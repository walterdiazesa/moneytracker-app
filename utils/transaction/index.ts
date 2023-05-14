import { Transaction } from "@/ts";

export const mutateTransactionFromList = (
  transaction: Transaction,
  transactionList: Transaction[],
  removeOperation: boolean
) => {
  let updateTransaction = false;
  const transactionIdx = transactionList.findIndex(({ purchaseDate, id }) => {
    if (transaction.id === id) updateTransaction = true;
    return (
      updateTransaction ||
      new Date(purchaseDate) <= new Date(transaction.purchaseDate)
    );
  });
  if (transactionIdx === -1) return transactionList;
  transactionList.splice(
    transactionIdx,
    Number(updateTransaction),
    ...(removeOperation ? [] : [transaction])
  );
  return transactionList;
};
