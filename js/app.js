// variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const gastosListados = document.querySelector("#gastos");






// eventos 


EventListteners();
function EventListteners() {
    document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

    formulario.addEventListener("submit", agregarGasto);
} 





// clses 
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto( cantidad ) {
        // extrayendo el valor
        const { presupuesto, restante } = cantidad;

        // agregar al html
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // crear div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert");

        if(tipo === "error") {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }

        // mensaje error 
        divMensaje.textContent = mensaje;

        // insertar al html
        document.querySelector(".primario").insertBefore( divMensaje, formulario);

        // quitar del html 
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostarGastos(gastos) {
        this.limpiarHTML(); // elimina el html previo

        // iterar sobre los gastos
        gastos.forEach(gasto => {
            
            const {cantidad, nombre, id} = gasto;

            // crear im li
            const nuevoGasto = document.createElement("li");
            nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";
            nuevoGasto.dataset.id = id;
        
            // agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad} </span>`;


            // boton para borrar el gasto 
            const btnBorrar = document.createElement("button");
            btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
            btnBorrar.innerHTML = "Borrar &times";
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // agregar el html
            gastosListados.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        while( gastosListados.firstChild) {
            gastosListados.removeChild(gastosListados.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestObj) {
        const { presupuesto, restante } = presupuestObj;

        const restanteDiv = document.querySelector(".restante");

        // comprobar 
        if( (presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if( (presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // si el total es 0 o menor 
        if(restante <= 0) {
            ui.imprimirAlerta("El presupuesto se ha agotado", "error");

            formulario.querySelector("button[type='submit']").disabled = true;
        }
    }
}

// intamciar
const ui = new UI();
let presupuesto;


// funciones 

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");
    //console.log( Number(presupuestoUsuario));

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    // presupuesto valido 
    presupuesto = new Presupuesto(presupuestoUsuario);
    

    ui.insertarPresupuesto(presupuesto);
}

// añade gastos 
function agregarGasto(e) {
    e.preventDefault();


    // leer los datos del formulario
    const nombre = document.querySelector("#gasto").value;
    const cantidad = Number(document.querySelector("#cantidad").value);


    // validar 
    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta("Ambos campos son obligatorios", "error");
        
        return;
    } else if ( cantidad <= 0 || isNaN(cantidad) ) {
        ui.imprimirAlerta("Cantidad no valida", "error");

        return;
    }
    
    // generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() }

    // añade un nueva gasto 
    presupuesto.nuevoGasto(gasto);

    // mensaje de todo bien
    ui.imprimirAlerta("Gasto agregado correctamente");

    // imprimir gastos
    const { gastos, restante } = presupuesto;
    ui.mostarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    // reinicia el formulario 
    formulario.reset();
}

function eliminarGasto(id) {
    // elimina del objeto
    presupuesto.eliminarGasto(id);

    // elimina los gastos del html
    const { gastos, restante } = presupuesto;
    ui.mostarGastos(gastos);
    ui.actualizarRestante(restante)
    ui.comprobarPresupuesto(presupuesto);
}