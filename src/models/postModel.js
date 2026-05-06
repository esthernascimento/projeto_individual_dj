const database = require("../database/config");

function listar(idUsuario) {
    const sql = `
        SELECT 
            p.*, 
            u.nome,
            (SELECT COUNT(*) FROM curtida WHERE fkPost = p.idPost) AS totalCurtidas,
            (SELECT COUNT(*) FROM curtida WHERE fkPost = p.idPost AND fkUsuario = ${idUsuario}) AS jaCurtiu
        FROM post p
        JOIN usuario u ON p.fkAdmin = u.idUsuario
        ORDER BY p.dtPostagem DESC
    `;
    return database.executar(sql);
}

function listarMeus(idAdmin) {
    const sql = `
        SELECT p.*, u.nome,
            (SELECT COUNT(*) FROM curtida WHERE fkPost = p.idPost) AS totalCurtidas,
            (SELECT COUNT(*) FROM comentario WHERE fkPost = p.idPost) AS totalComentarios
        FROM post p
        JOIN usuario u ON p.fkAdmin = u.idUsuario
        WHERE p.fkAdmin = ${idAdmin}
        ORDER BY p.dtPostagem DESC
    `;
    return database.executar(sql);
}

function publicar(titulo, conteudo, imagem, fkAdmin) {
    const sql = `
        INSERT INTO post (titulo, conteudo, imagemPost, fkAdmin)
        VALUES ('${titulo}', '${conteudo}', '${imagem}', ${fkAdmin})
    `;
    return database.executar(sql);
}

function listarComentarios(idPost) {
    const sql = `
        SELECT 
            co.idComentario,
            co.comentarioDescricao AS texto,
            co.fkUsuario, 
            u.nome AS autor,
            co.dtComentario
        FROM comentario co
        JOIN usuario u ON co.fkUsuario = u.idUsuario
        WHERE co.fkPost = ${idPost}
          AND co.statusComentario = 1
        ORDER BY co.dtComentario ASC
    `;
    return database.executar(sql);
}

function comentar(idUsuario, idPost, texto) {
    const sql = `
        INSERT INTO comentario (fkUsuario, fkPost, comentarioDescricao, statusComentario)
        VALUES (${idUsuario}, ${idPost}, '${texto}', 1)
    `;
    return database.executar(sql);
}

function curtir(idUsuario, idPost, curtir) {
    const sql = curtir
        ? `INSERT IGNORE INTO curtida (fkUsuario, fkPost) VALUES (${idUsuario}, ${idPost})`
        : `DELETE FROM curtida WHERE fkUsuario = ${idUsuario} AND fkPost = ${idPost}`;
    
    return database.executar(sql);
}

function deletarComentario(idComentario, idUsuario, tipoUsuario) {
    const sql = tipoUsuario === "Administrador"
        ? `DELETE FROM comentario WHERE idComentario = ${idComentario}`
        : `DELETE FROM comentario WHERE idComentario = ${idComentario} AND fkUsuario = ${idUsuario}`;

    return database.executar(sql);
}

function deletarPost(idPost, idUsuario) {
    const sql1 = `DELETE FROM comentario WHERE fkPost = ${idPost}`;
    const sql2 = `DELETE FROM curtida WHERE fkPost = ${idPost}`;
    const sql3 = `DELETE FROM post WHERE idPost = ${idPost} AND fkAdmin = ${idUsuario}`;

    return database.executar(sql1)
        .then(() => database.executar(sql2))
        .then(() => database.executar(sql3));
}

module.exports = {
    listar,
    listarMeus,
    publicar,
    listarComentarios,
    comentar,
    curtir,
    deletarComentario,
    deletarPost
};