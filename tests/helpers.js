import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';
import Company from '../src/models/Company.js';
import { config } from '../src/config/index.js';

export const createCompanyWithUser = async (overrides = {}) => {
  const company = await Company.create({
    name: 'Constructora Test SL',
    cif: `B${Date.now()}`,
    isFreelance: false,
    ...overrides.company,
  });

  const password = overrides.password || 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: overrides.email || `user${Date.now()}@test.com`,
    password: hashedPassword,
    name: 'Test',
    lastName: 'User',
    role: overrides.role || 'admin',
    status: 'verified',
    company: company._id,
    ...overrides.user,
  });

  company.owner = user._id;
  await company.save();

  const token = jwt.sign(
    { sub: user._id, role: user.role, company: user.company },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return { company, user, token, password };
};

export const authHeader = (token) => ({ Authorization: `Bearer ${token}` });