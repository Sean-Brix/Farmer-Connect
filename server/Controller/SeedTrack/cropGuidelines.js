import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * GET /api/crop-guidelines
 * Get all crop guidelines with optional filters
 */
const getAllGuidelines = async (req, res) => {
  try {
    const { category, search, includeInactive } = req.query;

    const where = {};

    // Filter by category if provided
    if (category) {
      where.category = category;
    }

    // Filter by active status
    if (includeInactive !== 'true') {
      where.isActive = true;
    }

    // Search by name if provided
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    const guidelines = await prisma.cropGuideline.findMany({
      where,
      include: {
        stages: {
          orderBy: {
            sequenceOrder: 'asc'
          }
        },
        _count: {
          select: {
            registeredCrops: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Parse JSON fields
    const parsedGuidelines = guidelines.map(guideline => ({
      ...guideline,
      varieties: JSON.parse(guideline.varieties),
      plantingSeasons: JSON.parse(guideline.plantingSeasons),
      keyTips: JSON.parse(guideline.keyTips),
      commonPests: JSON.parse(guideline.commonPests),
      diseases: JSON.parse(guideline.diseases),
      stages: guideline.stages.map(stage => ({
        ...stage,
        activities: JSON.parse(stage.activities)
      }))
    }));

    res.json({
      success: true,
      data: parsedGuidelines
    });
  } catch (error) {
    console.error('Error fetching crop guidelines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop guidelines',
      error: error.message
    });
  }
};

/**
 * GET /api/crop-guidelines/:id
 * Get a single crop guideline by ID
 */
const getGuidelineById = async (req, res) => {
  try {
    const { id } = req.params;

    const guideline = await prisma.cropGuideline.findUnique({
      where: { id },
      include: {
        stages: {
          orderBy: {
            sequenceOrder: 'asc'
          }
        },
        _count: {
          select: {
            registeredCrops: true
          }
        }
      }
    });

    if (!guideline) {
      return res.status(404).json({
        success: false,
        message: 'Crop guideline not found'
      });
    }

    // Parse JSON fields
    const parsedGuideline = {
      ...guideline,
      varieties: JSON.parse(guideline.varieties),
      plantingSeasons: JSON.parse(guideline.plantingSeasons),
      keyTips: JSON.parse(guideline.keyTips),
      commonPests: JSON.parse(guideline.commonPests),
      diseases: JSON.parse(guideline.diseases),
      stages: guideline.stages.map(stage => ({
        ...stage,
        activities: JSON.parse(stage.activities)
      }))
    };

    res.json({
      success: true,
      data: parsedGuideline
    });
  } catch (error) {
    console.error('Error fetching crop guideline:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop guideline',
      error: error.message
    });
  }
};

/**
 * POST /api/crop-guidelines
 * Create a new crop guideline
 */
const createGuideline = async (req, res) => {
  try {
    const {
      name,
      category,
      varieties,
      plantingSeasons,
      growingPeriod,
      waterRequirements,
      expectedYield,
      soilType,
      climate,
      spacing,
      fertilizer,
      keyTips,
      commonPests,
      diseases,
      marketPrice,
      profitability,
      difficulty,
      stages
    } = req.body;

    // Validate required fields
    if (!name || !category || !stages || stages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and at least one stage are required'
      });
    }

    // Create guideline with stages
    const guideline = await prisma.cropGuideline.create({
      data: {
        name,
        category,
        varieties: JSON.stringify(varieties || []),
        plantingSeasons: JSON.stringify(plantingSeasons || []),
        growingPeriod: growingPeriod || '',
        waterRequirements: waterRequirements || '',
        expectedYield: expectedYield || '',
        soilType: soilType || '',
        climate: climate || '',
        spacing: spacing || '',
        fertilizer: fertilizer || '',
        keyTips: JSON.stringify(keyTips || []),
        commonPests: JSON.stringify(commonPests || []),
        diseases: JSON.stringify(diseases || []),
        marketPrice: marketPrice || '',
        profitability: profitability || 'Moderate',
        difficulty: difficulty || 'Moderate',
        stages: {
          create: stages.map((stage, index) => ({
            stageName: stage.stageName || stage.stage,
            duration: stage.duration,
            description: stage.description,
            activities: JSON.stringify(stage.activities || []),
            sequenceOrder: index
          }))
        }
      },
      include: {
        stages: {
          orderBy: {
            sequenceOrder: 'asc'
          }
        }
      }
    });

    // Parse JSON fields for response
    const parsedGuideline = {
      ...guideline,
      varieties: JSON.parse(guideline.varieties),
      plantingSeasons: JSON.parse(guideline.plantingSeasons),
      keyTips: JSON.parse(guideline.keyTips),
      commonPests: JSON.parse(guideline.commonPests),
      diseases: JSON.parse(guideline.diseases),
      stages: guideline.stages.map(stage => ({
        ...stage,
        activities: JSON.parse(stage.activities)
      }))
    };

    res.status(201).json({
      success: true,
      message: 'Crop guideline created successfully',
      data: parsedGuideline
    });
  } catch (error) {
    console.error('Error creating crop guideline:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create crop guideline',
      error: error.message
    });
  }
};

/**
 * PATCH /api/crop-guidelines/:id
 * Update a crop guideline
 */
const updateGuideline = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category,
      varieties,
      plantingSeasons,
      growingPeriod,
      waterRequirements,
      expectedYield,
      soilType,
      climate,
      spacing,
      fertilizer,
      keyTips,
      commonPests,
      diseases,
      marketPrice,
      profitability,
      difficulty,
      isActive,
      stages
    } = req.body;

    // Check if guideline exists
    const existingGuideline = await prisma.cropGuideline.findUnique({
      where: { id }
    });

    if (!existingGuideline) {
      return res.status(404).json({
        success: false,
        message: 'Crop guideline not found'
      });
    }

    // Prepare update data
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (varieties !== undefined) updateData.varieties = JSON.stringify(varieties);
    if (plantingSeasons !== undefined) updateData.plantingSeasons = JSON.stringify(plantingSeasons);
    if (growingPeriod !== undefined) updateData.growingPeriod = growingPeriod;
    if (waterRequirements !== undefined) updateData.waterRequirements = waterRequirements;
    if (expectedYield !== undefined) updateData.expectedYield = expectedYield;
    if (soilType !== undefined) updateData.soilType = soilType;
    if (climate !== undefined) updateData.climate = climate;
    if (spacing !== undefined) updateData.spacing = spacing;
    if (fertilizer !== undefined) updateData.fertilizer = fertilizer;
    if (keyTips !== undefined) updateData.keyTips = JSON.stringify(keyTips);
    if (commonPests !== undefined) updateData.commonPests = JSON.stringify(commonPests);
    if (diseases !== undefined) updateData.diseases = JSON.stringify(diseases);
    if (marketPrice !== undefined) updateData.marketPrice = marketPrice;
    if (profitability !== undefined) updateData.profitability = profitability;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle stages update if provided
    if (stages !== undefined) {
      // Delete existing stages and create new ones
      await prisma.cropGuidelineStage.deleteMany({
        where: { guidelineId: id }
      });

      updateData.stages = {
        create: stages.map((stage, index) => ({
          stageName: stage.stageName || stage.stage,
          duration: stage.duration,
          description: stage.description,
          activities: JSON.stringify(stage.activities || []),
          sequenceOrder: index
        }))
      };
    }

    // Update guideline
    const guideline = await prisma.cropGuideline.update({
      where: { id },
      data: updateData,
      include: {
        stages: {
          orderBy: {
            sequenceOrder: 'asc'
          }
        }
      }
    });

    // Parse JSON fields for response
    const parsedGuideline = {
      ...guideline,
      varieties: JSON.parse(guideline.varieties),
      plantingSeasons: JSON.parse(guideline.plantingSeasons),
      keyTips: JSON.parse(guideline.keyTips),
      commonPests: JSON.parse(guideline.commonPests),
      diseases: JSON.parse(guideline.diseases),
      stages: guideline.stages.map(stage => ({
        ...stage,
        activities: JSON.parse(stage.activities)
      }))
    };

    res.json({
      success: true,
      message: 'Crop guideline updated successfully',
      data: parsedGuideline
    });
  } catch (error) {
    console.error('Error updating crop guideline:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update crop guideline',
      error: error.message
    });
  }
};

/**
 * DELETE /api/crop-guidelines/:id
 * Delete (soft delete) a crop guideline
 */
const deleteGuideline = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if guideline exists
    const existingGuideline = await prisma.cropGuideline.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            registeredCrops: true
          }
        }
      }
    });

    if (!existingGuideline) {
      return res.status(404).json({
        success: false,
        message: 'Crop guideline not found'
      });
    }

    // If there are registered crops using this guideline, soft delete (set isActive to false)
    if (existingGuideline._count.registeredCrops > 0) {
      await prisma.cropGuideline.update({
        where: { id },
        data: { isActive: false }
      });

      return res.json({
        success: true,
        message: 'Crop guideline deactivated (has active registered crops)'
      });
    }

    // Otherwise, hard delete
    await prisma.cropGuideline.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Crop guideline deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting crop guideline:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete crop guideline',
      error: error.message
    });
  }
};

export {
  getAllGuidelines,
  getGuidelineById,
  createGuideline,
  updateGuideline,
  deleteGuideline
};
