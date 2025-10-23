import toast, { Toaster } from 'react-hot-toast'

export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      color: '#1f2937',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    iconTheme: {
      primary: '#10b981',
      secondary: '#ffffff',
    },
  })
}

export const showError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    style: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      color: '#1f2937',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#ffffff',
    },
  })
}

export const showInfo = (message: string) => {
  toast(message, {
    duration: 3000,
    icon: '✨',
    style: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(20px)',
      color: '#1f2937',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
  })
}

export { Toaster }
