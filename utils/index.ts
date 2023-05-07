import { CATEGORIES, MINIMUM_MONTHLY_INCOME } from "@/constants";
import { Transaction } from "@/ts";

export const getRemainingFromTransactions = (
  transactions: Transaction[] = []
) => {
  let income = 0;
  let expenses = 0;
  for (const { amount, type } of transactions) {
    switch (type) {
      case "minus":
        expenses += +amount;
        break;
      case "plus":
        income += +amount;
        break;
    }
  }
  return Math.max(income, MINIMUM_MONTHLY_INCOME) - expenses;
};

export const getExpendedFromTransactions = (
  transactions: Transaction[] = [],
  category?: typeof CATEGORIES[number]["id"]
) => {
  return transactions.reduce((acc, { amount, type, categoryId }) => {
    return (
      acc +
      (!category || category === categoryId
        ? type === "minus"
          ? +amount
          : 0
        : 0)
    );
  }, 0);
};

export const currencyFormatter = (number: number) =>
  Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(number) ? 0 : 2,
  }).format(Math.abs(number));
