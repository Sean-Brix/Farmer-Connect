import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Migrate old picturePath format (userId_timestamp.jpg) to new format (userId.jpg)
 * This script updates the database to use the simplified naming convention
 */
async function migratePicturePaths() {
    console.log('🔄 Starting picturePath migration...\n');
    
    try {
        // Get all accounts with picturePath
        const accounts = await prisma.account.findMany({
            where: {
                picturePath: {
                    not: null
                }
            },
            select: {
                id: true,
                username: true,
                picturePath: true
            }
        });

        console.log(`Found ${accounts.length} accounts with profile pictures\n`);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const account of accounts) {
            // Check if picturePath contains timestamp (old format: userId_timestamp.jpg)
            const oldFormatPattern = new RegExp(`accounts/${account.id}_\\d+\\.jpg`);
            
            if (oldFormatPattern.test(account.picturePath)) {
                // Update to new format: userId.jpg
                const newPath = `accounts/${account.id}.jpg`;
                
                await prisma.account.update({
                    where: { id: account.id },
                    data: { picturePath: newPath }
                });
                
                console.log(`✅ Updated: ${account.username} (${account.id})`);
                console.log(`   Old: ${account.picturePath}`);
                console.log(`   New: ${newPath}\n`);
                updatedCount++;
            } else {
                console.log(`⏭️  Skipped: ${account.username} - already using new format`);
                skippedCount++;
            }
        }

        console.log('\n📊 Migration Summary:');
        console.log(`   Total accounts: ${accounts.length}`);
        console.log(`   Updated: ${updatedCount}`);
        console.log(`   Skipped: ${skippedCount}`);
        console.log('\n✨ Migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Error during migration:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the migration
migratePicturePaths()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
