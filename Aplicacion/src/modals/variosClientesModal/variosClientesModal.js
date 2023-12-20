function iniciarModalVariosClientes() {
  return new Promise((resolve) => {
  document.getElementById("container-modal").innerHTML = `<div id="custom-modalVariosClientes" class="modalVariosClientes">
    <div class="modal-contentVariosClientes">
      <h2>Existen varios clientes segun los datos ingresados</h2>
      <p>Ingrese datos extra o el Nº de cliente</p>
      <button id="aceptar-buttonVariosClientes">Aceptar</button>
    </div>
  </div>`;

  let previouslyFocusedElement = document.activeElement;
  previouslyFocusedElement.blur();

  const aceptarButton = document.getElementById("aceptar-buttonVariosClientes");

  function listenerClickAceptarVariosClientes() {
    variosClientesModal.hide();
    aceptarButton.removeEventListener("click", listenerClickAceptarVariosClientes);
    resolve();
  }
  
  aceptarButton.addEventListener("click", listenerClickAceptarVariosClientes);
  
  document.addEventListener("keydown", listenerClickAceptarVariosClientes);


});
}

const variosClientesModal = {
  async show() {
    // Muestra el modal
    await iniciarModalVariosClientes();
  },
  hide() {
    // Oculta el modal
    const modal = document.getElementById("custom-modalVariosClientes");
    modal.style.display = "none";
  }
};