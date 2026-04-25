var database = require("../database/config");

function cadastrar(nome, dtNasc, email, senha, imagem, estilo) {
    var instrucaoSql = `
        INSERT INTO usuario (nome, dtNasc, email, senha, imagemUsuario, estiloMusical) 
        VALUES ('${nome}', '${dtNasc}', '${email}', '${senha}', '${imagem}', '${estilo}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT idUsuario, nome, email, tipoUser, imagemUsuario, estiloMusical 
        FROM usuario 
        WHERE email = '${email}' AND senha = '${senha}';
    `;
    return database.executar(instrucaoSql);
}

function buscarUsuarioPeloId(idUsuario) {
    var instrucaoSql = `
        SELECT idUsuario, nome, email, dtNasc, tipoUser, imagemUsuario, estiloMusical 
        FROM usuario 
        WHERE idUsuario = ${idUsuario};
    `;
    return database.executar(instrucaoSql);
}

function buscarUsuarioPeloEmail(email) {
    var instrucaoSql = `
        SELECT idUsuario, nome, email, dtNasc, tipoUser, imagemUsuario, estiloMusical 
        FROM usuario 
        WHERE email = '${email}';
    `;
    return database.executar(instrucaoSql);
}

function atualizar(id, nome, email, senha, imagem) {
    var setSenha = senha ? `, senha='${senha}'` : "";
    var setImagem = imagem ? `, imagemUsuario='${imagem}'` : "";

    var instrucaoSql = `
        UPDATE usuario 
        SET nome='${nome}', email='${email}'${setSenha}${setImagem}
        WHERE idUsuario=${id};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrar,
    buscarUsuarioPeloId,
    buscarUsuarioPeloEmail,
    atualizar
};
