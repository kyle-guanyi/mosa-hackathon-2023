//@ts-nocheck
"use client";

import NextImage from "next/image";

import { useState, useEffect } from "react";
import { signIn, useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button, Image, Spinner } from "@chakra-ui/react";

/**
 * This is the login page.
 *
 * @constructor - The login page
 * @returns - The login page
 */
const LogIn = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [providers, setProviders] = useState(null);

  const queryParams = new URLSearchParams(window.location.search);
  const callbackUrl = queryParams.get("callbackUrl");

  // Check if callbackUrl matches the expected style
  const isEventCallback = /\/event\/([^/]+)/.test(callbackUrl);

  // Construct eventUrl conditionally
  const eventUrl = isEventCallback ? callbackUrl : "/home";

  // Fetches the providers
  useEffect(() => {
    const setUpProviders = async () => {
      const response = await getProviders();

      setProviders(response);
    };

    setUpProviders();
  }, []);

  // Redirects to the home page if the user is logged in
  useEffect(() => {
    if (session?.user) {
      router.push(`/home`);
    }
  }, [session, router]);

  // Displays a loading spinner if the session is loading
  // if (status === "loading") {
  //   return (
  //     <div className="fixed inset-0 flex-center">
  //       <Spinner size="xl" />
  //     </div>
  //   );
  // }
  // Displays the login page
  return (
    <div className="fixed inset-0 flex-center flex-col">
      <div>
        <section className="w-full flex-center ">
          <Image
            className="image-contain"
            src="https://i.imgur.com/Z49SyI3.png"
            alt="Founding Friends Logo"
            loading="lazy" // This enables lazy loading
          />
        </section>
        <div className="flex justify-center space-x-4 mt-4">
          {status === "loading" && !providers ? (
            <div className="inset-0 flex-center">
              <Spinner size="xl" />
            </div>
          ) : (
            providers &&
            Object.values(providers).map((provider) => (
              <Button
                type="button"
                colorScheme="facebook"
                isActive="true"
                className="hover:opacity-80 mx-auto"
                size="md"
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl: eventUrl })}
                leftIcon={
                  <Image
                    src="https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/5179d6b3-aa3f-403b-8cb4-718850815472.png?auto=format,compress&size=50"
                    alt="Image"
                    boxSize={4}
                  />
                }
              >
                Login with your UPenn Google Email
              </Button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LogIn;
