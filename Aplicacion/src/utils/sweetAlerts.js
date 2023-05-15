async function confirmar_borrado_venta(){
    let resultado;
    let checkBorrarPuntos;
  
    await Swal.fire({
      title: '¿Seguro que desea borrar la venta?',
      text: "Se perderán todos los datos de la venta y no se realizará seguimiento.",
      footer: "No se podrán revertir los cambios.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: "Cancelar",
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar',
      html:
        '<div class="form-check">' +
        '  <input class="form-check-input" type="checkbox" id="borrar-puntos-checkbox" style="transform: scale(1.5);" checked>' +
        '  <label class="form-check-label" for="borrar-puntos-checkbox">' +
        '    Borrar puntos otorgados por la venta y devolver puntos canjeados' +
        '  </label>' +
        '</div>'
    }).then((result) => {
      if (result.isConfirmed) {
        resultado = true;
        checkBorrarPuntos = document.getElementById('borrar-puntos-checkbox').checked;
      } else {
        resultado = false;
      }
    });
  
    let resultados = {
      confirma_borrado: resultado,
      confirma_borrar_puntos: checkBorrarPuntos
    }
  
    console.log(resultados);
  
    return resultados;
  }


  async function variosClientes() {
    await Swal.fire({
      title: "Existen varios clientes con ese nombre",
      text: "Ingrese el nombre completo o el id",
      icon: "error",
      backdrop: true,
      showConfirmButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      allowEnterKey: true,
      stopKeydownPropagation: false
    })
  }

  async function noSeDetectoCliente() {
    await Swal.fire({
      title: "No se ha detectado ese cliente",
      icon: "error",
      backdrop: true,
      showConfirmButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      allowEnterKey: true,
      stopKeydownPropagation: false,
      position: "center",
      zIndex: 9
    })
  }



  async function sweetAlertVentaExitosa() {
    await Swal.fire({
        title: "¡Todo listo!",
        text: "La venta se ha ejecutado con exito",
        icon: "success",
        backdrop: true,
        showConfirmButton: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        stopKeydownPropagation: false,
    })
}

async function sweetAlertErrorDesconocidoVenta() {
  await Swal.fire({
      title: "Ha ocurrido un error desconocido",
      text: "Verifique haber escrito correctamente el nombre de la bolsa y haber completado todos los campos",
      icon: "error",
      backdrop: true,
      showConfirmButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      allowEnterKey: true,
      stopKeydownPropagation: false,
      position: "center",
  })
}


async function sweetAlertSeleccionMascota() {
  await Swal.fire({
      title: "Debe seleccionar al menos una mascota",
      icon: "error",
      backdrop: true,
      showConfirmButton: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      allowEnterKey: true,
      stopKeydownPropagation: false,
      position: "center",
  })
}


async function sweetAlert_confirmar_borrado_kilos_bolsa(kilos_bolsa) {
  let resultado;
  await Swal.fire({
      title: '¿Seguro que desea borrar el tamaño: ' + kilos_bolsa + 'kg?',
      icon: 'warning',
      showCancelButton: true,
      toast: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: "Cancelar",
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
  }).then((result) => {
      if (result.isConfirmed) {
          resultado = true;
      } else {
          resultado = false;
      }
  })

  return resultado;
}


async function sweetAlertAgregarMarcaBolsa() {
  await Swal.fire({
      title: "Debes indicar la marca de la bolsa",
      icon: "error",
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      toast: true,
      stopKeydownPropagation: false,
      position: "top",
  })
}

async function sweetAlertBolsaRepetida() {
  await Swal.fire({
      title: "Ya existe una bolsa con ese nombre",
      icon: "error",
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      toast: true,
      stopKeydownPropagation: false,
      position: "center",
  })
}

async function sweetAlertAgregarTamanioBolsa() {
  await Swal.fire({
      title: "Debes agregar al menos 1 tamaño de bolsa",
      icon: "error",
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      toast: true,
      stopKeydownPropagation: false,
      position: "top",
  })
}


async function sweetAlertCompletarInputTamanio() {
  await Swal.fire({
      title: "Debes completar el campo de agregar tamaño",
      icon: "error",
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      toast: true,
      stopKeydownPropagation: false,
      position: "top",
  })
}


async function sweetAlert_confirmar_borrado_bolsa() {
  let resultado;
  await Swal.fire({
    title: '¿Seguro que desea borrar la bolsa?',
    text: "No se podran revertir los cambios",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonText: "Cancelar",
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrar'
  }).then((result) => {
    if (result.isConfirmed) {
      resultado = true;
    } else {
      resultado = false;
    }
  })

  return resultado;
}


async function sweetAlertBorrarCliente() {
  let resultado;
  await Swal.fire({
    title: '¿Seguro que desea borrar el cliente?',
    text: "No se podran revertir los cambios",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonText: "Cancelar",
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrar'
  }).then((result) => {
    if (result.isConfirmed) {
      resultado = true;
    } else {
      resultado = false;
    }
  })

  return resultado;
}


async function sweetAlertClienteBorradoConExito() {
  await Swal.fire(
    '¡Borrado!',
    'El cliente ha sido eliminado con exito.',
    'success',
  )
}



async function sweetAlertGuardadoConExito() {
  await Swal.fire({
      title: "¡Cambios guardados con exito!",
      icon: "success",
      backdrop: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      stopKeydownPropagation: false,
      position: "center",
  })
}


async function sweetAlertCamposSinCompletar() {
  await Swal.fire({
      title: "Debe completar todos los campos",
      icon: "error",
      backdrop: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      stopKeydownPropagation: false,
      position: "center",
  })
}

async function sweetAlertSinMascotas() {
  await Swal.fire({
      title: "Debe agregar al menos una mascota",
      icon: "error",
      backdrop: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      stopKeydownPropagation: false,
      position: "center",
  })
}


async function sweetAlertPuntosNegativos() {
  await Swal.fire({
      title: "No puede canjear mas puntos de los disponibles",
      icon: "error",
      backdrop: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      stopKeydownPropagation: false,
      position: "center",
  })
}


async function sweetAlertBorrarMascota() {
  let resultado;
  await Swal.fire({
    title: '¿Seguro que desea borrar la mascota?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonText: "Cancelar",
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrar'
  }).then((result) => {
    if (result.isConfirmed) {
      resultado = true;
    } else {
      resultado = false;
    }
  })

  return resultado;
}


module.exports = { 
    confirmar_borrado_venta, 
    variosClientes, 
    noSeDetectoCliente,
    sweetAlertVentaExitosa,
    sweetAlertErrorDesconocidoVenta,
    sweetAlertSeleccionMascota,
    sweetAlert_confirmar_borrado_kilos_bolsa,
    sweetAlertAgregarMarcaBolsa,
    sweetAlertBolsaRepetida,
    sweetAlertAgregarTamanioBolsa,
    sweetAlertCompletarInputTamanio,
    sweetAlert_confirmar_borrado_bolsa,
    sweetAlertBorrarCliente,
    sweetAlertGuardadoConExito,
    sweetAlertCamposSinCompletar,
    sweetAlertSinMascotas,
    sweetAlertBorrarMascota,
    sweetAlertClienteBorradoConExito,
    sweetAlertPuntosNegativos
}
  