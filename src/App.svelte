<script>
  import mobilityData from "./lib/data/curvaMovilidad.json";
  import quintilesPadresHijos from "./lib/data/quintilesPadresHijos.json";
  import ccaaData from "./lib/data/ccaa.json";
  import conversorHijos from "./lib/data/centilesEurosHijos.json";
  import conversorPadres from "./lib/data/centilesEurosPadres.json";
  import MobilityChart from "./lib/componentes/MobilidadChart.svelte";
  import CalculoIngresos from "./lib/componentes/CalculoIngresos.svelte";
  import TransitionHeatmap from "./lib/componentes/TransicionHeatMap.svelte";
  import RadialDesigualdad from "./lib/componentes/RadialDesigualdad.svelte";
  import RadialRegiones from "./lib/componentes/RadialRegiones.svelte";

  const columnasOrdenadas = ["0-20", "20-40", "40-60", "60-80", "80-100"];

  // Extraer datos
  function extraerDatosRadar(datos, quintilObjetivo) {
    const fila = datos.find((d) => {
      const nombreFila = Object.values(d)[0];
      return String(nombreFila).trim() === quintilObjetivo;
    });

    if (!fila) return [0, 0, 0, 0, 0];

    return columnasOrdenadas.map((col) => {
      let valor = fila[col];

      if (valor === undefined) {
        const claveReal = Object.keys(fila).find((k) => k.trim() === col);
        valor = fila[claveReal];
      }

      // String -> int
      return parseFloat(String(valor).replace(",", ".")) || 0;
    });
  }

  $: dataRadarPobre = extraerDatosRadar(quintilesPadresHijos, "0-20");
  $: dataRadarRico = extraerDatosRadar(quintilesPadresHijos, "80-100");
</script>

<main class="dark bg-gradient-to-br from-indigo-900 to-blue-700 text-white">
  <header
    class="bg-blue-900 p-6 p-10 rounded-md mb-8 text-center shadow-xl/20 w-5/6 h-auto mx-auto"
  >
    <h1 class="text-4xl font-bold text-indigo-100">
      El Ascensor Social en España
    </h1>
    <p>Un análisis visual sobre la movilidad intergeneracional de la renta.</p>
  </header>

  <section
    class="w-5/6 mx-auto bg-gradient-to-br from-yellow-200 to-amber-300 p-6 rounded-md mb-8 shadow-xl/40"
  >
    <div>
      <h2 class="text-2xl font-semibold text-blue-950">
        La Curva de Movilidad
      </h2>
      <p class="text-sky-800 mb-4">
        Comparativa entre la riqueza de los padres (Eje X) y la de los hijos
        (Eje Y).
      </p>
      <MobilityChart data={mobilityData} />
    </div>
  </section>
  <section
    class="grid grid-cols-1 lg:grid-cols-3 gap-6 text-center justify-center h-auto w-5/6 mx-auto mb-8"
  >
    <div
      class="bg-gradient-to-b from-yellow-200 to-amber-300 p-6 rounded-md mb-8 shadow-xl/40 col-span-2"
    >
      <h2 class="text-2xl font-semibold text-blue-950">
        Calculadora de Realidad
      </h2>
      <p class="text-sky-800 mb-4">¿Cuánto dinero real es un percentil?</p>

      <CalculoIngresos data={conversorHijos} />
    </div>
    <div
      class="col-span-1 bg-gradient-to-br from-amber-300 to-yellow-200 p-6 rounded-md mb-8 shadow-xl/40
      flex items-center gap-4 
         lg:block
      "
    >
      <div class="w-1/3 mb-0 lg:w-full lg:mb-4">
        <h2 class="text-2xl font-semibold text-blue-950">
          Matriz de Transición
        </h2>
        <p class="text-sky-800 mb-4">
          Probabilidad de moverse entre clases sociales.
        </p>
      </div>
      <div class=" w-2/3 lg:w-full">
        <TransitionHeatmap data={quintilesPadresHijos} />
      </div>
    </div>
  </section>
  <section
    class="w-5/6 mx-auto bg-gradient-to-b from-yellow-200 to-yellow-400 p-6 rounded-md mb-8 shadow-xl/40"
  >
    <div class="card p-6">
      <h2 class="text-2xl font-semibold text-blue-950">
        Ranking por Comunidades Autónomas
      </h2>
      <p class="text-sky-800 mb-4">
        ¿Dónde es más fácil ascender socialmente si naces pobre?
      </p>
      <RadialRegiones data={ccaaData} />
    </div>
  </section>

  <br />
  <!-- Ver si hay alguna mejor manera de lograr el efecto de q no se corte el fondo -->
</main>
