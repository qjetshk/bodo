import { useEffect, useState } from "react";
import { User } from "@/types/auth.type";

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    try {
      const parsed: User = JSON.parse(raw);
      setUser(parsed);
    } catch (err) {
      console.error("Ошибка при парсинге user:", err, raw);
      setUser(null);
    }
  }, []);

  return {user};
};
