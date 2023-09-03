function iniciarSinMascotasModal() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalSinMascotas" class="modalSinMascotas">
    <div class="modal-contentSinMascotas" id="modal-contentSinMascotas">
      <h2>Debe agregar al menos una mascota</h2>
      <button id="aceptar-buttonSinMascotas">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonSinMascotas");


  function listenerClickAceptarSinMascotas() {
    SinMascotasModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarSinMascotas);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarSinMascotas);




  function listenerEnterSinMascotas(event) {
    if (event.key === "Enter") {
      SinMascotasModal.hide();
      document.removeEventListener("keydown", listenerEnterSinMascotas); // Elimina el eventListener
      resolve();
    }
  }
  
  document.addEventListener("keydown", listenerEnterSinMascotas);
});
}

const SinMascotasModal = {
  async show() {
    // Muestra el modal
    await iniciarSinMascotasModal();
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalSinMascotas");
    modal.style.display = "none";
  }
};