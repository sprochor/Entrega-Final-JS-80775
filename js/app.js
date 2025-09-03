import { calcularLiquidacion } from "./core.js";

const selEmpleado   = document.querySelector("#selEmpleado");
const formLiquidar  = document.querySelector("#formLiquidar");
const resultadoDiv  = document.querySelector("#resultado");
const historialDiv  = document.querySelector("#historial");
const btnExportCSV  = document.querySelector("#btnExportCSV");

let EMPLEADOS = [];
let REGLAS    = null;
let HISTORIAL = JSON.parse(localStorage.getItem("historial_liq")) || [];

init();

async function init() {
  // Cargar “datos remotos” (JSON)
  const [empRes, regRes] = await Promise.all([
    fetch("./data/empleados.json"),
    fetch("./data/conceptos.json")
  ]);
  EMPLEADOS = await empRes.json();
  REGLAS = await regRes.json();

  // Popular select empleados
  selEmpleado.innerHTML = `<option value="">Seleccioná</option>` + 
    EMPLEADOS.map(e => `<option value="${e.id}">${e.legajo} - ${e.nombre}</option>`).join("");

  renderHistorial();
}

formLiquidar.addEventListener("submit", (e) => {
  e.preventDefault();
  const idEmp      = Number(selEmpleado.value);
  const periodo    = document.querySelector("#periodo").value;
  const horasExtra = Number(document.querySelector("#horasExtras").value || 0);
  if (!idEmp || !periodo) return;

  const emp = EMPLEADOS.find(x => x.id === idEmp);
  const liq = calcularLiquidacion(emp, REGLAS, horasExtra, periodo);

  renderRecibo(emp, periodo, horasExtra, liq);
  persistirEnHistorial({ fecha: new Date().toISOString(), periodo, emp, liq, horasExtra });
});

function renderRecibo(emp, periodo, horasExtras, liq) {
  resultadoDiv.innerHTML = `
    <div class="recibo shadow-sm">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h5 class="m-0">Recibo de Haberes</h5>
        <div id="chartWrap"><canvas id="chartLiq"></canvas></div>
      </div>
      <p class="m-0"><strong>Legajo:</strong> ${emp.legajo} | <strong>Nombre:</strong> ${emp.nombre}</p>
      <p class="m-0"><strong>CUIL:</strong> ${emp.cuil} | <strong>Puesto:</strong> ${emp.puesto}</p>
      <p class="mb-2"><strong>Ingreso:</strong> ${emp.fechaIngreso} | <strong>Período:</strong> ${periodo}</p>

      <table class="table table-bordered table-sm">
        <thead class="table-light">
          <tr>
            <th>Código</th><th>Concepto</th><th>Ref.</th><th>Cant.</th><th>Unid.</th><th>Haberes</th><th>Descuentos</th>
          </tr>
        </thead>
        <tbody>
          ${liq.conceptos.map(c => `
            <tr>
              <td>${c.codigo}</td>
              <td>${c.concepto}</td>
              <td>${c.ref}</td>
              <td>${c.cant ?? ""}</td>
              <td>${c.unid ?? ""}</td>
              <td>${c.haber ? c.haber.toFixed(2) : "0.00"}</td>
              <td>${c.desc ? c.desc.toFixed(2) : "0.00"}</td>
            </tr>
          `).join("")}
        </tbody>
        <tfoot>
          <tr class="totales">
            <td colspan="5" class="text-end">Totales</td>
            <td>${liq.bruto.toFixed(2)}</td>
            <td>${liq.descuentos.toFixed(2)}</td>
          </tr>
          <tr class="totales">
            <td colspan="5" class="text-end">Neto a Cobrar</td>
            <td colspan="2">${liq.neto.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;

  // Gráfico (Haberes vs Descuentos)
  const ctx = document.querySelector("#chartLiq");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Haberes", "Descuentos"],
      datasets: [{ data: [liq.bruto, liq.descuentos] }]
    },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } }
  });
}

function persistirEnHistorial(item) {
  HISTORIAL.unshift(item);
  localStorage.setItem("historial_liq", JSON.stringify(HISTORIAL));
  renderHistorial();
}

function renderHistorial() {
  if (!HISTORIAL.length) {
    historialDiv.innerHTML = `<p class="text-muted">Sin liquidaciones aún.</p>`;
    return;
  }
  historialDiv.innerHTML = `
    <div class="table-responsive">
      <table class="table table-sm align-middle">
        <thead class="table-light">
          <tr><th>Fecha</th><th>Período</th><th>Empleado</th><th>Neto</th></tr>
        </thead>
        <tbody>
          ${HISTORIAL.map(h => `
            <tr>
              <td>${new Date(h.fecha).toLocaleString()}</td>
              <td>${h.periodo}</td>
              <td>${h.emp.legajo} - ${h.emp.nombre}</td>
              <td>$ ${h.liq.neto.toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

btnExportCSV.addEventListener("click", () => {
  if (!HISTORIAL.length) return;
  const headers = ["fecha","periodo","legajo","nombre","neto"];
  const rows = HISTORIAL.map(h => [
    h.fecha,
    h.periodo,
    h.emp.legajo,
    h.emp.nombre,
    h.liq.neto.toFixed(2)
  ]);
  const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "historial_liquidaciones.csv"; a.click();
  URL.revokeObjectURL(url);
});
