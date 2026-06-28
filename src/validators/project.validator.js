import {z} from 'zod';

export const createProjectValidator = z.object({
    name: z.string().min(1, 'El nombre del proyecto es requerido'),
    projectCode: z.string().min(1, 'El código del proyecto es requerido'),
    address: z.object({
        street: z.string().optional(),
        number: z.string().optional(),
        postal: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional()
    }).optional(),
    email: z.string().email('Email no válido').optional(),
    notes: z.string().optional(),
    clientId: z.string().min(1, 'El ID del cliente es requerido')
});

export const updateProjectValidator = z.object({
    name: z.string().min(1, 'El nombre del proyecto es requerido').optional(),
    projectCode: z.string().min(1, 'El código del proyecto es requerido').optional(),
    address: z.object({
        street: z.string().optional(),
        number: z.string().optional(),
        postal: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional()
    }).optional(),
    email: z.string().email('Email no válido').optional(),
    notes: z.string().optional(),
    clientId: z.string().min(1, 'El ID del cliente es requerido').optional()
});

export const projectIdValidator= z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de MongoDB no válido')
})

export const listProject= z.object({
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    clientId: z.string().min(1, 'El ID del cliente es requerido'),
    name: z.string().trim().optional(),
    active: z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional(),
    sort: z.string().trim().optional(),
});