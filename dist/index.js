"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_1 = require("./data");
const app = (0, express_1.default)();
const PORT = 8000;
const router = express_1.default.Router();
// Genesis route for API
router.get("/", (req, res) => {
    res.send("REV Financial Institution API");
});
// Test route to get all customers
router.get("/customers", (req, res) => {
    // tslint:disable-next-line:no-console
    console.log('getting customers');
    const customers = (0, data_1.getAllCustomers)();
    if (customers) {
        res.status(200).send(customers);
    }
    else {
        res.status(400).send('Could not fetch customers');
    }
});
app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server is listening on PORT ${PORT}`);
});
//# sourceMappingURL=index.js.map