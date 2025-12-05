<script>
  import * as d3 from 'd3';

  // DATOS
  export let data = []; 

  // CONFIGURACIÓN VISUAL
  let containerWidth;
  let width = 800;
  let height = 500;
  let margin = { top: 40, right: 30, bottom: 60, left: 70 }; // Márgenes ajustados para las etiquetas

  // REFERENCIAS DOM
  let gx, gy;

  // 1. DIMENSIONES REACTIVAS
  $: if (containerWidth) width = containerWidth;
  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = height - margin.top - margin.bottom;

  // 2. ESCALAS
  $: xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, innerWidth]);

  $: yScale = d3.scaleLinear()
    .domain([0, 100])
    .range([innerHeight, 0]);

  // 3. GENERADORES DE EJES Y REJILLA
  $: if (gx) {
    // Eje X con rejilla vertical completa (tickSize negativa)
    d3.select(gx)
      .call(d3.axisBottom(xScale).ticks(10).tickSize(-innerHeight))
      .call(g => g.selectAll(".tick line").attr("stroke", "#e2e8f0").attr("stroke-dasharray", "2,2")) // Rejilla discontinua gris
      .call(g => g.select(".domain").remove()); // Quitamos la línea negra base del eje
  }
  
  $: if (gy) {
    // Eje Y con rejilla horizontal completa
    d3.select(gy)
      .call(d3.axisLeft(yScale).ticks(10).tickSize(-innerWidth))
      .call(g => g.selectAll(".tick line").attr("stroke", "#e2e8f0").attr("stroke-dasharray", "2,2"))
      .call(g => g.select(".domain").remove());
  }

  // 4. LÍNEA DE TENDENCIA
  $: lineGenerator = d3.line()
    .x(d => xScale(+d.centil_padres))
    .y(d => yScale(+d.centil_hijo_loess))
    .curve(d3.curveBasis);

</script>

<div class="chart-container" bind:clientWidth={containerWidth}>
  <svg viewBox="0 0 {width} {height}">
    
    <g transform="translate({margin.left}, {margin.top})">
      
      <g 
        bind:this={gx} 
        transform="translate(0, {innerHeight})" 
        font-family="sans-serif" 
        font-size="12" 
        color="#718096"
      />
      <text 
        x={innerWidth / 2} 
        y={innerHeight + 45} 
        text-anchor="middle" 
        fill="#2d3748" 
        font-weight="bold" 
        font-size="14"
      >
        Riqueza de los Padres (Percentil 0-100)
      </text>


      <g 
        bind:this={gy} 
        font-family="sans-serif" 
        font-size="12" 
        color="#718096"
      />
      <text 
        transform="rotate(-90)" 
        x={-innerHeight / 2} 
        y={-50} 
        text-anchor="middle" 
        fill="#2d3748" 
        font-weight="bold" 
        font-size="14"
      >
        Riqueza de los Hijos (Percentil 0-100)
      </text>


      <g class="dots">
        {#each data as d}
          <circle 
            cx={xScale(+d.centil_padres)} 
            cy={yScale(+d.centil_hijo)} 
            r="3" 
            fill="steelblue" 
            opacity="0.4"
          />
        {/each}
      </g>


      <path 
        d={lineGenerator(data)} 
        fill="none" 
        stroke="#1a365d" 
        stroke-width="3" 
        stroke-linecap="round"
      />

    </g>
  </svg>
</div>

<style>
  .chart-container {
    width: 100%;
    height: auto;
    /* Tipografía limpia */
    font-family: system-ui, -apple-system, sans-serif;
  }
</style>