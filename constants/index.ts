export const MONEY_TRACKER_API = process.env.NEXT_PUBLIC_API_URL;

export const MONTHLY_SAVING_GOAL = 1600;
export const MINIMUM_MONTHLY_INCOME = 3150;

export const CATEGORIES = [
  { id: 1, name: "🃏 Miscelánea", color: "EEE0DD", appColor: "stone" },
  { id: 2, name: "🥖 Alimentos", color: "F9CE58", appColor: "yellow" },
  { id: 3, name: "🍣 Restaurante", color: "F99558", appColor: "orange" },
  { id: 4, name: "🏋️‍♂️ Gimnasio", color: "F958A6", appColor: "pink" },
  { id: 5, name: "🧼 Belleza", color: "C8F958", appColor: "lime" },
  { id: 6, name: "🍾 Salidas", color: "58F9EC", appColor: "cyan" },
  { id: 7, name: "🏂 Experiencias", color: "4169e1", appColor: "blue" },
  { id: 8, name: "🚈 Transporte", color: "74747e", appColor: "gray" },
  { id: 9, name: "🛍 Ropa", color: "E1415B", appColor: "rose" },
  { id: 10, name: "🏠 Hospedaje", color: "E1A641", appColor: "amber" },
  { id: 11, name: "💸 Income", color: "157811", appColor: "emerald" },
] as const;

export const CATEGORIES_MAPPER = CATEGORIES.reduce((acc, cVal) => {
  acc[cVal.id] = cVal;
  return acc;
}, {} as Record<typeof CATEGORIES[number]["id"], typeof CATEGORIES[number]>);
