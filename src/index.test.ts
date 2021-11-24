import request from 'supertest';
import app from './index';

// To test the creation of Bank Accounts
describe('Bank Accounts Creation', () => {
  // Correct case
  it('should create a new account successfully', async () => {
    const result = await request(app)
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
  });
  // Edge case: Customer ID is omitted
  it('should display an error if no customer id is provided', async () => {
    const result = await request(app)
      .post('/account')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 400 });
    expect(result.statusCode).toEqual(404);
  });

  // Edge case: Invaid customer ID
  it('should display an error if an incorrect customer id is provided', async () => {
    const result = await request(app)
      .post('/account/asdf')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 400 });
    expect(result.statusCode).toBe(400);
    expect(result.error).toBeTruthy();
    expect(result.text).toEqual('Please input a customer Id after /account/ in the URL');
  });

  // Edge case: No deposit provided
  it('should display an error if no initial deposit is included', async () => {
    const result = await request(app)
      .post('/account/3')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(result.statusCode).toEqual(400);
    expect(result.error).toBeTruthy();
    expect(result.text).toEqual('Please add an initial deposit in the request body as "deposit"');
  });

  // Edge case: Deposit is less than $1.00
  it('should display an error if an initial deposit is less than $1', async () => {
    const result = await request(app)
      .post('/account/3')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 0 });
    expect(result.statusCode).toEqual(400);
    expect(result.error).toBeTruthy();
    expect(result.text).toEqual('Please add an initial deposit in the request body as "deposit"')
  });

  // Requirement: Multiple bank accounts for 1 customer ID
  it('should allow multiple bank accounts for 1 customer', async () => {
    const res1 = await request(app)
      .post('/account/3')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 400 });
    const res2 = await request(app)
      .post('/account/3')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 200 });
    expect(res1.statusCode).toEqual(200);
    expect(res2.statusCode).toEqual(200);
  });
});

// To test the transfer of amounts between two accounts
describe('Transfer between Two Accounts', () => {
  // Requirement: Transfer should work between two accounts
  it('should successfully transfer an amount', async () => {
    const res1 = await request(app)
      .post('/account/1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 100 });
    const res2 = await request(app)
      .post('/account/2')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 200 });
    const result = await request(app)
      .post(`/transfer/${res2.body.id}/${res1.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ amount: 100 });
    expect(result.statusCode).toBe(200);
    expect(result.body.amount).toBe(100);
  });

  // Edge case: Invaid URL params
  it('should fail if the URL params are not correct', async () => {
    const res2 = await request(app)
      .post('/account/2')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 200 });

    const result = await request(app)
      .post(`/transfer/${res2.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ amount: 100 });
    expect(result.statusCode).toBe(404);
  });

  // Edge case: No amount for transfer provided
  it('should fail if an amount is not given', async () => {
    const res1 = await request(app)
      .post('/account/1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 100 });
    const res2 = await request(app)
      .post('/account/2')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 200 });

    const result = await request(app)
      .post(`/transfer/${res2.body.id}/${res1.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(result.statusCode).toBe(400);
    expect(result.text).toBe('Please add a valid amount as "amount" field in request body');
  });

  // Edge case: Transfer between same account ID
  it('should fail if a transfer is attempted in the same account', async () => {
    const res1 = await request(app)
      .post('/account/1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 100 });

    const result = await request(app)
      .post(`/transfer/${res1.body.id}/${res1.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ amount: 200 });
    expect(result.statusCode).toBe(400);
    expect(result.text).toBe('A transfer cannot be completed between the same account');
  });

  // Requirement: Transfer between 2 accounts with same owner
  it('should successfully transfer between accounts from the same owner', async () => {
    const res1 = await request(app)
      .post('/account/1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 100 });
    const res2 = await request(app)
      .post('/account/1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 500 });

    const result = await request(app)
      .post(`/transfer/${res2.body.id}/${res1.body.id}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ amount: 300 });
    expect(result.statusCode).toBe(200);
    expect(result.body.amount).toBe(300);
  });
});

// To test retrieval of bank account balance(s)
describe('Retrieve bank account balance', () => {
  // Correct case
  it('should retrieve a valid bank account balance', async () => {
    const bankAccount = await request(app)
      .post('/account/1')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 777 });
    const result = await request(app)
      .get(`/account/balance/${bankAccount.body.id}`);
    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(777);
  });

  // Edge case: Bank account ID not provided
  it('should error out if an account ID is not provided', async () => {
    const result = await request(app)
      .get(`/account/balance/`);
    expect(result.statusCode).toBe(404);
  });

  // Edge case: Invalid account ID type provided
  it('should error out if a non-integer account ID is provided', async () => {
    const result = await request(app)
      .get(`/account/balance/asdf`);
    expect(result.statusCode).toBe(400);
    expect(result.error).toBeTruthy();
    expect(result.text).toBe('Please add a valid account id in the URL string - /account/balance/:accountId');
  });

  // Edge case: Bank Account ID not found
  it('should provide an error if the account is not found', async () => {
    const result = await request(app)
      .get(`/account/balance/999`);
    expect(result.statusCode).toBe(404);
    expect(result.error).toBeTruthy();
    expect(result.text).toBe('Unknown error. Could not retrieve bank account balance');
  });
});