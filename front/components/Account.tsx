"use client";
import React from "react";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { User } from "@/types/auth.type";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { copyToClipboard } from "@/utils/copy-to-clipboard.util";
import { getAvatarFallback } from "@/utils/avatar-fallback.util";

const Account = () => {
  const user_ = localStorage.getItem("user");
  const user: User = user_ ? JSON.parse(user_) : undefined;

  return (
    <DialogContent className="dark">
      <DialogHeader>
        <DialogTitle>Ваш аккаунт</DialogTitle>
      </DialogHeader>
      <section className="flex justify-between">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-15 w-15 rounded-full dark">
            <AvatarImage src={user?.avatarUrl} alt={user?.nickName} />
            <AvatarFallback className="rounded-full text-lg">
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-lg leading-tight">
            <span className="truncate font-medium">{`@${user?.nickName}`}</span>
            <span
              onClick={(e) => copyToClipboard<HTMLSpanElement>(e, user.email)}
              className="text-sm text-neutral-600 cursor-pointer transition-colors hover:text-neutral-300"
            >
              {user?.email}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1 justify-center">
          <span
            onClick={(e) =>
              copyToClipboard<HTMLSpanElement>(e, user?.id.toString())
            }
            className="text-sm text-neutral-600 max-w-15 truncate cursor-pointer transition-colors hover:text-neutral-300"
          >
            id: {user?.id}
          </span>
          <span className="text-sm text-neutral-600">
            {" "}
            {new Date(user?.createdAt).toLocaleDateString()}
          </span>
        </div>
      </section>
    </DialogContent>
  );
};

export default Account;
