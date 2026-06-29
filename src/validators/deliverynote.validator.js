import {z} from 'zod';

// TODO: añadir mensakes

const objectIdValidator = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'ID de MongoDB no válido');

const workerValidator = z.object({
  name: z.string().trim().min(1, 'El nombre del trabajador es obligatorio'),
  hours: z.coerce.number().positive('Las horas del trabajador deben ser mayores que 0'),
});

export const createDeliveryNoteValidator = z.object({
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

export const updateDeliveryNoteValidator = z.object({
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

export const deliveryNoteIdValidator = z.object({
  params: z.object({
    id: objectIdValidator,
  }),
});

export const listDeliveryNotesValidator = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    project: objectIdValidator.optional(),
    client: objectIdValidator.optional(),
    format: z.enum(['material', 'hours']).optional(),
    signed: z.enum(['true', 'false']).optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    sort: z.string().trim().optional().default('-workDate'),
  }),
});