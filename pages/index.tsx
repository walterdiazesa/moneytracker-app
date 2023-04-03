// @ts-nocheck
import MonthPicker from "@/components/MonthPicker";
import Page from "@/components/page";
import Transaction from "@/components/Transaction";
import { TransactionContext } from "@/context";
import { getTransactionFromMonth } from "@/fetch";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { ProgressBar } from "@tremor/react";
import {
  getExpendedFromTransactions,
  getRemainingFromTransactions,
} from "@/utils";
import { MONEY_TRACKER_API, MONTHLY_SAVING_GOAL } from "@/constants";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Transaction as TransactionType } from "@/ts";

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
      <div
        id="transaction_modal"
        className={`fixed z-50 h-full w-full bg-red-600 transition-transform duration-200 ${
          isTransactionModalOpen ? "translate-y-0" : "translate-y-full"
        } bg-theme-dark px-8 py-16`}
      >
        <input id="title" placeholder="title" className="mb-2 w-full" />
        <input
          id="purchaseDate"
          placeholder="purchaseDate"
          type="datetime-local"
          className="my-2 w-full"
        />
        <input
          id="from"
          placeholder="from"
          className="my-2 w-full"
          defaultValue="💵"
        />
        <select id="type" className="my-2 w-full">
          <option value="minus">Gasto</option>
          <option value="plus">Ingreso</option>
        </select>
        <input id="amount" placeholder="amount" className="my-2 w-full" />
        <select id="categoryId" className="my-2 w-full">
          <option value={1}>🃏 Miscelánea</option>
          <option value={2}>🥖 Alimentos</option>
          <option value={3}>🍣 Restaurante</option>
          <option value={4}>🏋️‍♂️ Gimnasio</option>
          <option value={5}>🧼 Belleza</option>
          <option value={6}>🍾 Salidas</option>
          <option value={7}>🏂 Experiencias</option>
          <option value={8}>🚈 Transporte</option>
          <option value={9}>🛍 Ropa</option>
          <option value={10}>🏠 Hospedaje</option>
          <option value={11}>💸 Income</option>
        </select>
        <input
          type="button"
          value="Crear"
          className="my-2 w-full bg-blue-500"
          onClick={async () => {
            const form =
              document.querySelector("#transaction_modal")?.childNodes;
            const transactionBody: TransactionType = {};
            for (const { id, value } of Array.from(form).slice(0, 6)) {
              if (!value) return alert(`Campo "${id}" no puede quedar vacío`);
              transactionBody[id] =
                value === "💵"
                  ? "CASH"
                  : id === "purchaseDate"
                  ? new Date(value)
                  : Number.isFinite(+value)
                  ? +value
                  : value;
            }
            transactionBody["owner"] = "walterwalon@gmail.com";
            transactionBody["currency"] = "USD";
            try {
              let res = await fetch(`${MONEY_TRACKER_API}transaction/`, {
                method: "POST",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(transactionBody),
              });
              res = await res.json();
              alert(JSON.stringify(res));
            } catch (e) {
              console.error({ e });
              alert(JSON.stringify(e));
            } finally {
              setTransactionContext({ isTransactionModalOpen: false });
            }
          }}
        />
        <input
          type="button"
          value="Cancelar"
          className="my-2 w-full bg-gray-400"
          onClick={() =>
            setTransactionContext({ isTransactionModalOpen: false })
          }
        />
      </div>
      <MonthPicker />
      {isLoading && (
        <div className="mb-3 px-8">
          <div className="flex items-center justify-center rounded-md bg-gray-300 py-2 text-sm text-white">
            <ArrowPathIcon
              className="mr-2 animate-spin"
              width={18}
              height={18}
            />
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
      <div key={lastSelectedMonth.getMonth()}>
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
