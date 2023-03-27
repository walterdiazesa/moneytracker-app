import { Transaction } from "@/ts";

export const getRemainingFromTransactions = (transactions: Transaction[]) => {
  return transactions.reduce((acc, { amount, type }) => {
    return acc + +amount * (type === "minus" ? -1 : 1);
  }, 0);
};

export const getExpendedFromTransactions = (transactions: Transaction[]) => {
  return transactions.reduce((acc, { amount, type }) => {
    return acc + (type === "minus" ? +amount : 0);
  }, 0);
};
