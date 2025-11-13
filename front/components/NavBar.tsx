"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { User } from "@/types/auth.type";
import { getAvatarFallback } from "@/utils/avatar-fallback.util";

const NavBar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <nav className="flex gap-5 items-center">
        <Link className="sm:block hidden" href={"/register"}>
          <Button className="bg-transparent" variant={"outline"}>
            Зарегистрироваться
          </Button>
        </Link>
        <Link href={"/login"}>
          <Button variant={"secondary"}>Войти</Button>
        </Link>
      </nav>
    );
  } else {


    return (
      <nav className="flex gap-5 items-center">
        <Link href={"/dashboard"} className="flex gap-2 items-center">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg dark">
              <AvatarImage src={user.avatarUrl} alt={user.nickName} />
              <AvatarFallback className="rounded-lg">{getAvatarFallback()}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{`@${user.nickName}`}</span>
            </div>
          </div>
        </Link>
      </nav>
    );
  }
};

export default NavBar;
