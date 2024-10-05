"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, HeartIcon, PencilIcon, TrashIcon } from "lucide-react"
import { format, isBefore, startOfDay, parseISO, setHours, setMinutes, setSeconds, setMilliseconds } from "date-fns"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from 'next/image'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

import { authService } from "@/services/authService"
import { retroService } from "@/services/retroService"
import { User, RetroCard, ActionItem, RetroBoardHistory } from "@/types/retro"
import { showToast } from "@/utils/toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HistoryIcon } from "lucide-react"
import ActionItemSidebar from '@/components/ActionItemSidebar'

const typesInfo = [
  { id: "good", title: "Good", color: "bg-green-100", indicatorColor: "bg-green-300" },
  { id: "keep", title: "Keep", color: "bg-blue-100", indicatorColor: "bg-blue-300" },
  { id: "change", title: "Change", color: "bg-yellow-100", indicatorColor: "bg-yellow-300" },
  { id: "bad", title: "Bad", color: "bg-red-100", indicatorColor: "bg-red-300" },
]

const users: User[] = [
  { id: "E001", name: "张三", avatar: "/E001.svg?height=32&width=32", email: "zhangsan@example.com" },
  { id: "E002", name: "李四", avatar: "/E002.svg?height=32&width=32", email: "lisi@example.com" },
  { id: "E003", name: "王五", avatar: "/E003.svg?height=32&width=32", email: "wangwu@example.com" },
  { id: "E004", name: "赵六", avatar: "/E004.svg?height=32&width=32", email: "zhaoliu@example.com" },
  { id: "E005", name: "钱七", avatar: "/E005.svg?height=32&width=32", email: "qianqi@example.com" },
]

const formatLocalTime = (dateString: string) => {
  return format(parseISO(dateString + "Z"), 'yyyy-MM-dd HH:mm')
}

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
  const [newActionItem, setNewActionItem] = useState<Omit<ActionItem, 'id' | 'createdAt'>>({
    assignee: { id: "", name: "", avatar: "", email: "" },
    dueDate: "",
    content: ""
  })
  const [editingActionItem, setEditingActionItem] = useState<ActionItem | null>(null)
  const [openAssignee, setOpenAssignee] = useState(false)
  const router = useRouter()
  const [histories, setHistories] = useState<RetroBoardHistory[]>([])
  const [isHistoryMode, setIsHistoryMode] = useState(false)
  const [currentHistoryDate, setCurrentHistoryDate] = useState<string | null>(null)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  // 在组件内部添加这个辅助函数
  const getLocalEndOfDay = (date: Date) => {
    return setMilliseconds(setSeconds(setMinutes(setHours(date, 23), 59), 59), 999);
  }

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
        router.push("/login") // 如果未登录,重定向到登录页面
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

  const isActionItemValid = newActionItem.assignee.id && newActionItem.content.trim() !== ""

  const isSubmitEnabled = newCard.content.trim() !== ""
  const isActionItemSubmitEnabled = isActionItemValid

  // 计算 action items 的摘要信息
  const totalActionItems = actionItems.length
  const overdueTasks = actionItems.filter(item => !!item.dueDate).filter(item => new Date(item.dueDate) < startOfDay(new Date())).length

  const handleCardSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (isSubmitEnabled && user) {
      try {
        const newCardData: RetroCard = { 
          ...newCard, 
          author: user,
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

    if (!currentUser || !cardToDelete || (cardToDelete.author.id !== currentUser.id && !cardToDelete.isAnonymous)) {
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
      setNewActionItem({ 
        assignee: { id: "", name: "", avatar: "", email: "" }, 
        dueDate: "", 
        content: "" 
      })
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
    setNewActionItem({
      assignee: item.assignee,
      dueDate: item.dueDate,
      content: item.content
    })
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

  const handleCardKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isSubmitEnabled) {
      handleCardSubmit()
    }
  }

  const handleActionItemKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift + Enter 用于换行，不需要特殊处理
        return;
      } else {
        // 仅 Enter 键用于提交
        e.preventDefault(); // 阻止默认的换行行为
        if (isActionItemSubmitEnabled) {
          handleActionItemSubmit();
        }
      }
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
      setIsHistoryDialogOpen(true) // Open the dialog after loading histories
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
      setIsHistoryDialogOpen(false) // Close the dialog after loading history
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
    loadData() // This should reset the cards to the current state
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
          <div className="relative flex justify-between items-center px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 overflow-hidden">
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
              <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white" onClick={loadHistories}>
                    <HistoryIcon className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Retro Board History</DialogTitle>
                    <DialogDescription>
                      Select a history to view past retro boards
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
                          <span>Deleted By</span>
                        </div>
                        {histories.map((history) => (
                          <div
                            key={history.id}
                            className="flex justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => loadHistoryById(history.id)}
                          >
                            <span>{format(new Date(history.deletedAt), "yyyy-MM-dd HH:mm")}</span>
                            <span>{history.deletedBy.name}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white">Hello, {user?.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>{user?.name?.[0] ?? '?'}</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border-2 border-white"></span>
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
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="bg-white text-purple-500"
                disabled={isHistoryMode}
              >
                {isSidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </Button>
            </div>
          </div>
          <div className="flex justify-between p-4 gap-2 items-center">
            {isHistoryMode && (
              <h1 className="text-2xl font-bold font-heading">
                Retro Board History - {currentHistoryDate}
              </h1>
            )}
            {isHistoryMode ? (
              <Button onClick={exitHistoryMode}>Exit History Mode</Button>
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
                
                <Select value={newCard.type} onValueChange={(value) => setNewCard({ ...newCard, type: value })}>
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
                  onChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
                  onKeyPress={handleCardKeyPress}
                  className="flex-grow min-w-[200px]"
                />
                <div className="flex items-center">
                  <Checkbox
                    id="anonymous"
                    checked={newCard.isAnonymous}
                    onCheckedChange={(checked: boolean) => setNewCard({ ...newCard, isAnonymous: checked })}
                  />
                  <label htmlFor="anonymous" className="ml-2 hidden sm:inline">Anonymous</label>
                </div>
                <Button onClick={handleCardSubmit} disabled={!isSubmitEnabled}>Submit</Button>
              </>
            )}
          </div>
          <div className="flex flex-1 overflow-hidden">
            <ScrollArea className="flex-1 mr-4">
              {isLoadingHistory ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4 h-full">
                  {typesInfo.map((column, index) => (
                    <div key={column.id} className={`${column.color} p-4 rounded-lg overflow-auto ${index === 0 ? 'ml-4' : ''}`}>
                      <h3 className="text-lg font-bold mb-2 font-heading">{column.title}</h3>
                      {(cards || []).filter(card => card.type === column.id).map((card) => (
                        <Card key={card.id} className="mb-2 relative">
                          <div className="px-2 pt-0">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCardLike(card.id!)}
                                  className={card.likes.some(like => like.id === user?.id) ? "text-red-500" : ""}
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
                                            <AvatarImage src={like.avatar} alt={like.name} />
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
                                              <AvatarImage src={like.avatar} alt={like.name} />
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
                              {!isHistoryMode && user && (card.author?.id === user.id || card.isAnonymous) && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCardDelete(card.id!)}
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
                              <span>{card.isAnonymous ? "Anonymous" : card.author.name}</span>
                              <span>{formatLocalTime(card.createdAt)}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            {isSidebarOpen && !isHistoryMode && (
              <ActionItemSidebar
                actionItems={actionItems}
                users={users}
                onActionItemSubmit={handleActionItemSubmit}
                onActionItemDelete={handleActionItemDelete}
                onActionItemEdit={handleActionItemEdit}
                editingActionItem={editingActionItem}
              />
            )}
          </div>
          <div className="h-4"></div>
        </div>
      )}
    </div>
  )
}