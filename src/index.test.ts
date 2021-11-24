import request from 'supertest';
import app from './index';

describe('Bank Accounts Creation', () => {
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

  it('should display an error if no customer id is provided', async () => {
    const result = await request(app)
      .post('/account')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ deposit: 400 });
    expect(result.statusCode).toEqual(404);
  });

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

  it('should display an error if no initial deposit is included', async () => {
    const result = await request(app)
      .post('/account/3')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(result.statusCode).toEqual(400);
    expect(result.error).toBeTruthy();
    expect(result.text).toEqual('Please add an initial deposit in the request body as "deposit"');
  });

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

describe('Transfer between Two Accounts', () => {
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