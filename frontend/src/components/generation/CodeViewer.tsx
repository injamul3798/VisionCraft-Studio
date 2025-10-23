import React, { useState } from 'react'
import { FileCode, Copy, Check, Download } from 'lucide-react'
import { Button } from '@/components/shared/Button'

interface CodeViewerProps {
  filesData: Record<string, string>
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ filesData }) => {
  const [activeFile, setActiveFile] = useState<string>(Object.keys(filesData)[0] || '')
  const [copiedFile, setCopiedFile] = useState<string | null>(null)

  const handleCopy = async (fileName: string) => {
    await navigator.clipboard.writeText(filesData[fileName])
    setCopiedFile(fileName)
    setTimeout(() => setCopiedFile(null), 2000)
  }

  const handleDownloadAll = () => {
    // Create a zip-like structure or download as separate files
    // For now, let's create a simple text file with all files
    let allContent = ''
    Object.entries(filesData).forEach(([fileName, content]) => {
      allContent += `\n\n// ========== ${fileName} ==========\n\n${content}`
    })

    const blob = new Blob([allContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'react-project.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadFile = (fileName: string) => {
    const blob = new Blob([filesData[fileName]], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
  }

  const getFileIcon = (fileName: string) => {
    return <FileCode size={14} className="text-gray-500" />
  }

  if (!filesData || Object.keys(filesData).length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>No code generated yet</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <FileCode size={20} className="text-primary-600" />
          <span className="font-medium text-sm">Code Files</span>
        </div>
        <Button
          variant="secondary"
          onClick={handleDownloadAll}
          className="flex items-center gap-2 text-sm"
        >
          <Download size={16} />
          Download All
        </Button>
      </div>

      {/* File Tabs */}
      <div className="flex overflow-x-auto bg-gray-100 border-b scrollbar-thin">
        {Object.keys(filesData).map((fileName) => (
          <button
            key={fileName}
            onClick={() => setActiveFile(fileName)}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap border-r
              transition-colors duration-150
              ${
                activeFile === fileName
                  ? 'bg-white text-primary-600 border-b-2 border-b-primary-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {getFileIcon(fileName)}
            <span className="font-mono text-xs">{fileName}</span>
          </button>
        ))}
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white">
        {activeFile && (
          <>
            {/* File Actions */}
            <div className="flex items-center justify-between bg-gray-50 px-4 py-2 border-b">
              <span className="font-mono text-xs text-gray-600">{activeFile}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(activeFile)}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-gray-200 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedFile === activeFile ? (
                    <>
                      <Check size={14} className="text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDownloadFile(activeFile)}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-gray-200 transition-colors"
                  title="Download file"
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Display */}
            <div className="flex-1 overflow-auto scrollbar-thin">
              <pre className="p-4 text-sm font-mono leading-relaxed">
                <code className="language-typescript">{filesData[activeFile]}</code>
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
