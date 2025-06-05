export interface IProfile {
  name: string;
  email: string;
  orders: {
    id: number;
    date: string;
    name: string;
    status: string;
  }[];
}
