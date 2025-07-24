'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/design-system'

interface NotionPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showItemsPerPage?: boolean
  itemsPerPage?: number
  onItemsPerPageChange?: (itemsPerPage: number) => void
  itemsPerPageOptions?: number[]
  showJumpToPage?: boolean
  siblingCount?: number
  totalItems?: number
  className?: string
  mobileOptimized?: boolean
}

export function NotionPagination({
  currentPage,
  totalPages,
  onPageChange,
  showItemsPerPage = false,
  itemsPerPage = 10,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 50],
  showJumpToPage = false,
  siblingCount = 1,
  totalItems,
  className,
  mobileOptimized = true,
}: NotionPaginationProps) {
  const [jumpToPageValue, setJumpToPageValue] = useState('')

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const totalNumbers = siblingCount * 2 + 3 // Current + siblings + first + last
    const totalBlocks = totalNumbers + 2 // + 2 for ellipsis

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftEllipsis = leftSiblingIndex > 2
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 2

    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, '...', totalPages]
    }

    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      )
      return [1, '...', ...rightRange]
    }

    if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      )
      return [1, '...', ...middleRange, '...', totalPages]
    }

    return []
  }, [currentPage, totalPages, siblingCount])

  const handleJumpToPage = () => {
    const page = parseInt(jumpToPageValue)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      setJumpToPageValue('')
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  // Mobile view (only prev/next)
  if (mobileOptimized) {
    return (
      <>
        {/* Mobile version */}
        <div className="flex sm:hidden items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentPage <= 1}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-notion-sm font-medium rounded-notion',
              'border border-notion-border dark:border-notion-dark-border',
              'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors duration-200'
            )}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück
          </button>

          <span className="text-notion-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
            {currentPage} von {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-notion-sm font-medium rounded-notion',
              'border border-notion-border dark:border-notion-dark-border',
              'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors duration-200'
            )}
          >
            Weiter
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Desktop version */}
        <div className={cn('hidden sm:flex items-center justify-between', className)}>
          <DesktopPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            pageNumbers={pageNumbers}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            showItemsPerPage={showItemsPerPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            itemsPerPageOptions={itemsPerPageOptions}
            showJumpToPage={showJumpToPage}
            jumpToPageValue={jumpToPageValue}
            setJumpToPageValue={setJumpToPageValue}
            handleJumpToPage={handleJumpToPage}
            totalItems={totalItems}
          />
        </div>
      </>
    )
  }

  // Desktop only version
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <DesktopPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        pageNumbers={pageNumbers}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        showItemsPerPage={showItemsPerPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        itemsPerPageOptions={itemsPerPageOptions}
        showJumpToPage={showJumpToPage}
        jumpToPageValue={jumpToPageValue}
        setJumpToPageValue={setJumpToPageValue}
        handleJumpToPage={handleJumpToPage}
        totalItems={totalItems}
      />
    </div>
  )
}

// Desktop pagination component
interface DesktopPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageNumbers: (number | string)[]
  handlePrevious: () => void
  handleNext: () => void
  showItemsPerPage: boolean
  itemsPerPage: number
  onItemsPerPageChange?: (itemsPerPage: number) => void
  itemsPerPageOptions: number[]
  showJumpToPage: boolean
  jumpToPageValue: string
  setJumpToPageValue: (value: string) => void
  handleJumpToPage: () => void
  totalItems?: number
}

function DesktopPagination({
  currentPage,
  totalPages,
  onPageChange,
  pageNumbers,
  handlePrevious,
  handleNext,
  showItemsPerPage,
  itemsPerPage,
  onItemsPerPageChange,
  itemsPerPageOptions,
  showJumpToPage,
  jumpToPageValue,
  setJumpToPageValue,
  handleJumpToPage,
  totalItems,
}: DesktopPaginationProps) {
  return (
    <>
      {/* Left side - Items info and per page selector */}
      <div className="flex items-center gap-4">
        {totalItems && (
          <span className="text-notion-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
            {totalItems === 0 
              ? 'Keine Einträge' 
              : `${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} von ${totalItems} Einträgen`
            }
          </span>
        )}
        
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <span className="text-notion-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
              Einträge pro Seite:
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
              className={cn(
                'px-2 py-1 text-notion-sm rounded border',
                'border-notion-border dark:border-notion-dark-border',
                'bg-white dark:bg-gray-800',
                'focus:outline-none focus:ring-2 focus:ring-notion-blue/20'
              )}
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Center - Page numbers */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          className={cn(
            'p-2 rounded-notion border border-notion-border dark:border-notion-dark-border',
            'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors duration-200'
          )}
          aria-label="Vorherige Seite"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={typeof page === 'string'}
            className={cn(
              'min-w-[40px] h-10 px-3 text-notion-sm font-medium rounded-notion',
              'border border-notion-border dark:border-notion-dark-border',
              'transition-colors duration-200',
              typeof page === 'number' && page === currentPage
                ? 'bg-notion-blue text-white border-notion-blue'
                : typeof page === 'string'
                  ? 'cursor-default'
                  : 'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover'
            )}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className={cn(
            'p-2 rounded-notion border border-notion-border dark:border-notion-dark-border',
            'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors duration-200'
          )}
          aria-label="Nächste Seite"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Right side - Jump to page */}
      {showJumpToPage && (
        <div className="flex items-center gap-2">
          <span className="text-notion-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
            Gehe zu Seite:
          </span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpToPageValue}
            onChange={(e) => setJumpToPageValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJumpToPage()}
            className={cn(
              'w-16 px-2 py-1 text-notion-sm rounded border',
              'border-notion-border dark:border-notion-dark-border',
              'bg-white dark:bg-gray-800',
              'focus:outline-none focus:ring-2 focus:ring-notion-blue/20'
            )}
          />
          <button
            onClick={handleJumpToPage}
            className={cn(
              'px-3 py-1 text-notion-sm font-medium rounded-notion',
              'border border-notion-border dark:border-notion-dark-border',
              'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover',
              'transition-colors duration-200'
            )}
          >
            Los
          </button>
        </div>
      )}
    </>
  )
}

// Simple pagination for basic use cases
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: Pick<NotionPaginationProps, 'currentPage' | 'totalPages' | 'onPageChange' | 'className'>) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={cn(
          'px-3 py-2 text-notion-sm font-medium rounded-notion',
          'border border-notion-border dark:border-notion-dark-border',
          'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-200'
        )}
      >
        Zurück
      </button>
      
      <span className="px-3 py-2 text-notion-sm text-notion-text-secondary dark:text-notion-dark-text-secondary">
        {currentPage} von {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={cn(
          'px-3 py-2 text-notion-sm font-medium rounded-notion',
          'border border-notion-border dark:border-notion-dark-border',
          'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-200'
        )}
      >
        Weiter
      </button>
    </div>
  )
}