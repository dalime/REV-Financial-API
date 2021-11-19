import express, { Request, Response } from 'express';
import { getAllCustomers } from './data';

const app = express();
const PORT = 8000;

// Genesis route for API
app.get("/", (req: Request, res: Response) => {
  res.send("REV Financial Institution API");
});

// Test route to get all customers
app.get("/customers", (req: Request, res: Response) => {
  // tslint:disable-next-line:no-console
  console.log('getting customers');
  const customers = getAllCustomers();
  if (customers) {
    res.status(200).send(customers);
  } else {
    res.status(400).send('Could not fetch customers');
  }
});

app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server is listening on PORT ${PORT}`);
});

export default app;