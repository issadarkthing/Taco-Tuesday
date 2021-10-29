import { MersenneTwister19937, Random } from "random-js"

export const currency = ":taco:";
export const BLUE_BUTTON = "🔵";

export function toNList(items: string[], start = 1) {
  if (items.length < 0) return "none";
  return items.map((x, i) => `${i + start}. ${x}`).join("\n");
}

export function bold(str: string | number) {
  return `**${str}**`;
}

export function inlineCode(str: string | number) {
  return `\`\`${str}\`\``;
}

export function formatFloat(num: number) {
  return num.toFixed(1);
}


export function formatPercent(num: number) {
  return `${(num * 100).toFixed(2)}%`
}

class InvalidNumber extends Error {}

export function validateNumber(amount: number) {
  if (Number.isNaN(amount)) {
    throw new InvalidNumber("not a valid number");
  }
}

class InsufficientBalance extends Error {}
class ZeroAmount extends Error {}

export function validateAmount(amount: number, balance: number) {
  if (amount > balance) {
    throw new InsufficientBalance("insufficient balance");
  } else if (amount <= 0) {
    throw new ZeroAmount("zero amount is not allowed");
  }
}

class InvalidIndex extends Error {}

export function validateIndex<T>(index: number, arr: T[]) {
  if (index < 0 || index > arr.length - 1) 
    throw new InvalidIndex(`cannot find item in index ${index + 1}`);
}

export const random = new Random(MersenneTwister19937.autoSeed());

export const roll = () => random.integer(1, 100);

export function sleep(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  })
}

function remove1<T>(item: T, arr: T[]) {
  const copy = [...arr];
  const index = copy.findIndex(x => x === item);

  if (index !== undefined) {
    copy.splice(index, 1);
  }

  return copy;
}

export function remove<T>(item: T, arr: T[], count = 1) {
  for (let i = 0; i < count; i++) {
    arr = remove1(item, arr);
  }

  return arr;
}
