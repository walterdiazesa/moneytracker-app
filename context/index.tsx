import { ExpenseHistory, Transaction } from "@/ts";
import createFastContext from "./FastContext";

export const TransactionContext = createFastContext({
  lastSelectedMonth: new Date(),
  lastTransactions: [] as Transaction[],
  expenseHistory: {} as ExpenseHistory,
  transactionsFromSearch: [] as Transaction[],
  isTransactionModalOpen: false as boolean | { transaction: Transaction },
});
