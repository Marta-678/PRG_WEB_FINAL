import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Company from '../models/Company.js';
import AppError from '../utils/AppError.js';
import notificationService from '../services/notification.service.js';
import {config} from '../config/index.js';

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (user) => {
    return jwt.sign(
        { sub: user._id, role: user.role, company: user.company || null },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { sub: user._id },
        config.jwtRefreshSecret,
        { expiresIn: config.jwtRefreshExpiresIn }
    );
};

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser.status === 'verified') {
            return next(AppError.conflict('El correo ya está registrado'));
        } 
        if (existingUser && existingUser.status !== 'verified') {
            return next(AppError.conflict('El correo ya está registrado pero no verificado. Por favor, verifica tu correo o contacta con soporte.'));
        }  
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = generateVerificationCode();
        const user =await User.create({
            email,
            password: hashedPassword,
            verificationCode,
            verificationAttempts: 3,
            role: 'admin',
            status: 'pending',
        });
        const acessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken= refreshToken
        await user.save();
        
        notificationService.emit('user:registered', { userId: user._id, email: user.email,});
        res.status(201).json({
            ok: true,
            data: {
                user: {
                    _id:    user._id,
                    email:  user.email,
                    status: user.status,
                    role:   user.role
                },
                acessToken,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }   
};

export const validateEmail  = async (req, res, next) => {
    try {
        const { code } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(AppError.notFound('Usuario no encontrado'));
        }   
        if (user.verificationAttempts <= 0) {
            return next(AppError.tooManyRequests('Intentos agotados'));
        }

        if (user.verificationCode !== code) {
            user.verificationAttempts -= 1;
            await user.save();

            if (user.verificationAttempts <= 0) {
                return next(AppError.tooManyRequests('Intentos agotados'));
            }

            return next(AppError.badRequest('Código incorrecto'));
        }

        user.status = 'verified';
        user.verificationCode = undefined;
        await user.save();

        notificationService.emit('user:verified', {
            userId: user._id,
            email: user.email,
        });

        res.json({
            ok: true,
            message: 'Usuario verificado correctamente',
        });
    } catch (error) {
        next(error);
    }   
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // password tiene select:false en el modelo, hay que pedirlo explícitamente
        const user = await User.findOne({ email }).select('+password +refreshToken');
        if (!user) {
            return next(AppError.unauthorized('Credenciales incorrectas'));
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return next(AppError.unauthorized('Credenciales incorrectas'));
        }

        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        notificationService.emit('user:logged_in', {
            userId: user._id,
            email: user.email,
        });

        // Quitar campos sensibles de la respuesta
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.refreshToken;

        res.json({
        ok: true,
        data: {
                user: {
                    _id:    user._id,
                    email:  user.email,
                    status: user.status,
                    role:   user.role
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }   
};


export const updatePersonalData = async (req, res, next) => {
  try {
    const { name, lastName, nif, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, lastName, nif, ...(address && { address }) },
      { new: true, runValidators: true }
    ).select('-password ');

    if (!user) {
      return next(AppError.notFound('Usuario no encontrado'));
    }

    notificationService.emit('user:updated', { userId: user._id, email: user.email });

    res.json({
      ok: true,
      message: 'Datos personales actualizados correctamente',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompanyData = async (req, res, next) => {
  try {
    const { name, cif, address, isFreelance } = req.body;

    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return next(AppError.notFound('Usuario no encontrado'));
    }

    const companyCif = isFreelance ? currentUser.nif : cif;
    const companyName = isFreelance ? currentUser.name : name;
    const companyAddr = isFreelance ? currentUser.address : address;

    let company = await Company.findOne({ cif: companyCif });
    let companyCreated = false;

    if (!company) {
      company = await Company.create({
        owner: currentUser._id,
        name: companyName,
        cif: companyCif,
        address: companyAddr,
        isFreelance: isFreelance || false,
      });

      currentUser.role = 'admin';
      companyCreated = true;
    } else {
      currentUser.role = 'guest';
    }

    currentUser.company = company._id;
    await currentUser.save();

    const updatedUser = await User.findById(currentUser._id)
      .select('-password -refreshToken')
      .populate('company');

    notificationService.emit('user:updated', {
      userId: currentUser._id,
      email: currentUser.email,
    });

    res.json({
      ok: true,
      message: companyCreated
        ? 'Compañía creada correctamente'
        : 'Compañía asignada correctamente',
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return next(AppError.badRequest('Refresh token requerido'));
    }
    const payload = jwt.verify(refreshToken, config.jwtRefreshSecret);
    const user = await User.findById(payload.sub).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return next(AppError.unauthorized('Refresh token inválido'));
    }
    const accessToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save();
    res.json({  
        accessToken,
        refreshToken: newRefreshToken
    });
    notificationService.emit('user:token_refreshed', { userId: user._id, email: user.email });
  } catch (error) {
    next(error);
  } 
};

export const logout = async (req, res, next) => {   
    try {
    const user = await User.findById(req.user.id).select('+refreshToken');
    if (!user) {
      return next(AppError.notFound('Usuario no encontrado'));
    }
    user.refreshToken = null;
    await user.save();
    notificationService.emit('user:logged_out', { userId: user._id, email: user.email });
    res.json({
        ok: true,
        message: 'Sesión cerrada correctamente'
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken').populate('company');
    if (!user) {
      return next(AppError.notFound('Usuario no encontrado'));
    }
    res.json({
      ok: true,
      data: {
        user
      }
    });

  } catch (error) {
    next(error);
  } 
};

export const deleteProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(AppError.notFound('Usuario no encontrado'));
    }

    const isSoft = req.query.soft === 'true';

    if (isSoft) {
      // Borrado lógico: marcar como eliminado
      user.deleted = true;
      await user.save();
    } else {
      // Borrado físico
      await User.findByIdAndDelete(req.user._id);
    }

    notificationService.emit('user:deleted', { userId: user._id, email: user.email });

    res.json({
      ok: true,
      message: isSoft
        ? 'Cuenta desactivada correctamente (soft delete)'
        : 'Cuenta eliminada correctamente (hard delete)',
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;  
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return next(AppError.notFound('Usuario no encontrado'));
    }
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return next(AppError.unauthorized('Contraseña actual incorrecta'));
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    notificationService.emit('user:password_changed', { userId: user._id, email: user.email });
    res.json({
        ok: true,
        message: 'Contraseña cambiada correctamente'
    });
  } catch (error) {
    next(error);
  }
};

export const inviteUser = async (req, res, next) => {
  try {
    const { email, name, lastName } = req.body;

    // Solo admins pueden invitar (verificado también en la ruta, doble seguridad)
    if (req.user.role !== 'admin') {
      return next(AppError.forbidden('Solo los administradores pueden invitar usuarios'));
    }

    // El invitador debe tener compañía asignada
    if (!req.user.company) {
      return next(AppError.badRequest('Debes tener una compañía asignada para invitar usuarios'));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(AppError.conflict('Ya existe un usuario con ese email'));
    }

    // Generar contraseña temporal aleatoria
    const tempPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    const verificationCode = generateVerificationCode();

    const newUser = await User.create({
      email,
      name:     name || '',
      lastName: lastName || '',
      password: hashedPassword,
      role: 'guest',
      status: 'pending',
      company: req.user.company,
      verificationCode,
      verificationAttempts: 3,
    });

    notificationService.emit('user:invited', {
      invitedBy: req.user._id,
      userId: newUser._id,
      email: newUser.email,
      company: req.user.company,
    });

    res.status(201).json({
      ok: true,
      message: 'Usuario invitado correctamente',
      data: {
        user: {
          _id:     newUser._id,
          email:   newUser.email,
          role:    newUser.role,
          status:  newUser.status,
          company: newUser.company,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCompanyLogo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('company'); 
    if (!user) {
      return next(AppError.notFound('Usuario no encontrado'));
    }
    if (!user.company) {
      return next(AppError.badRequest('El usuario no tiene una empresa asociada'));
    }
    const company = user.company;
    if (!req.file) {
      return next(AppError.badRequest('Archivo de logo no proporcionado'));
    }
    const logoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    company.logo = logoUrl;
    await company.save();
    notificationService.emit('company:logo_updated', { companyId: company._id, userId: user._id, email: user.email });
    res.json({
        ok: true,
        message: 'Logo de empresa actualizado correctamente',
        data: {
            company
        }
    });
  } catch (error) {
    next(error);
  } 
};
