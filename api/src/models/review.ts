/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - reviewId
 *         - productId
 *         - rating
 *         - title
 *         - body
 *         - authorName
 *         - createdAt
 *       properties:
 *         reviewId:
 *           type: integer
 *           description: The unique identifier for the review
 *         productId:
 *           type: integer
 *           description: The product this review is for (FK to Product)
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Star rating (1-5)
 *         title:
 *           type: string
 *           maxLength: 100
 *           description: Review headline
 *         body:
 *           type: string
 *           maxLength: 2000
 *           description: Review text content
 *         authorName:
 *           type: string
 *           description: Display name of the reviewer
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: ISO date when the review was created
 *         verifiedPurchase:
 *           type: boolean
 *           description: Whether the reviewer actually purchased the product
 *         helpful:
 *           type: integer
 *           description: Number of helpful votes this review has received
 */
export interface Review {
    reviewId: number;
    productId: number;
    rating: number;
    title: string;
    body: string;
    authorName: string;
    createdAt: string;
    verifiedPurchase: boolean;
    helpful: number;
}
