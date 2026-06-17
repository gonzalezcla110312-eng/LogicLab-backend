DROP PROCEDURE IF EXISTS sp_registrar_usuario;

DELIMITER $$

CREATE PROCEDURE sp_registrar_usuario(
    IN p_email VARCHAR(120),
    IN p_nombre VARCHAR(80),
    IN p_apellido VARCHAR(80),
    IN p_contrasena VARCHAR(255),
    IN p_rol_nombre VARCHAR(50),
    IN p_id_tipo_documento INT
)
BEGIN
    DECLARE v_password_hash VARCHAR(255);
    DECLARE v_rol_id INT;

    main_block: BEGIN

        IF p_email IS NULL OR TRIM(p_email) = '' THEN
            SELECT 'Error: El email es obligatorio' AS mensaje;
            LEAVE main_block;
        END IF;

        IF p_nombre IS NULL OR TRIM(p_nombre) = '' THEN
            SELECT 'Error: El nombre es obligatorio' AS mensaje;
            LEAVE main_block;
        END IF;

        IF p_apellido IS NULL OR TRIM(p_apellido) = '' THEN
            SELECT 'Error: El apellido es obligatorio' AS mensaje;
            LEAVE main_block;
        END IF;

        IF p_contrasena IS NULL OR TRIM(p_contrasena) = '' THEN
            SELECT 'Error: La contrasena es obligatoria' AS mensaje;
            LEAVE main_block;
        END IF;

        SELECT id INTO v_rol_id
        FROM roles
        WHERE LOWER(nombre) = LOWER(TRIM(p_rol_nombre))
        LIMIT 1;

        IF v_rol_id IS NULL THEN
            SELECT 'Error: Rol no valido' AS mensaje;
            LEAVE main_block;
        END IF;

        IF p_id_tipo_documento IS NOT NULL AND NOT EXISTS (
            SELECT 1
            FROM tipo_documento
            WHERE id = p_id_tipo_documento
        ) THEN
            SELECT 'Error: Tipo de documento no valido' AS mensaje;
            LEAVE main_block;
        END IF;

        IF EXISTS (
            SELECT 1
            FROM usuarios
            WHERE email = TRIM(p_email)
        ) THEN
            SELECT 'Error: El email ya existe' AS mensaje;
            LEAVE main_block;
        END IF;

        CALL p_encriptar_contraseña_sha2(TRIM(p_contrasena), v_password_hash);

        INSERT INTO usuarios (email, password, nombre, apellido, rol_id, tipo_documento_id, activo)
        VALUES (TRIM(p_email), v_password_hash, TRIM(p_nombre), TRIM(p_apellido), v_rol_id, p_id_tipo_documento, 1);

        SELECT 'Usuario registrado correctamente' AS mensaje,
               LAST_INSERT_ID() AS id_usuario;

    END main_block;
END $$

DELIMITER ;