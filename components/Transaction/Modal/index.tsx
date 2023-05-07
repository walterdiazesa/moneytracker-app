import Spinner from "@/components/Icons/Spinner";
import { MONEY_TRACKER_API } from "@/constants";
import { TransactionContext } from "@/context";
import { revalidateCache } from "@/fetch";
import { Transaction } from "@/ts";
import React, { useCallback, useEffect, useRef, useState } from "react";

type TransactionFormKey = Exclude<
  keyof Transaction,
  "category" | "id" | "orCurrency" | "orAmount"
>;

const TransactionModal = () => {
  const [{ lastSelectedMonth, isTransactionModalOpen }, setTransactionContext] =
    TransactionContext.useStore((store) => store);

  const transKey = useRef(Date.now());

  const fromTransaction =
    (isTransactionModalOpen &&
      typeof isTransactionModalOpen === "object" &&
      isTransactionModalOpen.transaction) ||
    undefined;

  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);

  const [amount, setAmount] = useState("0");

  const selectFormInput = (inputId: TransactionFormKey) =>
    document.querySelector(
      `#transaction_modal>#${inputId}`
    ) as HTMLInputElement;
  const focusFormInput = (inputId: TransactionFormKey) =>
    selectFormInput(inputId).focus();

  useEffect(() => {
    if (isTransactionModalOpen) {
      focusFormInput("amount");
      setAmount(fromTransaction?.amount || "0");
      selectFormInput("title").value = fromTransaction?.title || "";
      //console.log(document.querySelector("#transaction_modal>#amount"));
    } else {
      transKey.current = Date.now();
    }
  }, [isTransactionModalOpen]);

  const getInitialPurchaseDate = useCallback((overrideDate?: string) => {
    const now = overrideDate ? new Date(overrideDate) : new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    now.setMilliseconds(0);
    now.setSeconds(0);
    return now.toISOString().slice(0, -1);
  }, []);

  return (
    <div
      id="transaction_modal"
      className={`fixed z-50 h-full w-full bg-red-600 transition-transform duration-200 ${
        isTransactionModalOpen ? "translate-y-0" : "translate-y-full"
      } bg-theme-dark px-8 py-16`}
    >
      <h1
        className="mb-4 w-full text-center text-6xl"
        onClick={() => focusFormInput("amount")}
      >
        <span className="text-xl">$</span>
        {amount}
      </h1>
      <input
        id="title"
        placeholder="Título"
        className="mb-2 w-full rounded-md px-2 py-1"
      />
      <select
        id="categoryId"
        className="my-2 w-full appearance-none rounded-md px-2 py-1"
        value={fromTransaction?.categoryId || 1}
      >
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
        id="purchaseDate"
        placeholder="purchaseDate"
        type="datetime-local"
        className="my-2 min-w-[calc(100%-16px)] rounded-md py-1 px-2"
        defaultValue={getInitialPurchaseDate(fromTransaction?.purchaseDate)}
      />
      <input
        id="from"
        placeholder="from"
        className="my-2 w-full rounded-md px-2 py-1"
        defaultValue={
          fromTransaction?.from === "CASH"
            ? "💵"
            : fromTransaction?.from || "💵"
        }
      />
      <select
        id="type"
        className="my-2 w-full appearance-none rounded-md px-2 py-1"
        value={fromTransaction?.type || "minus"}
      >
        <option value="minus">Gasto</option>
        <option value="plus">Ingreso</option>
      </select>
      <input
        id="amount"
        placeholder="Cantidad"
        type="number"
        inputMode="decimal"
        key={fromTransaction?.id || transKey.current}
        className="absolute max-h-0 max-w-0"
        defaultValue={fromTransaction?.amount}
        onInput={({ target: { value } }: any) => setAmount(value || "0")}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            focusFormInput("title");
          }
        }}
      />
      <button
        disabled={isCreatingTransaction}
        className={`my-2 flex w-full items-center justify-center rounded-md bg-blue-500 py-1.5 ${
          isCreatingTransaction ? "bg-sky-400" : "hover:bg-blue-600"
        }`}
        onClick={async () => {
          const form = document.querySelector("#transaction_modal")!.childNodes;
          const transactionBody = {} as Transaction;
          for (const { id, value } of Array.from(form).slice(
            1,
            7
          ) as (HTMLInputElement & { id: TransactionFormKey })[]) {
            console.log({ value });
            if (!value && id !== "amount")
              return alert(`Campo "${id}" no puede quedar vacío`);
            switch (id) {
              case "amount":
                transactionBody["amount"] = (value || "0") as `${number}`;
                break;
              case "categoryId":
                transactionBody["categoryId"] = +value;
                break;
              case "from":
                transactionBody["from"] =
                  value === "💵" ? "CASH" : (value as `${number}`);
                break;
              case "purchaseDate":
                transactionBody["purchaseDate"] = new Date(value).toISOString();
                break;
              case "title":
              case "type":
                transactionBody[id] = value as any;
                break;
            }
          }
          transactionBody["owner"] = "walterwalon@gmail.com";
          transactionBody["currency"] = "USD";

          const { category, ...transactionPayload } = {
            ...fromTransaction,
            ...transactionBody,
          };

          try {
            setIsCreatingTransaction(true);
            const res = await fetch(
              `${MONEY_TRACKER_API}transaction/${fromTransaction?.id || ""}`,
              {
                method: fromTransaction ? "PATCH" : "POST",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(transactionPayload),
              }
            );
            const transaction: Transaction = await res.json();
            const { mutatedMonth, transactions: revalidateHelper } =
              revalidateCache(transaction);
            const lastMonthKey = lastSelectedMonth
              .getAbsMonth("begin")
              .toISOString();
            if (
              mutatedMonth === lastMonthKey && // Actual condition, we are seeing the same month as the mutated month
              lastMonthKey === new Date().getAbsMonth("begin").toISOString() // Avoid redundant re-render
            )
              setTransactionContext({ lastTransactions: revalidateHelper });
            setTransactionContext({ isTransactionModalOpen: false });
          } catch (e) {
            console.error({ e });
            alert(JSON.stringify(e));
          } finally {
            setIsCreatingTransaction(false);
          }
        }}
      >
        {isCreatingTransaction ? (
          <>
            <Spinner className="mr-2 h-4 w-4 text-white" />
            {fromTransaction ? "Guardando..." : "Creando..."}
          </>
        ) : (
          <>{fromTransaction ? "Guardar" : "Crear"}</>
        )}
      </button>
      <input
        type="button"
        value="Cancelar"
        disabled={isCreatingTransaction}
        className="my-2 w-full rounded-md bg-gray-400 py-1.5 hover:bg-gray-500"
        onClick={() => setTransactionContext({ isTransactionModalOpen: false })}
      />
    </div>
  );
};

export default TransactionModal;
