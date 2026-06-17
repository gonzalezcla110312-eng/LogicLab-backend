CREATE DEFINER=`root`@`localhost` PROCEDURE `p_validar_contraseña_sha2`(
    IN p_contraseña_intento VARCHAR(255),
    IN p_contraseña_hash_almacenado VARCHAR(255),
    OUT p_es_valida BOOLEAN
)
BEGIN
    DECLARE v_salt_almacenado VARCHAR(100);
    DECLARE v_hash_almacenado VARCHAR(128);
    DECLARE v_hash_calculado VARCHAR(128);
    
    -- Extraer salt
    SET v_salt_almacenado = SUBSTRING_INDEX(p_contraseña_hash_almacenado, ':', 1);
    
    -- Extraer hash
    SET v_hash_almacenado = SUBSTRING_INDEX(p_contraseña_hash_almacenado, ':', -1);
    
    -- Calcular nuevo hash
    SET v_hash_calculado = SHA2(CONCAT(p_contraseña_intento, v_salt_almacenado), 256);
    
    -- Comparar
    IF v_hash_calculado = v_hash_almacenado THEN
        SET p_es_valida = TRUE;
    ELSE
        SET p_es_valida = FALSE;
    END IF;
END