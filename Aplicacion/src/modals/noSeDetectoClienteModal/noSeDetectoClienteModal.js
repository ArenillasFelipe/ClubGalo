function iniciarNoSeDetectoClienteModal() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalNoSeDetectoCliente" class="modalNoSeDetectoCliente">
    <div class="modal-contentNoSeDetectoCliente" id="modal-contentNoSeDetectoCliente">
      <h2>No se ha detectado ese cliente</h2>
      <button id="aceptar-buttonNoSeDetectoCliente">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonNoSeDetectoCliente");


  function listenerClickAceptarNoSeDetectoCliente() {
    noSeDetectoClienteModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarNoSeDetectoCliente);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarNoSeDetectoCliente);




  function listenerEnterNoSeDetectoCliente(event) {
    if (event.key === "Enter") {
      noSeDetectoClienteModal.hide();
      document.removeEventListener("keydown", listenerEnterNoSeDetectoCliente); // Elimina el eventListener
      resolve();
    }
  }
  
  document.addEventListener("keydown", listenerEnterNoSeDetectoCliente);
});
}

const noSeDetectoClienteModal = {
  async show() {
    // Muestra el modal
    await iniciarNoSeDetectoClienteModal();
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalNoSeDetectoCliente");
    modal.style.display = "none";
  }
};