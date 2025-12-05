<script>
  import { onMount, onDestroy } from 'svelte';
  import Chart from 'chart.js/auto';

  // Props: Arrays de números [24.5, 22.1, ...]
  export let dataPobre = [];
  export let dataRico = [];

  let canvas; // Referencia al elemento <canvas> del DOM
  let chart;  // Instancia de Chart.js

  // Configuración de los datos
  $: chartData = {
    labels: ['Pobre', 'Baja-Media', 'Media Pura', 'Media-Alta', 'Rico'],
    datasets: [
      {
        label: 'Nacidos Pobres (0-20%)',
        data: dataPobre,
        // data:[25, 20, 15, 10, 5],
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Rojo transparente
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        fill: true
      },
      {
        label: 'Nacidos Ricos (80-100%)',
        data: dataRico,
        // data:[5, 10, 15, 20, 30],
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Azul transparente
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        fill: true
      }
    ]
  };

  // 1. Crear el gráfico al montar el componente
  onMount(() => {
    if (canvas) {
      chart = new Chart(canvas, {
        type: 'radar',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: { color: '#e2e8f0' }, // Líneas de los radios
              grid: { color: '#e2e8f0' },       // Telaraña
              pointLabels: {
                font: { size: 12, weight: 'bold' },
                color: '#4a5568'
              },
              suggestedMin: 0,
              suggestedMax: 35, // Ajusta esto según tus valores máximos
              ticks: {
                backdropColor: 'transparent', // Fondo transparente para números
                color: '#718096'
              }
            }
          },
          plugins: {
            legend: { position: 'top' },
            tooltip: { 
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%`
              }
            }
          }
        }
      });
    }
  });

  // 2. Reactividad: Si los props cambian, actualizamos el gráfico
  $: if (chart && (dataPobre || dataRico)) {
    chart.data = chartData;
    chart.update();
  }

  // 3. Limpieza: Destruir gráfico al salir para liberar memoria
  onDestroy(() => {
    if (chart) chart.destroy();
  });
</script>

<div class="chart-container">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chart-container {
    position: relative;
    width: 100%;
    height: 400px; /* Importante para Chart.js */
  }
</style>