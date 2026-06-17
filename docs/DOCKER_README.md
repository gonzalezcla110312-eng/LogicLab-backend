## 🐳 Guía Rápida de Docker

### Requisitos
- Docker Desktop instalado: https://www.docker.com/products/docker-desktop

### Iniciar MySQL con Docker

```bash
# 1. Navega al proyecto
cd proyectoMauricio

# 2. Levanta MySQL
docker-compose up

# Espera a ver el mensaje de conexión exitosa
```

### Conectar tu aplicación

La app Node.js se ejecuta en tu máquina local (`npm run dev`) conectándose a:

```
Host: localhost
Puerto: 3306
Usuario: mauricio_user
Contraseña: mauricio_password_secure_2024
Base de datos: restaurante_db
```

Estos valores están en tu `.env`

### Ver logs de MySQL

```bash
# Todos los logs
docker-compose logs

# En tiempo real
docker-compose logs -f
```

### Acceder a MySQL

```bash
# Desde terminal
docker-compose exec mysql mysql -u mauricio_user -p
# Contraseña: mauricio_password_secure_2024

# Dentro de MySQL
SELECT * FROM usuarios;
SHOW DATABASES;
```

### Detener MySQL

```bash
# Detener (conserva datos)
docker-compose down

# Detener y eliminar datos (CUIDADO)
docker-compose down -v
```

### Reiniciar

```bash
docker-compose down
docker-compose up
```

### Valores en docker-compose.yml (quemados)

```yaml
MYSQL_ROOT_PASSWORD: mauricio_password_secure_2024
MYSQL_DATABASE: restaurante_db
MYSQL_USER: mauricio_user
MYSQL_PASSWORD: mauricio_password_secure_2024
```

### Valores en .env (coinciden con docker-compose.yml)

```ini
DB_HOST=localhost
DB_USER=mauricio_user
DB_PASSWORD=mauricio_password_secure_2024
DB_NAME=restaurante_db
DB_PORT=3306
```

### Solución de problemas

| Error | Solución |
|-------|----------|
| "Port 3306 in use" | `docker-compose down` |
| "Cannot connect" | Espera 10 seg, ver logs |
| "Permission denied" | Usa `sudo docker-compose up` |

### Flujo de trabajo

```
1. docker-compose up       ← Inicia MySQL
2. npm run dev             ← Inicia tu app (otra terminal)
3. Ambas conectadas y funcionando
4. Ctrl+C para detener app
5. docker-compose down     ← Detiene MySQL
```

---

**¡MySQL corriendo en Docker! 🐳 Tu app en Node.js funciona local conectándose a Docker.**

