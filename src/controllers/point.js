import PointComponent from '../components/point';
import PointEditComponent from '../components/point-edit';
import {render, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class TaskController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point) {
    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point);

    this._pointComponent.setRollupButtonClickHandler(() => {
      this._replacePointToPointEdit();

      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setRollupButtonClickHandler(() => {
      this._replacePointEditToPoint();

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setFavoriteCheckboxChangeHandler(() => {
      this._onDataChange(this, point, Object.assign({}, point, {
        isFavorite: !point.isFavorite,
      }));
    });

    this._pointEditComponent.setEditFormSubmitHandler((evt) => {
      evt.preventDefault();

      this._replacePointEditToPoint();
    });

    if (oldPointEditComponent && oldPointComponent) {
      replace(this._pointComponent, oldPointComponent);
      replace(this._pointEditComponent, oldPointEditComponent);
    } else {
      render(this._container, this._pointComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replacePointEditToPoint();
    }
  }

  _replacePointEditToPoint() {
    this._pointEditComponent.reset();

    this._mode = Mode.DEFAULT;

    replace(this._pointComponent, this._pointEditComponent);
  }

  _replacePointToPointEdit() {
    this._onViewChange();

    this._mode = Mode.EDIT;

    replace(this._pointEditComponent, this._pointComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replacePointEditToPoint();

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
