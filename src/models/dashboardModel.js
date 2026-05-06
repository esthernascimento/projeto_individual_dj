const database = require("../database/config");

function numeros() {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM usuario) AS totalUsuarios,
            (SELECT COUNT(*) FROM curtida) AS totalCurtidas
    `;
    return database.executar(sql);
}

function generos() {
    const sql = `
        SELECT estiloMusical, COUNT(*) as total
        FROM usuario
        WHERE estiloMusical IS NOT NULL
        GROUP BY estiloMusical
    `;
    return database.executar(sql);
}

function crescimento() {
    const sql = `
        SELECT 
            MONTH(dtCadastro) AS mes,
            COUNT(*) AS usuarios
        FROM usuario
        GROUP BY MONTH(dtCadastro)
    `;
    return database.executar(sql);
}

function postsRecentes() {
    const sql = `
        SELECT 
            titulo, 
            conteudo, 
            imagemPost, 
            DATE_FORMAT(dtPostagem, '%d/%m/%Y') AS data_post
        FROM post
        ORDER BY dtPostagem DESC
        LIMIT 3
    `;
    return database.executar(sql);
}

function interacoes() {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM curtida) AS curtidas,
            (SELECT COUNT(*) FROM comentario) AS comentarios
    `;
    return database.executar(sql);
}

function postMaisEngajado() {
    const sql = `
        SELECT 
            p.idPost,
            p.titulo,
            p.conteudo,
            p.imagemPost,
            DATE_FORMAT(p.dtPostagem, '%d/%m/%Y') AS data,
            COUNT(DISTINCT c.fkUsuario) AS n_curtidas,
            COUNT(DISTINCT cm.idComentario) AS n_comentarios,
            (COUNT(DISTINCT c.fkUsuario) + COUNT(DISTINCT cm.idComentario)) AS engajamento
        FROM post p
        LEFT JOIN curtida c ON c.fkPost = p.idPost
        LEFT JOIN comentario cm ON cm.fkPost = p.idPost
        GROUP BY p.idPost
        ORDER BY engajamento DESC
        LIMIT 1;
    `;
    return database.executar(sql);
}

module.exports = {
    numeros,
    generos,
    crescimento,
    postsRecentes,
    interacoes,
    postMaisEngajado
};