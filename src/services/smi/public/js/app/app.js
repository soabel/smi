const API = "http://5b26f5b4c39cbf00140ef6dd.mockapi.io/api/";
const API_SECCIONES = API + "Secciones";
const API_REGIONES = API + "regiones";
const API_SECCIONES_PUNTOS = API + "seccionPuntos";
const API_SECCIONES_LINEAS= API + "seccionLineal";
const API_SECCIONES_POLIGONOS = API + "seccionPoligono";

const API_AUTHENTICATE = API + "autenticar";
const KEY_AUTHENTICATED_USER = "auth";

const URL_HOME = "main";
const URL_LOGIN = "login";

function authenticatedUser(){    
    return JSON.parse(localStorage.getItem(KEY_AUTHENTICATED_USER));
}

function saveUserCredentials($credentials){
    localStorage.setItem(KEY_AUTHENTICATED_USER, JSON.stringify($credentials));
}

function clearCredentials(){
    if(localStorage.length > 0)
        localStorage.clear();
}