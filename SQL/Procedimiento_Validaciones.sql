USE LogicLab;

SET @id_usuario_buscar = 1;
SET @password_probar = '123456';

SELECT
    u.id,
    CONCAT(u.nombre, ' ', u.apellido),
    u.password,
    SUBSTRING_INDEX(u.password, ':', 1),
    SUBSTRING_INDEX(u.password, ':', -1)
INTO
    @id_usuario,
    @nombre,
    @hash_completo,
    @salt,
    @hash_guardado
FROM usuarios u
WHERE u.id = @id_usuario_buscar;

SELECT
    @id_usuario_buscar AS id_usuario,
    @nombre AS nombre,
    @hash_completo AS hash_completo,
    @salt AS salt_extraido,
    @hash_guardado AS hash_guardado;

SET @resultado = FALSE;

CALL p_validar_contraseña_sha2(
    @password_probar,
    @hash_completo,
    @resultado
);

SELECT
    @id_usuario_buscar AS id_usuario,
    @password_probar AS contrasena_probada,
    @resultado AS es_valida,
    CASE @resultado
        WHEN 1 THEN 'CONTRASENA CORRECTA - Acceso permitido'
        WHEN 0 THEN 'CONTRASENA INCORRECTA - Acceso denegado'
    END AS resultado_legible;