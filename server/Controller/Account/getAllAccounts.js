import prisma from '../../config/database.js';

async function getAllAccounts(req, res) {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filters = {
            roles: req.query.roles,
            client_profile: req.query.client_profile,
            order: req.query.order,
            search: req.query.search,
        };

        const where = {};
        const orderBy = {};

        if (filters.roles) {
            const roles = filters.roles.split(',').map((role) => {
                if (role === 'Super Admin') return 'Super_Admin';
                return role;
            });
            where.access = { in: roles };
        }

        if (filters.client_profile) {
            const clientProfiles = filters.client_profile
                .split(',')
                .map((profile) => {
                    if (profile === 'Rural Based Org') return 'Rural_Based_Org';
                    if (profile === 'Agricultural/Fisheries Technician')
                        return 'Agricultural_Fisheries_Technician';
                    if (profile === "Gov't Employee") return 'Govt_Employee';
                    if (profile === 'Indigenous People')
                        return 'Indigenous_People';
                    return profile;
                });
            where.client_profile = { in: clientProfiles };
        }

        if (filters.search) {
            where.OR = [
                { username: { contains: filters.search } },
                { firstName: { contains: filters.search } },
                { surname: { contains: filters.search } },
                { email: { contains: filters.search } },
            ];
        }

        if (filters.order) {
            if (filters.order === 'username') {
                orderBy.username = 'asc';
            } else if (filters.order === 'firstname') {
                orderBy.firstName = 'asc';
            } else if (filters.order === 'lastname') {
                orderBy.surname = 'asc';
            } else if (filters.order === 'created_at') {
                orderBy.createdAt = 'desc';
            } else if (filters.order === 'updated_at') {
                orderBy.updatedAt = 'desc';
            }
        } else {
            orderBy.createdAt = 'desc';
        }

        // Execute both queries in parallel for better performance
        const [accounts, totalCount] = await Promise.all([
            prisma.account.findMany({
                select: {
                    id: true,
                    username: true,
                    firstName: true,
                    surname: true,
                    email: true,
                    access: true,
                    client_profile: true,
                    rsbsaNumber: true,
                },
                where: where,
                orderBy: orderBy,
                skip: skip,
                take: limit,
            }),
            prisma.account.count({ where: where })
        ]);

        // Transform access field for display
        accounts.forEach((account) => {
            if (account.access === 'Super_Admin') {
                account.access = 'Super Admin';
            }
        });

        return res.status(200).json({ 
            list: accounts,
            pagination: {
                page: page,
                limit: limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } 
    
    catch (error) {
        console.error('Error fetching accounts:', error);
        return res.status(500).json({
            message: 'An error occurred while fetching accounts',
            payload: [],
        });
    }
}

export default getAllAccounts;
