function iniciarPuntosNegativosModal() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalPuntosNegativos" class="modalPuntosNegativos">
    <div class="modal-contentPuntosNegativos" id="modal-contentPuntosNegativos">
      <h2>No puede canjear mas puntos de los disponibles</h2>
      <button id="aceptar-buttonPuntosNegativos">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonPuntosNegativos");


  function listenerClickAceptarPuntosNegativos() {
    PuntosNegativosModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarPuntosNegativos);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarPuntosNegativos);




  function listenerEnterPuntosNegativos(event) {
    if (event.key === "Enter") {
      PuntosNegativosModal.hide();
      document.removeEventListener("keydown", listenerEnterPuntosNegativos); // Elimina el eventListener
      resolve();
    }
  }
  
  document.addEventListener("keydown", listenerEnterPuntosNegativos);
});
}

const PuntosNegativosModal = {
  async show() {
    // Muestra el modal
    await iniciarPuntosNegativosModal();
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalPuntosNegativos");
    modal.style.display = "none";
  }
};