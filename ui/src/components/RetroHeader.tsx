import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HistoryIcon, ChevronRightIcon, ChevronLeftIcon } from "lucide-react";
import { User } from "@/types/retro";

interface RetroHeaderProps {
  user: User | null;
  isSidebarOpen: boolean;
  isHistoryMode: boolean;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onLoadHistories: () => void;
}

const RetroHeader: React.FC<RetroHeaderProps> = ({
  user,
  isSidebarOpen,
  isHistoryMode,
  onLogout,
  onToggleSidebar,
  onLoadHistories
}) => {
  return (
    <div className="relative flex justify-between items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="headerPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#headerPattern)" />
        </svg>
      </div>
      <div className="flex items-center space-x-2 relative z-10">
        <Image
          src="/favicon.svg"
          alt="Retro Board Logo"
          width={32}
          height={32}
          className="text-white"
        />
        <h1 className="text-2xl font-bold font-heading text-white">Retro Board</h1>
      </div>
      <div className="flex items-center space-x-4 relative z-10">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white">Hello, {user?.name}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.[0] ?? '?'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email ?? 'No email'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="ghost" size="icon" className="text-white" onClick={onLoadHistories}>
          <HistoryIcon className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white" 
          onClick={onToggleSidebar} 
          disabled={isHistoryMode}
        >
          {isSidebarOpen ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default RetroHeader;