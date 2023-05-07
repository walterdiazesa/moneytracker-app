import MonthPicker from "@/components/MonthPicker";
import Page from "@/components/page";
import Transaction from "@/components/Transaction";
import DaySpend from "@/components/DaySpend";
import { TransactionContext } from "@/context";
import { getTransactionFromMonth, invalidateCache } from "@/fetch";
import { useEffect, useState } from "react";
import Spinner from "@/components/Icons/Spinner";
import TransactionModal from "@/components/Transaction/Modal";
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
      <TransactionModal />
      <MonthPicker />
      {isLoading && (
        <div className="mb-3 px-8">
          <div className="flex items-center justify-center rounded-md bg-gray-300 py-2 text-sm text-white">
            <Spinner className="mr-2 h-4 w-4 text-white" />
            Obteniendo transacciones actualizadas
          </div>
        </div>
      )}
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
                  {Intl.DateTimeFormat("es", {
                    day: "2-digit",
                    weekday: "short",
                  }).format(new Date(lastSelectedMonth.clone().setDate(+day)))}
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
