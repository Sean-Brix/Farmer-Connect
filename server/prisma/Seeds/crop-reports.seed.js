export async function seedCropReports(prisma) {
  // Get all users with their crops and guidelines
  const usersWithCrops = await prisma.account.findMany({
    where: { access: 'User' },
    select: { 
      id: true, 
      username: true,
      registeredCrops: {
        select: {
          id: true,
          cropType: true,
          plantingDate: true,
          currentStageIndex: true,
          guideline: {
            select: {
              stages: {
                select: {
                  stageName: true,
                  sequenceOrder: true
                },
                orderBy: {
                  sequenceOrder: 'asc'
                }
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  // Get admin account for feedback
  const admin = await prisma.account.findFirst({
    where: { access: 'Super_Admin' },
    select: { id: true }
  });

  // Only first 6 users get reports
  const usersWithReports = usersWithCrops.slice(0, 6);
  
  let totalReports = 0;
  let totalFeedback = 0;

  for (const user of usersWithReports) {
    for (const crop of user.registeredCrops) {
      // Get available stages for this crop
      const stages = crop.guideline?.stages || [];
      if (stages.length === 0) continue;

      // Create 2-4 reports per crop, one per stage
      const numReports = Math.floor(Math.random() * 3) + 2; // 2-4 reports
      
      for (let i = 0; i < numReports; i++) {
        const daysAgo = 90 - (i * 25); // Space reports ~25 days apart
        const reportDate = new Date();
        reportDate.setDate(reportDate.getDate() - daysAgo);

        // Each report is for a different stage (i is the stageIndex)
        // Ensure we don't exceed available stages
        if (i >= stages.length) break;
        
        const stageIndex = i; // Each iteration creates report for next stage
        const stage = stages[stageIndex];

        // Calculate report status and dates based on age
        const isSubmitted = daysAgo > 30; // Reports older than 30 days are submitted
        const reportDueDate = new Date(reportDate);
        reportDueDate.setDate(reportDueDate.getDate() + 5); // Due 5 days after report date
        
        const isLate = isSubmitted && daysAgo > 35; // If submitted after 5-day grace period
        const submittedAt = isSubmitted ? new Date(reportDate.getTime() + (isLate ? 6 : 3) * 24 * 60 * 60 * 1000) : null;

        const report = await prisma.stageReport.create({
          data: {
            cropId: crop.id,
            stageIndex: stageIndex,
            stageName: stage.stageName,
            status: isSubmitted ? (isLate ? 'Late' : 'Submitted') : 'Pending',
            reportDueDate: reportDueDate,
            submittedAt: submittedAt,
            plantHeight: 30 + (i * 15) + Math.random() * 10, // Growing over time
            healthStatus: ['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)],
            weatherImpact: ['None', 'Light Rain', 'Heavy Rain', 'Dry Spell'][Math.floor(Math.random() * 4)],
            notes: [
              'Plants are growing well with regular watering',
              'Applied organic fertilizer this month',
              'Noticed some pest activity, applied neem oil',
              'Weather has been favorable for growth',
              'Preparing for next growth stage'
            ][i % 5],
            pestsObserved: i > 1 && Math.random() > 0.5 ? 'Some aphids observed on leaves' : null,
            diseasesObserved: i > 2 && Math.random() > 0.7 ? 'Early signs of leaf spot' : null,
            fertilizersApplied: i > 0 ? '14-14-14 compound fertilizer, 2 bags' : null,
            pesticideApplications: i > 1 && Math.random() > 0.6 ? 'Organic neem oil spray' : null,
            irrigationFrequency: ['Daily', 'Every 2 days', 'Weekly'][Math.floor(Math.random() * 3)],
            soilCondition: ['Loamy', 'Clay loam', 'Sandy loam'][Math.floor(Math.random() * 3)],
            plannedActions: [
              'Continue regular watering schedule',
              'Apply additional fertilizer next week',
              'Monitor pest situation closely',
              'Prepare for harvesting in coming weeks'
            ][i % 4],
            actualYield: i === numReports - 1 && Math.random() > 0.5 ? 150 + Math.random() * 300 : null,
            costs: JSON.stringify({
              seeds: i === 0 ? 500 + Math.random() * 500 : 0,
              fertilizer: i > 0 ? 800 + Math.random() * 400 : 0,
              pesticides: i > 1 ? 300 + Math.random() * 200 : 0,
              labor: 1000 + Math.random() * 1500,
              irrigation: 200 + Math.random() * 300
            }),
            weatherSnapshot: JSON.stringify({
              avgTemp: 26 + Math.random() * 5,
              avgHumidity: 65 + Math.random() * 20,
              rainfall: Math.random() * 150,
              sunnyDays: Math.floor(15 + Math.random() * 10)
            }),
            createdAt: reportDate,
            updatedAt: reportDate
          }
        });

        totalReports++;

        // Add admin feedback to some reports (50% chance for reports older than 60 days)
        if (admin && daysAgo > 60 && Math.random() > 0.5) {
          const feedbackDate = new Date(reportDate);
          feedbackDate.setDate(feedbackDate.getDate() + 3); // Admin responds 3 days later

          const adminFeedback = await prisma.reportFeedback.create({
            data: {
              reportId: report.id,
              authorId: admin.id,
              message: [
                'Great progress! Keep maintaining the same care routine.',
                'Consider increasing fertilizer application for better yield.',
                'Good pest management. Continue monitoring regularly.',
                'Weather impact noted. Ensure proper drainage during rainy days.',
                'Excellent record keeping. Your crop is developing well.'
              ][Math.floor(Math.random() * 5)],
              createdAt: feedbackDate,
              updatedAt: feedbackDate
            }
          });

          totalFeedback++;

          // Some reports have farmer replies (30% chance)
          if (Math.random() > 0.7) {
            const replyDate = new Date(feedbackDate);
            replyDate.setDate(replyDate.getDate() + 2); // Farmer replies 2 days later

            await prisma.reportFeedback.create({
              data: {
                reportId: report.id,
                authorId: user.id,
                parentId: adminFeedback.id,
                message: [
                  'Thank you for the feedback! I will follow your advice.',
                  'I appreciate the guidance. Will increase fertilizer as suggested.',
                  'Thanks! I have already started implementing these changes.',
                  'Noted. I will continue monitoring the situation closely.'
                ][Math.floor(Math.random() * 4)],
                createdAt: replyDate,
                updatedAt: replyDate
              }
            });

            totalFeedback++;
          }
        }
      }
    }
  }

  console.log(`✅ Created ${totalReports} crop reports for 6 farmers`);
  console.log(`✅ Created ${totalFeedback} feedback messages (admin comments + farmer replies)`);
}
