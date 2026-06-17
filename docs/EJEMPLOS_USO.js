/**
 * ========================================
 * EJEMPLOS DE USO DE LA API
 * ========================================
 * 
 * Aquí encontrarás ejemplos prácticos
 * de cómo usar cada endpoint
 */

// ========================================
// 1. USANDO JAVASCRIPT/FETCH API
// ========================================

/**
 * Ejemplo 1: Obtener todos los usuarios
 * Equivalente a: GET http://localhost:3001/api/usuarios
 */
async function obtenerUsuarios() {
  try {
    const respuesta = await fetch('http://localhost:3001/api/usuarios');
    const datos = await respuesta.json();
    
    if (datos.éxito) {
      console.log('Usuarios obtenidos:', datos.datos);
    } else {
      console.error('Error:', datos.error);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

/**
 * Ejemplo 2: Obtener un usuario específico
 * Equivalente a: GET http://localhost:3001/api/usuarios/1
 */
async function obtenerUsuarioPorId(id) {
  try {
    const respuesta = await fetch(`http://localhost:3001/api/usuarios/${id}`);
    const datos = await respuesta.json();
    
    if (datos.éxito) {
      console.log('Usuario:', datos.datos);
    } else {
      console.error('Error:', datos.error);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

/**
 * Ejemplo 3: Hacer Login
 * Equivalente a: POST http://localhost:3001/api/usuarios/login
 */
async function hacerLogin(email, password) {
  try {
    const respuesta = await fetch('http://localhost:3001/api/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    
    const datos = await respuesta.json();
    
    if (datos.éxito) {
      console.log('Login exitoso!');
      console.log('Token:', datos.token);
      console.log('Usuario:', datos.usuario);
      
      // Guardar el token en localStorage (almacenamiento del navegador)
      localStorage.setItem('token', datos.token);
    } else {
      console.error('Error de login:', datos.error);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

/**
 * Ejemplo 4: Crear un nuevo usuario
 * Equivalente a: POST http://localhost:3001/api/usuarios
 */
async function crearUsuario() {
  try {
    const respuesta = await fetch('http://localhost:3001/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'carlos.garcia@gmail.com',
        password: '123456',
        nombre: 'Carlos',
        apellido: 'García',
        rol: 'Cocinero',
        Tipo_documentoId: 1,
        Roles_usuariosId: 3
      })
    });
    
    const datos = await respuesta.json();
    
    if (datos.éxito) {
      console.log('Usuario creado:', datos.datos);
    } else {
      console.error('Error:', datos.error);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

/**
 * Ejemplo 5: Actualizar un usuario
 * Equivalente a: PUT http://localhost:3001/api/usuarios/1
 */
async function actualizarUsuario(id) {
  try {
    const respuesta = await fetch(`http://localhost:3001/api/usuarios/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'carlitos.nuevo@gmail.com',
        nombre: 'Carlos Actualizado',
        apellido: 'García López',
        rol: 'Mesero',
        Tipo_documentoId: 1,
        Roles_usuariosId: 2
      })
    });
    
    const datos = await respuesta.json();
    
    if (datos.éxito) {
      console.log('Usuario actualizado:', datos.mensaje);
    } else {
      console.error('Error:', datos.error);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

/**
 * Ejemplo 6: Eliminar un usuario
 * Equivalente a: DELETE http://localhost:3001/api/usuarios/1
 */
async function eliminarUsuario(id) {
  try {
    const respuesta = await fetch(`http://localhost:3001/api/usuarios/${id}`, {
      method: 'DELETE'
    });
    
    const datos = await respuesta.json();
    
    if (datos.éxito) {
      console.log('Usuario eliminado:', datos.mensaje);
    } else {
      console.error('Error:', datos.error);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

/**
 * Ejemplo 7: Usar token para una solicitud protegida
 * (Cuando implementes autenticación)
 */
async function obtenerUsuariosProtegido() {
  try {
    const token = localStorage.getItem('token');
    
    const respuesta = await fetch('http://localhost:3001/api/usuarios', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const datos = await respuesta.json();
    
    if (datos.éxito) {
      console.log('Usuarios obtenidos (protegido):', datos.datos);
    } else {
      console.error('Error:', datos.error);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
}

// ========================================
// 2. USANDO POSTMAN (interfaz gráfica)
// ========================================

/*

EJEMPLO 1: Obtener todos los usuarios
┌─────────────────────────────────────────┐
│ Método:  GET                            │
│ URL:     http://localhost:3001/api/usuarios │
│ Headers: Content-Type: application/json │
│ Body:    (vacío)                        │
└─────────────────────────────────────────┘

EJEMPLO 2: Crear un usuario
┌─────────────────────────────────────────┐
│ Método:  POST                           │
│ URL:     http://localhost:3001/api/usuarios │
│ Headers: Content-Type: application/json │
│ Body:    {                              │
│   "email": "prueba@gmail.com",         │
│   "password": "123456",                │
│   "nombre": "Prueba",                  │
│   "apellido": "Usuario",               │
│   "rol": "Mesero",                     │
│   "Tipo_documentoId": 1,               │
│   "Roles_usuariosId": 1                │
│ }                                      │
└─────────────────────────────────────────┘

EJEMPLO 3: Login
┌─────────────────────────────────────────┐
│ Método:  POST                           │
│ URL:     http://localhost:3001/api/usuarios/login │
│ Headers: Content-Type: application/json │
│ Body:    {                              │
│   "email": "andres@gmail.com",         │
│   "password": "123456"                 │
│ }                                      │
└─────────────────────────────────────────┘

*/

// ========================================
// 3. USANDO CURL (Línea de comandos)
// ========================================

/*

EJEMPLO 1: Obtener todos los usuarios
$ curl http://localhost:3001/api/usuarios

EJEMPLO 2: Crear un usuario
$ curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"email":"prueba@gmail.com","password":"123456","nombre":"Prueba","apellido":"Usuario","rol":"Mesero","Tipo_documentoId":1,"Roles_usuariosId":1}'

EJEMPLO 3: Login
$ curl -X POST http://localhost:3001/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"andres@gmail.com","password":"123456"}'

EJEMPLO 4: Actualizar usuario
$ curl -X PUT http://localhost:3001/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{"email":"nuevo@gmail.com","nombre":"Juan Actualizado","apellido":"Pérez","rol":"Cocinero","Tipo_documentoId":1,"Roles_usuariosId":3}'

EJEMPLO 5: Eliminar usuario
$ curl -X DELETE http://localhost:3001/api/usuarios/1

*/

// ========================================
// CÓMO COPIAR Y PEGAR EN LA CONSOLA
// ========================================

/*

1. Abre la Consola del Navegador (F12 en Chrome)
2. Ve a la pestaña "Console"
3. Copia el código de una función (ej: obtenerUsuarios)
4. Pégalo en la consola
5. Presiona Enter
6. Ahora ejecuta la función: obtenerUsuarios()
7. Verás el resultado en la consola

*/

// ========================================
// EXPORTAR FUNCIONES (para usar en otros archivos)
// ========================================

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  hacerLogin,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuariosProtegido
};
