import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import reviewRouter, { resetReviews } from './review';
import { reviews as seedReviews } from '../seedData';

let app: express.Express;

describe('Review API', () => {
    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/products/:productId', reviewRouter);
        resetReviews();
    });

    describe('GET /products/:productId/reviews', () => {
        it('should get all reviews for a product', async () => {
            const response = await request(app).get('/products/1/reviews');
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.every((r: any) => r.productId === 1)).toBe(true);
        });

        it('should sort reviews by recent by default', async () => {
            const response = await request(app).get('/products/1/reviews');
            expect(response.status).toBe(200);
            const dates = response.body.map((r: any) => new Date(r.createdAt).getTime());
            const sortedDates = [...dates].sort((a, b) => b - a);
            expect(dates).toEqual(sortedDates);
        });

        it('should sort reviews by highest rating', async () => {
            const response = await request(app).get('/products/1/reviews?sort=highest');
            expect(response.status).toBe(200);
            const ratings = response.body.map((r: any) => r.rating);
            const sortedRatings = [...ratings].sort((a, b) => b - a);
            expect(ratings).toEqual(sortedRatings);
        });

        it('should sort reviews by most helpful', async () => {
            const response = await request(app).get('/products/1/reviews?sort=helpful');
            expect(response.status).toBe(200);
            const helpful = response.body.map((r: any) => r.helpful);
            const sortedHelpful = [...helpful].sort((a, b) => b - a);
            expect(helpful).toEqual(sortedHelpful);
        });

        it('should return empty array for product with no reviews', async () => {
            const response = await request(app).get('/products/999/reviews');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe('POST /products/:productId/reviews', () => {
        it('should create a new review', async () => {
            const newReview = {
                rating: 5,
                title: "Great product!",
                body: "This product exceeded my expectations.",
                authorName: "Test User"
            };
            const response = await request(app)
                .post('/products/1/reviews')
                .send(newReview);
            
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject({
                productId: 1,
                rating: 5,
                title: "Great product!",
                body: "This product exceeded my expectations.",
                authorName: "Test User",
                helpful: 0
            });
            expect(response.body.reviewId).toBeDefined();
            expect(response.body.createdAt).toBeDefined();
        });

        it('should reject review with missing required fields', async () => {
            const response = await request(app)
                .post('/products/1/reviews')
                .send({ rating: 5, title: "Test" });
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Missing required fields');
        });

        it('should reject review with invalid rating', async () => {
            const newReview = {
                rating: 6,
                title: "Test",
                body: "Test body",
                authorName: "Test User"
            };
            const response = await request(app)
                .post('/products/1/reviews')
                .send(newReview);
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Rating must be between 1 and 5');
        });

        it('should reject review with title too long', async () => {
            const newReview = {
                rating: 5,
                title: "a".repeat(101),
                body: "Test body",
                authorName: "Test User"
            };
            const response = await request(app)
                .post('/products/1/reviews')
                .send(newReview);
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Title must be 100 characters or less');
        });

        it('should reject review with body too long', async () => {
            const newReview = {
                rating: 5,
                title: "Test",
                body: "a".repeat(2001),
                authorName: "Test User"
            };
            const response = await request(app)
                .post('/products/1/reviews')
                .send(newReview);
            
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Body must be 2000 characters or less');
        });
    });

    describe('GET /products/:productId/rating-summary', () => {
        it('should get rating summary for a product', async () => {
            const response = await request(app).get('/products/1/rating-summary');
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('averageRating');
            expect(response.body).toHaveProperty('totalReviews');
            expect(response.body).toHaveProperty('distribution');
            expect(response.body.averageRating).toBeGreaterThan(0);
            expect(response.body.totalReviews).toBeGreaterThan(0);
        });

        it('should have correct distribution structure', async () => {
            const response = await request(app).get('/products/1/rating-summary');
            expect(response.status).toBe(200);
            expect(response.body.distribution).toHaveProperty('5');
            expect(response.body.distribution).toHaveProperty('4');
            expect(response.body.distribution).toHaveProperty('3');
            expect(response.body.distribution).toHaveProperty('2');
            expect(response.body.distribution).toHaveProperty('1');
        });

        it('should return zero values for product with no reviews', async () => {
            const response = await request(app).get('/products/999/rating-summary');
            expect(response.status).toBe(200);
            expect(response.body.averageRating).toBe(0);
            expect(response.body.totalReviews).toBe(0);
            expect(response.body.distribution).toEqual({
                5: 0, 4: 0, 3: 0, 2: 0, 1: 0
            });
        });

        it('should calculate correct average rating', async () => {
            const response = await request(app).get('/products/1/rating-summary');
            expect(response.status).toBe(200);
            
            // Verify the calculation
            const productReviews = seedReviews.filter(r => r.productId === 1);
            const expectedAvg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
            expect(response.body.averageRating).toBe(Math.round(expectedAvg * 10) / 10);
        });
    });
});
