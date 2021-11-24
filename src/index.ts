import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { createBankAccount, createTransfer, retrieveBalance, getAccountHistory, } from './data';

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

// Genesis route for API
// GET
app.get("/", (req: Request, res: Response) => {
  res.send("REV Financial Institution API");
});

// Creates a bank account for a given customer with an initial deposit
// POST
app.post("/account/:customerId", (req: Request, res: Response) => {
  const { deposit } = req.body;
  const { customerId } = req.params;
  if (!deposit) {
    res.status(400).send('Please add an initial deposit in the request body as "deposit"');
  }
  if (Number.isNaN(parseInt(customerId, 10))) {
    res.status(400).send('Please input a customer Id after /account/ in the URL');
  }
  const newBankAccount = createBankAccount(parseInt(customerId, 10), deposit);
  if (newBankAccount) {
    res.status(200).send(newBankAccount);
  } else {
    res.status(400).send('Unknown error: Could not create a bank account');
  }
});

// Transfers an amount from one bank account to another
// POST
app.post("/transfer/:from/:to", (req: Request, res: Response) => {
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
  const newTransfer = createTransfer(parseInt(from, 10), parseInt(to, 10), amount);
  if (newTransfer) {
    res.status(200).send(newTransfer);
  } else {
    res.status(400).send('Unknown error: Could not complete transfer');
  }
});

// Retrieves balances for a given account
// GET
app.get('/account/balance/:accountId', (req: Request, res: Response) => {
  const { accountId } = req.params;
  if (Number.isNaN(parseInt(accountId, 10))) {
    res.status(400).send('Please add a valid account id in the URL string - /account/balance/:accountId');
  }
  const accountBalance = retrieveBalance(parseInt(accountId, 10));
  if (accountBalance === null) {
    res.status(404).send('Unknown error. Could not retrieve bank account balance');
  }
  res.status(200).json(accountBalance);
});

// Retrieve transfer history for a given account
app.get('/account/history/:accountId', (req: Request, res: Response) => {
  const { accountId } = req.params;
  if (Number.isNaN(parseInt(accountId, 10))) {
    res.status(400).send('Please provide valid accountId in URL - /account/history/:accountId');
  }
  const accountHistory = getAccountHistory(parseInt(accountId, 10));
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

export default app;