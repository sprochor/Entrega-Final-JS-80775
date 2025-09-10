// Variable global para almacenar las liquidaciones
let liquidaciones = [];

document.addEventListener("DOMContentLoaded", () => {
  const liquidacionesGuardadas = localStorage.getItem('liquidaciones');
  if (liquidacionesGuardadas) {
    liquidaciones = JSON.parse(liquidacionesGuardadas);
  }
  mostrarLiquidaciones();
  
  // Función para cargar los empleados al abrir la página
  renderEmpleadosParaSeleccion();
});

// 
document.getElementById("btnLiquidacionFinal").addEventListener("click", liquidar);

// Boton "Marcar/Desmarcar todos
document.getElementById("btnMarcarTodos").addEventListener("click", () => {
  const checkboxes = document.querySelectorAll('#tablaEmpleadosModal input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = true;
  });
});

document.getElementById("btnDesmarcarTodos").addEventListener("click", () => {
  const checkboxes = document.querySelectorAll('#tablaEmpleadosModal input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
});

// Función para guardar las liquidaciones
function guardarLiquidaciones() {
  localStorage.setItem('liquidaciones', JSON.stringify(liquidaciones));
}

// Renderiza la lista de empleados 
function renderEmpleadosParaSeleccion() {
    const tablaModal = document.getElementById("tablaEmpleadosModal");
    tablaModal.innerHTML = ''; // Limpiar la tabla antes de renderizar
    if (typeof empleados === 'undefined' || empleados.length === 0) {
        tablaModal.innerHTML = '<tr><td colspan="4" class="text-center">No hay empleados en la nómina para seleccionar.</td></tr>';
        return;
    }

    empleados.forEach((emp, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" class="form-check-input" data-legajo="${emp.legajo}"></td>
            <td>${emp.legajo}</td>
            <td>${emp.nombre} ${emp.apellido}</td>
            <td>${emp.puesto}</td>
        `;
        tablaModal.appendChild(row);
    });
}

function liquidar() {
  const mes = document.getElementById("mesLiquidacion").value;
  const anio = document.getElementById("anioLiquidacion").value;
  
  if (mes === 'Elegir...' || !anio) {
    alert("Seleccione mes y año de liquidación");
    return;
  }

  const checkboxes = document.querySelectorAll('#tablaEmpleadosModal input[type="checkbox"]:checked');
  if (checkboxes.length === 0) {
    alert('No hay empleados seleccionados para liquidar. Por favor, selecciona al menos uno.');
    return;
  }

  const liquidacionesAEliminar = liquidaciones.filter(liq => liq.mes === mes && liq.anio === anio);
  if (liquidacionesAEliminar.length > 0) {
    if (!confirm("Ya existe una liquidación para este mes y año. ¿Quieres reemplazarla?")) {
      return;
    }
    liquidaciones = liquidaciones.filter(liq => liq.mes !== mes || liq.anio !== anio);
  }

  const empleadosSeleccionados = Array.from(checkboxes).map(checkbox => {
    const legajoSeleccionado = checkbox.getAttribute('data-legajo');
    return empleados.find(emp => emp.legajo === legajoSeleccionado);
  });
  
  empleadosSeleccionados.forEach((emp) => {
    liquidaciones.push({
      legajo: emp.legajo,
      nombre: emp.nombre,
      apellido: emp.apellido,
      mes: mes,
      anio: anio,
      sueldo: emp.sueldo,
    });
  });

  guardarLiquidaciones();
  mostrarLiquidaciones();
  const modalSeleccion = bootstrap.Modal.getInstance(document.getElementById('modalSeleccionarEmpleados'));
  modalSeleccion.hide();
  alert("Liquidación generada con éxito!");
}

function mostrarLiquidaciones() {
  const tabla = document.querySelector("#tablaLiquidaciones tbody");
  tabla.innerHTML = "";
  liquidaciones.forEach((liq, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${liq.legajo}</td>
      <td>${liq.nombre}</td>
      <td>${liq.apellido}</td>
      <td>${liq.mes}</td>
      <td>${liq.anio}</td>
      <td>${liq.sueldo}</td>
      <td>
        <button class="btn btn-info btn-sm me-2" onclick="verRecibo(${index})">Ver</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarLiquidacion(${index})">Eliminar</button>
      </td>
    `;
    tabla.appendChild(row);
  });
}

function eliminarLiquidacion(index) {
  if (confirm("¿Estás seguro de que quieres eliminar esta liquidación?")) {
    liquidaciones.splice(index, 1);
    guardarLiquidaciones();
    mostrarLiquidaciones();
  }
}

function verRecibo(index) {
  const liquidacion = liquidaciones[index];
  const sueldoBruto = parseFloat(liquidacion.sueldo);
  const descuentos = sueldoBruto * 0.17; // Ejemplo de descuento del 17%
  const sueldoNeto = sueldoBruto - descuentos;

  const reciboContent = document.getElementById("reciboContent");
  reciboContent.innerHTML = `
    <p><strong>Legajo:</strong> ${liquidacion.legajo}</p>
    <p><strong>Nombre:</strong> ${liquidacion.nombre} ${liquidacion.apellido}</p>
    <p><strong>Mes/Año:</strong> ${liquidacion.mes}/${liquidacion.anio}</p>
    <hr>
    <h5>Conceptos</h5>
    <p><strong>Sueldo Básico:</strong> $${sueldoBruto.toFixed(2)}</p>
    <p><strong>Descuentos de Ley (17%):</strong> -$${descuentos.toFixed(2)}</p>
    <hr>
    <h4>Total Neto a Cobrar: $${sueldoNeto.toFixed(2)}</h4>
  `;
  const modalRecibo = new bootstrap.Modal(document.getElementById('modalRecibo'));
  modalRecibo.show();
}