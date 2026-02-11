import { useQuery } from 'react-query';
import axios from 'axios';
import { api } from '../../../api/config';
import StarRating from '../../common/StarRating';

interface RatingSummary {
  averageRating: number;
  totalReviews: number;
}

interface ProductRatingProps {
  productId: number;
}

const fetchRatingSummary = async (productId: number): Promise<RatingSummary> => {
  const { data } = await axios.get(`${api.baseURL}${api.endpoints.ratingSummary(productId)}`);
  return data;
};

export default function ProductRating({ productId }: ProductRatingProps) {
  const { data: ratingSummary } = useQuery(
    ['ratingSummary', productId],
    () => fetchRatingSummary(productId),
    {
      staleTime: 30000, // Consider data fresh for 30 seconds
    }
  );

  if (!ratingSummary) {
    return null;
  }

  return (
    <div className="mb-3">
      <StarRating
        rating={ratingSummary.averageRating}
        totalReviews={ratingSummary.totalReviews}
        size="small"
        showCount={true}
      />
    </div>
  );
}
