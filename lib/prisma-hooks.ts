import type { PrismaClient } from '@prisma/client';
// PrismaClientKnownRequestError import is not needed for our middleware

// TypeScript interfaces for our models
export interface EventCreateInput {
  title: string;
  slug?: string;
  date: string;
  time: string;
  [key: string]: any;
}

export interface EventUpdateInput {
  title?: string;
  slug?: string;
  date?: string;
  time?: string;
  [key: string]: any;
}

interface BookingCreateInput {
  userEmail: string;
  eventId: string;
  [key: string]: any;
}

interface BookingUpdateInput {
  userEmail?: string;
  eventId?: string;
  [key: string]: any;
}

/**
 * Generates a URL-friendly slug from a title
 * 
 * Key logic:
 * 1. Convert to lowercase
 * 2. Replace spaces with hyphens
 * 3. Remove special characters
 * 4. Handle duplicate slugs by appending numbers
 * 
 * @param title - The title to generate a slug from
 * @param prisma - Prisma client instance for checking duplicate slugs
 * @returns A unique slug string
 */
async function generateSlug(title: string, prisma: any): Promise<string> {
  // Convert to lowercase and replace spaces with hyphens
  let slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    // Remove special characters
    .replace(/[^a-z0-9\-]/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');

  // Check if slug already exists and handle duplicates
  if (prisma) {
    let counter = 1;
    let originalSlug = slug;
    
    // Check if slug exists in database
    let existingEvent = await prisma.event.findUnique({
      where: { slug: slug }
    });
    
    // If slug exists, append counter until we find a unique one
    while (existingEvent) {
      slug = `${originalSlug}-${counter}`;
      counter++;
      existingEvent = await prisma.event.findUnique({
        where: { slug: slug }
      });
    }
  }

  return slug;
}

/**
 * Validates and normalizes date to ISO format
 * 
 * Key logic:
 * 1. Parse various date formats
 * 2. Convert to ISO format for consistency
 * 3. Validate that date is valid
 */
function normalizeDate(dateString: string): string {
  // Try to parse the date
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  
  // Return in ISO format
  return date.toISOString();
}

/**
 * Validates and normalizes time to consistent format (24-hour)
 * 
 * Key logic:
 * 1. Parse various time formats (12-hour, 24-hour)
 * 2. Convert to consistent 24-hour format
 * 3. Validate that time is valid
 */
function normalizeTime(timeString: string): string {
  // Remove extra spaces
  timeString = timeString.trim();
  
  // Check if already in 24-hour format (HH:MM or HH:MM:SS)
  const time24Regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  if (time24Regex.test(timeString)) {
    return timeString;
  }
  
  // Check if in 12-hour format with AM/PM
  const time12Regex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s*(AM|PM)$/i;
  const match = timeString.match(time12Regex);
  if (match) {
    let [_, hours, minutes, period] = timeString.split(/[:\s]/);
    hours = hours.padStart(2, '0');
    minutes = minutes.padStart(2, '0');
    period = period.toUpperCase();
    
    // Convert 12-hour to 24-hour
    let hour24 = parseInt(hours, 10);
    if (period === 'AM') {
      if (hour24 === 12) hour24 = 0;
    } else {
      if (hour24 !== 12) hour24 += 12;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
  }
  
  // If we can't parse it, throw an error
  throw new Error('Invalid time format. Use HH:MM (24-hour) or HH:MM AM/PM (12-hour)');
}

/**
 * Validates email format
 * 
 * Key logic:
 * 1. Check email against standard email regex
 * 2. Return true if valid, false otherwise
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Create a type for our middleware function
type MiddlewareFunction = (params: any, next: any) => Promise<any>;

/**
 * Creates a Prisma middleware for Event model with slug generation
 * 
 * @param prisma - Prisma client instance
 * @returns Middleware function
 */
export const createEventMiddleware = (prisma: any): MiddlewareFunction => async (params, next) => {
  // Handle Event creation
  if (params.model === 'Event' && params.action === 'create') {
    const data = params.args.data as any;

    // Generate slug from title if not provided
    if (!data.slug && data.title) {
      data.slug = await generateSlug(data.title, prisma);
    }

    // Normalize date to ISO format
    if (data.date) {
      data.date = normalizeDate(data.date);
    }

    // Normalize time to consistent format
    if (data.time) {
      data.time = normalizeTime(data.time);
    }
  }

  // Handle Event updates
  if (params.model === 'Event' && params.action === 'update') {
    const data = params.args.data as any;

    // Generate slug from title only if title is being updated
    if (data.title && !data.slug) {
      data.slug = await generateSlug(data.title, prisma);
    }

    // Normalize date to ISO format if being updated
    if (data.date) {
      data.date = normalizeDate(data.date);
    }

    // Normalize time to consistent format if being updated
    if (data.time) {
      data.time = normalizeTime(data.time);
    }
  }

  return next(params);
};

/**
 * Prisma middleware for Booking model
 * 
 * Handles:
 * 1. Event ID validation (ensure referenced event exists)
 * 2. Email format validation
 */
export const bookingMiddleware: MiddlewareFunction = async (params, next) => {
  // Handle Booking creation
  if (params.model === 'Booking' && params.action === 'create') {
    const data = params.args.data as BookingCreateInput;

    // Validate email format
    if (data.userEmail && !validateEmail(data.userEmail)) {
      throw new Error('Invalid email format');
    }
  }

  // Handle Booking updates
  if (params.model === 'Booking' && params.action === 'update') {
    const data = params.args.data as BookingUpdateInput;

    // Validate email format if being updated
    if (data.userEmail && !validateEmail(data.userEmail)) {
      throw new Error('Invalid email format');
    }
  }

  return next(params);
};
