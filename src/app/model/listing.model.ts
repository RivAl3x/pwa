

export class ListingModel {
    _id?: any;
    name?: string;
    ean?: any;
    price?:any;


    public constructor(
      _id: any = null,
      name: string = '',
      ean: any = null,
      price:any = null,


    ) {
        this._id = _id;
        this.name = name;
        this.ean = ean;
        this.price = price;


    }
}
