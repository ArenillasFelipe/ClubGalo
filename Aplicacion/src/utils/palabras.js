function convertirMayusculas(str) {
    return str.toUpperCase();
}

function capitalizarPalabras(str) {
    const palabras = str.split(' ');
    const resultado = [];
    for (let i = 0; i < palabras.length; i++) {
        resultado.push(palabras[i].charAt(0).toUpperCase() + palabras[i].slice(1));
    }
    return resultado.join(' ');
}


module.exports = { capitalizarPalabras, convertirMayusculas }