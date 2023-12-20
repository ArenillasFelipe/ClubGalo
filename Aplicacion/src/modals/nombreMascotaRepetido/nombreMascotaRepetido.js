function iniciarNombreMascotaRepetidoModal() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalNombreMascotaRepetido" class="modalNombreMascotaRepetido">
    <div class="modal-contentNombreMascotaRepetido" id="modal-contentNombreMascotaRepetido">
      <h2>El cliente ya tiene una mascota con ese nombre</h2>
      <button id="aceptar-buttonNombreMascotaRepetido">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonNombreMascotaRepetido");


  function listenerClickAceptarNombreMascotaRepetido() {
    NombreMascotaRepetidoModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarNombreMascotaRepetido);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarNombreMascotaRepetido);




  function listenerEnterNombreMascotaRepetido(event) {
    if (event.key === "Enter") {
      NombreMascotaRepetidoModal.hide();
      document.removeEventListener("keydown", listenerEnterNombreMascotaRepetido); // Elimina el eventListener
      resolve();
    }
  }
  
  document.addEventListener("keydown", listenerEnterNombreMascotaRepetido);
});
}

const NombreMascotaRepetidoModal = {
  async show() {
    // Muestra el modal
    await iniciarNombreMascotaRepetidoModal();
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalNombreMascotaRepetido");
    modal.style.display = "none";
  }
};