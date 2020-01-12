import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'chart.js/dist/Chart.min.css';
import {generateNumber} from '../data/points';
import {formatMarkupDate, makeWordCapitalize, calculateDuration} from '../utils/common';
import {TYPE_GROUPS} from '../const';

const generateColor = () => {
  return `rgb(${generateNumber(205, 50)}, ${generateNumber(205, 50)}, ${generateNumber(205, 50)})`;
};

const renderMoneyStats = (containerElement, points) => {
  const types = new Set(points.map((point) => point.type));

  const prices = Array.from(types).map((type) => {
    return points
      .filter((point) => point.type === type)
      .reduce((sum, point) => sum + +point.price, 0);
  });

  return new Chart(containerElement, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: Array.from(types).map((type) => makeWordCapitalize(type)),
      datasets: [{
        data: prices,
        backgroundColor: points.map(() => generateColor())
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((sum, item) => sum + parseFloat(item));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} € — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `DONE BY: MONEY`,
        fontSize: 17,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
};

const renderTrasportStats = (containerElement, points) => {
  const trasportPoints = points
    .filter((point) => {
      return !(TYPE_GROUPS.transport.indexOf(point.type) === -1);
    });

  const transportTypes = new Set(trasportPoints.map((point) => point.type));

  const times = Array.from(transportTypes).map((type) => {
    return points
      .filter((point) => point.type === type)
      .length;
  });

  return new Chart(containerElement, {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: Array.from(transportTypes).map((type) => makeWordCapitalize(type)),
      datasets: [{
        data: times,
        backgroundColor: points.map(() => generateColor())
      }]
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((sum, item) => sum + parseFloat(item));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData === 1 ? `${tooltipData} time` : `${tooltipData} times`} — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: `DONE BY: TRANSPORT`,
        fontSize: 17,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  });
};

const renderTimeSpendStats = (containerElement, points) => {
  const formattedDates = points.map((point) => `${formatMarkupDate(point.time.start)} — ${makeWordCapitalize(point.type)}`);

  const colors = points.map(() => generateColor());

  const durations = points.map((point) => point.time.end - point.time.start);

  return new Chart(containerElement, {
    plugins: [ChartDataLabels],
    type: `bar`,
    data: {
      labels: formattedDates,
      datasets: [{
        data: durations,
        backgroundColor: colors,
        borderColor: `#000000`,
        borderWidth: 1,
        lineTension: 0
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 0
          }
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            fontStyle: `bold`,
            fontColor: `#000000`
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      legend: {
        display: false
      },
      layout: {
        padding: {
          top: 10,
          bottom: 100
        }
      },
      title: {
        display: true,
        text: `DONE BY: TIME`,
        fontSize: 17,
        fontColor: `#000000`
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;

            return calculateDuration(allData[tooltipItem.index]);
          }
        },
        displayColors: false,
        titleFontColor: `#000000`,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      }
    }
  });
};

const createTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="100%"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="100%"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="100%"></canvas>
      </div>
    </section>`
  );
};

export default class Stats extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();

    this._pointsModel = pointsModel;

    this._moneyStats = null;
    this._transportStats = null;
    this._timeSpendStats = null;
  }

  getTemplate() {
    return createTemplate();
  }

  rerender() {
    super.rerender(false);

    this._renderCharts();
  }

  _renderCharts() {
    this._resetCharts();

    const points = this._pointsModel.getAllPoints();

    const moneyCtx = this.findElement(`.statistics__chart--money`);
    const transportCtx = this.findElement(`.statistics__chart--transport`);
    const timeSpendCtx = this.findElement(`.statistics__chart--time`);

    this._moneyStats = renderMoneyStats(moneyCtx, points);
    this._transportStats = renderTrasportStats(transportCtx, points);
    this._timeSpendStats = renderTimeSpendStats(timeSpendCtx, points);
  }

  _resetCharts() {
    if (this._moneyStats) {
      this._moneyStats.destroy();
      this._moneyStats = null;
    }

    if (this._transportStats) {
      this._transportStats.destroy();
      this._transportStats = null;
    }

    if (this._timeSpendStats) {
      this._timeSpendStats.destroy();
      this._timeSpendStats = null;
    }
  }
}
