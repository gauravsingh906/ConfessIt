'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { Home, User as UserIcon, LogIn } from 'lucide-react'; // Importing icons

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="fixed top-0 left-0 right-0 mt-5 p-3 md:p-6 bg-transparent text-white transition duration-300 ease-in-out z-50">
      <div className="container mx-auto flex justify-between items-center w-full max-w-5xl px-4">

        {/* Increased size for the logo */}
        <Link href="/" passHref>
          <span className="text-4xl underline md:text-4xl font-extrabold text-black hover:text-gray-800 transition-transform transform hover:scale-110 duration-300 ease-in-out bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent">
            ConfessIt
          </span>
        </Link>

        {/* Menu links - Directly displayed on small screens */}
        <div className="hidden md:flex items-center space-x-4"> {/* For larger screens */}
          {session ? (
            <>
              <span className="block text-lg md:text-xl font-semibold text-black">
                Welcome, {user.username || user.email}
              </span>
              <Button
                onClick={() => signOut()}
                className="bg-transparent text-black hover:bg-gray-300 hover:text-black transition-all duration-300 ease-in-out transform hover:scale-105"
                variant="outline"
              >
                <UserIcon className="h-6 w-6 inline-block" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/u/gaurav" passHref>
                <Button className="bg-transparent text-black hover:bg-gray-300 hover:text-black transition-all duration-300 ease-in-out transform hover:scale-105" variant="outline">
                  <Home className="h-6  w-6 inline-block" />
                  Secret Dispatch
                </Button>
              </Link>
              <Link href="/sign-in" passHref>
                <Button className="bg-transparent ml-[-1] text-black hover:bg-gray-300 hover:text-black transition-all duration-300 ease-in-out transform hover:scale-105" variant="outline">
                  <LogIn className="h-6  w-6 inline-block" />
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Common border for icons - Displayed on both small and large screens */}
        <div className="flex items-center pr-4  p-1 space-x-1 md:hidden"> {/* For small screens */}
          {session ? (
            <>
              <Button
                onClick={() => signOut()}
                className="bg-transparent text-black hover:bg-gray-300 hover:text-black transition-all duration-300 ease-in-out transform hover:scale-105"
                variant="outline"
              >
                <UserIcon className="h-6 w-6 inline-block" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/u/gaurav" passHref>
                <Button className="bg-transparent text-black hover:bg-gray-300 hover:text-black transition-all duration-300 ease-in-out transform hover:scale-105">
                  <Home className="h-6 w-6 inline-block" />
                </Button>
              </Link>
              <Link href="/sign-in" passHref>
                <Button className="bg-transparent text-black hover:bg-gray-300 hover:text-black transition-all duration-300 ease-in-out transform hover:scale-105">
                  <LogIn className="h-6 w-6 inline-block" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
