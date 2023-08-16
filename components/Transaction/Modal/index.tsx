import Spinner from "@/components/Icons/Spinner";
import { CATEGORIES, MONEY_TRACKER_API } from "@/constants";
import { TransactionContext } from "@/context";
import { getJWT, revalidateCache } from "@/fetch";
import { Transaction } from "@/ts";
import { mutateTransactionFromList } from "@/utils/transaction";
import { TrashIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useRef, useState } from "react";

type TransactionFormKey = Exclude<
  keyof Transaction,
  "category" | "id" | "orCurrency" | "orAmount"
>;
type TransactionOperation = "DELETE" | "PATCH" | "POST";

const TransactionModal = () => {
  const [
    {
      lastSelectedMonth,
      isTransactionModalOpen,
      expenseHistory,
      transactionsFromSearch,
    },
    setTransactionContext,
  ] = TransactionContext.useStore((store) => store);

  const transKey = useRef(Date.now());

  const fromTransaction =
    (isTransactionModalOpen &&
      typeof isTransactionModalOpen === "object" &&
      isTransactionModalOpen.transaction) ||
    undefined;

  const [isMutatingTransaction, setIsMutatingTransaction] = useState<
    false | TransactionOperation
  >(false);

  const [amount, setAmount] = useState("0");

  const selectFormInput = (
    inputId: TransactionFormKey
  ): Omit<HTMLInputElement, "value"> & {
    value: Transaction[TransactionFormKey];
  } =>
    document.querySelector(
      `#transaction_modal>#${inputId}`
    ) as HTMLInputElement;
  const focusFormInput = (inputId: TransactionFormKey) =>
    selectFormInput(inputId).focus();

  const getInitialPurchaseDate = useCallback((overrideDate?: string) => {
    const now = overrideDate ? new Date(overrideDate) : new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    now.setMilliseconds(0);
    now.setSeconds(0);
    return now.toISOString().slice(0, -1);
  }, []);

  useEffect(() => {
    if (isTransactionModalOpen) {
      focusFormInput("amount");
      setAmount(fromTransaction?.amount || "0");
      selectFormInput("title").value = fromTransaction?.title || "";
      selectFormInput("categoryId").value = fromTransaction?.categoryId || 1;
      selectFormInput("type").value = fromTransaction?.type || "minus";
      selectFormInput("purchaseDate").value = getInitialPurchaseDate(
        fromTransaction?.purchaseDate
      );
      selectFormInput("from").value =
        fromTransaction?.from === "CASH" ? "💵" : fromTransaction?.from || "💵";
      //console.log(document.querySelector("#transaction_modal>#amount"));
    } else {
      transKey.current = Date.now();
    }
  }, [isTransactionModalOpen]);

  const submitTransaction = async (deleteOperation = false) => {
    const transactionBody = {} as Transaction;

    if (!deleteOperation) {
      const form = document.querySelector("#transaction_modal")!.childNodes;
      for (const { id, value } of Array.from(form).slice(
        1,
        7
      ) as (HTMLInputElement & { id: TransactionFormKey })[]) {
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
    }

    const { category, ...transactionPayload } = {
      ...fromTransaction,
      ...transactionBody,
    };

    const operation: TransactionOperation = deleteOperation
      ? "DELETE"
      : fromTransaction
      ? "PATCH"
      : "POST";
    try {
      setIsMutatingTransaction(operation);
      const jwt = await getJWT();
      const res = await fetch(
        `${MONEY_TRACKER_API}transaction/${fromTransaction?.id || ""}`,
        {
          method: operation,
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            ...(jwt && { Authorization: `Bearer ${jwt}` }),
          },
          credentials: "include",
          ...(!deleteOperation && {
            body: JSON.stringify(transactionPayload),
          }),
        }
      );
      // Check for write permission
      if ([401, 403].includes(res.status)) throw res;
      const transaction: Transaction = await res.json();
      const { mutatedMonth, transactions: revalidateHelper } = revalidateCache(
        transaction,
        deleteOperation
      );

      const batchSetTransactionContext: Parameters<
        typeof setTransactionContext
      >[0] = {};

      if (mutatedMonth === lastSelectedMonth.getAbsMonth("begin").toISOString())
        (batchSetTransactionContext["lastTransactions"] = [
          ...revalidateHelper,
        ]),
          (batchSetTransactionContext["isTransactionModalOpen"] = false);

      if (operation !== "POST" && transactionsFromSearch.length) {
        batchSetTransactionContext["transactionsFromSearch"] = [
          ...mutateTransactionFromList(
            transaction,
            transactionsFromSearch,
            deleteOperation
          ),
        ];
      }
      const mutateExpenseHistory = expenseHistory[mutatedMonth];
      if (mutateExpenseHistory) {
        const mutatedExpenseHistoryContainsCategory =
          mutateExpenseHistory.findIndex(
            ({ categoryId }) => categoryId === transaction.categoryId
          );
        if (!mutatedExpenseHistoryContainsCategory)
          mutateExpenseHistory.push({
            categoryId: transaction.categoryId,
            _sum: { amount: transaction.amount },
          });
        else {
          const diff = +transaction.amount - +fromTransaction!.amount;
          const currentCategorySum =
            +mutateExpenseHistory[mutatedExpenseHistoryContainsCategory]._sum
              .amount;
          mutateExpenseHistory[
            mutatedExpenseHistoryContainsCategory
          ]._sum.amount = `${
            currentCategorySum +
            (operation === "PATCH"
              ? diff
              : +transaction.amount * (operation === "POST" ? 1 : -1))
          }`;
        }
        batchSetTransactionContext["expenseHistory"] = { ...expenseHistory };
      }

      setTransactionContext(batchSetTransactionContext);
    } catch (error) {
      console.log(
        `${console.bgRed}${console.fgWhite} Error on Transaction/Modal/index.tsx > [submit] ${console.reset}`,
        {
          operation,
          error,
        }
      );
      if (error instanceof Response)
        alert(
          JSON.stringify({
            status: error.status,
            statusText: (await error.json())?.error ?? error.statusText,
          })
        );
      else
        alert(
          JSON.stringify(
            error,
            Object.getOwnPropertyNames(error).filter((key) => key !== "stack")
          )
        );
    } finally {
      setIsMutatingTransaction(false);
    }
  };

  return (
    <div
      className={`fixed z-50 h-full w-full transition-transform duration-200 ${
        isTransactionModalOpen ? "translate-y-0" : "translate-y-full"
      } flex flex-col justify-between bg-theme-dark px-8 py-16`}
    >
      <div id="transaction_modal">
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
          className="mb-2 w-full rounded-md px-2 py-1 input"
        />
        <select
          id="categoryId"
          className="my-2 w-full appearance-none rounded-md px-2 py-1 input"
        >
          {CATEGORIES.map(({ id, name }) => (
            <option value={id} key={id}>
              {name}
            </option>
          ))}
        </select>
        <input
          id="purchaseDate"
          placeholder="purchaseDate"
          type="datetime-local"
          className="my-2 min-w-[calc(100%-16px)] rounded-md py-1 px-2 input"
        />
        <input
          id="from"
          placeholder="from"
          className="my-2 w-full rounded-md px-2 py-1 input"
        />
        <select
          id="type"
          className="my-2 w-full appearance-none rounded-md px-2 py-1 input"
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
          disabled={!!isMutatingTransaction}
          className={`my-2 flex w-full items-center justify-center rounded-md bg-theme-action py-1.5 ${
            isMutatingTransaction && isMutatingTransaction !== "DELETE"
              ? "bg-theme-action-light"
              : "hover:bg-theme-action-dark"
          }`}
          onClick={() => submitTransaction()}
        >
          {isMutatingTransaction && isMutatingTransaction !== "DELETE" ? (
            <>
              <Spinner className="mr-2 h-4 w-4 text-white" />
              {fromTransaction ? "Guardando..." : "Creando..."}
            </>
          ) : fromTransaction ? (
            "Guardar"
          ) : (
            "Crear"
          )}
        </button>
        <input
          type="button"
          value="Cancelar"
          disabled={!!isMutatingTransaction}
          className="my-2 w-full rounded-md bg-gray-400 py-1.5 hover:bg-gray-500"
          onClick={() =>
            setTransactionContext({ isTransactionModalOpen: false })
          }
        />
      </div>
      {fromTransaction && (
        <button
          disabled={!!isMutatingTransaction}
          className={`mb-8 flex w-full items-center justify-center rounded-md py-1.5 ${
            isMutatingTransaction && isMutatingTransaction === "DELETE"
              ? "bg-red-300"
              : "bg-red-400 hover:bg-red-500"
          }`}
          onClick={() => submitTransaction(true)}
        >
          {isMutatingTransaction && isMutatingTransaction === "DELETE" ? (
            <>
              <Spinner className="mr-2 h-4 w-4 text-white" />
              Eliminando...
            </>
          ) : (
            <>
              <TrashIcon className="mr-2 h-4 w-4 text-white" />
              Eliminar
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default TransactionModal;
