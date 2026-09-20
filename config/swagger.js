const idParameter = {
  name: 'id',
  in: 'path',
  required: true,
  schema: { type: 'integer', minimum: 1 }
};

const dateParameter = {
  name: 'fecha',
  in: 'path',
  required: true,
  schema: { type: 'string', format: 'date' }
};

const dateRangeParameters = [
  {
    name: 'desde',
    in: 'query',
    schema: { type: 'string', format: 'date' }
  },
  {
    name: 'hasta',
    in: 'query',
    schema: { type: 'string', format: 'date' }
  }
];

const securedResponse = {
  description: 'Respuesta de la API'
};

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API REST del Restaurante',
    version: '3.0.0',
    description: 'Documentacion de la API de LogicLab para la gestion del restaurante.'
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor local'
    }
  ],
  tags: [
    { name: 'Sistema' },
    { name: 'Usuarios' },
    { name: 'Mesas y pedidos' },
    { name: 'Platillos' },
    { name: 'Menu del dia' },
    { name: 'Dashboard administrativo' },
    { name: 'PQRS' }
  ],
  paths: {
    '/': {
      get: {
        tags: ['Sistema'],
        summary: 'Comprobar estado de la API',
        responses: { 200: { description: 'API disponible' } }
      }
    },
    '/api/usuarios/login': {
      post: {
        tags: ['Usuarios'],
        summary: 'Iniciar sesion',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' }
            }
          }
        },
        responses: {
          200: { description: 'Sesion iniciada' },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/api/usuarios/roles': {
      get: {
        tags: ['Usuarios'],
        summary: 'Listar roles',
        security: [{ bearerAuth: [] }],
        responses: { 200: securedResponse, 401: { $ref: '#/components/responses/Unauthorized' } }
      }
    },
    '/api/usuarios': {
      get: {
        tags: ['Usuarios'],
        summary: 'Listar usuarios',
        security: [{ bearerAuth: [] }],
        responses: { 200: securedResponse, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' } }
      },
      post: {
        tags: ['Usuarios'],
        summary: 'Crear usuario',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UserRequest' } } }
        },
        responses: { 201: securedResponse, 400: { $ref: '#/components/responses/BadRequest' } }
      }
    },
    '/api/usuarios/{id}': {
      parameters: [idParameter],
      get: {
        tags: ['Usuarios'],
        summary: 'Obtener usuario por ID',
        security: [{ bearerAuth: [] }],
        responses: { 200: securedResponse, 401: { $ref: '#/components/responses/Unauthorized' }, 404: { $ref: '#/components/responses/NotFound' } }
      },
      put: {
        tags: ['Usuarios'],
        summary: 'Actualizar usuario',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/UserRequest' } } }
        },
        responses: { 200: securedResponse, 400: { $ref: '#/components/responses/BadRequest' } }
      }
    },
    '/api/usuarios/{id}/activar': {
      parameters: [idParameter],
      patch: {
        tags: ['Usuarios'],
        summary: 'Activar usuario',
        security: [{ bearerAuth: [] }],
        responses: { 200: securedResponse }
      }
    },
    '/api/usuarios/{id}/inactivar': {
      parameters: [idParameter],
      patch: {
        tags: ['Usuarios'],
        summary: 'Inactivar usuario',
        security: [{ bearerAuth: [] }],
        responses: { 200: securedResponse }
      }
    },
    '/api/mesas': {
      get: {
        tags: ['Mesas y pedidos'],
        summary: 'Listar mesas',
        security: [{ bearerAuth: [] }],
        responses: { 200: securedResponse }
      },
      post: {
        tags: ['Mesas y pedidos'],
        summary: 'Crear mesa',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TableRequest' } } } },
        responses: { 201: securedResponse, 400: { $ref: '#/components/responses/BadRequest' } }
      }
    },
    '/api/mesas/{id}': {
      parameters: [idParameter],
      put: {
        tags: ['Mesas y pedidos'],
        summary: 'Actualizar mesa',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/TableRequest' } } } },
        responses: { 200: securedResponse, 400: { $ref: '#/components/responses/BadRequest' } }
      }
    },
    '/api/mesas/{id}/pedido-activo': {
      parameters: [idParameter],
      get: { tags: ['Mesas y pedidos'], summary: 'Obtener pedido activo de una mesa', security: [{ bearerAuth: [] }], responses: { 200: securedResponse } }
    },
    '/api/mesas/{id}/liberar': {
      parameters: [idParameter],
      patch: { tags: ['Mesas y pedidos'], summary: 'Liberar mesa', security: [{ bearerAuth: [] }], responses: { 200: securedResponse } }
    },
    '/api/mesas/{id}/pedidos': {
      parameters: [idParameter],
      post: {
        tags: ['Mesas y pedidos'],
        summary: 'Crear pedido para una mesa',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderRequest' } } } },
        responses: { 201: securedResponse, 400: { $ref: '#/components/responses/BadRequest' } }
      }
    },
    '/api/mesas/pedidos': {
      get: { tags: ['Mesas y pedidos'], summary: 'Listar pedidos', security: [{ bearerAuth: [] }], responses: { 200: securedResponse } }
    },
    '/api/mesas/pedidos/activos/cocina': {
      get: { tags: ['Mesas y pedidos'], summary: 'Listar pedidos activos para cocina', security: [{ bearerAuth: [] }], responses: { 200: securedResponse } }
    },
    '/api/mesas/pedidos/{pedidoId}': {
      parameters: [{ name: 'pedidoId', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }],
      get: { tags: ['Mesas y pedidos'], summary: 'Obtener pedido por ID', security: [{ bearerAuth: [] }], responses: { 200: securedResponse } },
      put: {
        tags: ['Mesas y pedidos'], summary: 'Actualizar pedido activo', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderUpdateRequest' } } } },
        responses: { 200: securedResponse, 400: { $ref: '#/components/responses/BadRequest' } }
      }
    },
    '/api/mesas/pedidos/{pedidoId}/estado': {
      parameters: [{ name: 'pedidoId', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }],
      patch: {
        tags: ['Mesas y pedidos'], summary: 'Actualizar estado del pedido', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderStatusRequest' } } } },
        responses: { 200: securedResponse, 400: { $ref: '#/components/responses/BadRequest' } }
      }
    },
    '/api/mesas/pedidos/{pedidoId}/entregar': {
      parameters: [{ name: 'pedidoId', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }],
      patch: { tags: ['Mesas y pedidos'], summary: 'Marcar pedido como entregado', security: [{ bearerAuth: [] }], responses: { 200: securedResponse } }
    },
    '/api/platillos': {
      get: { tags: ['Platillos'], summary: 'Listar platillos', responses: { 200: securedResponse } },
      post: {
        tags: ['Platillos'], summary: 'Crear platillo', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { $ref: '#/components/schemas/DishRequest' } } } },
        responses: { 201: securedResponse, 400: { $ref: '#/components/responses/BadRequest' } }
      }
    },
    '/api/platillos/{id}': {
      parameters: [idParameter],
      put: {
        tags: ['Platillos'], summary: 'Actualizar platillo', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { $ref: '#/components/schemas/DishUpdateRequest' } } } },
        responses: { 200: securedResponse, 400: { $ref: '#/components/responses/BadRequest' } }
      }
    },
    '/api/menu-dia/hoy': {
      get: { tags: ['Menu del dia'], summary: 'Obtener menu del dia actual', responses: { 200: securedResponse } }
    },
    '/api/menu-dia': {
      get: { tags: ['Menu del dia'], summary: 'Listar menus por rango de fechas', parameters: dateRangeParameters, responses: { 200: securedResponse } }
    },
    '/api/menu-dia/{fecha}': {
      parameters: [dateParameter],
      get: { tags: ['Menu del dia'], summary: 'Obtener menu por fecha', responses: { 200: securedResponse } },
      put: {
        tags: ['Menu del dia'], summary: 'Crear o actualizar menu del dia', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/DailyMenuRequest' } } } },
        responses: { 200: securedResponse, 400: { $ref: '#/components/responses/BadRequest' } }
      }
    },
    '/api/menu-dia/limpiar': {
      delete: { tags: ['Menu del dia'], summary: 'Limpiar menus por rango', parameters: dateRangeParameters, security: [{ bearerAuth: [] }], responses: { 200: securedResponse } }
    },
    '/api/admin/dashboard/estadisticas': {
      get: { tags: ['Dashboard administrativo'], summary: 'Obtener estadisticas', parameters: dateRangeParameters, security: [{ bearerAuth: [] }], responses: { 200: securedResponse } }
    },
    '/api/admin/dashboard/ingresos': {
      get: { tags: ['Dashboard administrativo'], summary: 'Obtener ingresos', parameters: dateRangeParameters, security: [{ bearerAuth: [] }], responses: { 200: securedResponse } }
    },
    '/api/admin/dashboard/tendencia-pedidos': {
      get: { tags: ['Dashboard administrativo'], summary: 'Obtener tendencia de pedidos', parameters: dateRangeParameters, security: [{ bearerAuth: [] }], responses: { 200: securedResponse } }
    },
    '/api/admin/dashboard/mesas-ocupadas': {
      get: { tags: ['Dashboard administrativo'], summary: 'Obtener mesas ocupadas', security: [{ bearerAuth: [] }], responses: { 200: securedResponse } }
    },
    '/api/admin/dashboard/resumen': {
      get: { tags: ['Dashboard administrativo'], summary: 'Obtener resumen del dashboard', parameters: [...dateRangeParameters, { name: 'top_limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 50 } }, { name: 'alertas_minutos', in: 'query', schema: { type: 'integer', minimum: 1 } }, { name: 'alertas_limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } }], security: [{ bearerAuth: [] }], responses: { 200: securedResponse } }
    },
    '/api/admin/dashboard/platillos-top': {
      get: { tags: ['Dashboard administrativo'], summary: 'Obtener platillos mas vendidos', parameters: [...dateRangeParameters, { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 50 } }], security: [{ bearerAuth: [] }], responses: { 200: securedResponse } }
    },
    '/api/admin/dashboard/alertas-pedidos': {
      get: { tags: ['Dashboard administrativo'], summary: 'Obtener alertas de pedidos', parameters: [{ name: 'minutos', in: 'query', schema: { type: 'integer', minimum: 1 } }, { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } }], security: [{ bearerAuth: [] }], responses: { 200: securedResponse } }
    },
    '/api/pqrs/tipos': {
      get: { tags: ['PQRS'], summary: 'Listar tipos de PQRSF', responses: { 200: securedResponse, 500: { description: 'Error al consultar los tipos de PQRSF' } } }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Token JWT obtenido en /api/usuarios/login' }
    },
    schemas: {
      LoginRequest: {
        type: 'object', required: ['email', 'password'],
        properties: { email: { type: 'string', format: 'email', example: 'admin@restaurante.com' }, password: { type: 'string', format: 'password', minLength: 6, example: 'secreto123' } }
      },
      UserRequest: {
        type: 'object', required: ['email', 'password', 'nombre', 'apellido', 'rol'],
        properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password', minLength: 6 }, nombre: { type: 'string' }, apellido: { type: 'string' }, rol: { type: 'string', enum: ['administrador', 'mesero', 'cocinero'] }, tipo_documento_id: { type: 'integer', minimum: 1 } }
      },
      TableRequest: {
        type: 'object', required: ['numero'],
        properties: { numero: { type: 'integer', minimum: 1 }, estado: { type: 'string', enum: ['LIBRE', 'OCUPADA', 'INACTIVA'] }, activa: { type: 'integer', enum: [0, 1] } }
      },
      OrderRequest: {
        type: 'object', required: ['usuario_id', 'items'],
        properties: { usuario_id: { type: 'integer', minimum: 1 }, items: { type: 'array', minItems: 1, items: { $ref: '#/components/schemas/OrderItem' } } }
      },
      OrderUpdateRequest: {
        type: 'object', required: ['items'],
        properties: { items: { type: 'array', minItems: 1, items: { $ref: '#/components/schemas/OrderItem' } } }
      },
      OrderItem: {
        type: 'object', required: ['platillo_id', 'cantidad'],
        properties: { platillo_id: { type: 'integer', minimum: 1 }, cantidad: { type: 'integer', minimum: 1 }, notas: { type: 'string', maxLength: 255 } }
      },
      OrderStatusRequest: {
        type: 'object', required: ['estado'],
        properties: { estado: { type: 'string', enum: ['COCINANDO', 'PARA_ENTREGA', 'ENTREGADO', 'PAGADO', 'CERRADO', 'CANCELADO'] } }
      },
      DishRequest: {
        type: 'object', required: ['nombre', 'precio'],
        properties: { nombre: { type: 'string' }, precio: { type: 'number', format: 'float', minimum: 0 }, categoria_id: { type: 'integer', minimum: 1 }, imagen: { type: 'string', format: 'binary' }, imagen_nombre: { type: 'string' }, imagen_url: { type: 'string' } }
      },
      DishUpdateRequest: {
        allOf: [{ $ref: '#/components/schemas/DishRequest' }, { type: 'object', required: ['activo'], properties: { activo: { type: 'integer', enum: [0, 1] } } }]
      },
      DailyMenuRequest: {
        type: 'object', required: ['items'],
        properties: { publicado: { oneOf: [{ type: 'boolean' }, { type: 'integer', enum: [0, 1] }] }, items: { type: 'array', minItems: 1, items: { type: 'object', required: ['platillo_id'], properties: { platillo_id: { type: 'integer', minimum: 1 }, orden: { type: 'integer', minimum: 1 } } } } }
      }
    },
    responses: {
      BadRequest: { description: 'Datos de entrada invalidos' },
      Unauthorized: { description: 'Token no proporcionado, invalido o expirado' },
      Forbidden: { description: 'El usuario no tiene permisos suficientes' },
      NotFound: { description: 'Recurso no encontrado' }
    }
  }
};

export default swaggerSpec;
