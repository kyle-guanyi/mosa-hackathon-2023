"use client";

import { SessionProvider } from "next-auth/react";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";

/**
 * This component is used to render a provider.
 *
 * @param children - A list of children
 * @param session - A session
 * @constructor - Renders a provider
 * @returns A provider
 */
const Provider = ({ children, session }) => {
  return (
    <CacheProvider>
      <ChakraProvider>
        <SessionProvider session={session}>{children}</SessionProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};

export default Provider;
