import prisma from '../../../config/database.js';

async function getAllRequest(req, res) {
    try {
        // Get all item transactions with related data - ONLY for Distribution stacks
        const requests = await prisma.itemTransaction.findMany({
            where: {
                itemStack: {
                    status: 'Distributed', // Only get transactions for Distributed stacks
                },
            },
            include: {
                itemStack: {
                    include: {
                        item: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                category: true,
                                picture: true,
                                unit: true,
                                seedVarietyId: true,
                                seedVariety: {
                                    select: {
                                        id: true,
                                        name: true,
                                        cropType: true,
                                        description: true,
                                        plantingWindow: true,
                                        directSeededDAS: true,
                                        transplantedDAS: true,
                                    },
                                },
                            },
                        },
                    },
                },
                account: {
                    select: {
                        id: true,
                        firstName: true,
                        surname: true,
                        email: true,
                        username: true,
                        contactNumber: true,
                        access: true,
                        client_profile: true,
                    },
                },
                admin: {
                    select: {
                        id: true,
                        firstName: true,
                        surname: true,
                        email: true,
                    },
                },
                plantingReport: {
                    select: {
                        id: true,
                        farmerName: true,
                        farmLocation: true,
                        rsbsaNumber: true,
                        croppingSeasonId: true,
                        areaPlanted: true,
                        seedClassification: true,
                        typeOfCrop: true,
                        riceIrrigation: true,
                        varietyId: true,
                        dateOfPlanting: true,
                        plantingMethod: true,
                        cropInsurance: true,
                        harvestArea: true,
                        numberOfBags: true,
                        weightPerBag: true,
                        yieldMtPerHa: true,
                        dateOfExpectedHarvest: true,
                        distributionRequestId: true,
                        distributionItemId: true,
                        distributionQuantity: true,
                        distributionUnit: true,
                        distributionPickupDate: true,
                        requestNote: true,
                        plantingReportDeadline: true,
                        state: true,
                        distributedQuantity: true,
                        archivedAt: true,
                        archivedBy: true,
                        isDeleted: true,
                        deletedAt: true,
                        deletedBy: true,
                        createdAt: true,
                        updatedAt: true,
                        stateHistory: true,
                        lastUpdatedBy: true,
                        isArchived: true,
                        variety: {
                            select: {
                                id: true,
                                name: true,
                                cropType: true,
                                directSeededDAS: true,
                                transplantedDAS: true,
                                description: true,
                            },
                        },
                    },
                },
            },
            orderBy: [
                {
                    status: 'asc', // Order by status first (Pending, Approved, etc.)
                },
                {
                    createdAt: 'desc', // Then by creation date (newest first)
                },
            ],
        });

        // Transform the data to match the expected format
        const transformedRequests = requests.map((request) => ({
            id: request.id,
            itemStackId: request.itemStackId,
            accountId: request.accountId,
            adminId: request.adminId,
            quantity: request.quantity,
            requestQuantity: request.quantity, // Frontend expects requestQuantity for consistency
            status: request.status,
            pickupDate: request.pickupDate,
            returnDate: null, // Always null for distribution items
            requestNote: request.requestNote,
            farmLocation: request.farmLocation,
            areaPlanted: request.areaPlanted,
            plantingMethod: request.plantingMethod,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            // Item information
            itemName: request.itemStack.item.name,
            itemDescription: request.itemStack.item.description,
            itemCategory: request.itemStack.item.category,
            itemPicture: request.itemStack.item.picture,
            itemDateLimit: request.itemStack.date_limit,
            // Stack inventory information
            currentStock: request.itemStack.quantity,
            // User information
            requestorName: `${request.account.firstName} ${request.account.surname}`,
            requestorEmail: request.account.email,
            requestorUsername: request.account.username,
            requestorPhone: request.account.contactNumber, // Fixed: was cellphone_no, correct field is contactNumber
            requestorAccess: request.account.access,
            requestorProfile: request.account.client_profile,
            // Admin information (if any)
            adminName: request.admin
                ? `${request.admin.firstName} ${request.admin.surname}`
                : null,
            adminEmail: request.admin ? request.admin.email : null,
            // Seed variety information (if item has seed variety)
            itemUnit: request.itemStack.item.unit,
            seedVarietyId: request.itemStack.item.seedVarietyId,
            seedCropType: request.itemStack.item.seedVariety?.cropType || null,
            seedPlantingWindow: request.itemStack.item.seedVariety?.plantingWindow || null,
            seedDescription: request.itemStack.item.seedVariety?.description || null,
            seedDirectSeededDAS: request.itemStack.item.seedVariety?.directSeededDAS || null,
            seedTransplantedDAS: request.itemStack.item.seedVariety?.transplantedDAS || null,
            // Planting report information (if exists)
            plantingReportId: request.plantingReportId,
            plantingReport: request.plantingReport ? {
                id: request.plantingReport.id,
                farmerName: request.plantingReport.farmerName,
                farmLocation: request.plantingReport.farmLocation,
                rsbsaNumber: request.plantingReport.rsbsaNumber,
                croppingSeasonId: request.plantingReport.croppingSeasonId,
                areaPlanted: request.plantingReport.areaPlanted,
                seedClassification: request.plantingReport.seedClassification,
                typeOfCrop: request.plantingReport.typeOfCrop,
                riceIrrigation: request.plantingReport.riceIrrigation,
                varietyId: request.plantingReport.varietyId,
                dateOfPlanting: request.plantingReport.dateOfPlanting,
                plantingMethod: request.plantingReport.plantingMethod,
                cropInsurance: request.plantingReport.cropInsurance,
                harvestArea: request.plantingReport.harvestArea,
                numberOfBags: request.plantingReport.numberOfBags,
                weightPerBag: request.plantingReport.weightPerBag,
                yieldMtPerHa: request.plantingReport.yieldMtPerHa,
                dateOfExpectedHarvest: request.plantingReport.dateOfExpectedHarvest,
                distributionRequestId: request.plantingReport.distributionRequestId,
                distributionItemId: request.plantingReport.distributionItemId,
                distributionQuantity: request.plantingReport.distributionQuantity,
                distributionUnit: request.plantingReport.distributionUnit,
                distributionPickupDate: request.plantingReport.distributionPickupDate,
                requestNote: request.plantingReport.requestNote,
                plantingReportDeadline: request.plantingReport.plantingReportDeadline,
                state: request.plantingReport.state,
                lastUpdatedBy: request.plantingReport.lastUpdatedBy,
                isArchived: request.plantingReport.isArchived,
                isDeleted: request.plantingReport.isDeleted,
                deletedAt: request.plantingReport.deletedAt,
                deletedBy: request.plantingReport.deletedBy,
                distributedQuantity: request.plantingReport.distributedQuantity,
                archivedAt: request.plantingReport.archivedAt,
                archivedBy: request.plantingReport.archivedBy,
                createdAt: request.plantingReport.createdAt,
                updatedAt: request.plantingReport.updatedAt,
                stateHistory: request.plantingReport.stateHistory,
                variety: request.plantingReport.variety,
            } : null,
            // Planting-related timestamps
            plantingReportDeadline: request.plantingReportDeadline,
            pickedUpAt: request.actual_pickup,
        }));

        return res.status(200).json({
            success: true,
            message: 'Distribution requests retrieved successfully',
            count: transformedRequests.length,
            requests: transformedRequests,
        });
    } catch (error) {
        console.error('Error fetching all distribution requests:', error);

        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'Conflict',
                message: 'A conflict occurred while fetching requests',
            });
        }

        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch requests. Please try again later.',
        });
    }
}

export default getAllRequest;
