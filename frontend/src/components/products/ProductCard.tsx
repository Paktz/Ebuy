import { useRouter } from 'next/router';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { showToast } from '../../utils/toast';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    condition: string;
    category: string;
    images: string[];
    status: string;
    quantity: number;
    seller: {
      username: string;
    };
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart, isLoading } = useCart();

  const handleClick = () => router.push(`/products/${product.id}`);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'SOLD':
        return 'bg-red-100 text-red-800';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoading) {
        await addToCart(product.id);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer transform hover:-translate-y-1"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img
          src={product.images[0] || '/placeholder.png'}
          alt={product.title}
          className="object-cover w-full h-48"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {product.condition}
          </span>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
            {product.category}
          </span>
          {product.status !== 'ACTIVE' && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
              {product.status}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-1 text-gray-900 line-clamp-2">
          {product.title}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price and Seller */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-gray-600">
            by {product.seller.username}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
        onClick={handleAddToCart}
        disabled={isLoading || product.status !== 'ACTIVE' || product.quantity === 0}
        className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Adding...' : 
         product.quantity === 0 ? 'Out of Stock' : 
         'Add to Cart'}
      </button>
      </div>
    </div>
  );
};

export default ProductCard;