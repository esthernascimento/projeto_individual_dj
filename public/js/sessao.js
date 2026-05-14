function validarSessao() {
    let email = sessionStorage.EMAIL_USUARIO;
    let nome = sessionStorage.NOME_USUARIO;
    let tipo = sessionStorage.TIPO_USUARIO;

    let b_usuario = document.getElementById("b_usuario");

    if (email != null && nome != null) {
        if (b_usuario != null) {
            b_usuario.innerHTML = nome;
        }
        if (window.location.pathname.includes("dashboard-adm.html") && tipo !== "Administrador") {
            window.location = "../feed.html";
        }
    } else {
        window.location = "../login.html";
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../login.html";
}

function aguardar() {
    let divAguardar = document.getElementById("div_aguardar");
    if (divAguardar) divAguardar.style.display = "flex";
}

function finalizarAguardar(texto) {
    let divAguardar = document.getElementById("div_aguardar");
    if (divAguardar) divAguardar.style.display = "none";

    let divErrosLogin = document.getElementById("div_erros_login");
    if (texto && divErrosLogin) {
        divErrosLogin.style.display = "flex";
        divErrosLogin.innerHTML = texto;
    }
}

