// Variable global to store the employees
let empleados = [];

// Load employees from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedEmployees = localStorage.getItem('empleadosNomina');
    if (savedEmployees) {
        empleados = JSON.parse(savedEmployees);
    }
});

// Function to save employees to localStorage
function guardarEmpleados() {
    localStorage.setItem('empleadosNomina', JSON.stringify(empleados));
}

// Render table (This function is now only called from nomina.js)
function renderNomina(empleadosFiltrados = empleados) {
  const tbody = document.querySelector("#tablaNomina tbody");
  tbody.innerHTML = "";
  empleadosFiltrados.forEach((emp, index) => {
    const row = `
      <tr>
        <td>${emp.legajo}</td>
        <td>${emp.nombre}</td>
        <td>${emp.apellido}</td>
        <td>${emp.dni}</td>
        <td>${emp.fechaIngreso}</td>
        <td>${emp.puesto}</td>
        <td>${emp.sueldo}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="abrirModalEditar(${index})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarEmpleado(${index})">Eliminar</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// Modal Add Employee
const modalAgregar = new bootstrap.Modal(document.getElementById('modalAgregar'));
document.getElementById("formAgregar").addEventListener("submit", function (e) {
  e.preventDefault();
  const nuevoLegajo = document.getElementById("nuevoLegajo").value;
  const nuevoDni = document.getElementById("nuevoDni").value;
  const isDuplicado = empleados.some(emp => emp.legajo === nuevoLegajo || emp.dni === nuevoDni);
  if (isDuplicado) {
    alert("Error: El Legajo o DNI ingresado ya existe.");
    return;
  }
  const nuevo = {
    legajo: nuevoLegajo,
    nombre: document.getElementById("nuevoNombre").value,
    apellido: document.getElementById("nuevoApellido").value,
    dni: nuevoDni,
    fechaIngreso: document.getElementById("nuevoFecha").value,
    puesto: document.getElementById("nuevoPuesto").value,
    sueldo: document.getElementById("nuevoSueldo").value,
  };
  empleados.push(nuevo);
  guardarEmpleados();
  modalAgregar.hide();
  document.getElementById("formAgregar").reset();
  renderNomina();
});

// Modal Edit Employee
const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
function abrirModalEditar(index) {
  const emp = empleados[index];
  document.getElementById("editarId").value = index;
  document.getElementById("editarNombre").value = emp.nombre;
  document.getElementById("editarApellido").value = emp.apellido;
  document.getElementById("editarDni").value = emp.dni;
  document.getElementById("editarFecha").value = emp.fechaIngreso;
  document.getElementById("editarPuesto").value = emp.puesto || "";
  document.getElementById("editarSueldo").value = emp.sueldo || 0;
  modalEditar.show();
}

document.getElementById("formEditar").addEventListener("submit", function (e) {
  e.preventDefault();
  const index = document.getElementById("editarId").value;
  empleados[index] = {
    legajo: empleados[index].legajo,
    nombre: document.getElementById("editarNombre").value,
    apellido: document.getElementById("editarApellido").value,
    dni: document.getElementById("editarDni").value,
    fechaIngreso: document.getElementById("editarFecha").value,
    puesto: document.getElementById("editarPuesto").value,
    sueldo: document.getElementById("editarSueldo").value,
  };
  guardarEmpleados();
  modalEditar.hide();
  renderNomina();
});

// Delete Employee
function eliminarEmpleado(index) {
  if (confirm("¿Estás seguro de que quieres eliminar a este empleado?")) {
    empleados.splice(index, 1);
    guardarEmpleados();
    renderNomina();
  }
}

// Filter logic (Now also only called from nomina.html)
if (document.getElementById("filtroNomina")) {
  document.getElementById("filtroNomina").addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const empleadosFiltrados = empleados.filter(emp => {
      const empString = Object.values(emp).join(" ").toLowerCase();
      return empString.includes(searchTerm);
    });
    renderNomina(empleadosFiltrados);
  });
}