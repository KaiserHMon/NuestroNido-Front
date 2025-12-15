import { toast } from 'sonner'

export function useNotification() {
  return {
    success: (message: string, description?: string) => {
      toast.success(message, {
        description,
        duration: 4000,
      })
    },
    error: (message: string, description?: string) => {
      toast.error(message, {
        description,
        duration: 4000,
      })
    },
    info: (message: string, description?: string) => {
      toast.info(message, {
        description,
        duration: 4000,
      })
    },
    loading: (message: string, description?: string) => {
      return toast.loading(message, {
        description,
      })
    },
    warning: (message: string, description?: string) => {
      toast.warning(message, {
        description,
        duration: 4000,
      })
    },
    dismiss: (id?: string | number) => {
      if (id) {
        toast.dismiss(id)
      } else {
        toast.dismiss()
      }
    },
  }
}
