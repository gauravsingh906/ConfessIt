'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 bg-gray-700 text-white shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" passHref className="text-2xl font-bold mb-4 md:mb-0 hover:text-gray-400 transition-colors">

          Anonymous Feedback

        </Link>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <span className="text-lg md:text-xl font-semibold">
                Welcome, {user.username || user.email}
              </span>
              <Button
                onClick={() => signOut()}
                className="bg-slate-100 text-black hover:bg-gray-200"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (<>
            <Link href="/u/gaurav" passHref>
              <Button className="bg-slate-100 text-black hover:bg-gray-200" variant="outline">
                Secret Dispatch
              </Button>
            </Link>
            <Link href="/sign-in" passHref>
              <Button className="bg-slate-100 text-black hover:bg-gray-200" variant="outline">
                Login
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
