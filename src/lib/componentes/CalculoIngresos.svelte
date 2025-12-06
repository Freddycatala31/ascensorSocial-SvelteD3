<script>
  import * as d3 from 'd3';

  // datos
  export let data = [];

  // Dimensiones
  let containerWidth;
  let width = 600; 
  let height = 500;
  let margin = { top: 20, right: 20, bottom: 50, left: 65 }; 

  // Estado
  let hoveredPoint = null; 
  let gx; // Referencia para el Eje X
  let gy; // Referencia para el Eje Y

  // reactividad
  $: if (containerWidth) width = containerWidth;
  $: innerWidth = Math.max(0, width - margin.left - margin.right); 
  $: innerHeight = height - margin.top - margin.bottom;

  // escalas
  $: xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, innerWidth]);

  $: yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.renta) || 50000])
    .range([innerHeight, 0])
    .nice();

  // Generar ejes y rejilla 
  $: if (gx) {
    d3.select(gx)
      .call(
        d3.axisBottom(xScale)
          .ticks(50) // Grid 
          .tickSize(-innerHeight) 
          .tickFormat(d => d % 10 === 0 ? d + '%' : '') // Texto solo cada 10
          .tickPadding(10)
      )
      // estilo borde inferior 
      .call(g => g.select(".domain")
        .attr("stroke", "#718096") 
        .attr("stroke-width", "3") 
      )
      // estilo Grid
      .call(g => g.selectAll(".tick line")
        .attr("stroke", "#6B7FC9")      //Grid
        .attr("stroke-dasharray", "3") // Efecto discontinuo ---
      );
  }

  $: if (gy) {
    d3.select(gy)
      .call(
        d3.axisLeft(yScale)
          .ticks(15) 
          .tickSize(-innerWidth) 
          .tickFormat(d => d >= 1000 ? (d/1000) + 'k €' : d + ' €') 
      )
      // estilo borde izquierdo
      .call(g => g.select(".domain")
        .attr("stroke", "#718096") 
        .attr("stroke-width", "2")
      )
      // estilo Grid
      .call(g => g.selectAll(".tick line")
        .attr("stroke", "#6B7FC9")
        .attr("stroke-dasharray", "3")
      );
  }

  // generador de área
  $: areaGenerator = d3.area()
    .x(d => xScale(+d.centil))
    .y0(innerHeight)
    .y1(d => yScale(+d.renta))
    .curve(d3.curveMonotoneX);

  // lógica de interacción
  const bisect = d3.bisector(d => d.centil).center;

  function handleMouseMove(event) {
    const [xCoord] = d3.pointer(event);
    const centilInvertido = xScale.invert(xCoord);
    const index = bisect(data, centilInvertido);

    if (index >= 0 && index < data.length) {
      hoveredPoint = data[index];
    }
  }

  function handleMouseLeave() {
    hoveredPoint = null;
  }

  const currency = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
</script>

<div class="chart-wrapper" bind:clientWidth={containerWidth}>
  <svg viewBox="0 0 {width} {height}" on:mouseleave={handleMouseLeave}>
    
    <defs>
      <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3182ce" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#3182ce" stop-opacity="0.1"/>
      </linearGradient>

      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
      </filter>
    </defs>

    <g transform="translate({margin.left}, {margin.top})">
      
      <g bind:this={gx} transform="translate(0, {innerHeight})" />
      <g bind:this={gy} />

      <text 
        x={innerWidth / 2} 
        y={innerHeight + 40} 
        text-anchor="middle" 
        font-size="12" 
        fill="#2d3748" 
        font-weight="bold"
      >
        DISTRIBUCIÓN DE RIQUEZA (PERCENTILES)
      </text>

      <text 
        transform="rotate(-90)" 
        x={-innerHeight / 2} 
        y={-50} 
        text-anchor="middle" 
        font-size="12" 
        fill="#2d3748" 
        font-weight="bold"
      >
        INGRESOS (€)
      </text>

      <path 
        d={areaGenerator(data)} 
        fill="url(#area-gradient)" 
        stroke="#2b6cb0" 
        stroke-width="2"
      />

      {#if hoveredPoint}
        <line x1={xScale(hoveredPoint.centil)} x2={xScale(hoveredPoint.centil)} y1={yScale(hoveredPoint.renta)} y2={innerHeight} stroke="#6B7FC9" stroke-dasharray="4"/>
        <line x1={0} x2={xScale(hoveredPoint.centil)} y1={yScale(hoveredPoint.renta)} y2={yScale(hoveredPoint.renta)} stroke="#6B7FC9" stroke-dasharray="4"/>
        
        <circle cx={xScale(hoveredPoint.centil)} cy={yScale(hoveredPoint.renta)} r="5" fill="white" stroke="#2b6cb0" stroke-width="2"/>

        <g transform="translate({xScale(hoveredPoint.centil)}, {yScale(hoveredPoint.renta) - 75})">
          <rect 
            x={hoveredPoint.centil > 80 ? -145 : 5} y="0" width="140" height="60" rx="8" ry="8"
            fill="white" stroke="#e2e8f0" filter="url(#shadow)"
          />
          <text 
            text-anchor={hoveredPoint.centil > 80 ? "end" : "start"} 
            x={hoveredPoint.centil > 80 ? -20 : 20} y="25" 
            font-weight="bold" fill="#2d3748" font-size="16"
          >
            {currency.format(hoveredPoint.renta)}
          </text>
          <text 
            text-anchor={hoveredPoint.centil > 80 ? "end" : "start"} 
            x={hoveredPoint.centil > 80 ? -20 : 20} y="45" 
            font-size="12" fill="#718096"
          >
            Percentil {hoveredPoint.centil}%
          </text>
        </g>
      {/if}

      <rect width={innerWidth} height={innerHeight} fill="transparent" on:mousemove={handleMouseMove} />
    </g>
  </svg>
</div>

<style>
  .chart-wrapper { width: 100%; font-family: sans-serif; }
  text { pointer-events: none; }
  
  /* Ajustamos el tamaño de fuente de los números de los ejes */
  g { font-size: 10px; color: #718096; }
</style>