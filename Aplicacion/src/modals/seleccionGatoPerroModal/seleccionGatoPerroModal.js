function iniciarSeleccionGatoPerroModal() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalSeleccionGatoPerro" class="modalSeleccionGatoPerro">
    <div class="modal-contentSeleccionGatoPerro">
      <h2>No puedes seleccionar gatos y perros a la vez</h2>
      <button id="aceptar-buttonSeleccionGatoPerro">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonSeleccionGatoPerro");

  function listenerClickAceptarSeleccionGatoPerro() {
    seleccionGatoPerroModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarSeleccionGatoPerro);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarSeleccionGatoPerro);


  function listenerEnterSeleccionGatoPerro(event) {
    if (event.key === "Enter") {
      seleccionGatoPerroModal.hide();
      document.removeEventListener("keydown", listenerEnterSeleccionGatoPerro); // Elimina el eventListener
      resolve();
    }
  }
  
  document.addEventListener("keydown", listenerEnterSeleccionGatoPerro);



});
}

const seleccionGatoPerroModal = {
  async show() {
    // Muestra el modal
    await iniciarSeleccionGatoPerroModal();
  },

  // La función hide() ahora devuelve una promesa
  hide() {
      const modal = document.getElementById("custom-modalSeleccionGatoPerro");
      modal.style.display = "none";
  }
};