import React, { useEffect, useRef, useState } from 'react'
import { Monitor, Tablet, Smartphone, Maximize2, Download } from 'lucide-react'
import { Button } from '@/components/shared/Button'

interface PreviewPaneProps {
  htmlContent: string
  isGenerating: boolean
}

type DeviceSize = 'desktop' | 'tablet' | 'mobile'

export const PreviewPane: React.FC<PreviewPaneProps> = ({ htmlContent, isGenerating }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (iframeRef.current && htmlContent) {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(htmlContent)
        iframeDoc.close()
      }
    }
  }, [htmlContent])

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'prototype.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const deviceSizeClasses = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[1024px] mx-auto',
    mobile: 'w-[375px] h-[667px] mx-auto',
  }

  return (
    <div className={`flex flex-col h-full bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white border-b px-4 py-2 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviceSize('desktop')}
            className={`p-2 rounded transition-colors ${
              deviceSize === 'desktop' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'
            }`}
            title="Desktop"
          >
            <Monitor size={20} />
          </button>
          <button
            onClick={() => setDeviceSize('tablet')}
            className={`p-2 rounded transition-colors ${
              deviceSize === 'tablet' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'
            }`}
            title="Tablet"
          >
            <Tablet size={20} />
          </button>
          <button
            onClick={() => setDeviceSize('mobile')}
            className={`p-2 rounded transition-colors ${
              deviceSize === 'mobile' ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'
            }`}
            title="Mobile"
          >
            <Smartphone size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {htmlContent && (
            <Button variant="secondary" onClick={handleDownload} className="flex items-center gap-2">
              <Download size={16} />
              Download HTML
            </Button>
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-auto scrollbar-thin p-4">
        {isGenerating && !htmlContent ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="loading-dots mb-4">
                <span className="text-primary-600"></span>
                <span className="text-primary-600"></span>
                <span className="text-primary-600"></span>
              </div>
              <p className="text-gray-600">Generating your prototype...</p>
            </div>
          </div>
        ) : htmlContent ? (
          <div className={`bg-white shadow-lg transition-all duration-300 ${deviceSizeClasses[deviceSize]}`}>
            <iframe
              ref={iframeRef}
              title="Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Your generated prototype will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
