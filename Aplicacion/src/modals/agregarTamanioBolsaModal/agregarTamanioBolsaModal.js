function iniciarAgregarTamanioBolsaModal() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalAgregarTamanioBolsa" class="modalAgregarTamanioBolsa">
    <div class="modal-contentAgregarTamanioBolsa" id="modal-contentAgregarTamanioBolsa">
      <h2>Debes agregar al menos 1 tamaño de bolsa</h2>
      <button id="aceptar-buttonAgregarTamanioBolsa">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonAgregarTamanioBolsa");


  function listenerClickAceptarAgregarTamanioBolsa() {
    AgregarTamanioBolsaModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarAgregarTamanioBolsa);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarAgregarTamanioBolsa);




  function listenerEnterAgregarTamanioBolsa(event) {
    if (event.key === "Enter") {
      AgregarTamanioBolsaModal.hide();
      document.removeEventListener("keydown", listenerEnterAgregarTamanioBolsa); // Elimina el eventListener
      resolve();
    }
  }
  
  document.addEventListener("keydown", listenerEnterAgregarTamanioBolsa);
});
}

const AgregarTamanioBolsaModal = {
  async show() {
    // Muestra el modal
    await iniciarAgregarTamanioBolsaModal();
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalAgregarTamanioBolsa");
    modal.style.display = "none";
  }
};