// pages/profile/edit.tsx
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Heading,
    Textarea,
    useToast,
  } from '@chakra-ui/react';
  import { useState, useEffect } from 'react';
  import { useRouter } from 'next/router';
  
  type ProfileFormData = {
    username: string;
    email: string;
    bio: string;
  };
  
  export default function EditProfilePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ProfileFormData>({
      username: '',
      email: '',
      bio: '',
    });
    const toast = useToast();
    const router = useRouter();
  
    // Fetch current profile data
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
          setFormData({
            username: data.username,
            email: data.email,
            bio: data.bio || '',
          });
        } catch (error) {
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            duration: 3000,
          });
        }
      };
  
      fetchProfile();
    }, [router, toast]);
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
  
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:3001/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update profile');
        }
  
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
          status: 'success',
          duration: 3000,
        });
  
        router.push('/profile');
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
  
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    return (
      <Container maxW="container.md" py={8}>
        <Stack spacing={8}>
          <Heading size="lg">Edit Profile</Heading>
          
          <Box p={6} borderWidth={1} borderRadius="lg">
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="username">
                  <FormLabel>Username</FormLabel>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </FormControl>
  
                <FormControl id="email">
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>
  
                <FormControl id="bio">
                  <FormLabel>Bio</FormLabel>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                  />
                </FormControl>
  
                <Stack direction="row" spacing={4} pt={4}>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/profile')}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Container>
    );
  }