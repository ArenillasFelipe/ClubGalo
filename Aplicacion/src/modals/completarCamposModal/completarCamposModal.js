function iniciarCompletarCamposModal() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalCompletarCampos" class="modalCompletarCampos">
    <div class="modal-contentCompletarCampos" id="modal-contentCompletarCampos">
      <h2>Debe completar todos los campos</h2>
      <button id="aceptar-buttonCompletarCampos">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonCompletarCampos");


  function listenerClickAceptarCompletarCampos() {
    CompletarCamposModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarCompletarCampos);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarCompletarCampos);




  function listenerEnterCompletarCampos(event) {
    if (event.key === "Enter") {
      CompletarCamposModal.hide();
      document.removeEventListener("keydown", listenerEnterCompletarCampos); // Elimina el eventListener
      resolve();
    }
  }
  
  document.addEventListener("keydown", listenerEnterCompletarCampos);
});
}

const CompletarCamposModal = {
  async show() {
    // Muestra el modal
    await iniciarCompletarCamposModal();
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalCompletarCampos");
    modal.style.display = "none";
  }
};