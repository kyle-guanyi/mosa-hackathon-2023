"use client";

import NextImage from 'next/image';

import { useState, useEffect } from 'react';
import { signIn, useSession, getProviders } from 'next-auth/react';
import { useRouter } from "next/navigation";

import {
  Button,
  Image,
  Spinner,
} from "@chakra-ui/react";

const LogIn = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };

    setUpProviders();
  }, []);

  useEffect(() => {
    if (session?.user) {
      router.push(`/home`)
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="fixed inset-0 flex-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex-center flex-col">
        <div>
          <section className="w-full flex-center ">
            <NextImage
              className="image-contain;"
              src="/assets/images/logo.png"
              alt="Founding Friends Logo"
              width={720}
              height={37}
            />
          </section>
          <div className="flex justify-center space-x-4 mt-4">
            {providers &&
              Object.values(providers).map((provider) => (
                <Button
                  type="button"
                  colorScheme="facebook"
                  isActive="true"
                  className="hover:opacity-80 mx-auto"
                  size="md"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                  leftIcon={<Image src="https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/5179d6b3-aa3f-403b-8cb4-718850815472.png?auto=format,compress&size=50" alt="Image" boxSize={4} />}
                >
                  Login with your UPenn Google Email
                </Button>
              ))}
          </div>
        </div>
    </div>
  );
};

export default LogIn;