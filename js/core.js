// Cálculos puros (sin tocar el DOM)
export function añosAntiguedad(fechaISO, periodoYYYYMM) {
  // periodoYYYYMM: "2025-09"
  const ingreso = dayjs(fechaISO);
  const periodo = dayjs(periodoYYYYMM + "-01");
  const diff = periodo.diff(ingreso, "year", true);
  return Math.max(0, Math.floor(diff));
}

export function calcularLiquidacion(empleado, reglas, horasExtras, periodo) {
  const basico = Number(empleado.basico) || 0;

  // Antigüedad
  const anios = añosAntiguedad(empleado.fechaIngreso, periodo);
  const antiguedad = basico * (reglas.antiguedad.porcPorAnio * anios);

  // Horas extras (valor hora simple = basico/30/8 aprox., ajustable)
  const valorHoraBase = (basico / 30) / 8 * reglas.extras.valorHoraBaseSobreBasico;
  const valorHsExtras = valorHoraBase * reglas.extras.multiplicadorHsExtras * (Number(horasExtras) || 0);

  const bruto = basico + antiguedad + valorHsExtras;

  const jubilacion  = bruto * reglas.aportes.jubilacion;
  const ley19032    = bruto * reglas.aportes.ley19032;
  const obraSocial  = bruto * reglas.aportes.obraSocial;
  const descuentos  = jubilacion + ley19032 + obraSocial;

  const neto = bruto - descuentos;

  const conceptos = [
    { codigo:"1-00",  concepto:"Sueldo Básico",  ref: basico, cant:30, unid:"Días", haber: bruto - antiguedad - valorHsExtras, desc:0 },
    { codigo:"1-10",  concepto:"Antigüedad",     ref: (anios*100)+"‰", cant: anios, unid:"Años", haber: antiguedad, desc:0 },
    { codigo:"1-20",  concepto:"Horas Extras",   ref: valorHoraBase.toFixed(2), cant: horasExtras, unid:"Hs", haber: valorHsExtras, desc:0 },
    { codigo:"101-0", concepto:"Jubilación",     ref: (reglas.aportes.jubilacion*100)+"%", cant:"", unid:"", haber:0, desc:jubilacion },
    { codigo:"102-0", concepto:"Ley 19032",      ref: (reglas.aportes.ley19032*100)+"%", cant:"", unid:"", haber:0, desc:ley19032 },
    { codigo:"103-0", concepto:"Obra Social",    ref: (reglas.aportes.obraSocial*100)+"%", cant:"", unid:"", haber:0, desc:obraSocial }
  ];

  return { bruto, descuentos, neto, conceptos };
}
