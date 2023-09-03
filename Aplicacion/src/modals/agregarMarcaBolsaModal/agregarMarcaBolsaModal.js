function iniciarAgregarMarcaBolsaModal() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalAgregarMarcaBolsa" class="modalAgregarMarcaBolsa">
    <div class="modal-contentAgregarMarcaBolsa" id="modal-contentAgregarMarcaBolsa">
      <h2>Debes indicar la marca de la bolsa</h2>
      <button id="aceptar-buttonAgregarMarcaBolsa">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonAgregarMarcaBolsa");


  function listenerClickAceptarAgregarMarcaBolsa() {
    AgregarMarcaBolsaModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarAgregarMarcaBolsa);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarAgregarMarcaBolsa);




  function listenerEnterAgregarMarcaBolsa(event) {
    if (event.key === "Enter") {
      AgregarMarcaBolsaModal.hide();
      document.removeEventListener("keydown", listenerEnterAgregarMarcaBolsa); // Elimina el eventListener
      resolve();
    }
  }
  
  document.addEventListener("keydown", listenerEnterAgregarMarcaBolsa);
});
}

const AgregarMarcaBolsaModal = {
  async show() {
    // Muestra el modal
    await iniciarAgregarMarcaBolsaModal();
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalAgregarMarcaBolsa");
    modal.style.display = "none";
  }
};