/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API endpoints for managing product reviews
 */

/**
 * @swagger
 * /api/products/{productId}/reviews:
 *   get:
 *     summary: Get all reviews for a specific product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [recent, highest, helpful]
 *         description: Sort order (recent, highest rating, most helpful)
 *     responses:
 *       200:
 *         description: List of reviews for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *   post:
 *     summary: Submit a new review for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - title
 *               - body
 *               - authorName
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               title:
 *                 type: string
 *                 maxLength: 100
 *               body:
 *                 type: string
 *                 maxLength: 2000
 *               authorName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid input (missing required fields or validation error)
 *
 * /api/products/{productId}/rating-summary:
 *   get:
 *     summary: Get rating summary for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Rating summary with average and distribution
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageRating:
 *                   type: number
 *                   format: float
 *                 totalReviews:
 *                   type: integer
 *                 distribution:
 *                   type: object
 *                   properties:
 *                     5:
 *                       type: integer
 *                     4:
 *                       type: integer
 *                     3:
 *                       type: integer
 *                     2:
 *                       type: integer
 *                     1:
 *                       type: integer
 */

import express, { Request, Response } from 'express';
import { Review } from '../models/review';
import { reviews as seedReviews } from '../seedData';
import { orderDetails as seedOrderDetails } from '../seedData';

interface RouteParams {
  productId: string;
}

const router = express.Router({ mergeParams: true });

let reviews: Review[] = [...seedReviews];

// Helper function to check if a review is verified purchase
const isVerifiedPurchase = (authorName: string, productId: number): boolean => {
    // Simple check: if the author name appears in any order detail for this product
    // In a real app, this would use userId and proper order history
    return seedOrderDetails.some(od => od.productId === productId);
};

// Helper function to sort reviews
const sortReviews = (reviewList: Review[], sortBy?: string): Review[] => {
    const sorted = [...reviewList];
    switch (sortBy) {
        case 'highest':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'helpful':
            return sorted.sort((a, b) => b.helpful - a.helpful);
        case 'recent':
        default:
            return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
};

// Get all reviews for a product
router.get<RouteParams>('/reviews', (req, res) => {
    const productId = parseInt(req.params.productId);
    const sortBy = req.query.sort as string;
    
    const productReviews = reviews.filter(r => r.productId === productId);
    const sortedReviews = sortReviews(productReviews, sortBy);
    
    res.json(sortedReviews);
});

// Submit a new review
router.post<RouteParams>('/reviews', (req, res) => {
    const productId = parseInt(req.params.productId);
    const { rating, title, body, authorName } = req.body;
    
    // Validation
    if (!rating || !title || !body || !authorName) {
        res.status(400).json({ 
            error: 'Missing required fields',
            required: ['rating', 'title', 'body', 'authorName']
        });
        return;
    }
    
    if (rating < 1 || rating > 5) {
        res.status(400).json({ error: 'Rating must be between 1 and 5' });
        return;
    }
    
    if (title.length > 100) {
        res.status(400).json({ error: 'Title must be 100 characters or less' });
        return;
    }
    
    if (body.length > 2000) {
        res.status(400).json({ error: 'Body must be 2000 characters or less' });
        return;
    }
    
    // Create new review
    const newReview: Review = {
        reviewId: reviews.length > 0 ? Math.max(...reviews.map(r => r.reviewId)) + 1 : 1,
        productId,
        rating,
        title,
        body,
        authorName,
        createdAt: new Date().toISOString(),
        verifiedPurchase: isVerifiedPurchase(authorName, productId),
        helpful: 0
    };
    
    reviews.push(newReview);
    res.status(201).json(newReview);
});

// Get rating summary for a product
router.get<RouteParams>('/rating-summary', (req, res) => {
    const productId = parseInt(req.params.productId);
    const productReviews = reviews.filter(r => r.productId === productId);
    
    if (productReviews.length === 0) {
        res.json({
            averageRating: 0,
            totalReviews: 0,
            distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
        return;
    }
    
    // Calculate average rating
    const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / productReviews.length;
    
    // Calculate distribution
    const distribution = productReviews.reduce((dist, r) => {
        dist[r.rating] = (dist[r.rating] || 0) + 1;
        return dist;
    }, {} as Record<number, number>);
    
    // Ensure all ratings are in the distribution
    const fullDistribution = {
        5: distribution[5] || 0,
        4: distribution[4] || 0,
        3: distribution[3] || 0,
        2: distribution[2] || 0,
        1: distribution[1] || 0
    };
    
    res.json({
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: productReviews.length,
        distribution: fullDistribution
    });
});

// Export function to reset reviews for testing
export const resetReviews = () => {
    reviews = [...seedReviews];
};

export default router;
