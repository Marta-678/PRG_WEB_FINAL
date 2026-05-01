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