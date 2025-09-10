Entrega Final – Curso de JavaScript (Coderhouse)

Comisión: 80775
Alumno: Sebastián Prochor

Proyecto: Sistema de RRHH para Liquidación de Sueldos

Este proyecto fue desarrollado como entrega final del curso de JavaScript en Coderhouse.
Se trata de un sistema simple de gestión de nómina y liquidación de sueldos, dividido en dos secciones principales:

🔹 Secciones del sistema
1. Nómina

Permite cargar empleados de dos formas:

Importando un archivo Excel 📂

Agregando empleados de forma individual mediante un formulario

Se puede editar, eliminar y filtrar empleados dentro de la tabla de nómina.

Los datos se almacenan en LocalStorage para mantener la información entre sesiones.

En la carpeta /data se incluye un archivo de ejemplo nomina.xlsx para importar empleados.

2. Liquidaciones

El usuario selecciona mes y año de liquidación.

Se utiliza la nómina cargada previamente para generar las liquidaciones de sueldos.

Se muestra en una tabla con la información del empleado y el sueldo correspondiente.

Tecnologías utilizadas

HTML5
CSS3 (Bootstrap)
JavaScript
LocalStorage
XLSX.js para importar datos desde Excel
