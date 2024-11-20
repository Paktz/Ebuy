import {
    Box,
    Container,
    Stack,
    Heading,
    Button,
    useToast,
    Skeleton
  } from '@chakra-ui/react';
  import { useRouter } from 'next/router';
  import { useEffect, useState } from 'react';
  import Link from 'next/link';
  
  type Profile = {
    username: string;
    email: string;
    bio?: string;
    avatar?: string;
    // Add other profile fields as needed
  };
  
  export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const router = useRouter();
  
    useEffect(() => {
      const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
  
        try {
          const response = await fetch('http://localhost:3001/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch profile');
          }
  
          const data = await response.json();
          setProfile(data);
        } catch (error) {
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            duration: 3000,
          });
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchProfile();
    }, [router, toast]);
  
    if (isLoading) {
      return (
        <Container maxW="container.md" py={8}>
          <Stack spacing={4}>
            <Skeleton height="40px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        </Container>
      );
    }
  
    return (
      <Container maxW="container.md" py={8}>
        <Stack spacing={8}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Heading size="lg">Profile</Heading>
            <Link href="/profile/edit" passHref>
              <Button colorScheme="blue">Edit Profile</Button>
            </Link>
          </Box>
          
          {profile && (
            <Box p={6} borderWidth={1} borderRadius="lg">
              <Stack spacing={4}>
                <Box>
                  <Heading size="sm" color="gray.500">Username</Heading>
                  <Box mt={1}>{profile.username}</Box>
                </Box>
                
                <Box>
                  <Heading size="sm" color="gray.500">Email</Heading>
                  <Box mt={1}>{profile.email}</Box>
                </Box>
  
                {profile.bio && (
                  <Box>
                    <Heading size="sm" color="gray.500">Bio</Heading>
                    <Box mt={1}>{profile.bio}</Box>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </Container>
    );
  }