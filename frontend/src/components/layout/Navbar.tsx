import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Box,
  Flex,
  Text,
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
  HStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart, Package } from 'lucide-react'; // Import icons

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const NavLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <Link href={href} passHref>
      <Text
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
          textDecoration: 'none',
          bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        cursor="pointer"
        fontWeight={router.pathname === href ? 'bold' : 'normal'}
        color={router.pathname === href ? 'blue.500' : undefined}>
        {children}
      </Text>
    </Link>
  );

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
        {/* Logo */}
        <Flex flex={{ base: 1 }} justify={{ base: 'start', md: 'start' }}>
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

        {/* Navigation Links */}
        <HStack
          flex={{ base: 1 }}
          justify={'center'}
          display={{ base: 'none', md: 'flex' }}
          spacing={4}>
          <NavLink href="/products">Products</NavLink>
          {isLoggedIn && (
            <>
              <NavLink href="/sell">Sell</NavLink>
              <NavLink href="/my-listings">My Listings</NavLink>
            </>
          )}
        </HStack>

        {/* Right Section */}
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
          align={'center'}>
          
          {/* Cart Icon */}
          {isLoggedIn && (
            <Button
              variant={'ghost'}
              size={'sm'}
              leftIcon={<ShoppingCart />}
              onClick={() => router.push('/cart')}>
              Cart
            </Button>
          )}

          {/* Auth Buttons / User Menu */}
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
                <Link href="/my-listings" passHref>
                  <MenuItem as="a">My Listings</MenuItem>
                </Link>
                <Link href="/orders" passHref>
                  <MenuItem as="a">Orders</MenuItem>
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