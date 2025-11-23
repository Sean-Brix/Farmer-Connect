import { PrismaClient } from '@prisma/client';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { app } from '../config/firebase.js';
import fetch from 'node-fetch';

const prisma = new PrismaClient();
const storage = getStorage(app);

/**
 * Copy old profile pictures to new naming format in Firebase Storage
 * Old format: accounts/userId_timestamp.jpg
 * New format: accounts/userId.jpg
 */
async function copyFirebaseImages() {
    console.log('🔄 Starting Firebase image migration...\n');
    
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

        console.log(`Found ${accounts.length} accounts to process\n`);

        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;

        for (const account of accounts) {
            const newPath = `accounts/${account.id}.jpg`;
            
            // Check if we need to copy from old location
            const oldPathPattern = new RegExp(`accounts/${account.id}_(\\d+)\\.jpg`);
            const match = account.picturePath.match(oldPathPattern);
            
            if (match) {
                const oldPath = account.picturePath;
                
                try {
                    console.log(`📥 Processing: ${account.username}`);
                    console.log(`   Copying from: ${oldPath}`);
                    console.log(`   To: ${newPath}`);
                    
                    // Get the old file URL
                    const oldRef = ref(storage, oldPath);
                    const oldUrl = await getDownloadURL(oldRef);
                    
                    // Download the image data
                    const response = await fetch(oldUrl);
                    if (!response.ok) {
                        throw new Error(`Failed to download: ${response.statusText}`);
                    }
                    const imageBuffer = await response.buffer();
                    
                    // Upload to new location
                    const newRef = ref(storage, newPath);
                    await uploadBytes(newRef, imageBuffer, {
                        contentType: 'image/jpeg',
                        cacheControl: 'public, max-age=3600'
                    });
                    
                    console.log(`   ✅ Successfully copied\n`);
                    successCount++;
                    
                } catch (error) {
                    console.error(`   ❌ Error: ${error.message}\n`);
                    errorCount++;
                }
            } else {
                console.log(`⏭️  Skipped: ${account.username} - using correct format already\n`);
                skippedCount++;
            }
        }

        console.log('\n📊 Migration Summary:');
        console.log(`   Total accounts: ${accounts.length}`);
        console.log(`   Successfully copied: ${successCount}`);
        console.log(`   Errors: ${errorCount}`);
        console.log(`   Skipped: ${skippedCount}`);
        console.log('\n✨ Firebase migration completed!');
        
    } catch (error) {
        console.error('❌ Fatal error during migration:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the migration
copyFirebaseImages()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
