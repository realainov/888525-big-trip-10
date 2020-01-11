import PointsComponent from '../components/points';
import PointComponent from '../components/point';
import PointEditComponent from '../components/point-edit';
import {render, replace, remove} from '../utils/render.js';
import {Mode} from '../const';
import {RenderPosition} from '../utils/render';
import {generateOptions} from '../data/points';

export const emptyPoint = {
  description: ``,
  city: ``,
  options: generateOptions(true),
  photos: [],
  price: ``,
  time: {
    start: new Date(),
    end: new Date()
  },
  type: `transport`
};

export default class PointController {
  constructor(containerElement, onDataChange, onViewChange) {
    this._containerElement = containerElement;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._pointsComponent = new PointsComponent();

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, mode = Mode.DEFAULT) {
    this._mode = mode;

    const oldPointComponent = this._pointComponent;
    const oldPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointComponent(point);
    this._pointEditComponent = new PointEditComponent(point, mode);

    this._pointComponent.setRollupButtonClickHandler(() => {
      this._replacePointToPointEdit();

      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    if (this._mode !== Mode.ADDING) {
      this._pointEditComponent.setRollupButtonClickHandler(() => {
        this._replacePointEditToPoint();

        document.removeEventListener(`keydown`, this._onEscKeyDown);
      });
    }

    this._pointEditComponent.setEditFormSubmitHandler((evt) => {
      evt.preventDefault();

      const data = this._pointEditComponent.getData();

      this._onDataChange(this, point, data);
    });

    this._pointEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, point, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldPointEditComponent && oldPointComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._pointEditComponent, oldPointEditComponent);

          this._replacePointEditToPoint();
        } else {
          render(this._containerElement, this._pointsComponent);
          render(this._pointsComponent.getElement(), this._pointComponent);
        }

        break;
      case Mode.ADDING:
        if (oldPointEditComponent && oldPointComponent) {
          remove(oldPointComponent);
          remove(oldPointEditComponent);
        }

        document.addEventListener(`keydown`, this._onEscKeyDown);

        render(this._containerElement, this._pointEditComponent, RenderPosition.AFTEREND);

        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replacePointEditToPoint();
    }
  }

  destroy() {
    remove(this._pointEditComponent);
    remove(this._pointComponent);
    remove(this._pointsComponent);

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replacePointEditToPoint() {
    this._pointEditComponent.reset();

    this._mode = Mode.DEFAULT;

    if (document.contains(this._pointEditComponent.getElement())) {
      replace(this._pointComponent, this._pointEditComponent);
    }
  }

  _replacePointToPointEdit() {
    this._onViewChange();

    this._mode = Mode.EDIT;

    replace(this._pointEditComponent, this._pointComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, emptyPoint, null);
      }

      this._replacePointEditToPoint();

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
