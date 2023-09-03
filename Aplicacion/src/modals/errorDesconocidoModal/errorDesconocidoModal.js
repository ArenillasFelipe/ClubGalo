function iniciarErrorDesconocidoModal() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalErrorDesconocido" class="modalErrorDesconocido">
    <div class="modal-contentErrorDesconocido">
      <h2>Ha ocurrido un error desconocido</h2>
      <p>Verifique haber escrito correctamente el nombre de la bolsa y haber completado todos los campos</p>
      <button id="aceptar-buttonErrorDesconocido">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonErrorDesconocido");

  function listenerClickAceptarErrorDesconocido() {
    ErrorDesconocidoModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarErrorDesconocido);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarErrorDesconocido);


  function listenerEnterErrorDesconocido(event) {
    if (event.key === "Enter") {
      ErrorDesconocidoModal.hide();
      document.removeEventListener("keydown", listenerEnterErrorDesconocido); // Elimina el eventListener
      resolve();
    }
  }
  
  document.addEventListener("keydown", listenerEnterErrorDesconocido);



});
}

const ErrorDesconocidoModal = {
  async show() {
    // Muestra el modal
    await iniciarErrorDesconocidoModal();
  },

  // La función hide() ahora devuelve una promesa
  hide() {
      const modal = document.getElementById("custom-modalErrorDesconocido");
      modal.style.display = "none";
  }
};