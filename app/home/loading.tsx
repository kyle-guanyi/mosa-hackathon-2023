// @ts-nocheck
"use client";

import { Spinner } from "@chakra-ui/react";

/**
 * This is the loading page. It is displayed when the user is waiting for the page to load.
 *
 * @constructor - The loading page
 * @returns - The loading page
 */
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="fixed inset-0 flex-center flex-col">
      <Spinner size="xl" />
    </div>
  );
}
