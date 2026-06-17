CREATE DEFINER=`root`@`localhost` PROCEDURE `p_encriptar_contraseña_sha2`(
    IN p_contraseña VARCHAR(255),
    OUT p_contraseña_hash VARCHAR(255)
)
BEGIN
    DECLARE v_salt VARCHAR(128);
    DECLARE v_hash_combinado VARCHAR(128);
    DECLARE v_uuid VARCHAR(36);
    
    -- Validar contraseña
    IF p_contraseña IS NULL OR p_contraseña = '' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'La contraseña no puede estar vacía';
    END IF;
    
    -- Generar UUID (base del salt)
    SET v_uuid = UUID();
    
    -- Generar salt seguro
    SET v_salt = SHA2(CONCAT(v_uuid, NOW()), 256);
    
    -- Generar hash (password + salt)
    SET v_hash_combinado = SHA2(CONCAT(p_contraseña, v_salt), 256);
    
    -- Formato final: salt:hash
    SET p_contraseña_hash = CONCAT(v_salt, ':', v_hash_combinado);
    
END