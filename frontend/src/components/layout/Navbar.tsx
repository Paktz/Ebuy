import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  useColorModeValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';



export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Only check localStorage after component mounts on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout(); 
    router.push('/login');
  };

  // Don't render anything until after client-side hydration
  if (!mounted) {
    return null;
  }

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
            fontWeight="bold"
            fontSize="xl">
            <Link href="/">
              Ebuy
            </Link>
          </Text>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          {isLoggedIn ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={':https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'}
                />
              </MenuButton>
              <MenuList>
                <Link href="/profile" passHref>
                  <MenuItem as="a">Profile</MenuItem>
                </Link>
                <Link href="/dashboard" passHref>
                  <MenuItem as="a">Dashboard</MenuItem>
                </Link>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button as="a" fontSize={'sm'} fontWeight={400} variant={'link'}>
                  Sign In
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button
                  as="a"
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'blue.400'}
                  _hover={{
                    bg: 'blue.500',
                  }}>
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}