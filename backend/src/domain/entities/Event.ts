export type EventStatus = 'draft' | 'published' | 'active' | 'sold_out' | 'finished' | 'cancelled';

export interface Event {
  id?: string;
  companyId: string;
  company?: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  name: string;
  slug: string;
  description?: string;
  image?: string;
  date: Date;
  time?: string;
  venue: string;
  address?: string;
  status: EventStatus;
  maxTicketsPerUser: number;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateEventDTO {
  name: string;
  description?: string;
  image?: string;
  date: Date;
  time?: string;
  venue: string;
  address?: string;
  maxTicketsPerUser?: number;
}

export interface UpdateEventDTO {
  name?: string;
  description?: string;
  image?: string;
  date?: Date;
  time?: string;
  venue?: string;
  address?: string;
  maxTicketsPerUser?: number;
  status?: EventStatus;
}
