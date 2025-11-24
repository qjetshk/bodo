import { useCurrentUser } from "@/hooks/use-user";

export const getAvatarFallback = (nickName?: string) => {
  if (!nickName) {
    const {user} = useCurrentUser()
    const avatarFallback = `${user?.nickName
      .slice(0, 1)
      .toLocaleLowerCase()}${user?.nickName
        .slice(user?.nickName.length - 1)
        .toLocaleLowerCase()}`;
    return avatarFallback;
  }else{
    const avatarFallback = `${nickName
      .slice(0, 1)
      .toLocaleLowerCase()}${nickName
        .slice(nickName.length - 1)
        .toLocaleLowerCase()}`;
    return avatarFallback;
  }

};
