"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountHistory = exports.retrieveBalance = exports.createTransfer = exports.createBankAccount = void 0;
const accounts = {};
/**
 * Creates a new bank account for a customer
 * @param customer number
 * @param deposit number
 * @returns BankAccount
 */
const createBankAccount = (customer, deposit) => {
    const newId = Object.keys(accounts).length + 1;
    const newAccount = {
        id: Object.keys(accounts).length + 1,
        customer,
        balance: deposit,
        history: [],
    };
    accounts[newId] = newAccount;
    return newAccount;
};
exports.createBankAccount = createBankAccount;
/**
 * Creates a bank transfer between two accounts
 * @param from number
 * @param to number
 * @param amount number
 * @returns Transfer
 */
const createTransfer = (from, to, amount) => {
    const newTransfer = {
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
    accounts[from] = Object.assign(Object.assign({}, fromAccount), { balance: newFromBalance, history: fromAccountHistory });
    accounts[to] = Object.assign(Object.assign({}, toAccount), { balance: newToBalance, history: toAccountHistory });
    return newTransfer;
};
exports.createTransfer = createTransfer;
/**
 * Gets the balance of an account by id
 * @param id number
 * @returns number | null
 */
const retrieveBalance = (id) => {
    if (accounts[id] && accounts[id].balance) {
        return accounts[id].balance;
    }
    else {
        return null;
    }
};
exports.retrieveBalance = retrieveBalance;
/**
 * Gets the transfer history of an account by id
 * @param id number
 * @returns Transfer[] | null
 */
const getAccountHistory = (id) => {
    if (accounts[id] && typeof accounts[id].history === 'object') {
        return accounts[id].history;
    }
    else {
        return null;
    }
};
exports.getAccountHistory = getAccountHistory;
//# sourceMappingURL=accounts.js.map