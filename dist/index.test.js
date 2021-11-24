"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("./index"));
// To test the creation of Bank Accounts
describe('Bank Accounts Creation', () => {
    // Correct case
    it('should create a new account successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(index_1.default)
            .post('/account/3')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 400 });
        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual({
            id: 1,
            customer: 3,
            balance: 400,
            history: [],
        });
    }));
    // Edge case: Customer ID is omitted
    it('should display an error if no customer id is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(index_1.default)
            .post('/account')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 400 });
        expect(result.statusCode).toEqual(404);
    }));
    // Edge case: Invaid customer ID
    it('should display an error if an incorrect customer id is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(index_1.default)
            .post('/account/asdf')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 400 });
        expect(result.statusCode).toBe(400);
        expect(result.error).toBeTruthy();
        expect(result.text).toEqual('Please input a customer Id after /account/ in the URL');
    }));
    // Edge case: No deposit provided
    it('should display an error if no initial deposit is included', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(index_1.default)
            .post('/account/3')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(result.statusCode).toEqual(400);
        expect(result.error).toBeTruthy();
        expect(result.text).toEqual('Please add an initial deposit in the request body as "deposit"');
    }));
    // Edge case: Deposit is less than $1.00
    it('should display an error if an initial deposit is less than $1', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(index_1.default)
            .post('/account/3')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 0 });
        expect(result.statusCode).toEqual(400);
        expect(result.error).toBeTruthy();
        expect(result.text).toEqual('Please add an initial deposit in the request body as "deposit"');
    }));
    // Requirement: Multiple bank accounts for 1 customer ID
    it('should allow multiple bank accounts for 1 customer', () => __awaiter(void 0, void 0, void 0, function* () {
        const res1 = yield (0, supertest_1.default)(index_1.default)
            .post('/account/3')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 400 });
        const res2 = yield (0, supertest_1.default)(index_1.default)
            .post('/account/3')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 200 });
        expect(res1.statusCode).toEqual(200);
        expect(res2.statusCode).toEqual(200);
    }));
});
// To test the transfer of amounts between two accounts
describe('Transfer between Two Accounts', () => {
    // Requirement: Transfer should work between two accounts
    it('should successfully transfer an amount', () => __awaiter(void 0, void 0, void 0, function* () {
        const res1 = yield (0, supertest_1.default)(index_1.default)
            .post('/account/1')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 100 });
        const res2 = yield (0, supertest_1.default)(index_1.default)
            .post('/account/2')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 200 });
        const result = yield (0, supertest_1.default)(index_1.default)
            .post(`/transfer/${res2.body.id}/${res1.body.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ amount: 100 });
        expect(result.statusCode).toBe(200);
        expect(result.body.amount).toBe(100);
    }));
    // Edge case: Invaid URL params
    it('should fail if the URL params are not correct', () => __awaiter(void 0, void 0, void 0, function* () {
        const res2 = yield (0, supertest_1.default)(index_1.default)
            .post('/account/2')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 200 });
        const result = yield (0, supertest_1.default)(index_1.default)
            .post(`/transfer/${res2.body.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ amount: 100 });
        expect(result.statusCode).toBe(404);
    }));
    // Edge case: No amount for transfer provided
    it('should fail if an amount is not given', () => __awaiter(void 0, void 0, void 0, function* () {
        const res1 = yield (0, supertest_1.default)(index_1.default)
            .post('/account/1')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 100 });
        const res2 = yield (0, supertest_1.default)(index_1.default)
            .post('/account/2')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 200 });
        const result = yield (0, supertest_1.default)(index_1.default)
            .post(`/transfer/${res2.body.id}/${res1.body.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(result.statusCode).toBe(400);
        expect(result.text).toBe('Please add a valid amount as "amount" field in request body');
    }));
    // Edge case: Transfer between same account ID
    it('should fail if a transfer is attempted in the same account', () => __awaiter(void 0, void 0, void 0, function* () {
        const res1 = yield (0, supertest_1.default)(index_1.default)
            .post('/account/1')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 100 });
        const result = yield (0, supertest_1.default)(index_1.default)
            .post(`/transfer/${res1.body.id}/${res1.body.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ amount: 200 });
        expect(result.statusCode).toBe(400);
        expect(result.text).toBe('A transfer cannot be completed between the same account');
    }));
    // Requirement: Transfer between 2 accounts with same owner
    it('should successfully transfer between accounts from the same owner', () => __awaiter(void 0, void 0, void 0, function* () {
        const res1 = yield (0, supertest_1.default)(index_1.default)
            .post('/account/1')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 100 });
        const res2 = yield (0, supertest_1.default)(index_1.default)
            .post('/account/1')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 500 });
        const result = yield (0, supertest_1.default)(index_1.default)
            .post(`/transfer/${res2.body.id}/${res1.body.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ amount: 300 });
        expect(result.statusCode).toBe(200);
        expect(result.body.amount).toBe(300);
    }));
});
// To test retrieval of bank account balance(s)
describe('Retrieve bank account balance', () => {
    // Correct case
    it('should retrieve a valid bank account balance', () => __awaiter(void 0, void 0, void 0, function* () {
        const bankAccount = yield (0, supertest_1.default)(index_1.default)
            .post('/account/1')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 777 });
        const result = yield (0, supertest_1.default)(index_1.default)
            .get(`/account/balance/${bankAccount.body.id}`);
        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(777);
    }));
    // Edge case: Bank account ID not provided
    it('should error out if an account ID is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(index_1.default)
            .get(`/account/balance/`);
        expect(result.statusCode).toBe(404);
    }));
    // Edge case: Invalid account ID type provided
    it('should error out if a non-integer account ID is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(index_1.default)
            .get(`/account/balance/asdf`);
        expect(result.statusCode).toBe(400);
        expect(result.error).toBeTruthy();
        expect(result.text).toBe('Please add a valid account id in the URL string - /account/balance/:accountId');
    }));
    // Edge case: Bank Account ID not found
    it('should provide an error if the account is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, supertest_1.default)(index_1.default)
            .get(`/account/balance/999`);
        expect(result.statusCode).toBe(404);
        expect(result.error).toBeTruthy();
        expect(result.text).toBe('Unknown error. Could not retrieve bank account balance');
    }));
});
// To test retrieval of bank account transfer history
describe('Retrieve bank account transfer history', () => {
    // Correct case
    it('should retrieve bank account history', () => __awaiter(void 0, void 0, void 0, function* () {
        const acct1 = yield (0, supertest_1.default)(index_1.default)
            .post('/account/1')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 800 });
        const acct2 = yield (0, supertest_1.default)(index_1.default)
            .post('/account/1')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 200 });
        const acct3 = yield (0, supertest_1.default)(index_1.default)
            .post('/account/1')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 100 });
        yield (0, supertest_1.default)(index_1.default)
            .post(`/transfer/${acct1.body.id}/${acct2.body.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ amount: 300 });
        yield (0, supertest_1.default)(index_1.default)
            .post(`/transfer/${acct2.body.id}/${acct3.body.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ amount: 200 });
        const acct2History = yield (0, supertest_1.default)(index_1.default)
            .get(`/account/history/${acct2.body.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(acct2History.statusCode).toBe(200);
        expect(acct2History.body.length).toBe(2);
    }));
    // Edge case: No transfer history
    it('should retrieve empty account history', () => __awaiter(void 0, void 0, void 0, function* () {
        const acct = yield (0, supertest_1.default)(index_1.default)
            .post('/account/1')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ deposit: 800 });
        const acctHistory = yield (0, supertest_1.default)(index_1.default)
            .get(`/account/history/${acct.body.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(acctHistory.statusCode).toBe(200);
        expect(acctHistory.body.length).toBe(0);
    }));
    // Edge case: No account ID provided
    it('should error out if no account ID provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const acctHistory = yield (0, supertest_1.default)(index_1.default)
            .get(`/account/history`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(acctHistory.statusCode).toBe(404);
    }));
    // Edge case: Invalid account ID provided
    it('should error out if invalid account ID provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const acctHistory = yield (0, supertest_1.default)(index_1.default)
            .get(`/account/history/asdf`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(acctHistory.statusCode).toBe(400);
        expect(acctHistory.error).toBeTruthy();
        expect(acctHistory.text).toBe('Please provide valid accountId in URL - /account/history/:accountId');
    }));
    // Edge case: Account not found
    it('should error out if account is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const acctHistory = yield (0, supertest_1.default)(index_1.default)
            .get(`/account/history/999`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(acctHistory.statusCode).toBe(404);
        expect(acctHistory.error).toBeTruthy();
        expect(acctHistory.text).toBe('Could not find this bank account');
    }));
});
//# sourceMappingURL=index.test.js.map