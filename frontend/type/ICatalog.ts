import { IProductType } from "./IProductType";

export interface IDataItem {
  id: number;
  name: string;
  type: IProductType["id"];
  price: number;
  img_link: string;
}

export interface ICatalog {
  count: number;
  data: IDataItem[];
}
