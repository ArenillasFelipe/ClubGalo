function convertirMayusculas(str) {
    return str.toUpperCase();
}

function capitalizarPalabras(str) {
    const palabras = str.split(' ');
    const resultado = [];

    for (let i = 0; i < palabras.length; i++) {
        const palabraCapitalizada = palabras[i].charAt(0).toUpperCase() + palabras[i].slice(1).toLowerCase();
        resultado.push(palabraCapitalizada);
    }

    return resultado.join(' ');
}



module.exports = { capitalizarPalabras, convertirMayusculas }