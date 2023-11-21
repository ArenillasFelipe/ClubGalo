function iniciarFormatoNumericoModal() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalFormatoNumerico" class="modalFormatoNumerico">
    <div class="modal-contentFormatoNumerico" id="modal-contentFormatoNumerico">
      <h2>Debes completar el campo con numeros positivos</h2>
      <button id="aceptar-buttonFormatoNumerico">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonFormatoNumerico");


  function listenerClickAceptarFormatoNumerico() {
    FormatoNumericoModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarFormatoNumerico);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarFormatoNumerico);




  function listenerEnterFormatoNumerico(event) {
    if (event.key === "Enter") {
      FormatoNumericoModal.hide();
      document.removeEventListener("keydown", listenerEnterFormatoNumerico); // Elimina el eventListener
      resolve();
    }
  }
  
  document.addEventListener("keydown", listenerEnterFormatoNumerico);
});
}

const FormatoNumericoModal = {
  async show() {
    // Muestra el modal
    await iniciarFormatoNumericoModal();
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalFormatoNumerico");
    modal.style.display = "none";
  }
};