import {z} from 'zod';

// TODO : lista clientes (gat), obtener id , eliminar cliente, restaurar cliente (soft delete)

const addressSchema = z
  .object({
    street: z.string().trim().optional(),
    number: z.string().trim().optional(),
    postal: z.string().trim().optional(),
    city: z.string().trim().optional(),
    province: z.string().trim().optional(),
  }).optional();


export const createClientSchema = z.object({
    name: z.string().trim().min(1, 'El nombre es obligatorio'),
    cif: z.string({ required_error: 'El CIF es obligatorio' }).trim().min(9, 'El CIF no válido'),
    email: z.string().trim().email('Email no válido').toLowerCase().optional(),
    phone: z.string().trim().optional(),
    address: addressSchema
});

export const updateClientSchema = z.object({
    name: z.string().trim().min(1, 'El nombre es obligatorio').optional(),
    cif: z.string({ required_error: 'El CIF es obligatorio' }).trim().min(9, 'El CIF no válido').optional(),
    email: z.string().trim().email('Email no válido').toLowerCase().optional(),
    phone: z.string().trim().optional(),
    address: addressSchema
});