function iniciarModalVentaExitosa() {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalVentaExitosa" class="modalVentaExitosa">
    <div class="modal-contentVentaExitosa">
      <h2>¡Todo listo!</h2>
      <p>La venta se ha ejecutado con exito</p>
      <button id="aceptar-buttonVentaExitosa">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonVentaExitosa");

  aceptarButton.addEventListener("click", function () {
    location.reload();
  });

  document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      location.reload();
    }
  });
}

const VentaExitosaModal = {
  show() {
    // Muestra el modal
    iniciarModalVentaExitosa();
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalVentaExitosa");
    modal.style.display = "none";
  }
};