import { IProductType } from "./IProductType";

export interface ISupplier {
  id: number;
  name: string;
  price: number;
  type: "local" | "import";
}

export interface IProduct {
  id: number;
  name: string;
  type: IProductType["id"];
  img_link: string;
  suppliers_list: ISupplier[];
}
