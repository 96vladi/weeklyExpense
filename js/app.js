// Variables y selectores
const  formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


//Eventos
eventListeners();
function eventListeners(){
  document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
  formulario.addEventListener('submit', agregarGasto);
}


//Clases
class Presupuesto{
  constructor(presupuesto){
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto){
    this.gastos = [...this.gastos, gasto];
    //console.log(this.gastos);
    this.calcularRestante();
  }

  calcularRestante(){
    const gastado = this.gastos.reduce( (total, gasto) => total+gasto.cantidad, 0 );
    //console.log(gastado);
    this.restante = this.presupuesto - gastado;
    //console.log(this.restante);
  }

  eliminarGasto(id){
    this.gastos = this.gastos.filter( gasto => gasto.id !== id );
    //console.log(this.gastos);
    this.calcularRestante();
  }
}

class UI{
  insertarPresupuesto( cantidad ){
    //Extraemos el valor
    const { presupuesto, restante } = cantidad;
    //Agregamos al html
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;
  }

  imprimirAlerta(mensaje, tipo){
    //Crear el div
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text.center', 'alert');
    if (tipo === 'error') {
      divMensaje.classList.add('alert-danger');
    } else {
      divMensaje.classList.add('alert-success');
    }
    //Mensaje de error
    divMensaje.textContent = mensaje;
    //Insertar en el html
    document.querySelector('.primario').insertBefore(divMensaje, formulario);
    //QUitar el error
    setTimeout(()=>{
      divMensaje.remove();
    }, 3000);
  }

  agregarGastoListado(gastos){
    this.limpiarHTML();  //ELimina el html previo
    //console.log(gastos);
    //Interar todos los gastos
    gastos.forEach( gasto => {
      const { cantidad, nombre, id } = gasto;
      //Crear un li
      const nuevoGasto = document.createElement('li');
      nuevoGasto.className = 'list-group-item d-flex justify-content-between aling-items-center';
      // nuevoGasto.setAttribute('data-id', id);  ES el mismo que el de abajo solo que nueva version
      nuevoGasto.dataset.id = id;

      //Agregar en el html del gasto
      nuevoGasto.innerHTML = `
      ${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>
      `;

      //Boton para borrar el gasto
      const btnBorrar = document.createElement('button');
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      btnBorrar.innerHTML = 'Borrar &times';
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      nuevoGasto.appendChild(btnBorrar);

      //Agregar al html
      gastoListado.appendChild(nuevoGasto);
    });
  }

  limpiarHTML(){
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante){
    document.querySelector('#restante').textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj){
    const { presupuesto, restante } = presupuestoObj;
    const restanteDiv = document.querySelector('.restante');
    //Comprobar el 25%
    if (( presupuesto / 4 ) > restante ) {
      //console.log("Ya gastaste el 75%");
      restanteDiv.classList.remove('alert-success', 'alert-warning');
      restanteDiv.classList.add('alert-danger');
    } else if ((presupuesto / 2) > restante) {
      restanteDiv.classList.remove('alert-success');
      restanteDiv.classList.add('alert-warning');
    } else {
      restanteDiv.classList.remove('alert-danger', 'alert-warning');
      restanteDiv.classList.add('alert-success');
    }

    //Si el total es menor a 0
    if (restante <= 0) {
      ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

//Instanciar
const ui = new UI();
let presupuesto;

//Funciones
function preguntarPresupuesto(){
  const presupuestoUsuario = prompt('Cual es tu presupuesto');
  //console.log(Number(presupuestoUsuario));
  if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
    window.location.reload();
  }

  //Presupuesto valor
  presupuesto = new Presupuesto(presupuestoUsuario);
  console.log(presupuesto);
  ui.insertarPresupuesto(presupuesto);
}

//Agregar gastos
function agregarGasto(e){
  e.preventDefault();

  //Leer los datos del formulario
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);

  //Validar
  if (nombre === '' || cantidad === '') {
    //console.log('Amobos campos son obligatorios');
    ui.imprimirAlerta('Ambos campos son oblicagatorios','error');
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta('Cantidad no valida', 'error');
    return;
  }

  //Generar un objeto con el gasto
  const gasto = {nombre, cantidad, id: Date.now()};
  //console.log(gasto);
  //Añade nuevo gasto
  presupuesto.nuevoGasto(gasto);
  ui.imprimirAlerta('Gasto agregado correctamente');
  //Imprimir los gastos
  const { gastos, restante } = presupuesto;
  ui.agregarGastoListado(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
  //Reinicia el formulario
  formulario.reset();
}


function eliminarGasto(id){
  //console.log(id);
  //Elimina gastos del arreglo
  presupuesto.eliminarGasto(id);
  //Elimina gastos del html
  const { gastos, restante } = presupuesto;
  ui.agregarGastoListado( gastos );

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);
}
