import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().optional(),
  number: z.string().optional(),
  postal: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
});

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID no válido');

export const createProjectValidator = z.object({
  body: z.object({
    name: z.string().min(1, 'El nombre del proyecto es obligatorio'),
    projectCode: z.string().min(1, 'El código del proyecto es obligatorio'),
    client: objectId,
    address: addressSchema.optional(),
    email: z.string().email('Email no válido').optional(),
    notes: z.string().optional(),
    active: z.boolean().optional(),
  }),
});

export const updateProjectValidator = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    projectCode: z.string().min(1).optional(),
    client: objectId.optional(),
    address: addressSchema.optional(),
    email: z.string().email('Email no válido').optional(),
    notes: z.string().optional(),
    active: z.boolean().optional(),
  }),
  params: z.object({ id: objectId }),
});

export const projectIdValidator = z.object({
  params: z.object({ id: objectId }),
});

export const listProjectsValidator = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    client: objectId.optional(),
    name: z.string().trim().optional(),
    active: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    sort: z.string().trim().optional(),
  }),
});

export const replaceProjectValidator = z.object({
  body: z.object({
    name: z.string().min(1, 'El nombre del proyecto es obligatorio'),
    projectCode: z.string().min(1, 'El código del proyecto es obligatorio'),
    client: objectId,
    address: addressSchema.optional(),
    email: z.string().email('Email no válido').optional(),
    notes: z.string().optional(),
    active: z.boolean().optional(),
  }),
  params: z.object({ id: objectId }),
});