import type { Avatar } from '#ui/types'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'

export interface User {
  id: number
  name: string
  email: string
  avatar?: Avatar
  status: UserStatus
  location: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

// export interface
export interface UTableColumn {
  key: string;
  sortable?: boolean;
  sort?: (a: any, b: any, direction: 'asc' | 'desc') => number;
  direction?: 'asc' | 'desc';
  class?: string;
  [key: string]: any;
}