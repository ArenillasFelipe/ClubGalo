function iniciarModalBorrarBolsa() {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalBorrarBolsa" class="modalBorrarBolsa">
    <div class="modal-contentBorrarBolsa">
      <h2>¿Seguro que desea borrar la bolsa?</h2>
      <button id="confirm-delete-buttonBorrarBolsa">Sí, borrar</button>
      <button id="cancel-buttonBorrarBolsa">Cancelar</button>
      <p>No se podran revertir los cambios</p>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const confirmDeleteButton = document.getElementById("confirm-delete-buttonBorrarBolsa");
  const cancelButton = document.getElementById("cancel-buttonBorrarBolsa");

// Definir las funciones de los eventListeners
function listenerClickAceptarBorrarBolsa() {
  userDecision = true;
  BorrarBolsaModal.hide();
  confirmDeleteButton.removeEventListener("click", listenerClickAceptarBorrarBolsa);
  previouslyFocusedElement.focus();
}

function listenerClickCancelarBorrarBolsa() {
  userDecision = false;
  BorrarBolsaModal.hide();
  cancelButton.removeEventListener("click", listenerClickCancelarBorrarBolsa);
  previouslyFocusedElement.focus();
}

function listenerEnterBorrarBolsa(event) {
  if (event.key === "Enter") {
    userDecision = false;
    BorrarBolsaModal.hide();
    document.removeEventListener("keydown", listenerEnterBorrarBolsa);
    
    requestAnimationFrame(() => {
      previouslyFocusedElement.focus();
    });
  }
}


confirmDeleteButton.addEventListener("click", listenerClickAceptarBorrarBolsa);
cancelButton.addEventListener("click", listenerClickCancelarBorrarBolsa);
document.addEventListener("keydown", listenerEnterBorrarBolsa);



}

const BorrarBolsaModal = {
  show() {
    // Muestra el modal
    iniciarModalBorrarBolsa();
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
    const modal = document.getElementById("custom-modalBorrarBolsa");
    modal.style.display = "none";
  }
};