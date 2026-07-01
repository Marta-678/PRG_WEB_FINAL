import { z } from 'zod';

const objectIdValidator = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de MongoDB no válido');

const workerValidator = z.object({
  name: z.string().trim().optional(),
  hours: z.coerce.number().min(0).optional(),
});

const baseDeliveryNoteBody = {
  client: objectIdValidator,
  project: objectIdValidator,
  format: z.enum(['material', 'hours']),
  description: z.string().trim().optional(),
  workDate: z.coerce.date(),
  material: z.string().trim().optional(),
  quantity: z.coerce.number().min(0).optional(),
  unit: z.string().trim().optional(),
  hours: z.coerce.number().min(0).optional(),
  workers: z.array(workerValidator).optional(),
};

export const createDeliveryNoteValidator = z.object({
  body: z.object(baseDeliveryNoteBody),
});

export const updateDeliveryNoteValidator = z.object({
  body: z.object({
    ...Object.fromEntries(
      Object.entries(baseDeliveryNoteBody).map(([key, schema]) => [key, schema.optional()])
    ),
  }),
  params: z.object({ id: objectIdValidator }),
});

export const deliveryNoteIdValidator = z.object({
  params: z.object({ id: objectIdValidator }),
});

export const listDeliveryNotesValidator = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    project: objectIdValidator.optional(),
    client: objectIdValidator.optional(),
    format: z.enum(['material', 'hours']).optional(),
    signed: z
      .enum(['true', 'false'])
      .transform((value) => value === 'true')
      .optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    sort: z.string().trim().optional().default('-workDate'),
  }),
});