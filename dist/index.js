"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const data_1 = require("./data");
const app = (0, express_1.default)();
const PORT = 8000;
app.use(body_parser_1.default.json());
// Genesis route for API
// GET
app.get("/", (req, res) => {
    res.send("REV Financial Institution API");
});
// Creates a bank account for a given customer with an initial deposit
// POST
app.post("/account/:customerId", (req, res) => {
    const { deposit } = req.body;
    const { customerId } = req.params;
    if (!deposit) {
        res.status(400).send('Please add an initial deposit in the request body as "deposit"');
    }
    if (Number.isNaN(parseInt(customerId, 10))) {
        res.status(400).send('Please input a customer Id after /account/ in the URL');
    }
    const newBankAccount = (0, data_1.createBankAccount)(parseInt(customerId, 10), deposit);
    if (newBankAccount) {
        res.status(200).send(newBankAccount);
    }
    else {
        res.status(400).send('Unknown error: Could not create a bank account');
    }
});
// Transfers an amount from one bank account to another
// POST
app.post("/transfer/:from/:to", (req, res) => {
    const { amount } = req.body;
    const { from, to } = req.params;
    if (!from || !to || Number.isNaN(parseInt(from, 10)) || Number.isNaN(parseInt(to, 10))) {
        res.status(400).send('Please structure the URL as /transfer/from-bank-account-id/to-bank-account-id');
    }
    if (!amount) {
        res.status(400).send('Please add a valid amount as "amount" field in request body');
    }
    if (from === to) {
        res.status(400).send('A transfer cannot be completed between the same account');
    }
    const newTransfer = (0, data_1.createTransfer)(parseInt(from, 10), parseInt(to, 10), amount);
    if (newTransfer) {
        res.status(200).send(newTransfer);
    }
    else {
        res.status(400).send('Unknown error: Could not complete transfer');
    }
});
// Retrieves balances for a given account
// GET
app.get('/account/balance/:accountId', (req, res) => {
    const { accountId } = req.params;
    if (Number.isNaN(parseInt(accountId, 10))) {
        res.status(400).send('Please add a valid account id in the URL string - /account/balance/:accountId');
    }
    const accountBalance = (0, data_1.retrieveBalance)(parseInt(accountId, 10));
    if (accountBalance === null) {
        res.status(404).send('Unknown error. Could not retrieve bank account balance');
    }
    res.status(200).json(accountBalance);
});
// Retrieve transfer history for a given account
app.get('/account/history/:accountId', (req, res) => {
    const { accountId } = req.params;
    if (Number.isNaN(parseInt(accountId, 10))) {
        res.status(400).send('Please provide valid accountId in URL - /account/history/:accountId');
    }
    const accountHistory = (0, data_1.getAccountHistory)(parseInt(accountId, 10));
    if (accountHistory === null) {
        res.status(404).send('Could not find this bank account');
    }
    res.status(200).json(accountHistory);
});
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        // tslint:disable-next-line:no-console
        console.log(`Server is listening on PORT ${PORT}`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map