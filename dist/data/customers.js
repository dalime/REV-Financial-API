"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCustomers = exports.addNewCustomer = void 0;
const customers = [
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
const addNewCustomer = (name) => {
    const newCustomer = {
        id: customers.length + 1,
        name,
    };
    customers.push(newCustomer);
    return newCustomer;
};
exports.addNewCustomer = addNewCustomer;
/**
 * Returns the mock customer array
 * @returns Customer[]
 */
const getAllCustomers = () => {
    return customers;
};
exports.getAllCustomers = getAllCustomers;
//# sourceMappingURL=customers.js.map