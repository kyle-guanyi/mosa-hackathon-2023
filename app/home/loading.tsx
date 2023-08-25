"use client";

import { Spinner } from "@chakra-ui/react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="fixed inset-0 flex-center flex-col">
      <Spinner size="xl" />
    </div>
  );
}
