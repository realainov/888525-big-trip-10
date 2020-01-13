import AbstractSmartComponent from './abstract-smart-component.js';
import 'chart.js/dist/Chart.min.css';
import {TYPE_GROUPS} from '../const';
import ApexCharts from 'apexcharts';

const renderMoneyStats = (containerElement, points) => {
  const types = new Set(points.map((point) => point.type));

  const prices = Array.from(types).map((type) => {
    return points
      .filter((point) => point.type === type)
      .reduce((sum, point) => sum + +point.price, 0);
  });

  return new ApexCharts(containerElement, {
    series: [{
      data: prices
    }],
    chart: {
      type: `bar`,
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `€ ${val}`
    },
    xaxis: {
      categories: Array.from(types).map((type) => type.toUpperCase()),
    },
    grid: {
      show: false
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

  return new ApexCharts(containerElement, {
    series: [{
      data: times
    }],
    chart: {
      type: `bar`,
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}x`,
    },
    xaxis: {
      categories: Array.from(transportTypes).map((type) => type.toUpperCase()),
    }
  });
};

const renderTimeSpendStats = (containerElement, points) => {
  const cities = new Set(points.map((point) => point.city));

  const times = Array.from(cities).map((city) => {
    return points
      .filter((point) => point.city === city)
      .reduce((sum, point) => sum + +point.time.start.getHours(), 0);
  });

  return new ApexCharts(containerElement, {
    series: [{
      data: times
    }],
    chart: {
      type: `bar`,
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}H`,
    },
    xaxis: {
      categories: Array.from(cities).map((type) => `TO ${type.toUpperCase()}`),
    }
  });
};

const createTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
      </div>

      <div class="statistics__item statistics__item--transport">
      </div>

      <div class="statistics__item statistics__item--time-spend">
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

    const moneyElement = this.findElement(`.statistics__item--money`);
    const transportCtx = this.findElement(`.statistics__item--transport`);
    const timeSpendCtx = this.findElement(`.statistics__item--time-spend`);

    this._moneyStats = renderMoneyStats(moneyElement, points);
    this._transportStats = renderTrasportStats(transportCtx, points);
    this._timeSpendStats = renderTimeSpendStats(timeSpendCtx, points);

    this._moneyStats.render();
    this._transportStats.render();
    this._timeSpendStats.render();
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
