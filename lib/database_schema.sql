DROP DATABASE IF EXISTS chat;

CREATE DATABASE chat;

USE chat;

CREATE TABLE users(
    userId CHAR(36),
    PRIMARY KEY (userId),
    username VARCHAR(50) NOT NULL UNIQUE KEY,
    password CHAR(128),
    passwordSalt BINARY(16),
    authHash CHAR(100),
    createdAt DATETIME
) ENGINE=InnoDB;

delimiter $

    CREATE FUNCTION find_hash(p_id CHAR(36), p_pass CHAR(128), p_salt BINARY(16))
    RETURNS CHAR(128)
    BEGIN
        RETURN (SELECT SHA2(CONCAT(p_id, p_pass, p_salt), 512) as hashed);
    END $

    CREATE TRIGGER initUsers BEFORE INSERT ON users
    FOR EACH ROW
    BEGIN
        DECLARE u_id CHAR(36);
        DECLARE u_salt BINARY(16);
        DECLARE u_pass CHAR(128) CHARACTER SET BINARY;
        SET u_id = UUID();
        -- SET u_salt = RANDOM_BYTES(16);
        SET u_salt = ';Ýü°Ð';
        SET u_pass = NEW.password;
        SET NEW.userId = u_id;
        SET NEW.passwordSalt = u_salt;
        SET NEW.password = SHA2(CONCAT(u_id, u_pass, u_salt), 512);
    END$

    CREATE PROCEDURE createUser(p_username CHAR(36), p_password CHAR(128) CHARACTER SET BINARY)
    BEGIN
        DECLARE err BOOLEAN;
        IF ( SELECT EXISTS ( SELECT username FROM users WHERE username = p_username) ) THEN
            SET err = TRUE;
        ELSE
            INSERT INTO users (username, password) VALUES (p_username, p_password);
            SET err = FALSE;
        END IF;
    END $

    CREATE PROCEDURE validateLogin(pUserName CHAR(36), pPassword CHAR(128) CHARACTER SET BINARY)
    BEGIN
        DECLARE uId CHAR(36);
        DECLARE salt BINARY(16);
        DECLARE secret CHAR(128);
        DECLARE err BOOLEAN;

        SET uId = (SELECT userId FROM users WHERE username = pUserName);
        SET salt = (SELECT passwordSalt FROM users WHERE username = pUserName);
        IF (SELECT EXISTS (SELECT userId FROM users WHERE username = pUserName AND password = find_hash(uId, pPassword, salt))) THEN
            SET secret = (SELECT passwordSalt FROM users WHERE username = pUserName);
            UPDATE users set authHash = secret WHERE username = pUsername;
            SET err = FALSE;
            select err, userId, username, authHash FROM users WHERE username =  pUserName;
        ELSE
            SET err = TRUE;
            SELECT err;
        END IF;
    END$

delimiter ;

CALL createUser('7', '123456789Ss');
CALL createUser('1', 'Abcd1234');