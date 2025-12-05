<script>
  import * as d3 from 'd3';

  // 1. Recibimos los datos "crudos" (posiblemente strings)
  export let data = [];

  // 2. SANEAMIENTO DE DATOS (IMPORTANTE)
  // Convertimos "54.3" (texto) a 54.3 (número) usando el símbolo '+'
  $: cleanData = data
    .map(d => ({
      ...d,
      centil_hijo_loess: +d.centil_hijo_loess
    }))
    .filter(d => !isNaN(d.centil_hijo_loess)); // Filtramos errores

  // 3. DIMENSIONES RESPONSIVE
  let containerWidth;
  let width = 800; // Valor por defecto
  let height = 600; // Altura fija suficiente para las 17 CCAA
  let margin = { top: 40, right: 40, bottom: 50, left: 160 }; // Izquierda amplia para nombres largos

  // Reactividad para ajustar ancho
  $: if (containerWidth) width = containerWidth;
  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = height - margin.top - margin.bottom;

  // 4. ORDENACIÓN (Mejor comunidad arriba)
  $: sortedData = [...cleanData].sort((a, b) => b.centil_hijo_loess - a.centil_hijo_loess);

  // 5. ESCALAS
  // Eje Y: Nombres de CCAA
  $: yScale = d3.scaleBand()
    .domain(sortedData.map(d => d.ccaa))
    .range([0, innerHeight])
    .padding(0.5);

  // Eje X: Valores (Hacemos zoom entre el min y el max para que se vean las diferencias)
  $: minVal = d3.min(cleanData, d => d.centil_hijo_loess) || 40;
  $: maxVal = d3.max(cleanData, d => d.centil_hijo_loess) || 60;

  $: xScale = d3.scaleLinear()
    .domain([minVal - 1, maxVal + 0.5]) 
    .range([0, innerWidth]);

  // Escala de color (Azul oscuro para valores altos)
  $: colorScale = d3.scaleSequential()
    .domain([minVal, maxVal])
    .interpolator((d3.interpolatePlasma));

</script>

<div class="chart-wrapper" bind:clientWidth={containerWidth}>
  <svg width={width} height={height} viewBox="0 0 {width} {height}">
    
    <g transform="translate({margin.left}, {margin.top})">
      
      {#each xScale.ticks(5) as tick}
        <g transform="translate({xScale(tick)}, 0)">
          <line y1="0" y2={innerHeight} stroke="#d4f4f0" stroke-dasharray="5" />
          <text y={innerHeight + 20} text-anchor="middle" font-size="12" fill="#a0aec0">
            {tick}
          </text>
        </g>
      {/each}

      {#each sortedData as d}
        <g class="lollipop-group">
          
          <line 
            x1={xScale(minVal - 1)} 
            x2={xScale(d.centil_hijo_loess)} 
            y1={yScale(d.ccaa) + yScale.bandwidth() / 2} 
            y2={yScale(d.ccaa) + yScale.bandwidth() / 2} 
            stroke="#cbd5e0" 
            stroke-width="2" 
          />

          <circle 
            cx={xScale(d.centil_hijo_loess)} 
            cy={yScale(d.ccaa) + yScale.bandwidth() / 2} 
            r="8" 
            fill={colorScale(d.centil_hijo_loess)}
            stroke="#2b6cb0"
            stroke-width="1"
          >
            <title>{d.ccaa}: {d.centil_hijo_loess.toFixed(2)}</title>
          </circle>

          <text 
            x="-15" 
            y={yScale(d.ccaa) + yScale.bandwidth() / 2} 
            dy=".35em" 
            text-anchor="end" 
            font-size="13" 
            font-weight="600" 
            fill="#4a5568"
          >
            {d.ccaa}
          </text>

          <text 
            x={xScale(d.centil_hijo_loess) + 15} 
            y={yScale(d.ccaa) + yScale.bandwidth() / 2} 
            dy=".35em" 
            font-size="12" 
            font-weight="bold" 
            fill={colorScale(d.centil_hijo_loess)}
          >
            {d.centil_hijo_loess.toFixed(1)}
          </text>
        
        </g>
      {/each}

      <text 
        x={innerWidth / 2} 
        y={innerHeight + 45} 
        text-anchor="middle" 
        font-size="12" 
        fill="#718096" 
        font-style="italic"
      >
        Puntuación de Ascensor Social (Mayor es mejor)
      </text>

    </g>
  </svg>
</div>

<style>
  .chart-wrapper {
    width: 100%;
    /* Aseguramos que no se desborde */
    overflow: hidden; 
  }

  /* Animación CSS suave al pasar el ratón */
  .lollipop-group circle {
    transition: r 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .lollipop-group:hover circle {
    r: 12; /* Crece el círculo */
    cursor: pointer;
    stroke: #2c5282;
    stroke-width: 2px;
  }
  
  .lollipop-group:hover line {
    stroke: #4a5568; /* Oscurece la línea */
  }
  
  .lollipop-group:hover text {
    fill: #2d3748; /* Oscurece el texto */
  }
</style>