// @ts-nocheck
import groupBy from "array.prototype.groupby";
groupBy.shim();

Date.prototype.change = function (unit, quantity) {
  switch (unit) {
    case "year":
      this.setFullYear(this.getFullYear() + quantity);
      break;
    case "month":
      this.setMonth(this.getMonth() + quantity);
      break;
    case "day":
      this.setDate(this.getDate() + quantity);
      break;
  }
  return this;
};

Date.prototype.clone = function () {
  return new Date(+this);
};

Date.prototype.getAbsMonth = function (type) {
  switch (type) {
    case "begin":
      return new Date(
        Date.UTC(
          this.getFullYear(),
          this.getMonth(),
          1,
          0 + (process.env.UTC_OFFSET ? +process.env.UTC_OFFSET : 0),
          0,
          0,
          0
        )
      );
    case "end":
      return new Date(
        Date.UTC(
          this.getFullYear(),
          this.getMonth() + 1,
          0,
          23 + (process.env.UTC_OFFSET ? +process.env.UTC_OFFSET : 0),
          59,
          59,
          999
        )
      );
  }
};

Date.prototype.diff = function (date, unit) {
  const diff_ms = date.getTime() - this.getTime();
  switch (unit) {
    case "year":
      return new Date(diff_ms).getUTCFullYear() - 1970;
    case "day":
      return Math.floor(diff_ms / 1000 / 60 / 60 / 24);
  }
};

Date.prototype.format = function ({ firstUpperCase, ...options }) {
  const dateDisplay = Intl.DateTimeFormat("es", options).format(this);
  if (firstUpperCase)
    return `${dateDisplay.charAt(0).toUpperCase()}${dateDisplay.slice(1)}`;
  return dateDisplay;
};

console.bgRed = "\x1b[41m";
console.fgWhite = "\x1b[37m";
console.reset = "\x1b[0m";

export {};
