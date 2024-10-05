import React from 'react'
import { format } from 'date-fns'
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { RetroBoardHistory } from "@/types/retro"

interface HistoryDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  histories: RetroBoardHistory[]
  onSelectHistory: (id: number) => void
}

const HistoryDialog: React.FC<HistoryDialogProps> = ({
  isOpen,
  onOpenChange,
  histories,
  onSelectHistory
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retro Board History</DialogTitle>
          <DialogDescription>
            Select a history record to view past retro boards (up to 20 records shown)
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[300px] mt-4">
          {histories.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No history records found
            </div>
          ) : (
            <>
              <div className="flex justify-between px-4 py-2 font-semibold border-b">
                <span>Date</span>
                <span>Comments</span>
                <span>Deleted By</span>
              </div>
              {histories.map((history) => (
                <div
                  key={history.id}
                  className="flex justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onSelectHistory(history.id)}
                >
                  <span>{format(new Date(history.deletedAt), "yyyy-MM-dd HH:mm")}</span>
                  <span>{history.cards.length}</span>
                  <span>{history.deletedBy.name}</span>
                </div>
              ))}
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default HistoryDialog