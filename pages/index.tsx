import MonthPicker from "@/components/MonthPicker";
import Page from "@/components/page";
import Transaction from "@/components/Transaction";
import DaySpend from "@/components/DaySpend";
import { TransactionContext } from "@/context";
import { getTransactionFromMonth, invalidateCache } from "@/fetch";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import {
  mountSwipeDownEvents,
  unmountSwipeDownEvents,
} from "@/utils/gestures/swipe";
import MonthOverview from "@/components/Transaction/Chart/MonthOverview";
import CategorySummary from "@/components/Transaction/Chart/CategorySummary";

const Index = () => {
  const [
    { lastSelectedMonth, lastTransactions, isTransactionModalOpen },
    setTransactionContext,
  ] = TransactionContext.useStore((store) => store);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getTransactionFromMonth(lastSelectedMonth)
      .then((transactions) => {
        setTransactionContext({ lastTransactions: transactions });
      })
      .finally(() => setIsLoading(false));
  }, [lastSelectedMonth]);

  useEffect(() => {
    const touchEndHandler = mountSwipeDownEvents(() => {
      invalidateCache(lastSelectedMonth.toISOString());
      setTransactionContext({
        lastSelectedMonth: lastSelectedMonth.clone(),
      });
    });
    return () => {
      unmountSwipeDownEvents(touchEndHandler);
    };
  }, [lastSelectedMonth]);

  return (
    <Page title="Transacciones" className="pb-20">
      <MonthPicker />
      {isLoading && <Loader label="Obteniendo transacciones actualizadas" />}
      <MonthOverview />
      <CategorySummary key="CategorySummary" />
      <div
        {...(isTransactionModalOpen && { className: "fixed w-full" })}
        key={lastSelectedMonth.getMonth()}
      >
        {Object.entries(
          lastTransactions.groupBy(({ purchaseDate }) =>
            new Date(purchaseDate).getDate()
          )
        )
          .reverse()
          .map(([day, dayTransactions]) => {
            return (
              <div key={day}>
                <div className="ml-8 text-sm">
                  {new Date(lastSelectedMonth.clone().setDate(+day)).format({
                    day: "2-digit",
                    weekday: "short",
                  })}
                  <DaySpend dayTransactions={dayTransactions} />
                </div>
                {dayTransactions.map((transaction) => (
                  <Transaction key={transaction.id} transaction={transaction} />
                ))}
              </div>
            );
          })}
      </div>
    </Page>
  );
};

export default Index;
