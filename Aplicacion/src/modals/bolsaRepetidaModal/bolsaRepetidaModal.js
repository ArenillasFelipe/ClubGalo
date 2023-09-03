function iniciarBolsaRepetidaModal() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalBolsaRepetidaModal" class="modalBolsaRepetidaModal">
    <div class="modal-contentBolsaRepetidaModal" id="modal-contentBolsaRepetidaModal">
      <h2>Ya existe una bolsa con ese nombre</h2>
      <button id="aceptar-buttonBolsaRepetidaModal">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonBolsaRepetidaModal");


  function listenerClickAceptarBolsaRepetidaModal() {
    BolsaRepetidaModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarBolsaRepetidaModal);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarBolsaRepetidaModal);




  function listenerEnterBolsaRepetidaModal(event) {
    if (event.key === "Enter") {
      BolsaRepetidaModal.hide();
      document.removeEventListener("keydown", listenerEnterBolsaRepetidaModal); // Elimina el eventListener
      resolve();
    }
  }
  
  document.addEventListener("keydown", listenerEnterBolsaRepetidaModal);
});
}

const BolsaRepetidaModal = {
  async show() {
    // Muestra el modal
    await iniciarBolsaRepetidaModal();
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalBolsaRepetidaModal");
    modal.style.display = "none";
  }
};