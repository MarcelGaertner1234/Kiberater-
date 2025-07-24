'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/design-system'
import { LoadingSpinner } from '../feedback/LoadingSpinner'

interface TableColumn<T = any> {
  key: string
  label: string
  sortable?: boolean
  width?: string | number
  minWidth?: string | number
  render?: (value: any, item: T, index: number) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  sticky?: boolean
}

interface NotionTableProps<T = any> {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  selectable?: boolean
  selectedItems?: T[]
  onSelect?: (items: T[]) => void
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  emptyState?: React.ReactNode
  stickyHeader?: boolean
  responsive?: boolean
  className?: string
  rowClassName?: string | ((item: T, index: number) => string)
  onRowClick?: (item: T, index: number) => void
  getRowId?: (item: T, index: number) => string | number
}

export function NotionTable<T = any>({
  columns,
  data,
  loading = false,
  selectable = false,
  selectedItems = [],
  onSelect,
  sortBy,
  sortDirection = 'asc',
  onSort,
  emptyState,
  stickyHeader = false,
  responsive = true,
  className,
  rowClassName,
  onRowClick,
  getRowId,
}: NotionTableProps<T>) {
  const [internalSortBy, setInternalSortBy] = useState<string | null>(null)
  const [internalSortDirection, setInternalSortDirection] = useState<'asc' | 'desc'>('asc')

  const currentSortBy = sortBy !== undefined ? sortBy : internalSortBy
  const currentSortDirection = sortBy !== undefined ? sortDirection : internalSortDirection

  // Handle sorting
  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key)
    if (!column?.sortable) return

    let newDirection: 'asc' | 'desc' = 'asc'
    if (currentSortBy === key && currentSortDirection === 'asc') {
      newDirection = 'desc'
    }

    if (onSort) {
      onSort(key, newDirection)
    } else {
      setInternalSortBy(key)
      setInternalSortDirection(newDirection)
    }
  }

  // Handle selection
  const isAllSelected = selectable && selectedItems.length === data.length && data.length > 0
  const isIndeterminate = selectable && selectedItems.length > 0 && selectedItems.length < data.length

  const handleSelectAll = () => {
    if (!onSelect) return
    if (isAllSelected) {
      onSelect([])
    } else {
      onSelect(data)
    }
  }

  const handleSelectItem = (item: T) => {
    if (!onSelect) return
    const isSelected = selectedItems.includes(item)
    if (isSelected) {
      onSelect(selectedItems.filter(selected => selected !== item))
    } else {
      onSelect([...selectedItems, item])
    }
  }

  // Sort data
  const sortedData = useMemo(() => {
    if (!currentSortBy) return data

    return [...data].sort((a, b) => {
      const aValue = a[currentSortBy]
      const bValue = b[currentSortBy]

      if (aValue === bValue) return 0

      let comparison = 0
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue)
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else {
        comparison = String(aValue).localeCompare(String(bValue))
      }

      return currentSortDirection === 'desc' ? -comparison : comparison
    })
  }, [data, currentSortBy, currentSortDirection])

  // Default empty state
  const defaultEmptyState = (
    <div className="text-center py-12">
      <div className="text-notion-text-secondary dark:text-notion-dark-text-secondary text-notion-sm">
        Keine Daten verfügbar
      </div>
    </div>
  )

  // Responsive cards view for mobile
  if (responsive) {
    return (
      <>
        {/* Desktop table */}
        <div className="hidden md:block">
          <DesktopTable
            columns={columns}
            data={sortedData}
            loading={loading}
            selectable={selectable}
            selectedItems={selectedItems}
            isAllSelected={isAllSelected}
            isIndeterminate={isIndeterminate}
            handleSelectAll={handleSelectAll}
            handleSelectItem={handleSelectItem}
            currentSortBy={currentSortBy}
            currentSortDirection={currentSortDirection}
            handleSort={handleSort}
            emptyState={emptyState || defaultEmptyState}
            stickyHeader={stickyHeader}
            className={className}
            rowClassName={rowClassName}
            onRowClick={onRowClick}
            getRowId={getRowId}
          />
        </div>

        {/* Mobile cards */}
        <div className="block md:hidden">
          <MobileCards
            columns={columns}
            data={sortedData}
            loading={loading}
            selectable={selectable}
            selectedItems={selectedItems}
            handleSelectItem={handleSelectItem}
            emptyState={emptyState || defaultEmptyState}
            className={className}
            onRowClick={onRowClick}
            getRowId={getRowId}
          />
        </div>
      </>
    )
  }

  // Desktop only
  return (
    <DesktopTable
      columns={columns}
      data={sortedData}
      loading={loading}
      selectable={selectable}
      selectedItems={selectedItems}
      isAllSelected={isAllSelected}
      isIndeterminate={isIndeterminate}
      handleSelectAll={handleSelectAll}
      handleSelectItem={handleSelectItem}
      currentSortBy={currentSortBy}
      currentSortDirection={currentSortDirection}
      handleSort={handleSort}
      emptyState={emptyState || defaultEmptyState}
      stickyHeader={stickyHeader}
      className={className}
      rowClassName={rowClassName}
      onRowClick={onRowClick}
      getRowId={getRowId}
    />
  )
}

// Desktop table component
interface DesktopTableProps<T> extends Omit<NotionTableProps<T>, 'responsive'> {
  isAllSelected: boolean
  isIndeterminate: boolean
  handleSelectAll: () => void
  handleSelectItem: (item: T) => void
  currentSortBy: string | null
  currentSortDirection: 'asc' | 'desc'
  handleSort: (key: string) => void
}

function DesktopTable<T>({
  columns,
  data,
  loading,
  selectable,
  selectedItems,
  isAllSelected,
  isIndeterminate,
  handleSelectAll,
  handleSelectItem,
  currentSortBy,
  currentSortDirection,
  handleSort,
  emptyState,
  stickyHeader,
  className,
  rowClassName,
  onRowClick,
  getRowId,
}: DesktopTableProps<T>) {
  return (
    <div className={cn('relative overflow-hidden rounded-notion border border-notion-border dark:border-notion-dark-border', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead
            className={cn(
              'bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary border-b border-notion-border dark:border-notion-dark-border',
              stickyHeader && 'sticky top-0 z-10'
            )}
          >
            <tr>
              {/* Selection column */}
              {selectable && (
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isIndeterminate
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-notion-border dark:border-notion-dark-border text-notion-blue focus:ring-notion-blue focus:ring-offset-0"
                  />
                </th>
              )}

              {/* Column headers */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-notion-xs font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:text-notion-text dark:hover:text-notion-dark-text select-none',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sticky && 'sticky left-0 bg-notion-bg-secondary dark:bg-notion-dark-bg-secondary'
                  )}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                  }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <svg
                          className={cn(
                            'w-3 h-3 transition-colors',
                            currentSortBy === column.key && currentSortDirection === 'asc'
                              ? 'text-notion-blue'
                              : 'text-notion-text-tertiary dark:text-notion-dark-text-tertiary'
                          )}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5 8l5-5 5 5H5z" />
                        </svg>
                        <svg
                          className={cn(
                            'w-3 h-3 transition-colors -mt-1',
                            currentSortBy === column.key && currentSortDirection === 'desc'
                              ? 'text-notion-blue'
                              : 'text-notion-text-tertiary dark:text-notion-dark-text-tertiary'
                          )}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M15 12l-5 5-5-5h10z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-notion-border dark:divide-notion-dark-border">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-8 text-center">
                  <LoadingSpinner size="lg" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  {emptyState}
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const isSelected = selectedItems.includes(item)
                const rowId = getRowId ? getRowId(item, index) : index
                const computedRowClassName = typeof rowClassName === 'function' 
                  ? rowClassName(item, index) 
                  : rowClassName

                return (
                  <tr
                    key={rowId}
                    className={cn(
                      'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-colors duration-200',
                      isSelected && 'bg-notion-blue/5',
                      onRowClick && 'cursor-pointer',
                      computedRowClassName
                    )}
                    onClick={() => onRowClick?.(item, index)}
                  >
                    {/* Selection cell */}
                    {selectable && (
                      <td className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation()
                            handleSelectItem(item)
                          }}
                          className="w-4 h-4 rounded border-notion-border dark:border-notion-dark-border text-notion-blue focus:ring-notion-blue focus:ring-offset-0"
                        />
                      </td>
                    )}

                    {/* Data cells */}
                    {columns.map((column) => {
                      const value = item[column.key]
                      const cellContent = column.render 
                        ? column.render(value, item, index)
                        : value

                      return (
                        <td
                          key={column.key}
                          className={cn(
                            'px-4 py-3 text-notion-sm text-notion-text dark:text-notion-dark-text',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right',
                            column.sticky && 'sticky left-0 bg-white dark:bg-gray-800'
                          )}
                        >
                          {cellContent}
                        </td>
                      )
                    })}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Mobile cards component
interface MobileCardsProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  loading: boolean
  selectable: boolean
  selectedItems: T[]
  handleSelectItem: (item: T) => void
  emptyState: React.ReactNode
  className?: string
  onRowClick?: (item: T, index: number) => void
  getRowId?: (item: T, index: number) => string | number
}

function MobileCards<T>({
  columns,
  data,
  loading,
  selectable,
  selectedItems,
  handleSelectItem,
  emptyState,
  className,
  onRowClick,
  getRowId,
}: MobileCardsProps<T>) {
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 border border-notion-border dark:border-notion-dark-border rounded-notion">
            <LoadingSpinner variant="skeleton" className="h-4 w-3/4 mb-2" />
            <LoadingSpinner variant="skeleton" className="h-3 w-1/2 mb-1" />
            <LoadingSpinner variant="skeleton" className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return <div className={className}>{emptyState}</div>
  }

  return (
    <div className={cn('space-y-4', className)}>
      {data.map((item, index) => {
        const isSelected = selectedItems.includes(item)
        const rowId = getRowId ? getRowId(item, index) : index

        return (
          <div
            key={rowId}
            className={cn(
              'p-4 border border-notion-border dark:border-notion-dark-border rounded-notion',
              'hover:bg-notion-bg-hover dark:hover:bg-notion-dark-bg-hover transition-colors duration-200',
              isSelected && 'bg-notion-blue/5 border-notion-blue/20',
              onRowClick && 'cursor-pointer'
            )}
            onClick={() => onRowClick?.(item, index)}
          >
            {/* Selection checkbox */}
            {selectable && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-notion-sm font-medium text-notion-text dark:text-notion-dark-text">
                  Auswählen
                </span>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleSelectItem(item)
                  }}
                  className="w-4 h-4 rounded border-notion-border dark:border-notion-dark-border text-notion-blue focus:ring-notion-blue focus:ring-offset-0"
                />
              </div>
            )}

            {/* Card content */}
            <div className="space-y-2">
              {columns.map((column) => {
                const value = item[column.key]
                const cellContent = column.render 
                  ? column.render(value, item, index)
                  : value

                return (
                  <div key={column.key} className="flex justify-between items-start">
                    <span className="text-notion-xs font-medium text-notion-text-secondary dark:text-notion-dark-text-secondary uppercase tracking-wider min-w-0 flex-shrink-0 mr-3">
                      {column.label}:
                    </span>
                    <span className="text-notion-sm text-notion-text dark:text-notion-dark-text text-right">
                      {cellContent}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}