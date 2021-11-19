import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { createBankAccount, } from './data';

const app = express();
const PORT = 8000;

app.use(bodyParser.json());

// Genesis route for API
app.get("/", (req: Request, res: Response) => {
  res.send("REV Financial Institution API");
});

// Creates a bank account for a given customer with an initial deposit
app.post("/account/:customerId", (req: Request, res: Response) => {
  const { deposit } = req.body;
  const { customerId } = req.params;
  if (!deposit) {
    res.status(400).send('Please add an initial deposit in the request body as "deposit"');
  }
  if (!customerId || !parseInt(customerId, 8)) {
    res.status(400).send('Please input a customer Id after /account/ in the URL');
  }
  const newBankAccount = createBankAccount(parseInt(customerId, 8), deposit);
  if (newBankAccount) {
    res.status(200).send(newBankAccount);
  } else {
    res.status(400).send('Unknown error: Could not create a bank account');
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log(`Server is listening on PORT ${PORT}`);
  });
}

export default app;