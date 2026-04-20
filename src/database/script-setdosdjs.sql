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
    statusUser TINYINT DEFAULT 1 
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

CREATE TABLE pergunta (
    idPergunta INT PRIMARY KEY AUTO_INCREMENT,
    texto VARCHAR(255) NOT NULL
);

CREATE TABLE resposta (
    idResposta INT PRIMARY KEY AUTO_INCREMENT,
    fkUsuario INT, 
    fkPergunta INT, 
    respostaEscolhida VARCHAR(100),
    dtResposta DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fkUsuarioResposta FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario),
    CONSTRAINT fkPerguntaResposta FOREIGN KEY (fkPergunta) REFERENCES pergunta(idPergunta)
);