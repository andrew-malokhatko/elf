import React from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

// Define the Header component
const Header: React.FC<{ userName: string | undefined }> = ({ userName }) => {
  return (
    <header className="bg-primary text-white p-2 text-center">
      <h1 className="text-sm font-bold">
        🧝🧝 Signed in as {userName}, 
        <Link 
          className="text-emerald-300" 
          href={'/login'} 
          onClick={async (e) => {
            e.preventDefault();
            await signOut();
          }}
        >
          Sign out
        </Link> 
        🧝🧝
      </h1>
    </header>
  );
};

// Usage example
// Assuming `session` is available in your component
// <Header userName={session?.user.name} />

export default Header;