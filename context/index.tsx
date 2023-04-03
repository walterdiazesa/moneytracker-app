import { Transaction } from "@/ts";
import { createContext } from "react";
import createFastContext from "./FastContext";

export const TransactionContext = createFastContext({
  lastSelectedMonth: new Date(),
  lastTransactions: [] as Transaction[],
  isTransactionModalOpen: false,
});
