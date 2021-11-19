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
    expect(result.statusCode).toEqual(400);
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
});