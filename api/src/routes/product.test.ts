import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import productRouter from './product';
import { products as seedProducts } from '../seedData';

let app: express.Express;

describe('Product API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/products', productRouter);
    });

    it('should get all products', async () => {
        const response = await request(app).get('/products');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(seedProducts.length);
    });

    it('should filter products by category', async () => {
        const response = await request(app).get('/products?category=Feeding%20%26%20Hydration');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3);
        response.body.forEach((product: any) => {
            expect(product.category).toBe('Feeding & Hydration');
        });
    });

    it('should filter products by supplier', async () => {
        const response = await request(app).get('/products?supplier=1');
        expect(response.status).toBe(200);
        response.body.forEach((product: any) => {
            expect(product.supplierId).toBe(1);
        });
    });

    it('should filter products by price range', async () => {
        const response = await request(app).get('/products?minPrice=50&maxPrice=100');
        expect(response.status).toBe(200);
        response.body.forEach((product: any) => {
            const effectivePrice = product.discount ? product.price * (1 - product.discount) : product.price;
            expect(effectivePrice).toBeGreaterThanOrEqual(50);
            expect(effectivePrice).toBeLessThanOrEqual(100);
        });
    });

    it('should sort products by price ascending', async () => {
        const response = await request(app).get('/products?sort=price_asc');
        expect(response.status).toBe(200);
        for (let i = 0; i < response.body.length - 1; i++) {
            const priceA = response.body[i].discount 
                ? response.body[i].price * (1 - response.body[i].discount) 
                : response.body[i].price;
            const priceB = response.body[i + 1].discount 
                ? response.body[i + 1].price * (1 - response.body[i + 1].discount) 
                : response.body[i + 1].price;
            expect(priceA).toBeLessThanOrEqual(priceB);
        }
    });

    it('should sort products by price descending', async () => {
        const response = await request(app).get('/products?sort=price_desc');
        expect(response.status).toBe(200);
        for (let i = 0; i < response.body.length - 1; i++) {
            const priceA = response.body[i].discount 
                ? response.body[i].price * (1 - response.body[i].discount) 
                : response.body[i].price;
            const priceB = response.body[i + 1].discount 
                ? response.body[i + 1].price * (1 - response.body[i + 1].discount) 
                : response.body[i + 1].price;
            expect(priceA).toBeGreaterThanOrEqual(priceB);
        }
    });

    it('should sort products by name', async () => {
        const response = await request(app).get('/products?sort=name');
        expect(response.status).toBe(200);
        for (let i = 0; i < response.body.length - 1; i++) {
            expect(response.body[i].name.localeCompare(response.body[i + 1].name)).toBeLessThanOrEqual(0);
        }
    });

    it('should combine category and price filters', async () => {
        const response = await request(app).get('/products?category=Smart%20Monitoring&minPrice=70');
        expect(response.status).toBe(200);
        response.body.forEach((product: any) => {
            expect(product.category).toBe('Smart Monitoring');
            const effectivePrice = product.discount ? product.price * (1 - product.discount) : product.price;
            expect(effectivePrice).toBeGreaterThanOrEqual(70);
        });
    });

    it('should get a product by ID', async () => {
        const response = await request(app).get('/products/1');
        expect(response.status).toBe(200);
        expect(response.body.productId).toBe(1);
        expect(response.body.category).toBeDefined();
    });

    it('should return 404 for non-existing product', async () => {
        const response = await request(app).get('/products/999');
        expect(response.status).toBe(404);
    });

    it('should create a new product with category', async () => {
        const newProduct = {
            productId: 99,
            supplierId: 1,
            name: "Test Product",
            description: "Test description",
            price: 99.99,
            sku: "TEST-001",
            unit: "piece",
            imgName: "test.png",
            category: "Smart Monitoring"
        };
        const response = await request(app).post('/products').send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body.category).toBe("Smart Monitoring");
    });
});
