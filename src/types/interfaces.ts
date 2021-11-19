export interface Customer {
  id: number
  name: string
}

export interface Customers {
  [key: number]: Customer
}

export interface Transfer {
  from: number
  to: number
  amount: number
  date: number
}

export interface BankAccount {
  id: number
  customer: number
  balance: number
  history: Transfer[]
}

export interface BankAccounts {
  [key: number]: BankAccount
}