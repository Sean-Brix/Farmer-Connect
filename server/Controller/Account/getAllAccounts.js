import { PrismaClient } from '../../prisma/generated/client.js';
const prisma = new PrismaClient();

async function getAllAccounts(req, res) {
    try {
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
                {
                    firstName: {
                        contains: filters.search,
                    },
                },
                { lastName: { contains: filters.search } },
                { email: { contains: filters.search } },
            ];
        }

        if (filters.order) {
            if (filters.order === 'Username') {
                orderBy.username = 'asc';
            } else if (filters.order === 'Firstname') {
                orderBy.firstName = 'asc';
            } else if (filters.order === 'Lastname') {
                orderBy.lastName = 'asc';
            } else if (filters.order === 'Date Created') {
                orderBy.createdAt = 'asc';
            } else if (filters.order === 'Recently Updated') {
                orderBy.updatedAt = 'desc';
            }
        } else {
            orderBy.createdAt = 'asc';
        }
        const accounts = await prisma.account.findMany({
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                email: true,
                access: true,
                client_profile: true,
            },
            where: where,
            orderBy: orderBy,
        });

        accounts.forEach((account) => {
            if (account.access === 'Super_Admin') {
                account.access = 'Super Admin';
            }
        });

        return res.status(200).json({ list: accounts });
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
