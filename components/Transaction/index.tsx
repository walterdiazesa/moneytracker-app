import { TransactionContext } from "@/context";
import { Transaction } from "@/ts";
import React from "react";

const CURRENCY_MAP = Object.freeze({ USD: "$", EUR: "€", ALL: "lek" } as const);

const index = ({ transaction }: { transaction: Transaction }) => {
  const [, setTransactionContext] = TransactionContext.useStore(
    (store) => store["isTransactionModalOpen"]
  );
  return (
    <div
      className="px-8"
      onClick={() =>
        setTransactionContext({ isTransactionModalOpen: { transaction } })
      }
    >
      <div className="my-2 flex w-full justify-between rounded-md bg-blue-500 p-2">
        <div className="flex truncate">
          <div
            data-icon={transaction.category.name.split(" ")[0]}
            style={{
              backgroundColor: `#${transaction.category.color}`,
            }}
            className="relative z-0 mr-2 inline-block rounded-md py-1 px-1.5 before:absolute before:-z-[1] before:scale-150 before:blur-sm before:content-[attr(data-icon)]"
          >
            {transaction.category.name.split(" ")[0]}
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-4">{transaction.title}</p>
            <p className="text-xs text-gray-300">
              {new Date(transaction.purchaseDate).toLocaleTimeString("es", {
                hour12: true,
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="ml-2 flex">
          <div className="flex items-center">
            <p className="mr-2 flex items-center text-2xl">
              {transaction.from === "CASH" ? (
                "💵"
              ) : (
                <>
                  {"💳"}
                  <span className="pt-0.5 pl-1 font-mono text-[0.65rem] leading-4">
                    ({transaction.from})
                  </span>
                </>
              )}
            </p>
          </div>
          <div
            className={`${
              transaction.type === "plus"
                ? "bg-green-200 text-green-700"
                : "bg-red-300 text-red-700"
            } h-fit rounded-md p-0.5 text-xs font-medium`}
          >
            {/* @ts-ignore */}
            {CURRENCY_MAP[transaction.currency] ?? transaction.currency}
            {Intl.NumberFormat("en", {
              maximumFractionDigits: 2,
              minimumFractionDigits: Number.isInteger(+transaction.amount)
                ? 0
                : 2,
            }).format(+transaction.amount)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
