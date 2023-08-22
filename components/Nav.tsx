"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

const Nav = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex-between w-full mb-16 pt-3 pl-3 pr-3 mx-auto">
      <Link href="/" className="flex gap-2 flex-center">
        <Image
          src="/assets/images/shield.png"
          alt="University of Pennsylvania Logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">Founding Friends</p>
      </Link>


      <div>
        {session?.user && (
          <a href="/create-event" className="flex flex-center">
          <button type ="button" className="blue_btn">Create Event</button>
          </a>
          
        )}
          
          
      </div>
      <div>
        {session?.user && (
          <a href="/profile" className="flex flex-center">
          <button type ="button" className="blue_btn">My Profile</button>
          </a>
          
        )}
          
          
      </div>

      <div>
        {session?.user ? (
          <button
            type="button"
            onClick={() => {
              signOut();
            }}
            className="red_btn"
          >
            Sign Out
          </button>
        ) : (
          <Link href="/about" className="flex flex-center">
            <p className="about_text">About</p>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Nav;
