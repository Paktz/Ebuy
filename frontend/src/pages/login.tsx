import { useAuth } from '../context/AuthContext';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Heading,
    Text,
    useToast,
    Container,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { useRouter } from 'next/router';
  import Link from 'next/link';
  
  // Make sure to use a proper function declaration for Next.js pages
  const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const { setIsLoggedIn } = useAuth();
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
        email: formData.get('email'),
        password: formData.get('password'),
        };
  
      try {
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.message || 'Login failed');
        }
  
        // Store token in localStorage
        localStorage.setItem('token', result.token);
        
        // Update global auth state
        setIsLoggedIn(true);

        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
        });
  
        router.push('/');
      } catch (error) {
        toast({
          title: 'Login failed',
          description: error.message,
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Container maxW="lg" py={{ base: 12, md: 24 }}>
        <Stack spacing={8}>
          <Stack align="center">
            <Heading fontSize="4xl">Welcome back</Heading>
            <Text fontSize="lg" color="gray.600">
              to continue to Ebuy ✌️
            </Text>
          </Stack>
          <Box
            rounded="lg"
            bg="white"
            boxShadow="lg"
            p={8}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input name="email" type="email" />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input name="password" type="password" />
                </FormControl>
                <Stack spacing={10}>
                  <Button
                    type="submit"
                    bg="blue.400"
                    color="white"
                    _hover={{
                      bg: 'blue.500',
                    }}
                    isLoading={isLoading}
                  >
                    Sign in
                  </Button>
                  <Text align="center">
                    Don't have an account?{' '}
                    <Link href="/register" style={{ color: 'blue' }}>
                      Register
                    </Link>
                  </Text>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    );
  };
  
  // Make sure to use default export
  export default LoginPage;
  