// Example: How to use the request queue in your controllers

// OLD WAY (Direct Prisma calls - can overwhelm connection pool):
/*
export async function getAccounts(req, res) {
    const accounts = await prisma.account.findMany({ take: 100 });
    res.json(accounts);
}
*/

// NEW WAY (Using request queue - recommended):

// Example 1: Simple query through queue
export async function getAccounts(req, res) {
    try {
        // Execute query through the queue with default priority
        const accounts = await req.dbQueue.execute(() => 
            req.prisma.account.findMany({ 
                take: 100,
                select: {
                    id: true,
                    username: true,
                    email: true,
                    firstName: true,
                    surname: true,
                    access: true
                }
            })
        );
        
        res.json({ success: true, data: accounts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Example 2: High priority query (for critical operations)
export async function getAccountById(req, res) {
    try {
        const account = await req.dbQueue.execute(() => 
            req.prisma.account.findUnique({
                where: { id: req.params.id }
            }),
            5 // Higher priority (0 is default, higher numbers = higher priority)
        );
        
        res.json({ success: true, data: account });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Example 3: Batch operations (multiple queries at once)
export async function getBulkData(req, res) {
    try {
        // Create array of operations
        const operations = [
            () => req.prisma.account.count(),
            () => req.prisma.inquiry.count(),
            () => req.prisma.seminar.count(),
            () => req.prisma.eic.count()
        ];
        
        // Execute in batches of 5
        const [accountCount, inquiryCount, seminarCount, eicCount] = 
            await req.dbQueue.batch(operations, 5);
        
        res.json({
            success: true,
            data: {
                accounts: accountCount,
                inquiries: inquiryCount,
                seminars: seminarCount,
                eics: eicCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Example 4: Complex query with transactions
export async function createAccountWithProfile(req, res) {
    try {
        const result = await req.dbQueue.execute(async () => {
            // Use Prisma transaction inside the queue
            return await req.prisma.$transaction(async (tx) => {
                const account = await tx.account.create({
                    data: req.body.account
                });
                
                const profile = await tx.userProfile.create({
                    data: {
                        ...req.body.profile,
                        userId: account.id
                    }
                });
                
                return { account, profile };
            });
        }, 3); // Medium-high priority for writes
        
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

// Example 5: Get queue statistics (for monitoring)
export async function getQueueStats(req, res) {
    const stats = req.dbQueue.stats();
    res.json({
        success: true,
        stats: {
            ...stats,
            avgWaitTimeMs: Math.round(stats.avgWaitTime),
            utilizationPercent: Math.round((stats.running / 12) * 100)
        }
    });
}

// BENEFITS:
// 1. Never exceed Aiven's 20 connection limit
// 2. Automatic request queuing during high traffic
// 3. Priority system for critical operations
// 4. Batch processing for efficiency
// 5. Monitoring and statistics
// 6. Automatic connection pooling and reuse
// 7. Graceful handling of connection timeouts
