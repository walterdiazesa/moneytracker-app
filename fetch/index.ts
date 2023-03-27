import { MONEY_TRACKER_API } from "@/constants";
import { Transaction } from "@/ts";

const transactionCache: Record<string, any> =
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
  }
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
