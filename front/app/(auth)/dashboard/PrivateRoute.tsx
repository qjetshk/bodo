"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetMeQuery } from "@/store/auth";
import { Loader2 } from "lucide-react";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isLoading, isError } = useGetMeQuery();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace("/login");
    }
  }, [isError, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin size-8" />
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  return <>{children}</>;
}
