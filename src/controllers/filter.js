import FilterComponent from '../components/filter';
import {render, replace, RenderPosition} from '../utils/render';
import {FilterType} from '../const';

export default class FilterController {
  constructor(containerElement, pointsModel) {
    this._containerElement = containerElement;
    this._pointsModel = pointsModel;

    this._currentFilterType = FilterType.EVERYTHING;

    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isChecked: filterType === this._currentFilterType,
        isNoPoints: !this._pointsModel.getFilterPoints(filterType).length
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);

    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._containerElement, this._filterComponent, RenderPosition.AFTEREND);
    }
  }

  _onDataChange() {
    this.render();
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._currentFilterType = filterType;
  }
}
