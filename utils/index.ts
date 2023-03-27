import { MINIMUM_MONTHLY_INCOME } from "@/constants";
import { Transaction } from "@/ts";

export const getRemainingFromTransactions = (transactions: Transaction[]) => {
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

export const getExpendedFromTransactions = (transactions: Transaction[]) => {
  return transactions.reduce((acc, { amount, type }) => {
    return acc + (type === "minus" ? +amount : 0);
  }, 0);
};
