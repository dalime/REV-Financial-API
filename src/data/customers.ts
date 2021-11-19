import { Customer } from '../types';

const customers: Customer[] = [
  {
    "id": 1,
    "name": "Arisha Barron"
  },
  {
    "id": 2,
    "name": "Branden Gibson"
  },
  {
    "id": 3,
    "name": "Rhonda Church"
  },
  {
    "id": 4,
    "name": "Georgina Hazel"
  },
];

/**
 * Adds a new customer to the mock customer array
 * @param name string
 * @returns Customer
 */
export const addNewCustomer = (name: string): Customer => {
  const newCustomer: Customer = {
    id: customers.length + 1,
    name,
  };
  customers.push(newCustomer);
  return newCustomer;
}

/**
 * Returns the mock customer array
 * @returns Customer[]
 */
export const getAllCustomers = (): Customer[] => {
  return customers;
}