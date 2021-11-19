import express, { Request, Response } from 'express';

const app = express();
const PORT = 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server is listening on PORT ${PORT}`);
});