<script>
  import * as d3 from 'd3';

  // Recibimos los datos crudos del JSON
  // Formato esperado: [{quintil_padres: "0-20", "0-20": 24.8, "20-40": 22.5...}, ...]
  export let data = [];

  let width = 500;
  let height = 500;
  let margin = { top: 30, right: 0, bottom: 0, left: 50 };

  // Definimos los nombres de los quintiles en orden
  const groups = ['0-20', '20-40', '40-60', '60-80', '80-100'];

  // ---------------------------------------------------------
  // 1. TRANSFORMACIÓN DE DATOS (Wide -> Long)
  // ---------------------------------------------------------
  let flatData = [];

  // Usamos la sintaxis reactiva $: para que si 'data' cambia, esto se recalcule
  $: {
    flatData = [];
    if (data && data.length > 0) {
      // Recorremos cada fila (Origen / Padres)
      data.forEach(row => {
        const parentQ = row['quintil_padres']; 
        
        // Recorremos cada columna (Destino / Hijos)
        groups.forEach(childQ => {
          flatData.push({
            parent: parentQ,         // Eje Y
            child: childQ,           // Eje X
            value: +row[childQ]      // Valor numérico (probabilidad)
          });
        });
      });
    }
  }

  // ---------------------------------------------------------
  // 2. ESCALAS D3
  // ---------------------------------------------------------
  
  // Escala para ejes X e Y (Bandas discretas)
  $: x = d3.scaleBand()
    .range([margin.left, width])
    .domain(groups)
    .padding(0.05);

  $: y = d3.scaleBand()
    .range([height - margin.top, 0]) // Invertido para que 0-20 esté abajo (opcional)
    .domain(groups)
    .padding(0.05);

  // Escala de Color (Probabilidad baja = claro, Probabilidad alta = oscuro)
  // Ajustamos el dominio de 0 a 30 (pues los valores suelen estar entre 10% y 30%)
  $: color = d3.scaleSequential()
    .interpolator(d3.interpolateYlGnBu) 
    .domain([5, 30]);

</script>

<div class="chart-container">
  <svg viewBox="0 0 {width} {height}">
    
    <g transform="translate(0, {height})">
      {#each groups as group}
        <text
          x={x(group) + x.bandwidth() / 2}
          y={-5}
          text-anchor="middle"
          font-size="12"
          fill="#666"
        >
          Hijos {group}%
        </text>
      {/each}
    </g>

    <g>
      {#each groups as group}
        <text
          x={margin.left - 10}
          y={y(group) + y.bandwidth() / 2}
          text-anchor="end"
          alignment-baseline="middle"
          font-size="12"
          fill="#666"
        >
          Padres {group}%
        </text>
      {/each}
    </g>

    {#each flatData as cell}
      <rect
        x={x(cell.child)}
        y={y(cell.parent)}
        width={x.bandwidth()}
        height={y.bandwidth()}
        fill={color(cell.value)}
        rx="4" ry="4" 
      >
        <title>
          Padres: {cell.parent}% -> Hijos: {cell.child}%
          Probabilidad: {cell.value.toFixed(1)}%
        </title>
      </rect>

      <text
        x={x(cell.child) + x.bandwidth() / 2}
        y={y(cell.parent) + y.bandwidth() / 2}
        dy=".35em"
        text-anchor="middle"
        fill={cell.value > 20 ? 'white' : 'black'}
        font-size="12"
        font-weight="bold"
      >
        {cell.value.toFixed(0)}%
      </text>
    {/each}

  </svg>
</div>

<style>
  .chart-container {
    max-width: 100%;
    margin: auto;
  }
  rect:hover {
    stroke: #333;
    stroke-width: 2px;
    cursor: pointer;
  }
</style>