import prisma from '../config/database.js';

async function seedSurveyResponses() {
    try {
        console.log('🌱 Starting survey response seeding...\n');

        // Get all survey forms
        const surveyForms = await prisma.surveyForm.findMany({
            include: {
                fields: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (surveyForms.length === 0) {
            console.log('⚠️  No survey forms found. Please create survey forms first.');
            return;
        }

        console.log(`📋 Found ${surveyForms.length} survey form(s)\n`);

        // Get all users (excluding admins for realistic data)
        const users = await prisma.account.findMany({
            where: {
                access: 'User'
            },
            select: {
                id: true,
                firstName: true,
                surname: true
            }
        });

        if (users.length === 0) {
            console.log('⚠️  No users found. Please create users first.');
            return;
        }

        console.log(`👥 Found ${users.length} user(s)\n`);

        // Sample responses for different field types
        const sampleTextResponses = [
            'This is very helpful',
            'Good service overall',
            'Excellent program',
            'Need more information',
            'Very satisfied with the service',
            'Could be improved',
            'Great experience',
            'Thanks for the support'
        ];

        const sampleRatings = [3, 4, 5, 4, 5, 5, 4, 3];

        let totalResponsesCreated = 0;

        // Create responses for each survey form
        for (const surveyForm of surveyForms) {
            console.log(`📝 Processing: ${surveyForm.title}`);
            console.log(`   Fields: ${surveyForm.fields.length}`);

            // Randomly select 40-60% of users to respond
            const responseCount = Math.floor(users.length * (0.4 + Math.random() * 0.2));
            const respondingUsers = users.sort(() => 0.5 - Math.random()).slice(0, responseCount);

            console.log(`   Creating ${responseCount} responses...`);

            for (const user of respondingUsers) {
                // Create answers for each field
                const answers = [];

                for (const field of surveyForm.fields) {
                    let answer = null;

                    switch (field.type) {
                        case 'text':
                        case 'textarea':
                            answer = sampleTextResponses[Math.floor(Math.random() * sampleTextResponses.length)];
                            break;

                        case 'number':
                        case 'rating':
                            answer = sampleRatings[Math.floor(Math.random() * sampleRatings.length)].toString();
                            break;

                        case 'select':
                        case 'radio':
                            try {
                                const options = typeof field.options === 'string' 
                                    ? JSON.parse(field.options) 
                                    : field.options;
                                if (Array.isArray(options) && options.length > 0) {
                                    answer = options[Math.floor(Math.random() * options.length)];
                                }
                            } catch (e) {
                                answer = 'Option 1';
                            }
                            break;

                        case 'checkbox':
                            try {
                                const options = typeof field.options === 'string' 
                                    ? JSON.parse(field.options) 
                                    : field.options;
                                if (Array.isArray(options) && options.length > 0) {
                                    // Select 1-3 random options
                                    const selectedCount = Math.min(options.length, 1 + Math.floor(Math.random() * 3));
                                    const selected = options
                                        .sort(() => 0.5 - Math.random())
                                        .slice(0, selectedCount);
                                    answer = JSON.stringify(selected);
                                }
                            } catch (e) {
                                answer = JSON.stringify(['Option 1']);
                            }
                            break;

                        case 'date':
                            const randomDate = new Date();
                            randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
                            answer = randomDate.toISOString().split('T')[0];
                            break;

                        case 'email':
                            answer = `user${Math.floor(Math.random() * 1000)}@example.com`;
                            break;

                        case 'phone':
                            answer = `09${Math.floor(100000000 + Math.random() * 900000000)}`;
                            break;

                        default:
                            answer = 'Sample response';
                    }

                    if (answer !== null) {
                        answers.push({
                            fieldId: field.id,
                            answer: answer
                        });
                    }
                }

                // Create the survey response with answers
                try {
                    await prisma.surveyResponse.create({
                        data: {
                            surveyFormId: surveyForm.id,
                            userId: user.id,
                            submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
                            answers: {
                                create: answers
                            }
                        }
                    });
                    totalResponsesCreated++;
                } catch (error) {
                    console.error(`   ❌ Error creating response for user ${user.firstName}: ${error.message}`);
                }
            }

            console.log(`   ✅ Created ${responseCount} responses for "${surveyForm.title}"\n`);
        }

        console.log('═══════════════════════════════════════════════════');
        console.log(`✅ Survey response seeding completed!`);
        console.log(`📊 Total responses created: ${totalResponsesCreated}`);
        console.log(`📋 Survey forms processed: ${surveyForms.length}`);
        console.log('═══════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error seeding survey responses:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the seed function
seedSurveyResponses()
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
