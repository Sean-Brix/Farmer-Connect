import { PrismaClient } from '@prisma/client';

const seedCropGuidelines = async (prisma) => {
  try {
    // Clear existing guidelines and stages
    await prisma.cropGuidelineStage.deleteMany({});
    await prisma.cropGuideline.deleteMany({});

    const guidelines = [
      {
        name: 'Rice (Inbred)',
        category: 'Cereals',
        varieties: JSON.stringify(['NSIC Rc222', 'PSB Rc18', 'NSIC Rc160', 'NSIC Rc358']),
        plantingSeasons: JSON.stringify(['Wet season (June-November)', 'Dry season (December-May)']),
        growingPeriod: '110-120 days',
        waterRequirements: 'High - Requires flooded conditions',
        expectedYield: '4-6 tons/hectare',
        soilType: 'Clay loam to silty clay loam, pH 5.5-6.5',
        climate: 'Tropical, temperatures 21-37°C',
        spacing: '20cm x 20cm (25 hills/m²)',
        fertilizer: 'Basal: 14-14-14 (2 bags/ha), Topdressing: Urea (1 bag/ha at 21 DAT and 42 DAT)',
        keyTips: JSON.stringify([
          'Use certified seeds for better yield',
          'Maintain 2-3 cm water depth during vegetative stage',
          'Apply fertilizer when soil is moist',
          'Control golden snail during early growth'
        ]),
        commonPests: JSON.stringify([
          { name: 'Rice Bug', control: 'Use insecticides like Lambda-cyhalothrin' },
          { name: 'Stem Borer', control: 'Apply Chlorantraniliprole' },
          { name: 'Golden Snail', control: 'Handpicking and use of Niclosamide' }
        ]),
        diseases: JSON.stringify([
          { name: 'Rice Blast', symptoms: 'Diamond-shaped lesions on leaves' },
          { name: 'Bacterial Leaf Blight', symptoms: 'Yellow to white lesions on leaf tips' }
        ]),
        marketPrice: '₱18-22/kg',
        profitability: 'High',
        difficulty: 'Moderate',
        isActive: true,
        stages: {
          create: [
            {
              stageName: 'Land Preparation',
              duration: '14-21 days',
              description: 'Prepare the field for planting by plowing, harrowing, and leveling',
              activities: JSON.stringify([
                'Clear the field of weeds and crop residues',
                'Plow the field 2-3 times',
                'Harrow to break soil clods',
                'Level the field properly',
                'Construct bunds and irrigation canals'
              ]),
              sequenceOrder: 0
            },
            {
              stageName: 'Seedling/Establishment',
              duration: '21 days',
              description: 'Transplant seedlings and ensure proper establishment',
              activities: JSON.stringify([
                'Transplant 21-day old seedlings',
                'Plant 2-3 seedlings per hill',
                'Maintain 2-3 cm water depth',
                'Replace missing hills within 7 days',
                'Control golden snails'
              ]),
              sequenceOrder: 1
            },
            {
              stageName: 'Vegetative',
              duration: '35-40 days',
              description: 'Active tillering and leaf development phase',
              activities: JSON.stringify([
                'Apply first topdress fertilizer at 21 DAT',
                'Maintain 5-7 cm water depth',
                'Weed control (manual or herbicide)',
                'Monitor for pests and diseases',
                'Apply second topdress at 42 DAT'
              ]),
              sequenceOrder: 2
            },
            {
              stageName: 'Reproductive',
              duration: '35 days',
              description: 'Panicle initiation, flowering, and grain formation',
              activities: JSON.stringify([
                'Maintain consistent water level',
                'Monitor for rice bugs and stem borers',
                'Avoid pesticide application during flowering',
                'Scout for diseases regularly',
                'Ensure proper drainage to prevent lodging'
              ]),
              sequenceOrder: 3
            },
            {
              stageName: 'Maturity',
              duration: '15-20 days',
              description: 'Grain filling and ripening phase',
              activities: JSON.stringify([
                'Drain field 14 days before harvest',
                'Monitor grain moisture content',
                'Prevent bird damage',
                'Plan harvest schedule',
                'Prepare harvesting equipment'
              ]),
              sequenceOrder: 4
            },
            {
              stageName: 'Harvest',
              duration: '3-5 days',
              description: 'Harvest when grains are mature',
              activities: JSON.stringify([
                'Harvest at 20-25% moisture content',
                'Cut stalks 20-25 cm from ground',
                'Thresh immediately to prevent grain loss',
                'Dry to 14% moisture for storage',
                'Clean and store properly'
              ]),
              sequenceOrder: 5
            }
          ]
        }
      },
      {
        name: 'Corn (Sweet Corn)',
        category: 'Cereals',
        varieties: JSON.stringify(['Sweet Grande', 'Honey Bantam', 'Golden Cross Bantam']),
        plantingSeasons: JSON.stringify(['Year-round with irrigation', 'Dry season (Dec-May) preferred']),
        growingPeriod: '65-75 days',
        waterRequirements: 'Moderate - Critical during silking and grain filling',
        expectedYield: '8-12 tons/hectare (fresh ears)',
        soilType: 'Well-drained loam, pH 5.8-7.0',
        climate: 'Warm season crop, 18-30°C optimal',
        spacing: '75cm x 25cm (2 plants per hill)',
        fertilizer: 'Basal: 14-14-14 (3 bags/ha), Sidedress: Urea (2 bags/ha at 30 DAP)',
        keyTips: JSON.stringify([
          'Plant in blocks for better pollination',
          'Harvest at milk stage for sweet corn',
          'Ensure adequate water during tasseling',
          'Control armyworms early'
        ]),
        commonPests: JSON.stringify([
          { name: 'Corn Borer', control: 'Apply Bt or chemical insecticides' },
          { name: 'Armyworm', control: 'Use Chlorantraniliprole or Emamectin benzoate' },
          { name: 'Corn Earworm', control: 'Apply mineral oil to silk' }
        ]),
        diseases: JSON.stringify([
          { name: 'Downy Mildew', symptoms: 'White growth on leaves, stunted plants' },
          { name: 'Leaf Blight', symptoms: 'Brown lesions on leaves' }
        ]),
        marketPrice: '₱35-50/kg (fresh ears)',
        profitability: 'Very_High',
        difficulty: 'Easy',
        isActive: true,
        stages: {
          create: [
            {
              stageName: 'Land Preparation',
              duration: '7-14 days',
              description: 'Prepare soil for planting',
              activities: JSON.stringify([
                'Plow and harrow the field',
                'Make furrows 75cm apart',
                'Apply organic matter if available',
                'Ensure good drainage'
              ]),
              sequenceOrder: 0
            },
            {
              stageName: 'Seedling',
              duration: '10-15 days',
              description: 'Germination and early growth',
              activities: JSON.stringify([
                'Direct seed 2-3 seeds per hill',
                'Apply basal fertilizer',
                'Thin to 2 plants per hill at 10 DAP',
                'Control weeds and cutworms',
                'Light irrigation if needed'
              ]),
              sequenceOrder: 1
            },
            {
              stageName: 'Vegetative',
              duration: '25-30 days',
              description: 'Rapid growth and leaf development',
              activities: JSON.stringify([
                'Apply sidedress fertilizer at 30 DAP',
                'Hilling up to support plants',
                'Regular weeding',
                'Monitor for pests and diseases',
                'Ensure adequate moisture'
              ]),
              sequenceOrder: 2
            },
            {
              stageName: 'Reproductive',
              duration: '20-25 days',
              description: 'Tasseling, silking, and pollination',
              activities: JSON.stringify([
                'Ensure consistent moisture',
                'Monitor for corn borers',
                'Remove weak plants',
                'Scout for armyworms daily',
                'Apply insecticides if needed'
              ]),
              sequenceOrder: 3
            },
            {
              stageName: 'Maturity',
              duration: '5-10 days',
              description: 'Ear development and grain filling',
              activities: JSON.stringify([
                'Check ears daily for maturity',
                'Harvest at milk stage for sweet corn',
                'Test kernels by pressing with fingernail',
                'Prevent bird and rodent damage',
                'Plan harvest and marketing'
              ]),
              sequenceOrder: 4
            }
          ]
        }
      },
      {
        name: 'Tomato',
        category: 'Vegetables',
        varieties: JSON.stringify(['Diamante Max', 'Apollo', 'Beetle', 'Roma VF']),
        plantingSeasons: JSON.stringify(['October-February (cool/dry season)', 'Year-round in highland areas']),
        growingPeriod: '75-90 days from transplanting',
        waterRequirements: 'Moderate - Consistent moisture needed',
        expectedYield: '20-30 tons/hectare',
        soilType: 'Sandy loam to clay loam, pH 6.0-6.8',
        climate: 'Cool season crop, 18-27°C optimal',
        spacing: '75cm x 50cm with staking',
        fertilizer: 'Basal: 14-14-14 (4 bags/ha), Weekly: Foliar fertilizer, Fruiting: 0-0-60',
        keyTips: JSON.stringify([
          'Use disease-resistant varieties',
          'Stake plants for better fruit quality',
          'Prune suckers for determinate types',
          'Mulch to conserve moisture and prevent soil-borne diseases'
        ]),
        commonPests: JSON.stringify([
          { name: 'Fruit Borer', control: 'Use pheromone traps and Bt sprays' },
          { name: 'Whitefly', control: 'Apply Imidacloprid or yellow sticky traps' },
          { name: 'Aphids', control: 'Spray with insecticidal soap or Acetamiprid' }
        ]),
        diseases: JSON.stringify([
          { name: 'Late Blight', symptoms: 'Brown lesions on leaves and fruits' },
          { name: 'Bacterial Wilt', symptoms: 'Sudden wilting of entire plant' },
          { name: 'Early Blight', symptoms: 'Concentric rings on older leaves' }
        ]),
        marketPrice: '₱40-80/kg',
        profitability: 'High',
        difficulty: 'Moderate_High',
        isActive: true,
        stages: {
          create: [
            {
              stageName: 'Seedbed Preparation',
              duration: '21-28 days',
              description: 'Raise seedlings in seedbed or trays',
              activities: JSON.stringify([
                'Prepare seedbed with good soil mix',
                'Sow seeds thinly',
                'Water regularly but avoid overwatering',
                'Protect from heavy rain',
                'Harden seedlings before transplanting'
              ]),
              sequenceOrder: 0
            },
            {
              stageName: 'Transplanting & Establishment',
              duration: '14 days',
              description: 'Transplant seedlings to final location',
              activities: JSON.stringify([
                'Transplant 3-4 week old seedlings',
                'Water immediately after transplanting',
                'Apply starter fertilizer',
                'Install stakes or trellises',
                'Replace dead seedlings within 7 days'
              ]),
              sequenceOrder: 1
            },
            {
              stageName: 'Vegetative',
              duration: '21-28 days',
              description: 'Rapid plant growth and branching',
              activities: JSON.stringify([
                'Apply sidedress fertilizer',
                'Regular weeding and cultivation',
                'Tie plants to stakes',
                'Prune suckers if needed',
                'Monitor for early pests and diseases'
              ]),
              sequenceOrder: 2
            },
            {
              stageName: 'Flowering',
              duration: '14-21 days',
              description: 'Flower development and fruit set',
              activities: JSON.stringify([
                'Ensure consistent moisture',
                'Apply potassium-rich fertilizer',
                'Control fruit borers',
                'Remove diseased plant parts',
                'Apply foliar fertilizer weekly'
              ]),
              sequenceOrder: 3
            },
            {
              stageName: 'Fruiting',
              duration: '21-35 days',
              description: 'Fruit development and ripening',
              activities: JSON.stringify([
                'Harvest ripe fruits regularly',
                'Continue pest and disease monitoring',
                'Maintain adequate moisture',
                'Remove overripe or damaged fruits',
                'Apply fungicides preventively'
              ]),
              sequenceOrder: 4
            }
          ]
        }
      },
      {
        name: 'Eggplant',
        category: 'Vegetables',
        varieties: JSON.stringify(['Mara', 'Morena', 'Condor', 'Long Purple']),
        plantingSeasons: JSON.stringify(['Year-round', 'Best during dry season (Nov-May)']),
        growingPeriod: '90-120 days from transplanting',
        waterRequirements: 'Moderate - Regular watering needed',
        expectedYield: '15-25 tons/hectare',
        soilType: 'Well-drained loam, pH 5.5-6.8',
        climate: 'Warm season crop, 21-30°C',
        spacing: '75cm x 50cm',
        fertilizer: 'Basal: 14-14-14 (3 bags/ha), Sidedress: Complete fertilizer every 2 weeks',
        keyTips: JSON.stringify([
          'Transplant during cool hours',
          'Mulch around plants',
          'Prune to 2-3 main stems for better fruit size',
          'Harvest young for tender fruits'
        ]),
        commonPests: JSON.stringify([
          { name: 'Fruit and Shoot Borer', control: 'Remove and destroy infested shoots, apply insecticides' },
          { name: 'Epilachna Beetle', control: 'Handpick adults and larvae, use botanical insecticides' },
          { name: 'Aphids', control: 'Spray with soap solution or systemic insecticides' }
        ]),
        diseases: JSON.stringify([
          { name: 'Bacterial Wilt', symptoms: 'Sudden wilting without yellowing' },
          { name: 'Phomopsis Blight', symptoms: 'Oval lesions on leaves and fruits' },
          { name: 'Little Leaf', symptoms: 'Stunted growth with small leaves' }
        ]),
        marketPrice: '₱30-60/kg',
        profitability: 'High',
        difficulty: 'Moderate',
        isActive: true,
        stages: {
          create: [
            {
              stageName: 'Seedbed',
              duration: '21-28 days',
              description: 'Raise healthy seedlings',
              activities: JSON.stringify([
                'Sow seeds in seedbed or trays',
                'Maintain moisture',
                'Protect from heavy rain and pests',
                'Harden seedlings 1 week before transplanting'
              ]),
              sequenceOrder: 0
            },
            {
              stageName: 'Transplanting',
              duration: '10-14 days',
              description: 'Establish seedlings in field',
              activities: JSON.stringify([
                'Transplant 3-4 week old seedlings',
                'Apply basal fertilizer',
                'Water immediately',
                'Mulch around plants',
                'Replace missing plants'
              ]),
              sequenceOrder: 1
            },
            {
              stageName: 'Vegetative',
              duration: '30-35 days',
              description: 'Active growth phase',
              activities: JSON.stringify([
                'Sidedress fertilizer every 2 weeks',
                'Weed regularly',
                'Prune to 2-3 stems',
                'Monitor for shoot borers',
                'Ensure adequate moisture'
              ]),
              sequenceOrder: 2
            },
            {
              stageName: 'Flowering & Fruiting',
              duration: '45-60 days',
              description: 'Continuous flowering and fruit production',
              activities: JSON.stringify([
                'Regular harvesting (every 3-4 days)',
                'Continue fertilizer application',
                'Control fruit and shoot borers',
                'Remove diseased fruits and shoots',
                'Maintain consistent moisture'
              ]),
              sequenceOrder: 3
            }
          ]
        }
      },
      {
        name: 'Banana (Lakatan)',
        category: 'Fruits',
        varieties: JSON.stringify(['Lakatan', 'Bungulan', 'Morado']),
        plantingSeasons: JSON.stringify(['Start of rainy season (May-July)', 'With irrigation: year-round']),
        growingPeriod: '10-12 months to first harvest',
        waterRequirements: 'High - Requires consistent moisture',
        expectedYield: '15-25 kg/plant, 20-30 tons/hectare',
        soilType: 'Deep, well-drained loam, pH 6.0-7.5',
        climate: 'Tropical, 25-30°C optimal',
        spacing: '2m x 2m or 3m x 3m (depending on variety)',
        fertilizer: '1kg 14-14-14 per plant every 3 months, increase during fruiting',
        keyTips: JSON.stringify([
          'Use tissue culture or certified suckers',
          'Ensure good drainage to prevent root rot',
          'Desuckering for better fruit quality',
          'Mulch heavily to conserve moisture'
        ]),
        commonPests: JSON.stringify([
          { name: 'Banana Weevil', control: 'Use pheromone traps and clean cultivation' },
          { name: 'Nematodes', control: 'Use clean planting material, crop rotation' },
          { name: 'Aphids (virus vectors)', control: 'Apply systemic insecticides' }
        ]),
        diseases: JSON.stringify([
          { name: 'Panama Disease (Fusarium Wilt)', symptoms: 'Yellowing and wilting of older leaves' },
          { name: 'Bunchy Top Virus', symptoms: 'Stunted growth, narrow upright leaves' },
          { name: 'Sigatoka', symptoms: 'Brown/black streaks on leaves' }
        ]),
        marketPrice: '₱40-70/kg',
        profitability: 'Very_High',
        difficulty: 'Moderate',
        isActive: true,
        stages: {
          create: [
            {
              stageName: 'Land Preparation & Planting',
              duration: '14-21 days',
              description: 'Prepare field and plant suckers',
              activities: JSON.stringify([
                'Plow and harrow the field',
                'Dig planting holes 30x30x30cm',
                'Apply organic matter and basal fertilizer',
                'Plant tissue culture or sword suckers',
                'Mulch around plants'
              ]),
              sequenceOrder: 0
            },
            {
              stageName: 'Establishment',
              duration: '60-90 days',
              description: 'Root and shoot development',
              activities: JSON.stringify([
                'Water regularly during dry periods',
                'Apply first fertilizer application',
                'Control weeds through mulching',
                'Monitor for pests and diseases',
                'Ensure proper drainage'
              ]),
              sequenceOrder: 1
            },
            {
              stageName: 'Vegetative Growth',
              duration: '120-180 days',
              description: 'Rapid leaf production',
              activities: JSON.stringify([
                'Fertilize every 3 months',
                'Desuckering - leave 1 follower',
                'Remove dead leaves',
                'Monitor for weevils and nematodes',
                'Maintain mulch layer'
              ]),
              sequenceOrder: 2
            },
            {
              stageName: 'Flowering',
              duration: '60-90 days',
              description: 'Flower emergence and fruit development',
              activities: JSON.stringify([
                'Increase fertilizer application',
                'Support bunch with bamboo pole if needed',
                'Remove male bud after last hand forms',
                'Cover bunch with plastic or cloth bag',
                'Control pests that damage fruits'
              ]),
              sequenceOrder: 3
            },
            {
              stageName: 'Fruit Development',
              duration: '90-120 days',
              description: 'Fruit filling and maturation',
              activities: JSON.stringify([
                'Monitor fruit maturity',
                'Harvest when fingers are full and rounded',
                'Cut bunch carefully to avoid damage',
                'Handle fruits properly to prevent bruising',
                'Allow follower sucker to develop for next crop'
              ]),
              sequenceOrder: 4
            }
          ]
        }
      },
      {
        name: 'Mango',
        category: 'Fruits',
        varieties: JSON.stringify(['Carabao', 'Pico', 'Indian Mango']),
        plantingSeasons: JSON.stringify(['Start of rainy season (June-July)']),
        growingPeriod: '3-5 years to first commercial harvest',
        waterRequirements: 'Low to Moderate - Drought tolerant when established',
        expectedYield: '100-200 kg/tree (mature tree)',
        soilType: 'Well-drained sandy loam to clay loam, pH 5.5-7.5',
        climate: 'Tropical to subtropical, dry season important for flowering',
        spacing: '8m x 8m to 10m x 10m',
        fertilizer: 'Young trees: 100-200g 14-14-14/tree/month, Bearing trees: 2-5 kg/tree/year',
        keyTips: JSON.stringify([
          'Induce flowering using potassium nitrate spray',
          'Prune to maintain tree height at 3-4 meters',
          'Thin fruits for better size and quality',
          'Protect young fruits from fruit flies'
        ]),
        commonPests: JSON.stringify([
          { name: 'Mango Fruit Fly', control: 'Protein bait spray, fruit bagging' },
          { name: 'Mango Hopper', control: 'Apply insecticides during flowering' },
          { name: 'Mango Weevil', control: 'Collect and destroy fallen fruits' }
        ]),
        diseases: JSON.stringify([
          { name: 'Anthracnose', symptoms: 'Black spots on fruits and leaves' },
          { name: 'Powdery Mildew', symptoms: 'White powder on flowers and young leaves' },
          { name: 'Stem End Rot', symptoms: 'Fruit decay starting from stem end' }
        ]),
        marketPrice: '₱60-120/kg',
        profitability: 'Very_High',
        difficulty: 'Moderate_High',
        isActive: true,
        stages: {
          create: [
            {
              stageName: 'Planting',
              duration: '365 days',
              description: 'First year establishment',
              activities: JSON.stringify([
                'Dig planting hole 1m x 1m x 1m',
                'Mix soil with organic matter and fertilizer',
                'Plant grafted seedlings at start of rainy season',
                'Water regularly during first year',
                'Stake young trees for support',
                'Apply fertilizer monthly'
              ]),
              sequenceOrder: 0
            },
            {
              stageName: 'Vegetative Growth',
              duration: '730-1095 days',
              description: 'Years 2-3: Tree development',
              activities: JSON.stringify([
                'Prune to develop good tree structure',
                'Increase fertilizer as tree grows',
                'Control weeds in basin',
                'Monitor for pests and diseases',
                'Maintain mulch around tree'
              ]),
              sequenceOrder: 1
            },
            {
              stageName: 'First Flowering',
              duration: '90-120 days',
              description: 'Initial fruit production (year 3-4)',
              activities: JSON.stringify([
                'Apply flower induction spray (potassium nitrate)',
                'Spray fungicide during flowering',
                'Control mango hoppers',
                'Remove excess flowers if needed',
                'Apply high potassium fertilizer'
              ]),
              sequenceOrder: 2
            },
            {
              stageName: 'Fruit Development',
              duration: '120-150 days',
              description: 'From fruit set to harvest',
              activities: JSON.stringify([
                'Thin fruits - leave 1-2 fruits per panicle',
                'Bag fruits to prevent fruit fly',
                'Apply calcium spray for fruit quality',
                'Monitor for anthracnose',
                'Harvest at mature green or ripe stage'
              ]),
              sequenceOrder: 3
            },
            {
              stageName: 'Post-Harvest & Maintenance',
              duration: '90-120 days',
              description: 'Tree recovery and next season prep',
              activities: JSON.stringify([
                'Prune after harvest',
                'Apply organic fertilizer',
                'Control pests and diseases',
                'Prepare for next flowering cycle',
                'Clean orchard of fallen fruits'
              ]),
              sequenceOrder: 4
            }
          ]
        }
      },
      {
        name: 'Mongo (Mung Bean)',
        category: 'Legumes',
        varieties: JSON.stringify(['Pagasa 1', 'Pagasa 3', 'Pagasa 7', 'NSIC Mg14']),
        plantingSeasons: JSON.stringify(['Dry season (January-April)', 'Wet season (July-September)']),
        growingPeriod: '60-65 days',
        waterRequirements: 'Low to Moderate - Drought tolerant',
        expectedYield: '0.8-1.2 tons/hectare',
        soilType: 'Sandy loam to clay loam, pH 6.0-7.5',
        climate: 'Warm season crop, 25-35°C',
        spacing: '40cm x 10cm',
        fertilizer: 'Basal: 14-14-14 (1 bag/ha), Inoculate seeds with Rhizobium',
        keyTips: JSON.stringify([
          'Inoculate seeds for better nitrogen fixation',
          'Plant in well-prepared seedbed',
          'Harvest when 80% of pods are mature',
          'Dry seeds properly before storage'
        ]),
        commonPests: JSON.stringify([
          { name: 'Pod Borer', control: 'Apply Bt or synthetic insecticides at podding' },
          { name: 'Aphids', control: 'Spray with insecticidal soap early' },
          { name: 'Bean Fly', control: 'Seed treatment with systemic insecticides' }
        ]),
        diseases: JSON.stringify([
          { name: 'Powdery Mildew', symptoms: 'White fungal growth on leaves' },
          { name: 'Yellow Mosaic Virus', symptoms: 'Yellow mottling on leaves' },
          { name: 'Cercospora Leaf Spot', symptoms: 'Brown spots with yellow halo' }
        ]),
        marketPrice: '₱60-90/kg',
        profitability: 'Moderate',
        difficulty: 'Easy',
        isActive: true,
        stages: {
          create: [
            {
              stageName: 'Land Preparation',
              duration: '7 days',
              description: 'Prepare soil for planting',
              activities: JSON.stringify([
                'Plow and harrow the field',
                'Level the field',
                'Make furrows 40cm apart',
                'Ensure good drainage'
              ]),
              sequenceOrder: 0
            },
            {
              stageName: 'Germination',
              duration: '7-10 days',
              description: 'Seed emergence',
              activities: JSON.stringify([
                'Broadcast or drill seeds',
                'Apply basal fertilizer',
                'Light irrigation if needed',
                'Monitor for bean fly damage',
                'Ensure good plant stand'
              ]),
              sequenceOrder: 1
            },
            {
              stageName: 'Vegetative',
              duration: '20-25 days',
              description: 'Leaf and stem development',
              activities: JSON.stringify([
                'Weed control (manual or chemical)',
                'Thin if too dense',
                'Monitor for aphids',
                'Light cultivation',
                'No fertilizer needed if inoculated'
              ]),
              sequenceOrder: 2
            },
            {
              stageName: 'Flowering & Podding',
              duration: '20-25 days',
              description: 'Flower and pod development',
              activities: JSON.stringify([
                'Monitor for pod borers',
                'Apply insecticide at early podding',
                'Ensure adequate moisture',
                'Scout for diseases',
                'Avoid overhead irrigation'
              ]),
              sequenceOrder: 3
            },
            {
              stageName: 'Maturity & Harvest',
              duration: '7-10 days',
              description: 'Pod maturation and harvest',
              activities: JSON.stringify([
                'Harvest when 80% pods are brown',
                'Pull or cut plants',
                'Dry in sun for 2-3 days',
                'Thresh when fully dry',
                'Clean and store seeds properly'
              ]),
              sequenceOrder: 4
            }
          ]
        }
      },
      {
        name: 'Peanut (Groundnut)',
        category: 'Legumes',
        varieties: JSON.stringify(['PN 19', 'PN 20', 'PN 21', 'Tinutong']),
        plantingSeasons: JSON.stringify(['Dry season (November-February)', 'Early wet season (May-June)']),
        growingPeriod: '90-120 days',
        waterRequirements: 'Moderate - Critical during flowering and pegging',
        expectedYield: '1.5-2.5 tons/hectare',
        soilType: 'Sandy loam, well-drained, pH 5.5-6.5',
        climate: 'Warm season, 25-30°C optimal',
        spacing: '40cm x 15cm',
        fertilizer: 'Basal: 14-14-14 (2 bags/ha), Gypsum: 200 kg/ha at flowering',
        keyTips: JSON.stringify([
          'Apply gypsum at flowering for better pod filling',
          'Hill up soil around plants at flowering',
          'Harvest when leaves turn yellow',
          'Cure pods properly before shelling'
        ]),
        commonPests: JSON.stringify([
          { name: 'Leaf Miner', control: 'Apply systemic insecticides' },
          { name: 'Aphids', control: 'Insecticidal soap or chemical spray' },
          { name: 'Termites', control: 'Soil treatment before planting' }
        ]),
        diseases: JSON.stringify([
          { name: 'Leaf Spot', symptoms: 'Brown spots on leaves with yellow halo' },
          { name: 'Rust', symptoms: 'Orange pustules on lower leaf surface' },
          { name: 'Root Rot', symptoms: 'Wilting and yellowing of plants' }
        ]),
        marketPrice: '₱80-120/kg',
        profitability: 'High',
        difficulty: 'Easy',
        isActive: true,
        stages: {
          create: [
            {
              stageName: 'Land Preparation',
              duration: '7-10 days',
              description: 'Prepare friable soil',
              activities: JSON.stringify([
                'Deep plowing (20-25 cm)',
                'Harrow 2-3 times',
                'Level the field',
                'Make furrows 40cm apart',
                'Apply basal fertilizer'
              ]),
              sequenceOrder: 0
            },
            {
              stageName: 'Germination',
              duration: '7-10 days',
              description: 'Seed emergence and establishment',
              activities: JSON.stringify([
                'Plant shelled seeds',
                'Cover lightly with soil',
                'Light irrigation',
                'Monitor for seed beetles',
                'Ensure 85-90% germination'
              ]),
              sequenceOrder: 1
            },
            {
              stageName: 'Vegetative',
              duration: '25-35 days',
              description: 'Leaf and branch development',
              activities: JSON.stringify([
                'Weed control (2-3 times)',
                'First cultivation at 15 DAP',
                'Monitor for leaf miners',
                'Ensure adequate moisture',
                'Scout for early leaf spot'
              ]),
              sequenceOrder: 2
            },
            {
              stageName: 'Flowering & Pegging',
              duration: '30-40 days',
              description: 'Flower production and peg penetration',
              activities: JSON.stringify([
                'Apply gypsum (200 kg/ha)',
                'Hill up soil around plants',
                'Maintain consistent moisture',
                'Control aphids and thrips',
                'Avoid disturbing pegs'
              ]),
              sequenceOrder: 3
            },
            {
              stageName: 'Pod Development',
              duration: '20-30 days',
              description: 'Pod filling and maturation',
              activities: JSON.stringify([
                'Reduce irrigation near maturity',
                'Monitor for termites',
                'Check pod maturity by digging test plants',
                'Plan harvest when leaves turn yellow'
              ]),
              sequenceOrder: 4
            },
            {
              stageName: 'Harvest & Curing',
              duration: '7-10 days',
              description: 'Digging, drying, and storage',
              activities: JSON.stringify([
                'Dig plants carefully',
                'Shake off excess soil',
                'Dry in windrows for 3-5 days',
                'Shell when fully dry',
                'Store in cool, dry place'
              ]),
              sequenceOrder: 5
            }
          ]
        }
      },
      {
        name: 'Sweet Potato (Kamote)',
        category: 'Root_Crops',
        varieties: JSON.stringify(['VSP', 'PSB Sp 8', 'Inabanga 5', 'VIS 005']),
        plantingSeasons: JSON.stringify(['Year-round', 'Best during dry season (Dec-May)']),
        growingPeriod: '90-120 days',
        waterRequirements: 'Low to Moderate - Drought tolerant',
        expectedYield: '10-20 tons/hectare',
        soilType: 'Sandy loam, well-drained, pH 5.5-6.5',
        climate: 'Tropical, 21-27°C optimal',
        spacing: '80-100cm x 25-30cm',
        fertilizer: 'Basal: 14-14-14 (2-3 bags/ha), High K fertilizer at 30 DAP',
        keyTips: JSON.stringify([
          'Use vine cuttings 25-30cm with 5-7 nodes',
          'Plant at 45-degree angle',
          'Ridge planting prevents waterlogging',
          'Harvest when vines start to yellow'
        ]),
        commonPests: JSON.stringify([
          { name: 'Sweet Potato Weevil', control: 'Crop rotation, clean planting material' },
          { name: 'Aphids', control: 'Natural enemies or insecticidal soap' },
          { name: 'Wireworms', control: 'Proper land preparation and clean culture' }
        ]),
        diseases: JSON.stringify([
          { name: 'Scab', symptoms: 'Corky lesions on storage roots' },
          { name: 'Soft Rot', symptoms: 'Watery decay of roots' },
          { name: 'Virus Disease', symptoms: 'Stunted growth, leaf malformation' }
        ]),
        marketPrice: '₱25-40/kg',
        profitability: 'Moderate',
        difficulty: 'Easy',
        isActive: true,
        stages: {
          create: [
            {
              stageName: 'Land Preparation',
              duration: '7-14 days',
              description: 'Prepare ridges or hills',
              activities: JSON.stringify([
                'Plow and harrow the field',
                'Make ridges 80-100cm apart',
                'Apply organic matter if available',
                'Ensure good drainage',
                'Apply basal fertilizer on ridges'
              ]),
              sequenceOrder: 0
            },
            {
              stageName: 'Planting & Establishment',
              duration: '10-15 days',
              description: 'Vine cutting establishment',
              activities: JSON.stringify([
                'Plant 25-30cm vine cuttings',
                'Insert at 45-degree angle',
                'Bury 3-4 nodes in soil',
                'Water immediately after planting',
                'Replace missing cuttings within 7 days'
              ]),
              sequenceOrder: 1
            },
            {
              stageName: 'Vegetative Growth',
              duration: '45-60 days',
              description: 'Vine and leaf development',
              activities: JSON.stringify([
                'Weed regularly (especially first 30 days)',
                'Apply sidedress fertilizer at 30 DAP',
                'Train vines if needed',
                'Monitor for sweet potato weevil',
                'Light irrigation during dry spells'
              ]),
              sequenceOrder: 2
            },
            {
              stageName: 'Root Bulking',
              duration: '30-45 days',
              description: 'Storage root development and filling',
              activities: JSON.stringify([
                'Reduce water near harvest',
                'Monitor for weevil damage',
                'Prevent vine boring into soil',
                'Check sample roots for size',
                'Plan harvest timing'
              ]),
              sequenceOrder: 3
            },
            {
              stageName: 'Harvest',
              duration: '3-7 days',
              description: 'Harvesting storage roots',
              activities: JSON.stringify([
                'Cut vines 3-5 days before digging',
                'Dig carefully to avoid root damage',
                'Cure roots in shade for 2-3 days',
                'Sort by size and quality',
                'Store in cool, well-ventilated area'
              ]),
              sequenceOrder: 4
            }
          ]
        }
      },
      {
        name: 'Cassava (Kamoteng Kahoy)',
        category: 'Root_Crops',
        varieties: JSON.stringify(['Lakan 1', 'Lakan 2', 'Golden Yellow', 'Rayong 9']),
        plantingSeasons: JSON.stringify(['Start of rainy season (May-July)', 'With irrigation: year-round']),
        growingPeriod: '8-12 months',
        waterRequirements: 'Low - Highly drought tolerant',
        expectedYield: '20-40 tons/hectare',
        soilType: 'Well-drained sandy loam, pH 5.5-7.0',
        climate: 'Tropical, 20-35°C',
        spacing: '1m x 1m',
        fertilizer: 'Basal: 14-14-14 (2 bags/ha), Topdress: Urea (1 bag/ha at 2-3 months)',
        keyTips: JSON.stringify([
          'Use healthy stem cuttings 20-25cm',
          'Plant at 45-60 degree angle',
          'Ensure good drainage to prevent root rot',
          'Harvest when leaves start to yellow and fall'
        ]),
        commonPests: JSON.stringify([
          { name: 'Cassava Mealybug', control: 'Biological control, systemic insecticides' },
          { name: 'Whitefly', control: 'Natural enemies, insecticidal soap' },
          { name: 'Variegated Grasshopper', control: 'Manual collection, insecticides' }
        ]),
        diseases: JSON.stringify([
          { name: 'Cassava Mosaic Disease', symptoms: 'Yellow mottling on leaves' },
          { name: 'Bacterial Blight', symptoms: 'Angular brown spots, wilting' },
          { name: 'Root Rot', symptoms: 'Yellowing and wilting, roots decay' }
        ]),
        marketPrice: '₱8-15/kg',
        profitability: 'Moderate',
        difficulty: 'Easy',
        isActive: true,
        stages: {
          create: [
            {
              stageName: 'Land Preparation & Planting',
              duration: '14-21 days',
              description: 'Prepare field and plant stem cuttings',
              activities: JSON.stringify([
                'Plow and harrow the field',
                'Make planting holes or furrows',
                'Select healthy stem cuttings 20-25cm',
                'Plant at 45-60 degree angle',
                'Apply basal fertilizer',
                'Mulch if available'
              ]),
              sequenceOrder: 0
            },
            {
              stageName: 'Establishment',
              duration: '60-90 days',
              description: 'Root and shoot development',
              activities: JSON.stringify([
                'Weed regularly (critical first 3 months)',
                'Replace dead stakes',
                'Monitor for pests and diseases',
                'Apply first topdress fertilizer',
                'Ensure adequate moisture during dry spells'
              ]),
              sequenceOrder: 1
            },
            {
              stageName: 'Vegetative Growth',
              duration: '120-180 days',
              description: 'Canopy development',
              activities: JSON.stringify([
                'Weed as needed',
                'Monitor for mealybugs and whiteflies',
                'Apply second topdress if needed',
                'Check for disease symptoms',
                'Light cultivation to prevent soil compaction'
              ]),
              sequenceOrder: 2
            },
            {
              stageName: 'Root Bulking',
              duration: '90-120 days',
              description: 'Storage root enlargement',
              activities: JSON.stringify([
                'Reduce or stop fertilization',
                'Minimal weeding (careful not to damage roots)',
                'Monitor for root quality',
                'Check sample plants for maturity',
                'Plan harvest schedule'
              ]),
              sequenceOrder: 3
            },
            {
              stageName: 'Harvest',
              duration: '7-14 days',
              description: 'Root harvesting',
              activities: JSON.stringify([
                'Cut stems 10-15cm above ground',
                'Save healthy stems for next planting',
                'Dig carefully to avoid root breakage',
                'Process or market within 24-48 hours',
                'Roots deteriorate quickly after harvest'
              ]),
              sequenceOrder: 4
            }
          ]
        }
      }
    ];

    for (const guidelineData of guidelines) {
      await prisma.cropGuideline.create({
        data: guidelineData
      });
    }

    console.log(`✅ Created ${guidelines.length} crop guidelines with complete stage details`);
    return guidelines.length;
  } catch (error) {
    console.error('Error seeding crop guidelines:', error);
    throw error;
  }
};

export default seedCropGuidelines;
