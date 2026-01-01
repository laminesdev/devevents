import { PrismaClient } from '@prisma/client';
import { createEventMiddleware, bookingMiddleware } from './prisma-hooks';

// Create a single instance of Prisma Client
const prismaClient = new PrismaClient();

// Apply middleware
prismaClient.$use(createEventMiddleware(prismaClient));
prismaClient.$use(bookingMiddleware);

// Export the Prisma client instance
export default prismaClient;

// Export types for convenience
export type { EventCreateInput, EventUpdateInput } from './prisma-hooks';
