import { Box, Image, Badge, Text, Stack, Button, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { formatPrice } from '../../utils/format';

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
    seller: {
      username: string;
    };
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      <Image
        src={product.images[0] || '/placeholder.png'}
        alt={product.title}
        height="200px"
        width="100%"
        objectFit="cover"
      />

      <Box p="6">
        <Box display="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="blue">
            {product.condition}
          </Badge>
          <Badge borderRadius="full" px="2" ml={2} colorScheme="green">
            {product.category}
          </Badge>
          {product.status !== 'ACTIVE' && (
            <Badge borderRadius="full" px="2" ml={2} colorScheme="red">
              {product.status}
            </Badge>
          )}
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          noOfLines={2}
        >
          {product.title}
        </Box>

        <Box color={textColor} fontSize="sm" mt={2} noOfLines={2}>
          {product.description}
        </Box>

        <Stack mt={4} direction="row" justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold" fontSize="xl">
            {formatPrice(product.price)}
          </Text>
          <Text fontSize="sm" color={textColor}>
            Seller: {product.seller.username}
          </Text>
        </Stack>

        <Button
          mt={4}
          width="full"
          colorScheme="blue"
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart functionality will be added later
            alert('Add to cart feature coming soon!');
          }}
        >
          Add to Cart
        </Button>
      </Box>
    </Box>
  );
};

export default ProductCard;