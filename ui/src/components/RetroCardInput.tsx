import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface RetroCardInputProps {
  newCard: {
    type: string;
    content: string;
    isAnonymous: boolean;
  };
  onCardTypeChange: (value: string) => void;
  onCardContentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardAnonymousChange: (checked: boolean) => void;
  onCardSubmit: () => void;
  isSubmitEnabled: boolean;
  typesInfo: Array<{ id: string; title: string; indicatorColor: string }>;
}

const RetroCardInput: React.FC<RetroCardInputProps> = ({
  newCard,
  onCardTypeChange,
  onCardContentChange,
  onCardAnonymousChange,
  onCardSubmit,
  isSubmitEnabled,
  typesInfo
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isSubmitEnabled) {
      onCardSubmit();
    }
  };

  return (
    <>
      <Select value={newCard.type} onValueChange={onCardTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          {typesInfo.map((typeInfo) => (
            <SelectItem key={typeInfo.id} value={typeInfo.id} className="flex items-center">
              <div className={`w-3 h-3 mr-2 ${typeInfo.indicatorColor} inline-block rounded-full`}></div>
              <span className="inline">{typeInfo.title}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input
        placeholder="Enter your opinion"
        value={newCard.content}
        onChange={onCardContentChange}
        onKeyPress={handleKeyPress}
        className="flex-grow min-w-[200px]"
      />
      <div className="flex items-center">
        <Checkbox
          id="anonymous"
          checked={newCard.isAnonymous}
          onCheckedChange={onCardAnonymousChange}
        />
        <label htmlFor="anonymous" className="ml-2 hidden sm:inline">Anonymous</label>
      </div>
      <Button onClick={onCardSubmit} disabled={!isSubmitEnabled}>Submit</Button>
    </>
  );
};

export default RetroCardInput;