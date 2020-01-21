import PointModel from '../models/point';
import PointsComponent from '../components/points';
import PointComponent from '../components/point';
import PointEditComponent from '../components/point-edit';
import {render, replace, remove} from '../utils/render.js';
import {Mode} from '../const';
import {RenderPosition} from '../utils/render';

const SHAKE_ANIMATION_TIMEOUT = 600;

export const emptyPoint = {
  destination: {
    name: ``,
    description: ``,
    pictures: []
  },
  offers: [],
  price: ``,
  date: {
    from: new Date(),
    to: new Date()
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

      this._pointEditComponent.setDisabledButtons(true);
      this._pointEditComponent.setSaveButtonText(`Saving...`);

      const data = new PointModel(this._pointEditComponent.getFormData());

      this._onDataChange(this, point, data);

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEditComponent.setDeleteButtonClickHandler(() => {
      this._pointEditComponent.setDisabledButtons(true);
      this._pointEditComponent.setDeleteButtonText(`Deleting...`);

      this._onDataChange(this, point, null);
    });

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

  shake() {
    this._pointEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._pointEditComponent.getElement().style.boxShadow = `0 11px 20px rgba(220, 20, 60, 0.2)`;

    setTimeout(() => {
      this._pointEditComponent.getElement().style.animation = ``;
      this._pointEditComponent.getElement().style.boxShadow = ``;

      this._pointEditComponent.setDisabledButtons(false);
      this._pointEditComponent.setSaveButtonText(`Save`);
      this._pointEditComponent.setDeleteButtonText(`Delete`);
    }, SHAKE_ANIMATION_TIMEOUT);
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
