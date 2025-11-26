/**
 * Survey Forms Seed Script
 * Creates 5 comprehensive survey forms with realistic fields
 */

export async function seedSurveyForms(prisma) {
  const admins = await prisma.account.findMany({
    where: { access: { in: ['Admin', 'Super_Admin'] } },
    select: { id: true }
  });
  
  const adminId = admins.length > 0 ? admins[0].id : null;

  const surveyData = [
    {
      title: 'Farmer Satisfaction Survey 2025',
      description: 'Help us improve our services by sharing your feedback on the agricultural support programs you have received.',
      status: 'ACTIVE',
      category: 'feedback',
      fields: [
        { type: 'TEXT', label: 'Full Name', placeholder: 'Enter your full name', required: true, order: 1 },
        { type: 'EMAIL', label: 'Email Address', placeholder: 'your.email@example.com', required: true, order: 2 },
        { type: 'SELECT', label: 'Which program did you participate in?', required: true, order: 3, options: ['Seed Distribution', 'Equipment Loan', 'Training Seminar', 'Financial Assistance', 'Other'] },
        { type: 'RADIO', label: 'How satisfied are you with the program?', required: true, order: 4, options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] },
        { type: 'RADIO', label: 'Did the program meet your expectations?', required: true, order: 5, options: ['Exceeded expectations', 'Met expectations', 'Below expectations'] },
        { type: 'CHECKBOX', label: 'What aspects did you find most helpful?', required: false, order: 6, options: ['Timely delivery', 'Quality of materials', 'Staff assistance', 'Clear instructions', 'Follow-up support'] },
        { type: 'TEXTAREA', label: 'Please share any suggestions for improvement', placeholder: 'Your feedback helps us serve you better...', required: false, order: 7 },
        { type: 'RADIO', label: 'Would you recommend our services to other farmers?', required: true, order: 8, options: ['Definitely', 'Probably', 'Not sure', 'Probably not', 'Definitely not'] },
      ]
    },
    {
      title: 'Equipment Needs Assessment',
      description: 'Tell us what farming equipment you need most to improve your farm productivity.',
      status: 'ACTIVE',
      category: 'equipment',
      fields: [
        { type: 'TEXT', label: 'Farm Name/Location', placeholder: 'e.g., Barangay San Jose, Municipality', required: true, order: 1 },
        { type: 'NUMBER', label: 'Total Farm Area (hectares)', placeholder: '0.00', required: true, order: 2 },
        { type: 'SELECT', label: 'Primary Crop Type', required: true, order: 3, options: ['Rice', 'Corn', 'Vegetables', 'Coconut', 'Fruits', 'Mixed Crops'] },
        { type: 'CHECKBOX', label: 'What equipment do you currently own?', required: false, order: 4, options: ['Hand Tractor', 'Water Pump', 'Sprayer', 'Thresher', 'Rice Mill', 'Harvester', 'None'] },
        { type: 'CHECKBOX', label: 'What equipment do you need most?', required: true, order: 5, options: ['Hand Tractor', 'Rice Transplanter', 'Mechanical Dryer', 'Thresher', 'Water Pump', 'Sprayer', 'Storage Facility'] },
        { type: 'RADIO', label: 'Would you prefer to purchase or rent equipment?', required: true, order: 6, options: ['Purchase', 'Rent/Borrow', 'Either option', 'Not sure'] },
        { type: 'TEXTAREA', label: 'Additional equipment needs or comments', placeholder: 'Describe any other equipment requirements...', required: false, order: 7 },
      ]
    },
    {
      title: 'Seminar Topic Preferences',
      description: 'Help us plan training programs that meet your learning needs and interests.',
      status: 'ACTIVE',
      category: 'seminar',
      fields: [
        { type: 'TEXT', label: 'Your Name', placeholder: 'Enter your name', required: true, order: 1 },
        { type: 'NUMBER', label: 'Years of Farming Experience', placeholder: '0', required: true, order: 2 },
        { type: 'CHECKBOX', label: 'What topics interest you most?', required: true, order: 3, options: ['Organic Farming', 'Pest Management', 'Soil Health', 'Water Conservation', 'Climate-Smart Agriculture', 'Marketing and Value-Adding', 'Modern Farming Technology', 'Financial Literacy'] },
        { type: 'RADIO', label: 'Preferred training format', required: true, order: 4, options: ['In-person seminar', 'Online webinar', 'Field demonstration', 'Hands-on workshop', 'Combination of formats'] },
        { type: 'RADIO', label: 'Preferred training day', required: true, order: 5, options: ['Weekday', 'Weekend', 'Either'] },
        { type: 'SELECT', label: 'Best time for training sessions', required: true, order: 6, options: ['Morning (8AM-12PM)', 'Afternoon (1PM-5PM)', 'Evening (6PM-8PM)', 'Flexible'] },
        { type: 'TEXTAREA', label: 'Specific topics or skills you want to learn', placeholder: 'Describe your learning interests...', required: false, order: 7 },
      ]
    },
    {
      title: 'Crop Damage and Climate Impact Survey',
      description: 'Report crop damage and help us understand climate impacts on your farming operations.',
      status: 'ACTIVE',
      category: 'agriculture',
      fields: [
        { type: 'TEXT', label: 'Farmer Name', placeholder: 'Enter your name', required: true, order: 1 },
        { type: 'TEXT', label: 'Barangay/Municipality', placeholder: 'Enter your location', required: true, order: 2 },
        { type: 'DATE', label: 'Date of Incident/Damage', required: true, order: 3 },
        { type: 'SELECT', label: 'Type of Crop Affected', required: true, order: 4, options: ['Rice', 'Corn', 'Vegetables', 'Root Crops', 'Fruits', 'Other'] },
        { type: 'NUMBER', label: 'Affected Area (hectares)', placeholder: '0.00', required: true, order: 5 },
        { type: 'CHECKBOX', label: 'What caused the damage?', required: true, order: 6, options: ['Typhoon', 'Drought', 'Flood', 'Pests', 'Disease', 'Extreme Heat', 'Other Weather Events'] },
        { type: 'RADIO', label: 'Estimated percentage of crop loss', required: true, order: 7, options: ['0-25%', '26-50%', '51-75%', '76-100%'] },
        { type: 'RADIO', label: 'Do you have crop insurance?', required: true, order: 8, options: ['Yes', 'No', 'Applied but pending'] },
        { type: 'TEXTAREA', label: 'Additional details about the damage', placeholder: 'Describe the extent of damage and any assistance needed...', required: false, order: 9 },
      ]
    },
    {
      title: 'Market Access and Sales Channels Survey',
      description: 'Share information about how you sell your produce and your market access needs.',
      status: 'ACTIVE',
      category: 'general',
      fields: [
        { type: 'TEXT', label: 'Farm/Business Name', placeholder: 'Enter your farm name', required: true, order: 1 },
        { type: 'SELECT', label: 'Main Crops/Products for Sale', required: true, order: 2, options: ['Rice', 'Corn', 'Vegetables', 'Fruits', 'Livestock', 'Processed Products', 'Mixed Products'] },
        { type: 'CHECKBOX', label: 'Where do you currently sell your products?', required: true, order: 3, options: ['Local Market', 'Trading Post', 'Direct to Consumers', 'Cooperatives', 'Processors/Buyers', 'Online Platforms', 'Cannot sell - no market access'] },
        { type: 'RADIO', label: 'Are you satisfied with your current market access?', required: true, order: 4, options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] },
        { type: 'CHECKBOX', label: 'What market challenges do you face?', required: false, order: 5, options: ['Low prices', 'Transportation costs', 'Lack of buyers', 'Product quality issues', 'Competition', 'No market information', 'Post-harvest losses'] },
        { type: 'RADIO', label: 'Would you be interested in forming or joining a farmers cooperative?', required: true, order: 6, options: ['Very interested', 'Somewhat interested', 'Neutral', 'Not interested', 'Already a member'] },
        { type: 'TEXTAREA', label: 'What support would help you improve sales?', placeholder: 'E.g., better storage, transport assistance, buyer connections...', required: false, order: 7 },
      ]
    },
  ];

  // Use $transaction to batch create all surveys and their fields
  const createdForms = await prisma.$transaction(
    surveyData.map(survey =>
      prisma.surveyForm.create({
        data: {
          title: survey.title,
          description: survey.description,
          status: survey.status,
          category: survey.category,
          createdById: adminId,
          fields: {
            createMany: {
              data: survey.fields.map(field => ({
                type: field.type,
                label: field.label,
                placeholder: field.placeholder || '',
                required: field.required,
                options: field.options ? JSON.stringify(field.options) : null,
                order: field.order,
              }))
            }
          }
        }
      })
    )
  );

  console.log(`✅ Created ${createdForms.length} survey forms with detailed fields`);
  return createdForms;
}

export async function seedSurveyResponses(prisma) {
  // Responses removed - not needed for initial seed
  console.log('⏭️  Skipping survey responses (can be added later if needed)');
}

export async function seedSurveyStatistics(prisma) {
  // Statistics removed - not needed for initial seed
  console.log('⏭️  Skipping survey statistics (can be added later if needed)');
}
