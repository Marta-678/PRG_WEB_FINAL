import { z } from 'zod';

// ── Registro ────────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'El email es obligatorio' })
      .email('Email no válido')
      .transform((v) => v.toLowerCase().trim()),
    password: z
      .string({ required_error: 'La contraseña es obligatoria' })
      .min(8, 'Mínimo 8 caracteres'),
  }),
});

// ── Login ────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'El email es obligatorio' })
      .email('Email no válido')
      .transform((v) => v.toLowerCase().trim()),
    password: z
      .string({ required_error: 'La contraseña es obligatoria' })
      .min(8, 'Mínimo 8 caracteres'),
  }),
});

// ── Validación de email (código 6 dígitos) ───────────────────────────────────
export const validateEmailSchema = z.object({
  body: z.object({
    code: z
      .string({ required_error: 'El código es obligatorio' })
      .length(6, 'El código debe tener exactamente 6 dígitos')
      .regex(/^\d{6}$/, 'El código debe contener solo dígitos'),
  }),
});

// ── Datos personales (onboarding) ────────────────────────────────────────────
export const personalDataSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'El nombre es obligatorio' })
      .min(2, 'Mínimo 2 caracteres')
      .trim(),
    lastName: z
      .string({ required_error: 'Los apellidos son obligatorios' })
      .min(2, 'Mínimo 2 caracteres')
      .trim(),
    nif: z
      .string({ required_error: 'El NIF es obligatorio' })
      .min(9, 'NIF no válido')
      .trim(),
  }),
});

// ── Datos de compañía (onboarding) ───────────────────────────────────────────
export const companyDataSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'El nombre de la empresa es obligatorio' }).min(2).trim(),
    cif: z.string({ required_error: 'El CIF es obligatorio' }).min(9, 'CIF no válido').trim(),
    isFreelance: z.boolean().optional().default(false),
    address: z
      .object({
        street: z.string().trim().optional(),
        number: z.string().trim().optional(),
        postal: z.string().trim().optional(),
        city: z.string().trim().optional(),
        province: z.string().trim().optional(),
      })
      .optional(),
  })
  .refine(
      (data) => {
        if (data.isFreelance) return true;
        return Boolean(data.name && data.cif && data.address);
      },
      {
        message: 'name, cif y address son obligatorios si no es autónomo',
        path: ['name'],
      }
    ),
});

// ── Cambio de contraseña (con .refine para validar que son distintas) ─────────
export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z
        .string({ required_error: 'La contraseña actual es obligatoria' })
        .min(8, 'Mínimo 8 caracteres'),
      newPassword: z
        .string({ required_error: 'La nueva contraseña es obligatoria' })
        .min(8, 'Mínimo 8 caracteres'),
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: 'La nueva contraseña debe ser distinta a la actual',
      path: ['newPassword'],
    }),
});

// ── Invitar usuario ──────────────────────────────────────────────────────────
export const inviteUserSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'El email es obligatorio' })
      .email('Email no válido')
      .transform((v) => v.toLowerCase().trim()),
    name: z.string().min(2).trim().optional(),
    lastName: z.string().min(2).trim().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'El nombre es obligatorio'),
    lastName: z.string().trim().min(2, 'Los apellidos son obligatorios'),
    nif: z.string().trim().min(8, 'El NIF debe tener al menos 8 caracteres'),
    address: z
      .object({
        street: z.string().trim().optional(),
        number: z.string().trim().optional(),
        postal: z.string().trim().optional(),
        city: z.string().trim().optional(),
        province: z.string().trim().optional(),
      })
      .optional(),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().trim().min(1, 'El refresh token es obligatorio'),
  }),
});