/**
 * Data Display Components Export
 * Components for displaying data with Notion design
 */

export { NotionTable } from './NotionTable'
export { 
  NotionAvatar, 
  NotionAvatarGroup, 
  NotionAvatarDropdown, 
  UserAvatar 
} from './NotionAvatar'
export { 
  NotionBadge, 
  NotionBadgeGroup, 
  StatusBadge, 
  PriorityBadge 
} from './NotionBadge'
export { 
  NotionStat, 
  NotionStatsGrid, 
  QuickStat 
} from './NotionStat'

// Re-export types for convenience
export type { default as NotionTableProps } from './NotionTable'
export type { default as NotionAvatarProps } from './NotionAvatar'
export type { default as NotionBadgeProps } from './NotionBadge'
export type { default as NotionStatProps } from './NotionStat'