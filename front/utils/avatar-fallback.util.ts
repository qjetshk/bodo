import { User } from "@/types/auth.type";

export const getAvatarFallback = () => {
  const user_ = localStorage.getItem("user");
  const user: User = user_ ? JSON.parse(user_) : undefined;
  const avatarFallback = `${user?.nickName
    .slice(0, 1)
    .toLocaleLowerCase()}${user?.nickName
    .slice(user?.nickName.length - 1)
    .toLocaleLowerCase()}`;
  return avatarFallback;
};
