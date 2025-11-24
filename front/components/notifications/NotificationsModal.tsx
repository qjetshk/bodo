import React, { SetStateAction, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { GET_ALL_USER_BOARD_INVITATIONS } from "@/apollo/requests/invitation";
import { useQuery } from "@apollo/client/react";
import Notification from "./Notification";
import { ScrollArea } from "../ui/scroll-area";
import { Loader2 } from "lucide-react";

export const NotificationsModal = ({
  isOpened,
  onOpenChange,
}: {
  isOpened: boolean;
  onOpenChange: (value: boolean) => void;
}) => {
  const { data, loading, refetch } = useQuery(GET_ALL_USER_BOARD_INVITATIONS);

  useEffect(() => {
    if (isOpened) {
      refetch();
    }
  }, [isOpened, refetch]);

  const invitations = data?.getAllUserBoardInvitation || [];

  return (
    <Dialog open={isOpened} onOpenChange={onOpenChange}>
      <DialogContent className="dark pr-2 sm:max-w-[95%] md:max-w-[85%] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Уведомления</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] pr-4">
          {loading ? (
            <div className="w-full h-15 flex justify-center items-center">
              <Loader2 className="animate-spin size-8" />
            </div>
          ) : invitations.length > 0 ? (
            <div className="flex flex-col gap-4">
              {invitations.map((invitation) => (
                <Notification key={invitation.id} notification={invitation} />
              ))}
            </div>
          ) : (
            <div className="h-15 flex items-center justify-center text-neutral-500 text-[16px]">
              У вас нет новых уведомлений
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};