import { Box, Container, Heading } from '@chakra-ui/react';
import ProductList from '../../components/products/ProductList';

const ProductsPage = () => {
  return (
    <Container maxW="7xl" py={8}>
      <Heading mb={8}>Browse Products</Heading>
      <ProductList />
    </Container>
  );
};

export default ProductsPage;