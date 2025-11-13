"use client";
import Link from "next/link";
import React from "react";
import { motion } from "motion/react";

const HelloPage = () => {
  const user = localStorage.getItem("user");
  const { nickName } = user ? JSON.parse(user) : undefined;

  return (
    <motion.main
      initial={{ y: 10, opacity: 0}}
      animate={{
        y: 0,
        opacity: 1, 
        transition: { duration: 0.5 },
      }}
      className="w-full h-[calc(100vh-105px)] flex justify-center items-center"
    >
      <section className="flex flex-col gap-5 justify-center text-center">
        <h1 className="font-unbounded font-medium md:text-3xl text-2xl">
          <motion.span
            style={{ display: "inline-block", transformOrigin: "70% 70%" }}
            animate={{
              rotate: [0, 14, -8, 14, -4, 10, 0],
            }}
            transition={{
              duration: 2.5,
              ease: [0.45, 0, 0.55, 1],
              repeat: Infinity,
              repeatDelay: 1.5,
            }}
            className="mr-3"
          >
            👋
          </motion.span>
          Привет, <span className="font-bold">@{nickName}</span>
        </h1>
        <div className="flex flex-col text-lg md:text-xl">
          <span>Добро пожаловать в твой рабочий кабинет!</span>
          <span>
            Здесь ты можешь управлять задачами и проектами вместе с командой.
          </span>
          <span>
            Начни работу с{" "}
            <Link
              className="text-neutral-400 underline transition-colors hover:text-white"
              href={"/dashboard/kanban/new"}
            >
              {" "}
              создания канбан-доски
            </Link>
          </span>
        </div>
      </section>
    </motion.main>
  );
};

export default HelloPage;
