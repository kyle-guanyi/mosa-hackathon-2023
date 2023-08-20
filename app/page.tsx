"use client";

import Image from 'next/image';

import { useState, useEffect } from 'react';
import { signIn, useSession, getProviders } from 'next-auth/react';
import { useRouter } from "next/navigation";

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };

    setUpProviders();
  }, []);

  const handleLoggedIn = () => {
    router.push(`/home`)
  };

  useEffect(() => {
    if (session?.user) {
      handleLoggedIn();
    }
  }, [session]);

  return (
    <div className="flex-center flex-col">
        <div>
          <section className="w-full flex-center">
            <Image
              className="image-contain"
              src="/assets/images/logo.png"
              alt="Founding Friends Logo"
              width={720}
              height={37}
            />
          </section>
          <div className="flex justify-center space-x-4 mt-4">
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="blue_btn pointer-events-auto"
                >
                  Log In
                </button>
              ))}
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="red_btn pointer-events-auto"
                >
                  Sign Up
                </button>
              ))}
          </div>
        </div>
    </div>
  );
};

export default Home;
