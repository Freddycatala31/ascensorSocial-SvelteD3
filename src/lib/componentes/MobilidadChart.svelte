<script>
  import * as d3 from 'd3';

  // DATOS
  export let data = []; 

  // CONFIGURACIÓN VISUAL
  let containerWidth;
  let width = 800;
  let height = 400;
  let margin = { top: 40, right: 30, bottom: 60, left: 70 }; // Márgenes ajustados para las etiquetas

  // REFERENCIAS DOM
  let gx, gy;

  // 1. DIMENSIONES REACTIVAS
  $: if (containerWidth) width = containerWidth;
  $: innerWidth = width - margin.left - margin.right;
  $: innerHeight = height - margin.top - margin.bottom;

  // configurar tamaño trazo/puntos(responsive, si los trazos seguian con el mismo grosor no se podia ver correctamente la grafica)
  $: dotRadius = containerWidth < 640 ? 2 : containerWidth < 1024 ? 2.5 : 3.5;
  $: lineStrokeWidth = containerWidth < 600 ? 1.5 : containerWidth < 1024 ? 2 : 3;

  // 2. ESCALAS
  $: xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, innerWidth]);

  $: yScale = d3.scaleLinear()
    .domain([35, 85])
    .range([innerHeight, 0]);

  // 3. GENERADORES DE EJES Y REJILLA
  $: if (gx) {
    // Eje X con rejilla vertical completa (tickSize negativa)
    d3.select(gx)
      .call(d3.axisBottom(xScale).ticks(10).tickSize(-innerHeight))
      .call(g => g.selectAll(".tick line").attr("stroke", "#5A57BD").attr("stroke-dasharray", "2,2")) // Rejilla discontinua gris
      .call(g => g.select(".domain").remove()); // Quitamos la línea negra base del eje
  }
  
  $: if (gy) {
    // Eje Y con rejilla horizontal completa
    d3.select(gy)
      .call(d3.axisLeft(yScale).ticks(10).tickSize(-innerWidth))
      .call(g => g.selectAll(".tick line").attr("stroke", "#5A57BD").attr("stroke-dasharray", "2,2"))
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
        font-size="22" 
        color="#0A1845"
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
        color="#0A1845"
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
            r={dotRadius} 
            fill="steelblue" 
            opacity="0.8"
          />
        {/each}
      </g>


      <path 
        d={lineGenerator(data)} 
        fill="none" 
        stroke="#07133D" 
        stroke-width={lineStrokeWidth} 
        stroke-linecap="round"
      />

    </g>
  </svg>
</div>

