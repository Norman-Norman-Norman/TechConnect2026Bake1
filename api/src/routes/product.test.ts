import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import productRouter from './product';

let app: express.Express;

describe('Product API - Delivery Estimates', () => {
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/products', productRouter);
  });

  it('should return delivery estimate for a valid product', async () => {
    const response = await request(app).get('/products/1/delivery-estimate');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('productId', 1);
    expect(response.body).toHaveProperty('supplierId');
    expect(response.body).toHaveProperty('estimatedDeliveryDate');
    expect(response.body).toHaveProperty('formattedDate');
    expect(response.body).toHaveProperty('displayText');
    expect(response.body).toHaveProperty('isSoon');
    expect(response.body.displayText).toMatch(/^Arrives by \w{3}, \w{3} \d{1,2}$/);
  });

  it('should return 404 for non-existent product', async () => {
    const response = await request(app).get('/products/999/delivery-estimate');
    expect(response.status).toBe(404);
  });

  it('should calculate different dates for different suppliers', async () => {
    // Product 1 is from supplier 3 (CatNip - 5 days)
    const response1 = await request(app).get('/products/1/delivery-estimate');
    // Product 3 is from supplier 2 (WhiskerWare - 2 days)
    const response3 = await request(app).get('/products/3/delivery-estimate');
    // Product 5 is from supplier 1 (PurrTech - 7 days)
    const response5 = await request(app).get('/products/5/delivery-estimate');

    expect(response1.status).toBe(200);
    expect(response3.status).toBe(200);
    expect(response5.status).toBe(200);

    const date1 = new Date(response1.body.estimatedDeliveryDate);
    const date3 = new Date(response3.body.estimatedDeliveryDate);
    const date5 = new Date(response5.body.estimatedDeliveryDate);

    // WhiskerWare (2 days) should be earliest
    expect(date3.getTime()).toBeLessThan(date1.getTime());
    // PurrTech (7 days) should be latest
    expect(date5.getTime()).toBeGreaterThan(date1.getTime());
  });
});
