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
    if (!parseInt(customerId, 10)) {
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
app.post("/transfer/:from/:to", (req, res) => {
    const { amount } = req.body;
    const { from, to } = req.params;
    if (!from || !to || typeof parseInt(from, 10) !== 'number' || typeof parseInt(to, 10) !== 'number') {
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
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        // tslint:disable-next-line:no-console
        console.log(`Server is listening on PORT ${PORT}`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map