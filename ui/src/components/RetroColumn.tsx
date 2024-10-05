import React from 'react';
import { RetroCard } from '@/types/retro';
import RetroCardComponent from './RetroCard';

interface RetroColumnProps {
  id: string;
  title: string;
  color: string;
  cards: RetroCard[];
  onCardLike: (cardId: number) => void;
  onCardDelete: (cardId: number) => void;
  isHistoryMode: boolean;
  currentUserId: string | undefined;
}

const RetroColumn: React.FC<RetroColumnProps> = ({
  id,
  title,
  color,
  cards,
  onCardLike,
  onCardDelete,
  isHistoryMode,
  currentUserId
}) => {
  return (
    <div className={`${color} p-4 rounded-lg overflow-auto`}>
      <h3 className="text-lg font-bold mb-2 font-heading">{title}</h3>
      {cards.filter(card => card.type === id).map((card) => (
        <RetroCardComponent
          key={card.id}
          card={card}
          onLike={onCardLike}
          onDelete={onCardDelete}
          isHistoryMode={isHistoryMode}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default RetroColumn;