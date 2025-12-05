<script>

  import mobilityData from './lib/data/curvaMovilidad.json';
  import quintilesPadresHijos from './lib/data/quintilesPadresHijos.json';
  import ccaaData from './lib/data/ccaa.json';
  import conversorHijos from './lib/data/centilesEurosHijos.json';
  import conversorPadres from './lib/data/centilesEurosPadres.json';
  import MobilityChart from './lib/componentes/MobilidadChart.svelte';
  import CalculoIngresos from './lib/componentes/CalculoIngresos.svelte';
  import TransitionHeatmap from './lib/componentes/TransicionHeatMap.svelte';
  import RadialDesigualdad from './lib/componentes/RadialDesigualdad.svelte';
  import RadialRegiones from './lib/componentes/RadialRegiones.svelte';


  const columnasOrdenadas = ['0-20', '20-40', '40-60', '60-80', '80-100'];

  // 2. Extraer datos
  function extraerDatosRadar(datos, quintilObjetivo) {
    const fila = datos.find(d => {
        const nombreFila = Object.values(d)[0]; 
        return String(nombreFila).trim() === quintilObjetivo;
    });

    if (!fila) return [0, 0, 0, 0, 0];

   
    return columnasOrdenadas.map(col => {
      let valor = fila[col];
      
      if (valor === undefined) {
         const claveReal = Object.keys(fila).find(k => k.trim() === col);
         valor = fila[claveReal];
      }

      // String -> int
      return parseFloat(String(valor).replace(',', '.')) || 0;
    });
  }

  $: dataRadarPobre = extraerDatosRadar(quintilesPadresHijos, '0-20');
  $: dataRadarRico = extraerDatosRadar(quintilesPadresHijos, '80-100');
</script>

<main class="dark bg-gradient-to-br from-indigo-900 to-blue-700 text-white">
  <header class="bg-blue-900 p-6 p-10  rounded-md mb-8 text-center shadow-xl/20 w-5/6 h-auto mx-auto">
    <h1 class="text-4xl font-bold text-indigo-100">El Ascensor Social en España</h1>
    <p>Un análisis visual sobre la movilidad intergeneracional de la renta.</p>
  </header>


  <section class="w-5/6 mx-auto bg-gradient-to-br from-yellow-200 to-amber-300 p-6 rounded-md mb-8 shadow-xl/40 ">
    <div>
      <h2 class="text-2xl font-semibold  text-blue-950">La Curva de Movilidad</h2>
      <p class="text-sky-800 mb-4">Comparativa entre la riqueza de los padres (Eje X) y la de los hijos (Eje Y).</p>
      <MobilityChart data={mobilityData} />
    </div>
  </section>
  <section class="flex grid grid-cols-3 gap-6 text-center justify-center h-auto w-5/6 mx-auto mb-8">
    
    <div class="bg-gradient-to-b from-yellow-200 to-amber-300 p-6 rounded-md mb-8 shadow-xl/40 col-span-2">
      <h2 class="text-2xl font-semibold  text-blue-950">Calculadora de Realidad</h2>
      <p class="text-sky-800 mb-4">¿Cuánto dinero real es un percentil?</p>
      
      <CalculoIngresos data={conversorHijos} />
    </div>
    <div class="col-span-1 bg-gradient-to-br from-amber-300 to-yellow-200 p-6 rounded-md mb-8 shadow-xl/40">
      <h2 class="text-2xl font-semibold  text-blue-950">Matriz de Transición</h2>
      <p class="text-sky-800 mb-4">Probabilidad de moverse entre clases sociales.</p>
      <TransitionHeatmap data={quintilesPadresHijos} />
    </div>
  </section>
  <section class="w-5/6 mx-auto bg-gradient-to-b from-yellow-200 to-yellow-400 p-6 rounded-md mb-8 shadow-xl/40">
    <div class="card p-6">
      <h2 class="text-2xl font-semibold  text-blue-950">Ranking por Comunidades Autónomas</h2>
      <p class="text-sky-800 mb-4">¿Dónde es más fácil ascender socialmente si naces pobre?</p>
      <RadialRegiones data={ccaaData} />
    </div>
  </section>

<br> <!-- Ver si hay alguna mejor manera de lograr el efecto de q no se corte el fondo -->

<!-- 
  <section class="hero-grid">
    <div class="card main-chart">
      <h2>La Curva de Movilidad</h2>
      <p>Comparativa entre la riqueza de los padres (Eje X) y la de los hijos (Eje Y).</p>
      
      <MobilityChart data={mobilityData} />
    </div>

    <div class="card calculator">
      <h2>Calculadora de Realidad</h2>
      <p>¿Cuánto dinero real es un percentil?</p>
      
      <CalculoIngresos data={conversorHijos} />
    </div>
    <div class="card">
      <h2>Matriz de Transición</h2>
      <p>Probabilidad de moverse entre clases sociales.</p>
      <TransitionHeatmap data={quintilesPadresHijos} />
    </div>
  </section>


  <section class="dual-grid">
    

     <div class="card">
      <h2>La Huella de la Desigualdad</h2>
      <p>Forma de las oportunidades según tu origen.</p>
      <RadialDesigualdad dataPobre={dataRadarPobre} dataRico={dataRadarRico} />
    </div> 
  </section>


  <section class="full-width">
    <div class="card">
      <h2>Ranking por Comunidades Autónomas</h2>
      <p>¿Dónde es más fácil ascender socialmente si naces pobre?</p>
      <RadialRegiones data={ccaaData} />
    </div>
  </section> -->

</main>


<!-- <style>
  :global(body) {
    background-color: #f4f4f9;
    font-family: 'Inter', sans-serif;
    margin: 0;
  }

  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    margin-bottom: 3rem;
    text-align: center;
  }

  h1 { font-size: 2.5rem; color: #2d3748; margin-bottom: 0.5rem; }
  p { color: #718096; }

  /* Grid Layouts */
  .hero-grid {
    display: flex;
    grid-template-columns: 1fr 1fr 1fr; /* El gráfico ocupa el doble que la calculadora */
    gap: 2rem;
    margin-bottom: 2rem;
  }
  .hero-grid div{
    width: fit-content;
  }

  .dual-grid {
    display: grid;
    grid-template-columns: 1fr 2fr; /* 50% cada uno */
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .card {
    background: rgb(255, 255, 255);
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  }

  h2 {
    font-size: 1.25rem;
    color: #4a5568;
    margin-top: 0;
    border-bottom: 2px solid #edf2f7;
    padding-bottom: 0.5rem;
  }

  /* Responsive: En móviles todo a 1 columna */
  @media (max-width: 768px) {
    .hero-grid, .dual-grid {
      grid-template-columns: 1fr;
    }
  }
</style> -->