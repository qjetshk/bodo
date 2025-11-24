"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import Member from "./Member";
import { toast } from "sonner";
import { GetInitialBoardQuery } from "@/apollo/gql/graphql";
import { InitialBoard } from "@/components/board/SettingsForOwner";

export interface MemberType {
  id: string;
  email: string;
  nickName: string;
  avatarUrl?: string | null;
}

type Members = InitialBoard['members']

interface MembersInputProps {
  findMembersInput: string;
  setFindMembersInput: (value: string) => void;
  handleFindMembers: (value: string) => void;
  data?: { findMembers?: MemberType[] };
  loading?: boolean;
  errors: FieldErrors;
  setValue: UseFormSetValue<any>;
  formMembers: MemberType[]; // ← ОБЯЗАТЕЛЬНО!
  maxMembers?: number; // добавим опциональный лимит
  addedMembers?: Members,
  disabled?: boolean
}

export function MembersInput({
  findMembersInput,
  setFindMembersInput,
  handleFindMembers,
  data,
  loading,
  errors,
  setValue,
  maxMembers = 5,
  addedMembers = [],
  disabled
}: MembersInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedMembers, setSelectedMembers] = useState<MemberType[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Закрытие дропдауна при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Открытие дропдауна при вводе текста
  useEffect(() => {
    setIsDropdownOpen(findMembersInput.length > 0);
  }, [findMembersInput]);

  // Выбор участника с ограничением
  const selectMember = (member: MemberType) => {
    if (selectedMembers.length >= maxMembers) {
      toast.error(`Можно добавить не более ${maxMembers} участников`, { duration: 1000 });
      return;
    }
    if (!selectedMembers.find((m) => m.id === member.id)) {
      const newMembers = [...selectedMembers, member];
      setSelectedMembers(newMembers);
      setValue("membersToAdd", newMembers.map((m) => m.id)); // только id в форму
    }
    setFindMembersInput("");
  };

  // Удаление выбранного участника
  const removeMember = (id: string) => {
    const newMembers = selectedMembers.filter((m) => m.id !== id);
    setSelectedMembers(newMembers);
    setValue("membersToAdd", newMembers.map((m) => m.id));
  };

  // Фильтруем уже выбранных участников
  const filteredMembers = data?.findMembers?.filter(
    (m) => !selectedMembers.find((s) => s.id === m.id)
  );

  const filteredFilteredMembers = filteredMembers?.filter(
    (m) => !addedMembers.find(s => s.user.id === m.id)
  )

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Ошибки */}
      {errors.members?.message && typeof errors.members.message === "string" && (
        <p className="text-sm text-red-400 mb-1">{errors.members.message}</p>
      )}

      {/* Инпут */}
      <Input
        disabled={disabled}
        placeholder="Добавьте участников"
        value={findMembersInput}
        onChange={(e) => {
          setFindMembersInput(e.target.value);
          handleFindMembers(e.target.value);
        }}
      />

      {/* Дропдаун */}
      {isDropdownOpen && (
        <div className="p-2 absolute top-full left-0 w-full bg-neutral-800 border rounded-lg mt-1 shadow-lg z-50 max-h-60 overflow-y-auto">
          {loading && <Skeleton className="block z-50 h-9 w-full rounded-[5px] bg-neutral-700" />}
          {!loading && filteredMembers?.length ? (
            <div className="flex flex-col gap-1">
              {filteredFilteredMembers?.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => selectMember(member)}
                  className="text-left"
                >
                  <Member user={{
                    ...member,
                    avatarUrl: member.avatarUrl ?? undefined, // null -> undefined
                  }} />
                </button>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="w-full text-center text-sm p-2 text-gray-500">
                Ничего не найдено
              </div>
            )
          )}
        </div>
      )}

      {/* Выбранные участники */}
      {selectedMembers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {selectedMembers.map((member) => (
            <div key={member.id} className="relative">
              <Member user={{
                ...member,
                avatarUrl: member.avatarUrl ?? undefined, // null -> undefined
              }} />
              <button
                type="button"
                onClick={() => removeMember(member.id)}
                className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
              >
                <div className="absolute top-[-10%] left-[32%]">
                  x
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
