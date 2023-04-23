function calcularDiasEntreFechaActualYFecha(fecha) {
    const fechaActual = new Date();
    const fechaSeleccionada = new Date(fecha);
    const diferenciaEnTiempo = fechaActual.getTime() - fechaSeleccionada.getTime();
    const diferenciaEnDias = Math.round(diferenciaEnTiempo / (1000 * 60 * 60 * 24));
    return diferenciaEnDias;
}

module.exports = { calcularDiasEntreFechaActualYFecha }