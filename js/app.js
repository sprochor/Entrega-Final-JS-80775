class Empleado {
    constructor(nombre, legajo, cuil, fechaIngreso, puesto, basico, horasExtras, valorHora) {
        this.nombre = nombre;
        this.legajo = legajo;
        this.cuil = cuil;
        this.fechaIngreso = fechaIngreso;
        this.puesto = puesto;
        this.basico = parseFloat(basico);
        this.horasExtras = parseFloat(horasExtras);
        this.valorHora = parseFloat(valorHora);
    }

    calcularBruto() {
        return this.basico + (this.horasExtras * this.valorHora);
    }

    calcularJubilacion() {
        return this.calcularBruto() * 0.11;
    }

    calcularLey19032() {
        return this.calcularBruto() * 0.03;
    }

    calcularObraSocial() {
        return this.calcularBruto() * 0.03;
    }

    calcularTotalDescuentos() {
        return this.calcularJubilacion() + this.calcularLey19032() + this.calcularObraSocial();
    }

    calcularNeto() {
        return this.calcularBruto() - this.calcularTotalDescuentos();
    }
}

let nomina = JSON.parse(localStorage.getItem("nomina")) || [];

document.querySelector("#formSueldo").addEventListener("submit", (e) => {
    e.preventDefault();

    const emp = new Empleado(
        document.querySelector("#nombre").value,
        document.querySelector("#legajo").value,
        document.querySelector("#cuil").value,
        document.querySelector("#fechaIngreso").value,
        document.querySelector("#puesto").value,
        document.querySelector("#basico").value,
        document.querySelector("#horasExtras").value || 0,
        document.querySelector("#valorHora").value || 0
    );

    nomina.push(emp);
    localStorage.setItem("nomina", JSON.stringify(nomina));
    mostrarResultados();
    e.target.reset();
});

function mostrarResultados() {
    const cont = document.querySelector("#resultado");
    cont.innerHTML = "";
    nomina.forEach((emp, index) => {
        cont.innerHTML += `
        <div class="recibo shadow-sm">
            <h5>Recibo de Haberes</h5>
            <p><strong>Legajo:</strong> ${emp.legajo} | <strong>Nombre:</strong> ${emp.nombre}</p>
            <p><strong>CUIL:</strong> ${emp.cuil} | <strong>Puesto:</strong> ${emp.puesto}</p>
            <p><strong>Fecha Ingreso:</strong> ${emp.fechaIngreso}</p>

            <table class="table table-bordered table-sm">
                <thead class="table-light">
                    <tr>
                        <th>Código</th>
                        <th>Concepto</th>
                        <th>Ref.</th>
                        <th>Cant.</th>
                        <th>Unid.</th>
                        <th>Haberes</th>
                        <th>Descuentos</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1-00</td>
                        <td>Sueldo</td>
                        <td>${emp.basico.toFixed(2)}</td>
                        <td>30</td>
                        <td>Días</td>
                        <td>${emp.calcularBruto().toFixed(2)}</td>
                        <td>0.00</td>
                    </tr>
                    <tr>
                        <td>101-00</td>
                        <td>Jubilación</td>
                        <td>${emp.basico.toFixed(2)}</td>
                        <td>11%</td>
                        <td>%</td>
                        <td>0.00</td>
                        <td>${emp.calcularJubilacion().toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>102-00</td>
                        <td>Ley 19032</td>
                        <td>${emp.basico.toFixed(2)}</td>
                        <td>3%</td>
                        <td>%</td>
                        <td>0.00</td>
                        <td>${emp.calcularLey19032().toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>103-00</td>
                        <td>Obra Social</td>
                        <td>${emp.basico.toFixed(2)}</td>
                        <td>3%</td>
                        <td>%</td>
                        <td>0.00</td>
                        <td>${emp.calcularObraSocial().toFixed(2)}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr class="totales">
                        <td colspan="5" class="text-end">Totales</td>
                        <td>${emp.calcularBruto().toFixed(2)}</td>
                        <td>${emp.calcularTotalDescuentos().toFixed(2)}</td>
                    </tr>
                    <tr class="totales">
                        <td colspan="5" class="text-end">Neto a Cobrar</td>
                        <td colspan="2">${emp.calcularNeto().toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            <button class="btn btn-sm btn-danger" onclick="eliminarEmpleado(${index})">Eliminar</button>
        </div>
        `;
    });
}

function eliminarEmpleado(index) {
    nomina.splice(index, 1);
    localStorage.setItem("nomina", JSON.stringify(nomina));
    mostrarResultados();
}

mostrarResultados();

