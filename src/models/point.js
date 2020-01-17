export default class PointModel {
  constructor(point) {
    this.destination = {
      name: point[`destination`][`name`],
      description: point[`destination`][`description`],
      pictures: point[`destination`][`pictures`]
    };
    this.id = point[`id`];
    this.isFavorite = Boolean(point[`is_favorite`]);
    this.offers = point[`offers`];
    this.price = point[`base_price`];
    this.date = {
      from: new Date(point[`date_from`]),
      to: new Date(point[`date_to`])
    };
    this.type = point[`type`];
  }

  toRAW() {
    return {
      'base_price': this.price,
      'id': this.id,
      'type': this.type,
      'date_from': this.date.from.toISOString(),
      'date_to': this.date.to.toISOString(),
      'destination': {
        'name': this.destination.name,
        'description': this.destination.description,
        'pictures': this.destination.pictures
      },
      'offers': this.offers,
      'is_favorite': this.isFavorite
    };
  }
}
