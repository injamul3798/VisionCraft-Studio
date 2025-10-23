import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Monitor, Tablet, Smartphone, Maximize2, Download, Code2, Eye } from 'lucide-react'
import { Button } from '@/components/shared/Button'
import { CodeViewer } from './CodeViewer'

interface PreviewPaneProps {
  htmlContent: string
  isGenerating: boolean
}

type DeviceSize = 'desktop' | 'tablet' | 'mobile'
type ViewMode = 'preview' | 'code'

export const PreviewPane: React.FC<PreviewPaneProps> = ({ htmlContent, isGenerating }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [deviceSize, setDeviceSize] = useState<DeviceSize>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('preview')

  // Parse content - check if it's JSON (React/TS project) or plain HTML
  const parsedContent = useMemo(() => {
    if (!htmlContent) return null

    try {
      const parsed = JSON.parse(htmlContent)
      if (parsed.files && typeof parsed.files === 'object') {
        return {
          type: 'react' as const,
          files: parsed.files as Record<string, string>,
          previewHtml: parsed.files['index.html'] || ''
        }
      }
    } catch {
      // Not JSON, treat as plain HTML
    }

    return {
      type: 'html' as const,
      html: htmlContent
    }
  }, [htmlContent])

  useEffect(() => {
    if (iframeRef.current && parsedContent && viewMode === 'preview') {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        iframeDoc.open()
        const content = parsedContent.type === 'react' ? parsedContent.previewHtml : parsedContent.html
        iframeDoc.write(content)
        iframeDoc.close()
      }
    }
  }, [parsedContent, viewMode])

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
          {/* View Mode Toggle */}
          {parsedContent?.type === 'react' && (
            <div className="flex items-center gap-1 bg-gray-100 rounded p-1 mr-2">
              <button
                onClick={() => setViewMode('preview')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'preview' ? 'bg-white shadow-sm text-primary-600' : 'hover:bg-gray-200'
                }`}
                title="Preview"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'code' ? 'bg-white shadow-sm text-primary-600' : 'hover:bg-gray-200'
                }`}
                title="Code"
              >
                <Code2 size={18} />
              </button>
            </div>
          )}

          {/* Device Size Toggle - only in preview mode */}
          {viewMode === 'preview' && (
            <>
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
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {htmlContent && viewMode === 'preview' && (
            <Button variant="secondary" onClick={handleDownload} className="flex items-center gap-2">
              <Download size={16} />
              Download
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

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {isGenerating && !htmlContent ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="loading-dots mb-4">
                <span className="text-primary-600"></span>
                <span className="text-primary-600"></span>
                <span className="text-primary-600"></span>
              </div>
              <p className="text-gray-600">Generating your project...</p>
            </div>
          </div>
        ) : parsedContent ? (
          viewMode === 'code' && parsedContent.type === 'react' ? (
            /* Code View */
            <CodeViewer filesData={parsedContent.files} />
          ) : (
            /* Preview View */
            <div className="h-full overflow-auto scrollbar-thin p-4">
              <div className={`bg-white shadow-lg transition-all duration-300 ${deviceSizeClasses[deviceSize]}`}>
                <iframe
                  ref={iframeRef}
                  title="Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
            </div>
          )
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Your generated project will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
