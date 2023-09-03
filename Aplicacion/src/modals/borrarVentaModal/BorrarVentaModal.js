function iniciarModalBorrarVenta() {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalBorrarVenta" class="modalBorrarVenta">
    <div class="modal-contentBorrarVenta">
      <h2>¿Seguro que desea borrar la venta?</h2>
      <label for="delete-optionsBorrarVenta">
        <input type="checkbox" id="delete-optionsBorrarVenta" name="delete-optionsBorrarVenta" checked>
        Borrar puntos otorgados y devolver ptos. canjeados
      </label>
      <button id="confirm-delete-buttonBorrarVenta">Sí, borrar</button>
      <button id="cancel-buttonBorrarVenta">Cancelar</button>
      <p>No se podrán revertir los cambios</p>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const confirmDeleteButton = document.getElementById("confirm-delete-buttonBorrarVenta");
  const cancelButton = document.getElementById("cancel-buttonBorrarVenta");

// Definir las funciones de los eventListeners
function listenerClickAceptarBorrarVenta() {
  isChecked = document.getElementById("delete-optionsBorrarVenta").checked;
  userDecision = true;
  deleteSaleModal.hide();
  confirmDeleteButton.removeEventListener("click", listenerClickAceptarBorrarVenta);
  previouslyFocusedElement.focus();
}

function listenerClickCancelarBorrarVenta() {
  userDecision = false;
  deleteSaleModal.hide();
  cancelButton.removeEventListener("click", listenerClickCancelarBorrarVenta);
  previouslyFocusedElement.focus();
}

function listenerEnterBorrarVenta(event) {
  if (event.key === "Enter") {
    userDecision = false;
    deleteSaleModal.hide();
    document.removeEventListener("keydown", listenerEnterBorrarVenta);
    
    requestAnimationFrame(() => {
      previouslyFocusedElement.focus();
    });
  }
}


confirmDeleteButton.addEventListener("click", listenerClickAceptarBorrarVenta);
cancelButton.addEventListener("click", listenerClickCancelarBorrarVenta);
document.addEventListener("keydown", listenerEnterBorrarVenta);



}

const deleteSaleModal = {
  show() {
    // Muestra el modal
    iniciarModalBorrarVenta();
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
    const modal = document.getElementById("custom-modalBorrarVenta");
    modal.style.display = "none";
  }
};