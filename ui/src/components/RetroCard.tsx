import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HeartIcon, TrashIcon } from "lucide-react";
import { RetroCard } from '@/types/retro';
import { formatLocalTime } from '@/utils/dateUtils';
import { getAvatarUrl } from '@/utils/imageUtils';

interface RetroCardProps {
  card: RetroCard;
  onLike: (cardId: number) => void;
  onDelete: (cardId: number) => void;
  isHistoryMode: boolean;
  currentUserId: string | undefined;
}

const RetroCardComponent: React.FC<RetroCardProps> = ({
  card,
  onLike,
  onDelete,
  isHistoryMode,
  currentUserId
}) => {
  return (
    <Card className="mb-2 relative">
      <div className="px-2 pt-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onLike(card.id!)}
              className={card.likes.some(like => like.id === currentUserId) ? "text-red-500" : ""}
              disabled={isHistoryMode}
            >
              <HeartIcon className="h-4 w-4" />
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex -space-x-2 ml-2">
                    {card.likes.map((like) => (
                      <Avatar key={like.id} className="w-6 h-6 border-2 border-background">
                        <AvatarImage src={getAvatarUrl(like.id)} alt={like.name} />
                        <AvatarFallback>{like.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex flex-col">
                    {card.likes.map(like => (
                      <div key={like.id} className="flex items-center mb-2">
                        <Avatar className="w-6 h-6 mr-2">
                          <AvatarImage src={getAvatarUrl(like.id)} alt={like.name} />
                          <AvatarFallback className="text-black">{like.name[0] ?? '?'}</AvatarFallback>
                        </Avatar>
                        <span>{like.name}</span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {!isHistoryMode && currentUserId && (card.author?.id === currentUserId || card.isAnonymous) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(card.id!)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <CardContent className="pl-4 pr-4 pt-0 pb-1">
        <p className="whitespace-pre-wrap break-words">{card.content}</p>
      </CardContent>
      <div className="px-4 pb-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{card.isAnonymous ? "Anonymous" : card.author?.name}</span>
          <span>{formatLocalTime(card.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
};

export default RetroCardComponent;