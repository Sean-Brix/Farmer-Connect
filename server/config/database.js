import { PrismaClient } from '@prisma/client';

/**
 * Centralized Prisma Client Instance (Singleton Pattern)
 * 
 * CRITICAL: Always import from this file to prevent connection pool exhaustion.
 * 
 * Aiven Free Tier Limits:
 * - Max connections: 10
 * - Connection pool: 5 (configured below)
 * 
 * Benefits:
 * - Single connection pool shared across entire app
 * - Automatic connection reuse
 * - Prevents "Too many connections" errors
 * - Proper connection cleanup on app shutdown
 */

let prisma;

export function getPrismaClient() {
  if (!prisma) {
    // Parse DATABASE_URL and add connection pool parameters if not present
    const databaseUrl = process.env.DATABASE_URL;
    let pooledUrl = databaseUrl;
    
    // Add connection pooling parameters for Aiven free tier
    if (databaseUrl && !databaseUrl.includes('connection_limit')) {
      const separator = databaseUrl.includes('?') ? '&' : '?';
      pooledUrl = `${databaseUrl}${separator}connection_limit=5&pool_timeout=10&connect_timeout=10`;
    }
    
    prisma = new PrismaClient({
      log: ['error', 'warn'], // Only log errors and warnings
      datasources: {
        db: {
          url: pooledUrl,
        },
      },
    });

    // Graceful shutdown handling
    const cleanup = async () => {
      console.log('🔌 Disconnecting Prisma client...');
      await prisma.$disconnect();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('beforeExit', cleanup);
  }

  return prisma;
}

// Export singleton instance
export const db = getPrismaClient();

// Also export as default for compatibility
export default db;
