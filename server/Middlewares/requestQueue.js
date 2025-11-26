import { PrismaClient } from '@prisma/client';

// Singleton Prisma instance with optimized pool settings for Aiven free tier
let prisma = null;

export function getPrismaClient() {
    if (!prisma) {
        // Pool settings are configured via connection string parameters
        // For Aiven: connection_limit, pool_timeout, etc. are in DATABASE_URL
        prisma = new PrismaClient({
            log: ['error']
        });

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            await prisma?.$disconnect();
        });
        process.on('SIGINT', async () => {
            await prisma?.$disconnect();
        });
    }
    return prisma;
}

// Request queue for managing concurrent database operations
class RequestQueue {
    constructor(maxConcurrent = 10) {  // Max concurrent DB operations (conservative for Aiven free tier)
        this.maxConcurrent = maxConcurrent;
        this.running = 0;
        this.queue = [];
        this.stats = {
            processed: 0,
            queued: 0,
            errors: 0,
            avgWaitTime: 0
        };
    }

    async enqueue(fn, priority = 0) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const task = {
                fn,
                resolve,
                reject,
                priority,
                startTime
            };

            // Priority queue: higher priority first, then FIFO
            const insertIndex = this.queue.findIndex(t => t.priority < priority);
            if (insertIndex === -1) {
                this.queue.push(task);
            } else {
                this.queue.splice(insertIndex, 0, task);
            }

            this.stats.queued++;
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.running >= this.maxConcurrent || this.queue.length === 0) {
            return;
        }

        const task = this.queue.shift();
        if (!task) return;

        this.running++;
        const waitTime = Date.now() - task.startTime;
        this.stats.avgWaitTime = (this.stats.avgWaitTime * this.stats.processed + waitTime) / (this.stats.processed + 1);

        try {
            const result = await task.fn();
            task.resolve(result);
            this.stats.processed++;
        } catch (error) {
            task.reject(error);
            this.stats.errors++;
        } finally {
            this.running--;
            this.processQueue();
        }
    }

    getStats() {
        return {
            ...this.stats,
            running: this.running,
            queued: this.queue.length
        };
    }

    // Batch operations helper
    async batch(operations, batchSize = 5) {
        const results = [];
        for (let i = 0; i < operations.length; i += batchSize) {
            const batch = operations.slice(i, i + batchSize);
            const batchResults = await Promise.all(
                batch.map(op => this.enqueue(op))
            );
            results.push(...batchResults);
            
            // Small delay between batches to prevent overwhelming the pool
            if (i + batchSize < operations.length) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
        return results;
    }
}

// Global queue instance (10 concurrent for safety with 20 connection limit)
const requestQueue = new RequestQueue(10);

// Middleware to attach queue to request
export function requestQueueMiddleware(req, res, next) {
    // Attach Prisma client to request
    req.prisma = getPrismaClient();
    
    // Attach queue helpers to request
    req.dbQueue = {
        // Execute a database operation through the queue
        execute: (fn, priority = 0) => requestQueue.enqueue(fn, priority),
        
        // Execute multiple operations in batches
        batch: (operations, batchSize) => requestQueue.batch(operations, batchSize),
        
        // Get queue statistics
        stats: () => requestQueue.getStats()
    };

    next();
}

// Response time tracking middleware
export function requestTimingMiddleware(req, res, next) {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        // Slow request monitoring disabled for cleaner logs
    });
    
    next();
}

// Health check endpoint helper
export function getHealthStats() {
    return {
        queue: requestQueue.getStats(),
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
            rss: Math.round(process.memoryUsage().rss / 1024 / 1024)
        },
        uptime: Math.round(process.uptime())
    };
}

export { requestQueue };
