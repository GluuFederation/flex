import Chart from 'chart.js';
import colors from './colors';

// Global Chart.js Style Adjustments

//
// Default chart styles
//

// Fonts
Chart.defaults.global.defaultFontColor = '#BBBCC1';

// Points
Chart.defaults.global.elements.point.backgroundColor = 'rgba(255, 255, 255, 1)';
Chart.defaults.global.elements.point.radius = 4;
Chart.defaults.global.elements.point.hoverRadius = 6;

// Grid lines
Chart.defaults.scale.gridLines.color = 'rgba(233, 236 ,239, 1)';

// Ticks
Chart.defaults.scale.ticks.autoSkip = false;
Chart.defaults.scale.ticks.minRotation = 0;
Chart.defaults.scale.ticks.maxRotation = 0;
Chart.defaults.scale.ticks.padding = 10;

// Points
Chart.defaults.global.elements.point.backgroundColor = colors.white.toHex();
Chart.defaults.global.elements.point.radius = 4;
Chart.defaults.global.elements.point.hoverRadius = 5;

// Custom tooltips
Chart.defaults.global.tooltips.custom = function customTooltip(tooltip) {
  let tooltipEl = document.getElementsByClassName(`sc-tooltip-${this._chart.id}`)[0];

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.classList.add(`sc-tooltip-${this._chart.id}`);
    tooltipEl.innerHTML = '<table></table>';
    this._chart.canvas.parentNode.appendChild(tooltipEl);
  }

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  // Set caret Position
  tooltipEl.classList.remove('above', 'below', 'no-transform');
  if (tooltip.yAlign) {
    tooltipEl.classList.add(tooltip.yAlign);
  } else {
    tooltipEl.classList.add('no-transform');
  }

  function getBody(bodyItem) {
    return bodyItem.lines;
  }

  // Set Text
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map(getBody);
    let innerHtml = '<thead>';

    titleLines.forEach((title) => {
      innerHtml += `<tr><th>${title}</th></tr>`;
    });
    innerHtml += '</thead><tbody>';

    bodyLines.forEach((body, i) => {
      const _colors = tooltip.labelColors[i];
      let style = `background:${_colors.backgroundColor}`;
      style += `; border-color:${_colors.borderColor}`;
      style += '; border-width: 2px';
      const span = `<span class="sc-tooltip-key" style="${style}"></span>`;
      innerHtml += `<tr><td>${span} ${body}</td></tr>`;
    });
    innerHtml += '</tbody>';

    const tableRoot = tooltipEl.querySelector('table');
    tableRoot.innerHTML = innerHtml;
  }

  const positionY = this._chart.canvas.offsetTop;
  const positionX = this._chart.canvas.offsetLeft;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = `${positionX + tooltip.caretX}px`;
  tooltipEl.style.top = `${positionY + tooltip.caretY}px`;
};

// Custom legends callback.
Chart.defaults.global.legendCallback = (chart) => {
  let text = `<ul class="sc-legend-container sc-legend-chart-${chart.id}">`;
  chart.data.datasets.forEach((set) => {
    text += `<li class="sc-legend"><span class="sc-legend__label" style="background: ${set.borderColor} !important;"></span>${set.label ? set.label : ''}</li>`;
  });
  text += '</ul>';
  return text;
};

Chart.defaults.LineWithLine = Chart.defaults.line;
Chart.controllers.LineWithLine = Chart.controllers.line.extend({
  draw(ease) {
    Chart.controllers.line.prototype.draw.call(this, ease);

    if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
      const activePoint = this.chart.tooltip._active[0];
      const { ctx } = this.chart;
      const { x } = activePoint.tooltipPosition();
      const topY = this.chart.scales['y-axis-0'].top;
      const bottomY = this.chart.scales['y-axis-0'].bottom;

      // Draw the line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#ddd';
      ctx.stroke();
      ctx.restore();
    }
  },
});

export default Chart;
