import AbstractComponent from './abstract-component.js';
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
      height: 350,
      fontFamily: `inherit`
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val !== 0 ? `€ ${val}` : ``}`,
      style: {
        fontFamily: `inherit`
      }
    },
    xaxis: {
      categories: Array.from(types).map((type) => type.toUpperCase())
    },
    title: {
      text: `Money`,
      align: `center`,
      style: {
        fontSize: `21px`,
        fontFamily: `inherit`,
        fontWeight: 500
      }
    },
    tooltip: {
      enabled: false
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
        horizontal: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val !== 0 ? `${val}x` : ``}`,
      style: {
        fontFamily: `inherit`
      }
    },
    xaxis: {
      categories: Array.from(transportTypes).map((type) => type.toUpperCase()),
    },
    title: {
      text: `Transport`,
      align: `center`,
      style: {
        fontSize: `21px`,
        fontFamily: `inherit`,
        fontWeight: 500
      }
    },
    tooltip: {
      enabled: false
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
        horizontal: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val !== 0 ? `${val}H` : ``}`,
      style: {
        fontFamily: `inherit`
      }
    },
    xaxis: {
      categories: Array.from(cities).map((type) => `TO ${type.toUpperCase()}`),
    },
    title: {
      text: `Time Spent`,
      align: `center`,
      style: {
        fontSize: `21px`,
        fontFamily: `inherit`,
        fontWeight: 500
      }
    },
    tooltip: {
      enabled: false
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

export default class Stats extends AbstractComponent {
  constructor(points) {
    super();

    this._points = points;

    this._moneyStats = null;
    this._transportStats = null;
    this._timeSpendStats = null;
  }

  getTemplate() {
    return createTemplate();
  }

  renderCharts() {
    const moneyElement = this.findElement(`.statistics__item--money`);
    const transportCtx = this.findElement(`.statistics__item--transport`);
    const timeSpendCtx = this.findElement(`.statistics__item--time-spend`);

    this._moneyStats = renderMoneyStats(moneyElement, this._points);
    this._transportStats = renderTrasportStats(transportCtx, this._points);
    this._timeSpendStats = renderTimeSpendStats(timeSpendCtx, this._points);

    this._moneyStats.render();
    this._transportStats.render();
    this._timeSpendStats.render();
  }

  destroyCharts() {
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
