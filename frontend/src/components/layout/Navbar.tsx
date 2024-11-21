// src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingCart } from 'lucide-react';
import { Menu } from '@headlessui/react';

export default function Navbar() {
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
      <span className={`px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100 
        ${router.pathname === href ? 'font-bold text-blue-500' : 'text-gray-600'}`}>
        {children}
      </span>
    </Link>
  );

  if (!mounted) return null;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-xl font-bold text-gray-800">Ebuy</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="/products">Products</NavLink>
            {isLoggedIn && (
              <>
                <NavLink href="/sell">Sell</NavLink>
                <NavLink href="/my-listings">My Listings</NavLink>
              </>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            {isLoggedIn && (
              <button
                onClick={() => router.push('/cart')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
            )}

            {/* Auth Buttons / User Menu */}
            {isLoggedIn ? (
              <Menu as="div" className="relative ml-3">
                <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
                    alt="User avatar"
                  />
                </Menu.Button>

                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link href="/profile">
                        <span className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}>
                          Profile
                        </span>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link href="/my-listings">
                        <span className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}>
                          My Listings
                        </span>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700`}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <span className="text-sm text-gray-600 hover:text-gray-900">Sign In</span>
                </Link>
                <Link href="/register">
                  <span className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600">
                    Sign Up
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}