import { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { api } from '../../../api/config';
import { useTheme } from '../../../context/ThemeContext';
import StarRating from '../../common/StarRating';

interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  imgName: string;
  sku: string;
  unit: string;
  supplierId: number;
  discount?: number;
}

interface Review {
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

interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

const fetchReviews = async (productId: number, sort?: string): Promise<Review[]> => {
  const url = `${api.baseURL}${api.endpoints.reviews(productId)}${sort ? `?sort=${sort}` : ''}`;
  const { data } = await axios.get(url);
  return data;
};

const fetchRatingSummary = async (productId: number): Promise<RatingSummary> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.ratingSummary(productId)}`);
  return data;
};

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { darkMode } = useTheme();
  const [sortBy, setSortBy] = useState<string>('recent');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    body: '',
    authorName: ''
  });

  const { data: reviews } = useQuery(
    ['reviews', product.productId, sortBy],
    () => fetchReviews(product.productId, sortBy)
  );

  const { data: ratingSummary } = useQuery(
    ['ratingSummary', product.productId],
    () => fetchRatingSummary(product.productId)
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${api.baseURL}${api.endpoints.reviews(product.productId)}`,
        reviewForm
      );
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', body: '', authorName: '' });
      // Refresh reviews
      window.location.reload();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const getDistributionPercentage = (count: number) => {
    if (!ratingSummary || ratingSummary.totalReviews === 0) return 0;
    return (count / ratingSummary.totalReviews) * 100;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" 
      onClick={onClose}
    >
      <div 
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl transition-colors duration-300`}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={onClose}
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors duration-300`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product Image */}
        <div className={`${darkMode ? 'bg-gradient-to-t from-gray-700 to-gray-800' : 'bg-gradient-to-t from-gray-100 to-white'} rounded-lg mb-6 p-4`}>
          <img 
            src={`/${product.imgName}`} 
            alt={product.name}
            className="w-full h-auto object-contain max-h-[300px]"
          />
        </div>

        {/* Product Info */}
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4 transition-colors duration-300`}>
          {product.name}
        </h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-lg mb-6 transition-colors duration-300`}>
          {product.description}
        </p>

        {/* Rating Summary Section */}
        {ratingSummary && (
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 mb-6`}>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
              Customer Reviews
            </h3>
            
            <div className="flex items-start gap-8 mb-6">
              {/* Average Rating */}
              <div className="text-center">
                <div className={`text-5xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-2`}>
                  {ratingSummary.averageRating.toFixed(1)}
                </div>
                <StarRating rating={ratingSummary.averageRating} size="medium" showCount={false} />
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                  {ratingSummary.totalReviews} {ratingSummary.totalReviews === 1 ? 'review' : 'reviews'}
                </div>
              </div>

              {/* Distribution Bars */}
              <div className="flex-grow">
                {[5, 4, 3, 2, 1].map(stars => (
                  <div key={stars} className="flex items-center gap-2 mb-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} w-12`}>
                      {stars} star
                    </span>
                    <div className={`flex-grow h-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${getDistributionPercentage(ratingSummary.distribution[stars as keyof typeof ratingSummary.distribution])}%` }}
                      />
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} w-12 text-right`}>
                      {Math.round(getDistributionPercentage(ratingSummary.distribution[stars as keyof typeof ratingSummary.distribution]))}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg transition-colors"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>
        )}

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6 mb-6`}>
            <h4 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'} mb-4`}>
              Write Your Review
            </h4>
            
            {/* Rating Selector */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Rating *
              </label>
              <StarRating
                rating={reviewForm.rating}
                size="large"
                showCount={false}
                interactive={true}
                onRatingChange={(rating) => setReviewForm({ ...reviewForm, rating })}
              />
            </div>

            {/* Author Name */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Your Name *
              </label>
              <input
                type="text"
                required
                maxLength={50}
                value={reviewForm.authorName}
                onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-600 text-light border-gray-500' : 'bg-white text-gray-800 border-gray-300'} rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none`}
              />
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Review Title * (max 100 characters)
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-600 text-light border-gray-500' : 'bg-white text-gray-800 border-gray-300'} rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none`}
                placeholder="Sum up your experience"
              />
            </div>

            {/* Body */}
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Review * (max 2000 characters)
              </label>
              <textarea
                required
                maxLength={2000}
                rows={5}
                value={reviewForm.body}
                onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                className={`w-full px-4 py-2 ${darkMode ? 'bg-gray-600 text-light border-gray-500' : 'bg-white text-gray-800 border-gray-300'} rounded-lg border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none`}
                placeholder="Share your thoughts about this product..."
              />
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-accent text-white px-6 py-2 rounded-lg transition-colors"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className={`text-xl font-bold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
              Reviews
            </h4>
            
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-2 ${darkMode ? 'bg-gray-700 text-light border-gray-600' : 'bg-white text-gray-800 border-gray-300'} rounded-lg border focus:border-primary focus:outline-none`}
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-4">
            {reviews && reviews.length > 0 ? (
              reviews.map(review => (
                <div 
                  key={review.reviewId}
                  className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StarRating rating={review.rating} size="small" showCount={false} />
                        <h5 className={`font-semibold ${darkMode ? 'text-light' : 'text-gray-800'}`}>
                          {review.title}
                        </h5>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          by {review.authorName}
                        </span>
                        {review.verifiedPurchase && (
                          <span className="text-xs bg-primary text-white px-2 py-1 rounded">
                            Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    {review.body}
                  </p>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {review.helpful} {review.helpful === 1 ? 'person' : 'people'} found this helpful
                  </div>
                </div>
              ))
            ) : (
              <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'} py-8`}>
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
