import {z} from 'zod';

// TODO: añadir mensakes

export const createDeliveryNoteSchema = z.object({
    client: z.string().optional(),
    project: z.string().optional(),
    format: z.enum(['material', 'hours']),
    description: z.string().optional(),
    workDate: z.string().optional(), // ISO date string
    material: z.string().optional(),
    quantity: z.number().optional(),
    unit: z.string().optional(),
    hours: z.number().optional(),
    workers: z.array(z.object({
        name: z.string().optional(),
        hours: z.number().optional()
    })).optional()
});

export const updateDeliveryNoteSchema = z.object({
    client: z.string().optional(),
    project: z.string().optional(),
    format: z.enum(['material', 'hours']).optional(),
    description: z.string().optional(),
    workDate: z.string().optional(), // ISO date string
    material: z.string().optional(),
    quantity: z.number().optional(),
    unit: z.string().optional(),
    hours: z.number().optional(),
    workers: z.array(z.object({
        name: z.string().optional(),
        hours: z.number().optional()
    })).optional()
});

export const IdParamSchema = z.object({
    id: z.string()
});