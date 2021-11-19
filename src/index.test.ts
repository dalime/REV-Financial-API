import request from 'supertest';
import app from './index';

describe('Get all customers', () => {
  it('should fetch all customers as an object', async () => {
    const result = await request(app)
      .get('/customers');
    expect(result.statusCode).toEqual(200);
    expect(typeof result.body).toEqual('object');
  });

  it('should fetch the correct number of customers', async () => {
    const result = await request(app)
      .get('/customers');
    expect(Object.keys(result.body).length).toEqual(4);
  });
});