"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

import { authService } from "@/services/authService"
import { retroService } from "@/services/retroService"
import { User, RetroCard, ActionItem, RetroBoardHistory } from "@/types/retro"
import { showToast } from "@/utils/toast"
import ActionItemSidebar from '@/components/ActionItemSidebar'
import HistoryDialog from '@/components/HistoryDialog'
import RetroHeader from '@/components/RetroHeader'
import RetroCardInput from '@/components/RetroCardInput'
import RetroColumn from '@/components/RetroColumn'
import { Footer } from '@/components/Footer'

const typesInfo = [
  { id: "good", title: "Good", color: "bg-green-100", indicatorColor: "bg-green-300" },
  { id: "keep", title: "Keep", color: "bg-blue-100", indicatorColor: "bg-blue-300" },
  { id: "change", title: "Change", color: "bg-yellow-100", indicatorColor: "bg-yellow-300" },
  { id: "bad", title: "Bad", color: "bg-red-100", indicatorColor: "bg-red-300" },
]

export default function RetroBoard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [cards, setCards] = useState<RetroCard[]>([])
  const [newCard, setNewCard] = useState<Omit<RetroCard, 'id' | 'author' | 'likes'>>({
    type: "good",
    content: "",
    isAnonymous: false,
    createdAt: new Date().toISOString(),
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [editingActionItem, setEditingActionItem] = useState<ActionItem | null>(null)
  const router = useRouter()
  const [histories, setHistories] = useState<RetroBoardHistory[]>([])
  const [isHistoryMode, setIsHistoryMode] = useState(false)
  const [currentHistoryDate, setCurrentHistoryDate] = useState<string | null>(null)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  useEffect(() => {
    const checkLoginStatus = () => {
      const isUserLoggedIn = !!localStorage.getItem("user")
      setIsLoggedIn(isUserLoggedIn)
      if (isUserLoggedIn) {
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          loadData()
        }
      } else {
        router.push("/login")
      }
      setIsLoading(false)
    }

    checkLoginStatus()
  }, [router])

  const loadData = async () => {
    try {
      const loadedCards = await retroService.getCards()
      setCards(loadedCards)

      const loadedActionItems = await retroService.getActionItems()
      setActionItems(loadedActionItems)
    } catch (error) {
      console.error("Failed to load data:", error)
      showToast.error("Failed to load data. Please try again later.")
    }
  }

  const isSubmitEnabled = newCard.content.trim() !== ""

  const handleCardSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isSubmitEnabled && user) {
      try {
        const newCardData: RetroCard = { 
          ...newCard, 
          author: newCard.isAnonymous ? undefined : user,
          likes: [], 
          createdAt: new Date().toISOString()
        }
        await retroService.saveCard(newCardData)
        setCards(await retroService.getCards())
        setNewCard({ type: "good", content: "", isAnonymous: false, createdAt: new Date().toISOString() })
        showToast.success("Card added successfully.")
      } catch (error) {
        console.error("Failed to add card:", error)
        showToast.error("Failed to add card. Please try again.")
      }
    }
  }

  const handleCardDelete = async (cardId: number) => {
    const currentUser = authService.getCurrentUser();
    const cardToDelete = cards.find(card => card.id === cardId);

    if (!currentUser || !cardToDelete || (cardToDelete.author?.id !== currentUser.id && !cardToDelete.isAnonymous)) {
      showToast.error("You do not have permission to delete this card.");
      return;
    }

    try {
      const updatedCards = cards.filter(card => card.id !== cardId);
      await retroService.deleteCard(cardId);
      setCards(updatedCards);
      showToast.success("Card deleted successfully.");
    } catch (error) {
      console.error("Failed to delete card:", error);
      showToast.error("Failed to delete card. Please try again.");
    }
  }
  
  const handleCardLike = async (cardId: number) => {
    if (!user) return
    try {
      const updatedCards = cards.map(card => {
        if (card.id === cardId) {
          const likeIndex = card.likes.findIndex(like => like.id === user.id)
          if (likeIndex === -1) {
            return { ...card, likes: [...card.likes, user] }
          } else {
            return { ...card, likes: card.likes.filter(like => like.id !== user.id) }
          }
        }
        return card
      })
      const updatedCard = updatedCards.find(card => card.id === cardId)
      if (!updatedCard) {
        throw new Error("Cannot find the card to update")
      }
      await retroService.updateCard(updatedCard)
      setCards(updatedCards)
      showToast.success("Like status updated.")
    } catch (error) {
      console.error("Failed to update like status:", error)
      showToast.error("Failed to update like status. Please try again.")
    }
  }

  const handleActionItemSubmit = async (newActionItem: Omit<ActionItem, 'id' | 'createdAt'>) => {
    try {
      if (editingActionItem) {
        const updatedActionItem = {
          ...editingActionItem,
          ...newActionItem,
        }
        await retroService.updateActionItem(updatedActionItem)
      } else {
        const newActionItemData: ActionItem = {
          ...newActionItem,
          createdAt: new Date().toISOString()
        }
        await retroService.saveActionItem(newActionItemData)
      }
      const updatedActionItems = await retroService.getActionItems()
      setActionItems(updatedActionItems)
      setEditingActionItem(null)
      showToast.success(editingActionItem ? "Action item updated." : "New action item added.")
    } catch (error) {
      console.error(editingActionItem ? "Failed to update action item:" : "Failed to add action item:", error)
      showToast.error(editingActionItem ? "Failed to update action item. Please try again." : "Failed to add action item. Please try again.")
    }
  }

  const handleActionItemDelete = async (itemId: number) => {
    try {
      await retroService.deleteActionItem(itemId)
      const updatedActionItems = actionItems.filter(item => item.id !== itemId)
      setActionItems(updatedActionItems)
      showToast.success("Action item deleted successfully.")
    } catch (error) {
      console.error("Failed to delete action item:", error)
      showToast.error("Failed to delete action item. Please try again.")
    }
  }

  const handleActionItemEdit = (item: ActionItem) => {
    setEditingActionItem(item)
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setIsLoggedIn(false)
      setUser(null)
      router.push("/login")
      showToast.success("You have been successfully logged out.")
    } catch (error) {
      console.error("Logout failed:", error)
      showToast.error("Logout failed. Please try again.")
    }
  }

  const handleClearBoard = async () => {
    try {
      await retroService.clearBoard()
      setCards([])
      showToast.success("Retro board cleared successfully.")
    } catch (error) {
      console.error("Failed to clear board:", error)
      showToast.error("Failed to clear board. Please try again.")
    }
  }

  const loadHistories = async () => {
    try {
      const loadedHistories = await retroService.getAllHistory()
      setHistories(loadedHistories)
      setIsHistoryDialogOpen(true)  // 直接���开对话框
    } catch (error) {
      console.error("Failed to load histories:", error)
      showToast.error("Failed to load histories. Please try again later.")
    }
  }

  const loadHistoryById = async (id: number) => {
    setIsLoadingHistory(true);
    try {
      const history = await retroService.getHistoryById(id)
      setCards(history.cards || [])
      setCurrentHistoryDate(format(new Date(history.deletedAt), "yyyy-MM-dd HH:mm"))
      setIsHistoryMode(true)
      setIsHistoryDialogOpen(false)
    } catch (error) {
      console.error("Failed to load history:", error)
      showToast.error("Failed to load history. Please try again later.")
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const exitHistoryMode = () => {
    setIsHistoryMode(false)
    setCurrentHistoryDate(null)
    loadData()
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="w-[300px] space-y-5">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-8 w-[300px]" />
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isLoggedIn && (
        <div className="flex flex-col h-screen">
          <RetroHeader
            user={user}
            isSidebarOpen={isSidebarOpen}
            isHistoryMode={isHistoryMode}
            onLogout={handleLogout}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onLoadHistories={loadHistories}
          />
          <div className="flex justify-between p-4 gap-2 items-center">
            {isHistoryMode ? (
              <>
                <h1 className="text-2xl font-bold font-heading">
                  Retro Board History - {currentHistoryDate}
                </h1>
                <Button onClick={exitHistoryMode}>Exit History Mode</Button>
              </>
            ) : (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Clear Board</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete all retro cards from the board.
                        Action items will not be affected.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearBoard}>Clear Board</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Separator orientation="vertical" className="h-8 mx-2" />
                
                <RetroCardInput
                  newCard={newCard}
                  onCardTypeChange={(value) => setNewCard({ ...newCard, type: value })}
                  onCardContentChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
                  onCardAnonymousChange={(checked) => setNewCard({ ...newCard, isAnonymous: checked })}
                  onCardSubmit={handleCardSubmit}
                  isSubmitEnabled={isSubmitEnabled}
                  typesInfo={typesInfo}
                />
              </>
            )}
          </div>
          <div className="flex flex-1 overflow-hidden">
            <ScrollArea className="flex-1 mx-4">
              {isLoadingHistory ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4 h-full">
                  {typesInfo.map((column) => (
                    <RetroColumn
                      key={column.id}
                      id={column.id}
                      title={column.title}
                      color={column.color}
                      cards={cards.filter(card => card.type === column.id)}
                      onCardLike={handleCardLike}
                      onCardDelete={handleCardDelete}
                      isHistoryMode={isHistoryMode}
                      currentUserId={user?.id}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
            {isSidebarOpen && !isHistoryMode && (
              <ActionItemSidebar
                actionItems={actionItems}
                onActionItemSubmit={handleActionItemSubmit}
                onActionItemDelete={handleActionItemDelete}
                onActionItemEdit={handleActionItemEdit}
                editingActionItem={editingActionItem}
              />
            )}
          </div>
          <HistoryDialog
            isOpen={isHistoryDialogOpen}
            onOpenChange={setIsHistoryDialogOpen}
            histories={histories}
            onSelectHistory={loadHistoryById}
          />
          <Footer />
        </div>
      )}
    </div>
  )
}