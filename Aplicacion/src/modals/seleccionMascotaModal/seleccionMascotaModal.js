function iniciarSeleccionMascotaModal() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalSeleccionMascota" class="modalSeleccionMascota">
    <div class="modal-contentSeleccionMascota" id="modal-contentSeleccionMascota">
      <h2>Debe seleccionar al menos una mascota</h2>
      <button id="aceptar-buttonSeleccionMascota">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonSeleccionMascota");


  function listenerClickAceptarSeleccionMascota() {
    SeleccionMascotaModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarSeleccionMascota);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarSeleccionMascota);




  function listenerEnterSeleccionMascota(event) {
    if (event.key === "Enter") {
      SeleccionMascotaModal.hide();
      document.removeEventListener("keydown", listenerEnterSeleccionMascota); // Elimina el eventListener
      resolve();
    }
  }
  
  document.addEventListener("keydown", listenerEnterSeleccionMascota);
});
}

const SeleccionMascotaModal = {
  async show() {
    // Muestra el modal
    await iniciarSeleccionMascotaModal();
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalSeleccionMascota");
    modal.style.display = "none";
  }
};