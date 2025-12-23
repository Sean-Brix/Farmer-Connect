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

    // Modification #5: Prisma Client Extension for archive cascade
    // Auto-archive distributions when planting report is archived
    prisma = prisma.$extends({
      query: {
        plantingReport: {
          async update({ args, query }) {
            // Execute the update
            const result = await query(args);
            
            // Check if report was archived
            if (args.data.isArchived === true) {
              const reportId = args.where.id;
              
              // Get linked transactions
              const report = await prisma.plantingReport.findUnique({
                where: { id: reportId },
                select: { itemTransactions: { select: { id: true } } }
              });

              if (report && report.itemTransactions.length > 0) {
                const now = new Date();
                
                // Update all linked distributions to Archived
                await prisma.itemTransaction.updateMany({
                  where: {
                    plantingReportId: reportId,
                    status: 'Planted'
                  },
                  data: {
                    status: 'Archived',
                    plantingReportArchivedAt: now
                  }
                });

                console.log(`📦 Auto-archived ${report.itemTransactions.length} distribution(s) for report ${reportId}`);
              }
            }
            
            return result;
          }
        }
      }
    });
  }

  return prisma;
}

// Export singleton instance
export const db = getPrismaClient();

// Also export as default for compatibility
export default db;
