import swaggerJsdoc from 'swagger-jsdoc';

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'BildyApp API',
      version: '1.0.0',
      description: 'API REST para la digitalización de albaranes entre clientes y proveedores',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor local' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'user', 'guest'] },
            company: { type: 'string' },
            emailVerified: { type: 'boolean' },
            deleted: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Company: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            owner: { type: 'string' },
            name: { type: 'string' },
            cif: { type: 'string' },
            address: { $ref: '#/components/schemas/Address' },
            logo: { type: 'string' },
            isFreelance: { type: 'boolean' },
            deleted: { type: 'boolean' },
          },
        },
        Address: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            number: { type: 'string' },
            postal: { type: 'string' },
            city: { type: 'string' },
            province: { type: 'string' },
          },
        },
        Client: {
          type: 'object',
          required: ['name', 'cif'],
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            company: { type: 'string' },
            name: { type: 'string' },
            cif: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { $ref: '#/components/schemas/Address' },
            deleted: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          example: {
            name: 'Construcciones García SL',
            cif: 'B12345678',
            email: 'contacto@construccionesgarcia.com',
            phone: '600111222',
            address: {
              street: 'Calle Mayor',
              number: '10',
              postal: '28001',
              city: 'Madrid',
              province: 'Madrid',
            },
          },
        },
        Project: {
          type: 'object',
          required: ['name', 'projectCode', 'client'],
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            company: { type: 'string' },
            client: { type: 'string' },
            name: { type: 'string' },
            projectCode: { type: 'string' },
            address: { $ref: '#/components/schemas/Address' },
            email: { type: 'string', format: 'email' },
            notes: { type: 'string' },
            active: { type: 'boolean' },
            deleted: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          example: {
            name: 'Reforma nave industrial',
            projectCode: 'PRJ-2026-001',
            client: '665f1a2b3c4d5e6f7a8b9c0d',
            address: { street: 'Polígono Industrial', number: '3', postal: '28522', city: 'Rivas', province: 'Madrid' },
            email: 'obra@cliente.com',
            notes: 'Reforma completa de nave de 500m2',
          },
        },
        DeliveryNoteWorker: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            hours: { type: 'number' },
          },
        },
        DeliveryNote: {
          type: 'object',
          required: ['client', 'project', 'format', 'workDate'],
          properties: {
            _id: { type: 'string' },
            user: { type: 'string' },
            company: { type: 'string' },
            client: { type: 'string' },
            project: { type: 'string' },
            format: { type: 'string', enum: ['material', 'hours'] },
            description: { type: 'string' },
            workDate: { type: 'string', format: 'date' },
            material: { type: 'string' },
            quantity: { type: 'number' },
            unit: { type: 'string' },
            hours: { type: 'number' },
            workers: {
              type: 'array',
              items: { $ref: '#/components/schemas/DeliveryNoteWorker' },
            },
            signed: { type: 'boolean' },
            signedAt: { type: 'string', format: 'date-time' },
            signatureUrl: { type: 'string' },
            pdfUrl: { type: 'string' },
            deleted: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
          example: {
            client: '665f1a2b3c4d5e6f7a8b9c0d',
            project: '665f1a2b3c4d5e6f7a8b9c1e',
            format: 'hours',
            description: 'Instalación eléctrica planta baja',
            workDate: '2026-01-15',
            hours: 8,
            workers: [{ name: 'Juan Pérez', hours: 8 }],
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            totalItems: { type: 'integer' },
            totalPages: { type: 'integer' },
            currentPage: { type: 'integer' },
            limit: { type: 'integer' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: false },
            message: { type: 'string' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Token ausente, inválido o expirado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        ForbiddenError: {
          description: 'El usuario no tiene permisos para esta acción',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        NotFoundError: {
          description: 'Recurso no encontrado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        ValidationError: {
          description: 'Error de validación de los datos enviados',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'User', description: 'Registro, autenticación y perfil de usuario' },
      { name: 'Client', description: 'Gestión de clientes' },
      { name: 'Project', description: 'Gestión de proyectos' },
      { name: 'DeliveryNote', description: 'Gestión de albaranes' },
    ],
  },
  apis: ['./src/routes/*.js'],
});

export default swaggerSpec;