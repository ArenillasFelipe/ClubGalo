function convertirMayusculas(str) {
    return str.toUpperCase();
}

function capitalizarPalabras(str) {
    str = quitarTildes(str);
    const palabras = str.split(' ');
    const resultado = [];

    for (let i = 0; i < palabras.length; i++) {
        const palabraCapitalizada = palabras[i].charAt(0).toUpperCase() + palabras[i].slice(1).toLowerCase();
        resultado.push(palabraCapitalizada);
    }

    return resultado.join(' ');
}

function reemplazarComa(event) {
    // Verificar si la tecla presionada es una coma
    if (event.key === ',') {
        // Prevenir la acción predeterminada (insertar la coma)
        event.preventDefault();

        // Obtener el valor actual del input
        let input = event.target;

        input.value += '.'
    }
}


function quitarTildes(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}



module.exports = { capitalizarPalabras, convertirMayusculas, reemplazarComa, quitarTildes }