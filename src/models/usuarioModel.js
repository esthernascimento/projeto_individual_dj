var database = require("../database/config");

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT idUsuario, nome, email, tipoUser, imagemUsuario 
        FROM usuario 
        WHERE email = '${email}' AND senha = '${senha}';
    `;
    return database.executar(instrucaoSql);
}

function cadastrar(nome, dtNasc, email, senha, imagem) {
    var instrucaoSql = `
        INSERT INTO usuario (nome, dtNasc, email, senha, imagemUsuario) 
        VALUES ('${nome}', '${dtNasc}', '${email}', '${senha}', '${imagem}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUsuarioPeloId(id) {
  const instrucao = `select * from usuario where id = ${idUsuario}`;
  return database.executar(instrucao);
}

module.exports = {
    autenticar,
    cadastrar,
    buscarUsuarioPeloId
};