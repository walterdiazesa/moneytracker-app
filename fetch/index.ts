import { MONEY_TRACKER_API } from "@/constants";
import { ExpenseHistory, Transaction } from "@/ts";
import { DateCaster } from "@/ts/primitives";
import { getScreenType } from "@/utils/screen";
import { mutateTransactionFromList } from "@/utils/transaction";

const transactionCache: Record<string, Transaction[]> =
  typeof localStorage !== "undefined" &&
  localStorage.getItem("transactionCache")
    ? JSON.parse(localStorage.getItem("transactionCache")!)
    : {};

export const invalidateCache = (key: DateCaster<string>) => {
  delete transactionCache[key];
  // localStorage.setItem("transactionCache", JSON.stringify(transactionCache)); // No need
  // to persist in cache as is going to be persisted from the next function from this function is called
};

const requestCache = async (
  key: DateCaster<string>,
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
 * @returns {Object} revalidateCache
 * @returns {Object} revalidateCache.transactions Return the __reference__ of the entries of the transactionCache key that was revalidated
 * @returns {string} revalidateCache.mutatedMonth Return the key of the mutated month
 */
export const revalidateCache = (
  transaction: Transaction,
  onlyRemove: boolean = false
): { transactions: Transaction[]; mutatedMonth: DateCaster<string> } => {
  const key = new Date(transaction.purchaseDate)
    .getAbsMonth("begin")
    .toISOString();
  if (!transactionCache.hasOwnProperty(key))
    transactionCache[key] = [transaction];
  else
    mutateTransactionFromList(transaction, transactionCache[key], onlyRemove);

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
        .toISOString()}/${date.getAbsMonth("end").toISOString()}`,
      {
        credentials: "include",
      }
    )
  );
};

const historyWindowBaseOfScreenSize = () => {
  const screenType = getScreenType();
  if (screenType === "mobile-portrait") return -5;
  if (screenType === "mobile-landscape") return -8;
  return -12;
};

export const getExpenseHistoryWindow = async (): Promise<ExpenseHistory> => {
  const expenseHistoryResponse = await fetch(
    `${MONEY_TRACKER_API}transaction/expenses/${new Date()
      .change("month", historyWindowBaseOfScreenSize())
      .getAbsMonth("begin")
      .toISOString()}/${new Date().getAbsMonth("end").toISOString()}`,
    {
      credentials: "include",
    }
  );
  return await expenseHistoryResponse.json();
};

export const getTransactionFromFilter = async ({
  title,
  from,
  to,
}: {
  title?: string;
  from?: Date | null;
  to?: Date | null;
}): Promise<Transaction[]> => {
  const prepareQuery = new URL(`${MONEY_TRACKER_API}transaction/`);
  const preparedFrom =
    from?.toISOString() || new Date(2022, 5).getAbsMonth("begin").toISOString();
  const preparedTo =
    to?.toISOString() || new Date().getAbsMonth("end").toISOString();
  prepareQuery.pathname += title
    ? `title/${title}`
    : `${preparedFrom}/${preparedTo}`;
  if (title && from !== to)
    prepareQuery.search = new URLSearchParams({
      from: preparedFrom,
      to: preparedTo,
    }).toString();

  const transactions = await fetch(prepareQuery.toString(), {
    credentials: "include",
  });
  return await transactions.json();
};

export const getJWT = async (): Promise<string | null> => {
  const res = await fetch("/api/auth/jwt");
  if (res.status !== 200) return null;
  return (await res.json()).token as string;
};
