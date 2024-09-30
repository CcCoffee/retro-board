import { toast } from "@/hooks/use-toast"

export const showToast = {
  success: (message: string) => {
    toast({
      title: "Success",
      description: message,
      variant: "default",
    })
  },

  error: (message: string) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    })
  },

  info: (message: string) => {
    toast({
      title: "Info",
      description: message,
      variant: "default",
    })
  },

  warning: (message: string) => {
    toast({
      title: "Warning",
      description: message,
      variant: "default",
    })
  },
}