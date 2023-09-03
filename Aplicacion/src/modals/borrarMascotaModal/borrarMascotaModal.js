function iniciarModalBorrarMascota() {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalBorrarMascota" class="modalBorrarMascota">
    <div class="modal-contentBorrarMascota">
      <h2>¿Seguro que desea borrar la mascota?</h2>
      <button id="confirm-delete-buttonBorrarMascota">Sí, borrar</button>
      <button id="cancel-buttonBorrarMascota">Cancelar</button>
      <p>No se podran revertir los cambios</p>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const confirmDeleteButton = document.getElementById("confirm-delete-buttonBorrarMascota");
  const cancelButton = document.getElementById("cancel-buttonBorrarMascota");

// Definir las funciones de los eventListeners
function listenerClickAceptarBorrarMascota() {
  userDecision = true;
  BorrarMascotaModal.hide();
  confirmDeleteButton.removeEventListener("click", listenerClickAceptarBorrarMascota);
  previouslyFocusedElement.focus();
}

function listenerClickCancelarBorrarMascota() {
  userDecision = false;
  BorrarMascotaModal.hide();
  cancelButton.removeEventListener("click", listenerClickCancelarBorrarMascota);
  previouslyFocusedElement.focus();
}

function listenerEnterBorrarMascota(event) {
  if (event.key === "Enter") {
    userDecision = false;
    BorrarMascotaModal.hide();
    document.removeEventListener("keydown", listenerEnterBorrarMascota);
    
    requestAnimationFrame(() => {
      previouslyFocusedElement.focus();
    });
  }
}


confirmDeleteButton.addEventListener("click", listenerClickAceptarBorrarMascota);
cancelButton.addEventListener("click", listenerClickCancelarBorrarMascota);
document.addEventListener("keydown", listenerEnterBorrarMascota);



}

const BorrarMascotaModal = {
  show() {
    // Muestra el modal
    iniciarModalBorrarMascota();
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
    const modal = document.getElementById("custom-modalBorrarMascota");
    modal.style.display = "none";
  }
};