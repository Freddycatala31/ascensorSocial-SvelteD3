import fs from 'fs';
import csv from 'csvtojson'; 

const files = [
    { name: 'curvaMovilidad', path: 'scripts/datos_csv/curva_movilidad_nacional.csv' },
    { name: 'quintilesPadresHijos', path: 'scripts/datos_csv/distribucion_quintiles_nacional_padres_hijos.csv' },
    { name: 'ccaa', path: 'scripts/datos_csv/ranking_ccaa_centil_padres_20.csv' },
    { name: 'quintilesPivot', path: 'scripts/datos_csv/distribucion_quintiles_nacional_pivot.csv'},
    { name: 'centilesEurosHijos', path: 'scripts/datos_csv/conversor_centiles_a_euros_hijos.csv'},
    { name: 'centilesEurosPadres', path: 'scripts/datos_csv/conversor_centiles_a_euros_padres.csv'}
];

async function procesar() {
  // Aseguramos que la carpeta de destino exista
  const outputDir = './src/lib/data';
  if (!fs.existsSync(outputDir)){
      fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const file of files) {
    // 1. Convertimos CSV a JSON "crudo"
    const jsonArray = await csv().fromFile(file.path);
    
    // 2. LIMPIEZA DE DATOS (El paso nuevo)
    // Recorremos cada fila para limpiar las claves (headers)
    const cleanJson = jsonArray.map(obj => {
      const newObj = {};
      for (const key in obj) {
        // .trim() quita espacios en blanco al principio y final
        // .replace(...) quita el BOM (caracter invisible de Excel)
        const cleanKey = key.trim().replace(/^[\uFEFF\xEF\xBB\xBF]*/, ""); 
        
        // Guardamos el valor con la clave limpia
        newObj[cleanKey] = obj[key];
      }
      return newObj;
    });

    // 3. Escribimos el JSON limpio en la carpeta del frontend
    fs.writeFileSync(`${outputDir}/${file.name}.json`, JSON.stringify(cleanJson));
    console.log(`✅ Generado y limpiado: ${file.name}.json`);
  }
}

procesar();