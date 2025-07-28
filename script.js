// Variables y constantes
const salarioMinimo = 317800;
const porcentajeJubilacion = 11; // 11%
const porcentajeObraSocial = 3; // 3%
const porcentajePami = 3; // 3%
let empleados = [];

// Función para calcular el neto
function calcularNeto(sueldo) {
  const jubilacion = (sueldo * porcentajeJubilacion) / 100;
  const obraSocial = (sueldo * porcentajeObraSocial) / 100;
  const pami = (sueldo * porcentajePami) / 100;
  const totalDescuentos = jubilacion + obraSocial + pami;
  const neto = sueldo - totalDescuentos;

  return {
    jubilacion,
    obraSocial,
    pami,
    totalDescuentos,
    neto,
  };
}

// Función principal
function simularLiquidacion() {
  alert("Bienvenido al simulador de liquidación de sueldos");

  let nombre = prompt("Ingresá el nombre del empleado:");
  let legajo = Number(prompt("Ingresá el legajo del empleado:"));

  if (isNaN(legajo) || legajo <= 0) {
    alert("Legajo inválido. Intentá nuevamente.");
    legajo = Number(
      prompt("Ingresá un legajo válido (solo números positivos):")
    );

    if (isNaN(legajo) || legajo <= 0) {
      alert("Legajo inválido. Se cancela la liquidacion.");
      return; // corta la función y no sigue con la carga
    }
  }

  let sueldo = Number(prompt(`Ingresá el sueldo bruto de ${nombre}:`));

  if (isNaN(sueldo) || sueldo < 317800) {
    alert("Sueldo inválido. Se usará el salario mínimo por defecto.");
    sueldo = salarioMinimo;
  }

  const descuentos = calcularNeto(sueldo);

  empleados.push({
    nombre,
    legajo,
    sueldo,
    ...descuentos,
  });

  alert(
    `Empleado: ${nombre}\n` +
      `Legajo: ${legajo}\n` +
      `Sueldo Bruto: $${sueldo}\n` +
      `Descuentos:\n` +
      `  Jubilación (11%): $${descuentos.jubilacion}\n` +
      `  Obra Social (3%): $${descuentos.obraSocial}\n` +
      `  Ley 19032 (3%): $${descuentos.pami}\n` +
      `Total Descuentos: $${descuentos.totalDescuentos}\n` +
      `Sueldo Neto: $${descuentos.neto}`
  );

  console.log("Resumen de empleados liquidados:");
  console.table(empleados);

  const otraLiquidacion = confirm("¿Querés liquidar otro empleado?");
  if (otraLiquidacion) {
    simularLiquidacion();
  } else {
    alert("Gracias por usar el simulador");
  }
}
// Iniciar simulación
simularLiquidacion();
