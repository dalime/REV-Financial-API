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
app.get("/", (req, res) => {
    res.send("REV Financial Institution API");
});
// Creates a bank account for a given customer with an initial deposit
app.post("/account/:customerId", (req, res) => {
    const { deposit } = req.body;
    const { customerId } = req.params;
    if (!deposit) {
        res.status(400).send('Please add an initial deposit in the request body as "deposit"');
    }
    if (!customerId || !parseInt(customerId, 8)) {
        res.status(400).send('Please input a customer Id after /account/ in the URL');
    }
    const newBankAccount = (0, data_1.createBankAccount)(parseInt(customerId, 8), deposit);
    if (newBankAccount) {
        res.status(200).send(newBankAccount);
    }
    else {
        res.status(400).send('Unknown error: Could not create a bank account');
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