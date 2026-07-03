import { z } from 'zod';

const objectIdValidator = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de MongoDB no válido');

const addressValidator = z
  .object({
    street: z.string().trim().optional(),
    number: z.string().trim().optional(),
    postal: z.string().trim().optional(),
    city: z.string().trim().optional(),
    province: z.string().trim().optional(),
  })
  .optional();

export const createClientValidator = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'El nombre es obligatorio'),
    cif: z.string({ required_error: 'El CIF es obligatorio' }).trim().min(9, 'CIF no válido'),
    email: z.string().trim().email('Email no válido').toLowerCase().optional(),
    phone: z.string().trim().optional(),
    address: addressValidator,
  }),
});

export const updateClientValidator = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'El nombre es obligatorio').optional(),
    cif: z.string().trim().min(9, 'CIF no válido').optional(),
    email: z.string().trim().email('Email no válido').toLowerCase().optional(),
    phone: z.string().trim().optional(),
    address: addressValidator,
  }),
  params: z.object({ id: objectIdValidator }),
});

export const clientIdValidator = z.object({
  params: z.object({ id: objectIdValidator }),
});

export const listClientsValidator = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    name: z.string().trim().optional(),
    sort: z.string().trim().optional().default('-createdAt'),
  }),
});

export const replaceClientValidator = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'El nombre es obligatorio'),
    cif: z.string({ required_error: 'El CIF es obligatorio' }).trim().min(9, 'CIF no válido'),
    email: z.string().trim().email('Email no válido').toLowerCase().optional(),
    phone: z.string().trim().optional(),
    address: addressValidator,
  }),
  params: z.object({ id: objectIdValidator }),
});