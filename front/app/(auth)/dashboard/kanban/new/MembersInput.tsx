'use client'
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldErrors, UseFormSetValue } from "react-hook-form";
import Member from "./Member";
import { toast } from "sonner";
import { Board } from "@/types/board.type";

export interface MemberType {
  id: string;
  email: string;
  nickName: string;
  avatarUrl?: string | null;
}

type Members = Board['members']

interface MembersInputProps {
  findMembersInput: string;
  setFindMembersInput: (value: string) => void;
  handleFindMembers: (value: string) => void;
  data?: { findMembers?: MemberType[] };
  loading?: boolean;
  errors: FieldErrors;
  setValue: UseFormSetValue<any>;
  formMembers: MemberType[]; 
  maxMembers?: number; 
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open dropdown when typing
  useEffect(() => {
    setIsDropdownOpen(findMembersInput.length > 0);
  }, [findMembersInput]);

  // Select member with limit
  const selectMember = (member: MemberType) => {
    if (selectedMembers.length >= maxMembers) {
      toast.error(`You can add up to ${maxMembers} members`, { duration: 1000 });
      return;
    }
    if (!selectedMembers.find((m) => m.id === member.id)) {
      const newMembers = [...selectedMembers, member];
      setSelectedMembers(newMembers);
      setValue("membersToAdd", newMembers.map((m) => m.id)); // only ids in the form
    }
    setFindMembersInput("");
  };

  // Remove selected member
  const removeMember = (id: string) => {
    const newMembers = selectedMembers.filter((m) => m.id !== id);
    setSelectedMembers(newMembers);
    setValue("membersToAdd", newMembers.map((m) => m.id));
  };

  // Filter out already selected members
  const filteredMembers = data?.findMembers?.filter(
    (m) => !selectedMembers.find((s) => s.id === m.id)
  );

  const filteredFilteredMembers = filteredMembers?.filter(
    (m) => !addedMembers.find(s => s.user.id === m.id)
  )

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Errors */}
      {errors.members?.message && typeof errors.members.message === "string" && (
        <p className="text-sm text-red-400 mb-1">{errors.members.message}</p>
      )}

      {/* Input */}
      <Input
        disabled={disabled}
        placeholder="Add members"
        value={findMembersInput}
        onChange={(e) => {
          setFindMembersInput(e.target.value);
          handleFindMembers(e.target.value);
        }}
      />

      {/* Dropdown */}
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
                    avatarUrl: member.avatarUrl ?? undefined, 
                  }} />
                </button>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="w-full text-center text-sm p-2 text-gray-500">
                Nothing found
              </div>
            )
          )}
        </div>
      )}

      {/* Selected members */}
      {selectedMembers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {selectedMembers.map((member) => (
            <div key={member.id} className="relative">
              <Member user={{
                ...member,
                avatarUrl: member.avatarUrl ?? undefined, 
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
