import { MersenneTwister19937, Random } from "random-js"

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

export const random = new Random(MersenneTwister19937.autoSeed());

export const roll = () => random.integer(100, 500);
