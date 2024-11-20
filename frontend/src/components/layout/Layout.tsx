// frontend/src/components/layout/Layout.tsx
import { Box } from '@chakra-ui/react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box>
      <Navbar />
      <Box as="main" minH="calc(100vh - 60px)">
        {children}
      </Box>
    </Box>
  );
}