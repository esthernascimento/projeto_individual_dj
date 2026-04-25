CREATE DATABASE setdosdjs;
USE setdosdjs;

CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    dtNasc DATE,
    email VARCHAR(45) UNIQUE,
    senha VARCHAR(45),
    tipoUser VARCHAR(45) DEFAULT 'Usuário',
    CONSTRAINT chk_tipo CHECK (tipoUser IN ('Administrador', 'Usuário')),
    imagemUsuario VARCHAR(255),
    dtCadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    statusUser TINYINT DEFAULT 1,
    estiloMusical VARCHAR(50)
);

CREATE TABLE post (
    idPost INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    conteudo VARCHAR(500) NOT NULL, 
    imagemPost VARCHAR(255),        
    fkAdmin INT, 
    dtPostagem DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fkAdminPost FOREIGN KEY (fkAdmin) REFERENCES usuario(idUsuario)
);

CREATE TABLE curtida (
    fkUsuario INT, 
    fkPost INT,    
    dtCurtida DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fkUsuario, fkPost),
    CONSTRAINT fkUsuarioCurtida FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario),
    CONSTRAINT fkPostCurtida FOREIGN KEY (fkPost) REFERENCES post(idPost)
);


CREATE TABLE comentario (
    fkUsuario INT,
    fkPost INT,
    dtComentario DATETIME DEFAULT CURRENT_TIMESTAMP,
    comentarioDescricao VARCHAR(255),
    CONSTRAINT fkUsuarioComentario FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario),
    CONSTRAINT fkPostComentario FOREIGN KEY (fkPost) REFERENCES post(idPost),
    statusComentario TINYINT DEFAULT 0
); 