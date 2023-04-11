import Spinner from "@/components/Icons/Spinner";
import { MONEY_TRACKER_API } from "@/constants";
import { TransactionContext } from "@/context";
import { revalidateCache } from "@/fetch";
import { Transaction } from "@/ts";
import React, { useEffect, useState } from "react";

const TransactionModal = () => {
  const [{ lastSelectedMonth, isTransactionModalOpen }, setTransactionContext] =
    TransactionContext.useStore((store) => store);

  const [isCreatingTransaction, setIsCreatingTransaction] = useState(false);

  const [amount, setAmount] = useState("0");

  const focusFormInput = (inputId: string) =>
    (
      document.querySelector(
        `#transaction_modal>#${inputId}`
      ) as HTMLInputElement
    ).focus();

  useEffect(() => {
    if (isTransactionModalOpen) {
      focusFormInput("amount");
      //console.log(document.querySelector("#transaction_modal>#amount"));
    }
  }, [isTransactionModalOpen]);

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
      <input
        id="purchaseDate"
        placeholder="purchaseDate"
        type="datetime-local"
        className="my-2 w-full rounded-md px-2 py-1"
      />
      <input
        id="from"
        placeholder="from"
        className="my-2 w-full rounded-md px-2 py-1"
        defaultValue="💵"
      />
      <select
        id="type"
        className="my-2 w-full appearance-none rounded-md px-2 py-1"
      >
        <option value="minus">Gasto</option>
        <option value="plus">Ingreso</option>
      </select>
      <input
        id="amount"
        placeholder="Cantidad"
        type="number"
        inputMode="decimal"
        className="absolute h-0" // my-2 w-full rounded-md px-2 py-1
        onInput={({ target: { value }, nativeEvent: { data } }: any) =>
          setAmount(`${value}${data === "." ? "." : ""}` || "0")
        }
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            focusFormInput("title");
          }
        }}
      />
      <select
        id="categoryId"
        className="my-2 w-full appearance-none rounded-md px-2 py-1"
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
      <button
        disabled={isCreatingTransaction}
        className={`my-2 flex w-full items-center justify-center rounded-md bg-blue-500 py-1.5 ${
          isCreatingTransaction ? "bg-sky-400" : "hover:bg-blue-600"
        }`}
        onClick={async () => {
          const form = document.querySelector("#transaction_modal")!.childNodes;
          const transactionBody = {} as Transaction;
          for (const { id, value } of Array.from(form).slice(
            0,
            6
          ) as (HTMLInputElement & { id: keyof Transaction })[]) {
            if (!value) return alert(`Campo "${id}" no puede quedar vacío`);
            // @ts-ignore
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
            setIsCreatingTransaction(true);
            const res = await fetch(`${MONEY_TRACKER_API}transaction/`, {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(transactionBody),
            });
            const transaction: Transaction = await res.json();
            const revalidateHelper = revalidateCache(transaction);
            if (
              lastSelectedMonth.getAbsMonth("begin").toISOString() ===
              new Date().getAbsMonth("begin").toISOString()
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
            Creando...
          </>
        ) : (
          <>Crear</>
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
