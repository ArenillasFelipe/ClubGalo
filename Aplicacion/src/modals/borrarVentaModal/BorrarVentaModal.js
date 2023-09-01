function iniciarModalBorrarVenta() {
  document.getElementById("modalBorrarVenta").innerHTML = `<div id="custom-modal" class="modal">
    <div class="modal-content">
      <h2>¿Seguro que desea borrar la venta?</h2>
      <label for="delete-options">
        <input type="checkbox" id="delete-options" name="delete-options">
        Borrar puntos otorgados y devolver ptos. canjeados
      </label>
      <button id="confirm-delete-button">Sí, borrar</button>
      <button id="cancel-button">Cancelar</button>
      <p>No se podrán revertir los cambios.</p>
    </div>
  </div>`;

  const confirmDeleteButton = document.getElementById("confirm-delete-button");
  const cancelButton = document.getElementById("cancel-button");

  confirmDeleteButton.addEventListener("click", function () {
    isChecked = document.getElementById("delete-options").checked; // Verifica si el checkbox está marcado
    userDecision = true; // Almacena la decisión y el estado del checkbox
    deleteSaleModal.hide();
  });

  cancelButton.addEventListener("click", function () {
    userDecision = false;
    deleteSaleModal.hide();
  });
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
    const modal = document.getElementById("custom-modal");
    modal.style.display = "none";
  }
};