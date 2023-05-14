import { DateCaster } from "./primitives";

export type Category = {
  id: number;
  name: `${string} ${string}`;
  color: string;
};
export type Transaction = {
  id: string;
  title: string;
  purchaseDate: DateCaster<string>;
  type: "plus" | "minus";
  from: `${number}` | "CASH";
  currency: string;
  amount: `${number}`;
  orCurrency?: string;
  orAmount?: `${number}`;
  owner: string;
  categoryId: number;
  category: Category;
};

export type ExpenseHistory = Record<
  DateCaster<string>,
  {
    categoryId: Category["id"];
    _sum: {
      amount: Transaction["amount"];
    };
  }[]
>;
