import React from "react";
import { DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const NotificationsModal = () => {
  return (
    <DialogContent className="dark">
      <DialogHeader>
        <DialogTitle>Уведомления</DialogTitle>
      </DialogHeader>
      <section className="  ">
        <div className="text-center text-neutral-500 text-[16px]">
          Здесь пока ничего нет
        </div>
      </section>
    </DialogContent>
  );
};

export default NotificationsModal;
