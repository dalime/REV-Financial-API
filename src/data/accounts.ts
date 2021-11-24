import { BankAccount, BankAccounts, Transfer } from "../types";

const accounts: BankAccounts = {};

/**
 * Creates a new bank account for a customer
 * @param customer number
 * @param deposit number
 * @returns BankAccount
 */
export const createBankAccount = (customer: number, deposit: number): BankAccount => {
  const newId: number = Object.keys(accounts).length + 1;
  const newAccount: BankAccount = {
    id: Object.keys(accounts).length + 1,
    customer,
    balance: deposit,
    history: [],
  };
  accounts[newId] = newAccount;
  return newAccount;
}

/**
 * Creates a bank transfer between two accounts
 * @param from number
 * @param to number
 * @param amount number
 * @returns Transfer
 */
export const createTransfer = (from: number, to: number, amount: number): Transfer => {
  const newTransfer: Transfer = {
    from,
    to,
    amount,
    date: Date.now(),
  };
  const fromAccount = accounts[from];
  const toAccount = accounts[to];
  const newFromBalance = fromAccount.balance - amount;
  const newToBalance = toAccount.balance + amount;
  const fromAccountHistory = [...fromAccount.history];
  fromAccountHistory.push(newTransfer);
  const toAccountHistory = [...toAccount.history];
  toAccountHistory.push(newTransfer);
  accounts[from] = { ...fromAccount, balance: newFromBalance, history: fromAccountHistory };
  accounts[to] = { ...toAccount, balance: newToBalance, history: toAccountHistory };
  return newTransfer;
}

/**
 * Gets the balance of an account by id
 * @param id number
 * @returns number
 */
export const retrieveBalance = (id: number): number | null => {
  if (accounts[id] && accounts[id].balance) {
    return accounts[id].balance;
  } else {
    return null;
  }
}

/**
 * Gets the transfer history of an account by id
 * @param id number
 * @returns Transfer[]
 */
export const getAccountHistory = (id: number): Transfer[] => {
  return accounts[id].history;
}