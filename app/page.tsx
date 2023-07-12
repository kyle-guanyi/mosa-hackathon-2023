"use client";

import Image from "next/image";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Home = () => {
  const isUserLoggedIn = false;
  const { data: session } = useSession();

  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };

    setUpProviders();
  }, []);

  return (
    <div>
      {session?.user ? (
        <div>test</div>
      ) : (
        <div>
          <section className="w-full flex-center flex-col">
            <Image
              className="image-contain"
              src="/assets/images/logo.png"
              alt="Next.js Logo"
              width={720}
              height={37}
              priority
            />
          </section>
          <div className="flex justify-center space-x-4 mt-4">
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type="button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  className="blue_btn"
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
                  className="red_btn"
                >
                  Sign Up
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
