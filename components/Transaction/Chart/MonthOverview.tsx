import { MONTHLY_SAVING_GOAL } from "@/constants";
import { TransactionContext } from "@/context";
import {
  getExpendedFromTransactions,
  getRemainingFromTransactions,
} from "@/utils";
import { ProgressBar } from "@tremor/react";
import React, { useMemo } from "react";

const MonthOverview = () => {
  const [{ lastSelectedMonth, lastTransactions }] = TransactionContext.useStore(
    (store) => store
  );
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
  );
};

export default MonthOverview;
