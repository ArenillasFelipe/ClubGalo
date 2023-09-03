function iniciarCompletarInputTamanioModal() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalCompletarInputTamanio" class="modalCompletarInputTamanio">
    <div class="modal-contentCompletarInputTamanio" id="modal-contentCompletarInputTamanio">
      <h2>Debes completar el campo de agregar tamaño</h2>
      <button id="aceptar-buttonCompletarInputTamanio">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonCompletarInputTamanio");


  function listenerClickAceptarCompletarInputTamanio() {
    CompletarInputTamanioModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarCompletarInputTamanio);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarCompletarInputTamanio);




  function listenerEnterCompletarInputTamanio(event) {
    if (event.key === "Enter") {
      CompletarInputTamanioModal.hide();
      document.removeEventListener("keydown", listenerEnterCompletarInputTamanio); // Elimina el eventListener
      resolve();
    }
  }
  
  document.addEventListener("keydown", listenerEnterCompletarInputTamanio);
});
}

const CompletarInputTamanioModal = {
  async show() {
    // Muestra el modal
    await iniciarCompletarInputTamanioModal();
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalCompletarInputTamanio");
    modal.style.display = "none";
  }
};