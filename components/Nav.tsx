"use client";

import Link from 'next/link';
import Image from 'next/image';

const Nav = () => {

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

        <Link href="/" className="flex flex-center">
            <p className="about_text">About</p>
        </Link> 
    </nav>
  )
}

export default Nav