"use client";

import { useEffect, useState } from "react";

export default function AuthErrorPage() {
  const [count, setCount] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    if (count === 0) {
      globalThis.location.href = "/";
    }

    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen">
      <p className="text-2xl font-bold">Error. Redirect in {count} seconds</p>
      <p className="text-xl">An error occurred, please try again later.</p>
    </div>
  );
}
