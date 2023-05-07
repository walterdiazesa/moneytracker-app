import { MONEY_TRACKER_API } from "@/constants";
import { Transaction } from "@/ts";
import { DateCaster } from "@/ts/primitives";

const transactionCache: Record<string, Transaction[]> =
  typeof localStorage !== "undefined" &&
  localStorage.getItem("transactionCache")
    ? JSON.parse(localStorage.getItem("transactionCache")!)
    : {};

const requestCache = async (
  key: string,
  catchValue: () => Promise<Response>
) => {
  // If exist, but if it's current month: revalidate
  // new Date().getAbsMonth("begin").toISOString() !== key
  // When first open the app, show current month in cache WHILE is requesting new data, revalidates when finish getting last data
  // If swipes between pages, keep same data
  // If swipe down to refresh, revalidate last month
  if (
    transactionCache.hasOwnProperty(key) &&
    new Date().getAbsMonth("begin").toISOString() !== key
  )
    return transactionCache[key];
  try {
    const data = await (await catchValue()).json();
    transactionCache[key] = data;
    localStorage.setItem("transactionCache", JSON.stringify(transactionCache));
    return data;
  } catch (error) {
    console.log(
      `${console.bgRed}${console.fgWhite} Error on fetch/index.ts > [requestCache] ${console.reset}`,
      {
        error,
      }
    );
    return [];
  }
};

/**
 *
 * @param transaction The transaction that will be incrusted inside the cache
 * @returns Return the entries of the transactionCache key that was revalidated
 */
export const revalidateCache = (
  transaction: Transaction
): { transactions: Transaction[]; mutatedMonth: DateCaster<string> } => {
  const key = new Date(transaction.purchaseDate)
    .getAbsMonth("begin")
    .toISOString();
  if (!transactionCache.hasOwnProperty(key)) {
    transactionCache[key] = [transaction];
  } else {
    let updateTransaction = false;
    transactionCache[key].splice(
      transactionCache[key].findIndex(({ purchaseDate, id }) => {
        if (transaction.id === id) updateTransaction = true;
        return (
          updateTransaction ||
          new Date(purchaseDate) <= new Date(transaction.purchaseDate)
        );
      }),
      Number(updateTransaction),
      transaction
    );
  }
  if (new Date().getAbsMonth("begin").toISOString() !== key)
    localStorage.setItem("transactionCache", JSON.stringify(transactionCache));
  return {
    transactions: transactionCache[key],
    mutatedMonth: key,
  };
};

export const getTransactionFromMonth = async (
  date: Date
): Promise<Transaction[]> => {
  return await requestCache(date.getAbsMonth("begin").toISOString(), () =>
    fetch(
      `${MONEY_TRACKER_API}transaction/${date
        .getAbsMonth("begin")
        .toISOString()}/${date.getAbsMonth("end").toISOString()}`
    )
  );
};
