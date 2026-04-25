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

module.exports = {
    autenticar,
    cadastrar,
};