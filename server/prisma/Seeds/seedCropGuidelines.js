import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path is relative to server/prisma/Seeds/
const cropGuidelinesData = JSON.parse(
  readFileSync(join(__dirname, '../../../client/src/data/cropGuidelinesData.json'), 'utf-8')
);

const prisma = new PrismaClient();

const seedCropGuidelines = async () => {
  console.log('🌱 Seeding crop guidelines...');

  try {
    // Clear existing guidelines
    await prisma.cropGuidelineStage.deleteMany({});
    await prisma.cropGuideline.deleteMany({});

    console.log('   Cleared existing crop guidelines');

    // Map category names from JSON to database enum values
    const categoryMap = {
      'cereals': 'Cereals',
      'vegetables': 'Vegetables',
      'fruits': 'Fruits',
      'legumes': 'Legumes',
      'root_crops': 'Root_Crops',
      'herbs_spices': 'Herbs_Spices'
    };

    // Map profitability from JSON to database enum
    const profitabilityMap = {
      'High': 'High',
      'Very High': 'Very_High',
      'Moderate': 'Moderate',
      'Low': 'Low'
    };

    // Map difficulty from JSON to database enum
    const difficultyMap = {
      'Easy': 'Easy',
      'Moderate': 'Moderate',
      'Moderate-High': 'Moderate_High',
      'High': 'High'
    };

    // Seed each crop from the JSON data
    for (const crop of cropGuidelinesData.crops) {
      const guideline = await prisma.cropGuideline.create({
        data: {
          name: crop.name,
          category: categoryMap[crop.category] || 'Vegetables',
          varieties: JSON.stringify(crop.varieties || []),
          plantingSeasons: JSON.stringify(crop.plantingSeasons || []),
          growingPeriod: crop.growingPeriod || '',
          waterRequirements: crop.waterRequirements || '',
          expectedYield: crop.expectedYield || '',
          soilType: crop.soilType || '',
          climate: crop.climate || '',
          spacing: crop.spacing || '',
          fertilizer: crop.fertilizer || '',
          keyTips: JSON.stringify(crop.keyTips || []),
          commonPests: JSON.stringify(crop.commonPests || []),
          diseases: JSON.stringify(crop.diseases || []),
          marketPrice: crop.marketPrice || '',
          profitability: profitabilityMap[crop.profitability] || 'Moderate',
          difficulty: difficultyMap[crop.difficulty] || 'Moderate',
          isActive: true,
          stages: {
            create: crop.stages.map((stage, index) => ({
              stageName: stage.stage,
              duration: stage.duration,
              description: stage.description,
              activities: JSON.stringify(stage.activities || []),
              sequenceOrder: index
            }))
          }
        }
      });

      console.log(`   ✓ Created guideline for ${guideline.name}`);
    }

    console.log(`✓ [CropGuidelines] DONE - Seeded ${cropGuidelinesData.crops.length} guidelines`);
  } catch (error) {
    console.error('Error seeding crop guidelines:', error);
    throw error;
  }
};

export default seedCropGuidelines;

// Run if this file is executed directly
const metaUrl = import.meta.url.replace(/\\/g, '/');
const argvPath = `file:///${process.argv[1].replace(/\\/g, '/')}`;

console.log('Meta URL:', metaUrl);
console.log('Argv path:', argvPath);
console.log('Match:', metaUrl === argvPath);

if (metaUrl.includes('seedCropGuidelines.js')) {
  console.log('Running seed...');
  seedCropGuidelines()
    .then(() => {
      console.log('Crop guidelines seeding complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error seeding crop guidelines:', error);
      process.exit(1);
    });
} else {
  console.log('Not running as main module');
}
