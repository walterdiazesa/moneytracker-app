import MonthPicker from "@/components/MonthPicker";
import Page from "@/components/page";
import Transaction from "@/components/Transaction";
import DaySpend from "@/components/DaySpend";
import { TransactionContext } from "@/context";
import { getTransactionFromMonth, revalidateCache } from "@/fetch";
import { useEffect, useMemo, useState } from "react";
import { ProgressBar } from "@tremor/react";
import {
  getExpendedFromTransactions,
  getRemainingFromTransactions,
} from "@/utils";
import { MONTHLY_SAVING_GOAL } from "@/constants";
import Spinner from "@/components/Icons/Spinner";
import TransactionModal from "@/components/Transaction/Modal";

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

  const remaining = useMemo(
    () => +getRemainingFromTransactions(lastTransactions).toFixed(2),
    [lastTransactions]
  );
  const expended = useMemo(
    () => +getExpendedFromTransactions(lastTransactions).toFixed(2),
    [lastTransactions]
  );
  const remainingDays = useMemo(() => {
    const selectedMonthDays = new Date(
      Date.UTC(
        lastSelectedMonth.getFullYear(),
        lastSelectedMonth.getMonth() + 1,
        0
      )
    );
    return Math.max(
      Math.min(
        selectedMonthDays.diff(new Date(), "day") * -1,
        selectedMonthDays.getDate()
      ),
      0
    );
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
      <div className="px-8">
        <div className="mb-3 w-full rounded-md bg-blue-500 p-2">
          <p className="text-xs">Ahorro este mes</p>
          <p>
            {remaining < 0 && "-"}${Math.abs(remaining)}
            <span className="ml-2 text-xs">{remainingDays} días restantes</span>
          </p>
          <div className="mt-4 flex justify-between text-xs">
            <p>Meta de ahorro</p>
            <p>
              ${expended | 0} / ${MONTHLY_SAVING_GOAL} ($
              {Math.abs((MONTHLY_SAVING_GOAL - expended) | 0)}{" "}
              {expended > MONTHLY_SAVING_GOAL ? "por encima" : "restantes"})
            </p>
          </div>
          <ProgressBar
            color={
              (expended / MONTHLY_SAVING_GOAL) * 100 < 40
                ? "emerald"
                : (expended / MONTHLY_SAVING_GOAL) * 100 < 60
                ? "lime"
                : (expended / MONTHLY_SAVING_GOAL) * 100 < 80
                ? "amber"
                : "red"
            }
            percentageValue={(expended / MONTHLY_SAVING_GOAL) * 100}
            className="mt-2"
            showAnimation
          />
        </div>
      </div>
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
