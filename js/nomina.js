// Function to convert Excel serial date to YYYY-MM-DD format
function excelSerialDateToJSDate(serial) {
  const excelEpoch = new Date(Date.UTC(1899, 11, 30));
  const jsDate = new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
  return jsDate.toISOString().slice(0, 10);
}

// Import Excel
document.getElementById("inputExcel").addEventListener("change", function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const empleadosExcel = jsonData.slice(1).map((row) => {
      const fechaIngresoExcel = row[4];
      const fechaIngresoFormateada = excelSerialDateToJSDate(fechaIngresoExcel);

      return {
        legajo: String(row[0]),
        nombre: row[1],
        apellido: row[2],
        dni: String(row[3]),
        fechaIngreso: fechaIngresoFormateada,
        puesto: row[5],
        sueldo: row[6],
      };
    });

    const empleadosSinDuplicados = [];
    const duplicados = [];
    
    empleadosExcel.forEach(emp => {
      const isDuplicado = empleados.some(existente => String(existente.legajo) === emp.legajo || String(existente.dni) === emp.dni) || empleadosSinDuplicados.some(nuevo => String(nuevo.legajo) === emp.legajo || String(nuevo.dni) === emp.dni);
      
      if (!isDuplicado) {
        empleadosSinDuplicados.push(emp);
      } else {
        duplicados.push(emp);
      }
    });

    localStorage.setItem('empleadosNomina', JSON.stringify(empleadosSinDuplicados));
    empleados = empleadosSinDuplicados;

    if (duplicados.length > 0) {
      alert(`Se encontraron ${duplicados.length} registros duplicados y no se importaron. Revisa tu archivo Excel.`);
    }

    renderNomina();
  };

  reader.readAsArrayBuffer(file);
});