function iniciarModalBorrarCliente() {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalBorrarCliente" class="modalBorrarCliente">
    <div class="modal-contentBorrarCliente">
      <h2>¿Seguro que desea borrar el cliente?</h2>
      <button id="confirm-delete-buttonBorrarCliente">Sí, borrar</button>
      <button id="cancel-buttonBorrarCliente">Cancelar</button>
      <p>No se podran revertir los cambios</p>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const confirmDeleteButton = document.getElementById("confirm-delete-buttonBorrarCliente");
  const cancelButton = document.getElementById("cancel-buttonBorrarCliente");

// Definir las funciones de los eventListeners
function listenerClickAceptarBorrarCliente() {
  userDecision = true;
  BorrarClienteModal.hide();
  confirmDeleteButton.removeEventListener("click", listenerClickAceptarBorrarCliente);
  previouslyFocusedElement.focus();
}

function listenerClickCancelarBorrarCliente() {
  userDecision = false;
  BorrarClienteModal.hide();
  cancelButton.removeEventListener("click", listenerClickCancelarBorrarCliente);
  previouslyFocusedElement.focus();
}

function listenerEnterBorrarCliente(event) {
  if (event.key === "Enter") {
    userDecision = false;
    BorrarClienteModal.hide();
    document.removeEventListener("keydown", listenerEnterBorrarCliente);
    
    requestAnimationFrame(() => {
      previouslyFocusedElement.focus();
    });
  }
}


confirmDeleteButton.addEventListener("click", listenerClickAceptarBorrarCliente);
cancelButton.addEventListener("click", listenerClickCancelarBorrarCliente);
document.addEventListener("keydown", listenerEnterBorrarCliente);



}

const BorrarClienteModal = {
  show() {
    // Muestra el modal
    iniciarModalBorrarCliente();
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (userDecision !== null) {
          clearInterval(interval);
          resolve(userDecision);
        }
      }, 100);
    });
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalBorrarCliente");
    modal.style.display = "none";
  }
};