function calcularDiasEntreFechaActualYFecha(fecha) {
    const fechaActual = new Date();
    const fechaSeleccionada = new Date(fecha);
    const diferenciaEnTiempo = fechaActual.getTime() - fechaSeleccionada.getTime();
    const diferenciaEnDias = Math.round(diferenciaEnTiempo / (1000 * 60 * 60 * 24));
    return diferenciaEnDias;
}


function calcularEdadMascota(fechaNacimiento) {
  const partesFecha = fechaNacimiento.split("/"); // Separar la fecha en tres partes
  const dia = parseInt(partesFecha[0]);
  const mes = parseInt(partesFecha[1]) - 1; // Los meses en JavaScript van de 0 a 11
  const anio = parseInt(partesFecha[2]);

  const fechaNac = new Date(anio, mes, dia);
  const fechaActual = new Date();

  const tiempoEnMs = fechaActual.getTime() - fechaNac.getTime();
  const msEnAnio = 1000 * 60 * 60 * 24 * 365.25;

  if (tiempoEnMs < msEnAnio) {
    // La mascota tiene menos de un año, devolver la edad en meses
    const meses = Math.floor(tiempoEnMs / (1000 * 60 * 60 * 24 * 30.4375));
    return `${meses} meses`;
  } else {
    // La mascota tiene un año o más, devolver la edad en años
    const edad = Math.floor(tiempoEnMs / msEnAnio);
    return `${edad} años`;
  }
}

  

module.exports = { calcularDiasEntreFechaActualYFecha, calcularEdadMascota }