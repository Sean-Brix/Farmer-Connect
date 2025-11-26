/**
 * FAQ Seed Script
 * Creates 5 categories with 3-4 questions each
 */

export async function seedFAQCategories(prisma) {
  const admins = await prisma.account.findMany({
    where: { access: { in: ['Admin', 'Super_Admin'] } },
    select: { id: true }
  });
  
  const adminId = admins.length > 0 ? admins[0].id : null;

  const categories = [
    {
      name: 'Seed Distribution',
      description: 'Questions about seed distribution programs and requirements',
      orderIndex: 1,
      createdById: adminId,
    },
    {
      name: 'Farming Equipment',
      description: 'Information about farming equipment and machinery rental',
      orderIndex: 2,
      createdById: adminId,
    },
    {
      name: 'Seminars and Training',
      description: 'Details about available seminars, workshops, and training programs',
      orderIndex: 3,
      createdById: adminId,
    },
    {
      name: 'Financial Assistance',
      description: 'Information about loans, subsidies, and financial support programs',
      orderIndex: 4,
      createdById: adminId,
    },
    {
      name: 'Account and Registration',
      description: 'Account management, registration, and profile-related questions',
      orderIndex: 5,
      createdById: adminId,
    },
  ];

  // Use createMany for batch insert (more efficient for Aiven free tier)
  await prisma.fAQCategory.createMany({
    data: categories,
    skipDuplicates: true,
  });

  // Fetch created categories
  const createdCategories = await prisma.fAQCategory.findMany({
    where: {
      name: { in: categories.map(c => c.name) }
    }
  });

  console.log(`✅ Created ${createdCategories.length} FAQ categories`);
  return createdCategories;
}

export async function seedFAQs(prisma) {
  const categories = await prisma.fAQCategory.findMany();
  const admins = await prisma.account.findMany({
    where: { access: { in: ['Admin', 'Super_Admin'] } },
    select: { id: true }
  });
  
  const adminId = admins.length > 0 ? admins[0].id : null;

  // Find categories by name
  const seedDistCategory = categories.find(c => c.name === 'Seed Distribution');
  const equipmentCategory = categories.find(c => c.name === 'Farming Equipment');
  const seminarCategory = categories.find(c => c.name === 'Seminars and Training');
  const financialCategory = categories.find(c => c.name === 'Financial Assistance');
  const accountCategory = categories.find(c => c.name === 'Account and Registration');

  const faqs = [
    // SEED DISTRIBUTION (4 questions)
    {
      categoryId: seedDistCategory?.id,
      question: 'How do I apply for free rice seeds?',
      answer: 'To apply for free rice seeds, you need to: 1) Register an account on the Farmer Connect platform, 2) Complete your farmer profile with your RSBSA number, 3) Submit a seed distribution request through the "Distribution" section, 4) Wait for admin approval. Approved requests can be picked up at your designated municipal agriculture office.',
      orderIndex: 1,
      createdById: adminId,
    },
    {
      categoryId: seedDistCategory?.id,
      question: 'What seed varieties are available for distribution?',
      answer: 'We offer various certified rice seed varieties including RC 160, RC 222, NSIC Rc 216, and PSB Rc 18. The availability depends on your municipality and the current cropping season. Check the "Available Seeds" section in your account to see current stock levels and varieties suitable for your location.',
      orderIndex: 2,
      createdById: adminId,
    },
    {
      categoryId: seedDistCategory?.id,
      question: 'How many kilograms of seeds can I receive?',
      answer: 'The seed allocation depends on your registered farm area. Typically, farmers receive 40kg of seeds per hectare for transplanted rice and 60kg per hectare for direct-seeded rice. The maximum allocation is based on your verified RSBSA registration and available inventory.',
      orderIndex: 3,
      createdById: adminId,
    },
    {
      categoryId: seedDistCategory?.id,
      question: 'When is the deadline to claim distributed seeds?',
      answer: 'Seeds must be claimed within 7 days of approval notification. After this period, unclaimed seeds will be released back to the inventory for other farmers. You will receive an SMS and email notification once your request is approved. Please bring a valid ID and your RSBSA card during pickup.',
      orderIndex: 4,
      createdById: adminId,
    },

    // FARMING EQUIPMENT (4 questions)
    {
      categoryId: equipmentCategory?.id,
      question: 'What farming equipment is available for rent or borrowing?',
      answer: 'We offer various farming equipment including hand tractors, rice transplanters, threshers, mechanical dryers, water pumps, and sprayers. Equipment availability varies by municipality. Check the "Inventory" section to see available items and their current status.',
      orderIndex: 1,
      createdById: adminId,
    },
    {
      categoryId: equipmentCategory?.id,
      question: 'How do I request to borrow farming equipment?',
      answer: 'Log in to your account, go to "Equipment Request" section, select the equipment you need, specify the date and duration, and submit your request. Our staff will review your request and contact you for pickup arrangements. Some equipment may require a deposit or advance booking.',
      orderIndex: 2,
      createdById: adminId,
    },
    {
      categoryId: equipmentCategory?.id,
      question: 'Is there a fee for borrowing equipment?',
      answer: 'Most basic equipment is provided free of charge to registered farmers. However, larger machinery like tractors and mechanical dryers may require a minimal fee to cover fuel and maintenance costs. The specific fees are displayed when you submit your equipment request.',
      orderIndex: 3,
      createdById: adminId,
    },
    {
      categoryId: equipmentCategory?.id,
      question: 'What happens if equipment is damaged while in my possession?',
      answer: 'Farmers are responsible for equipment while borrowed. Minor wear and tear is expected, but significant damage must be reported immediately. Depending on the damage assessment, you may be required to pay for repairs or replacement. Always inspect equipment before and after use, and report any issues to staff.',
      orderIndex: 4,
      createdById: adminId,
    },

    // SEMINARS AND TRAINING (3 questions)
    {
      categoryId: seminarCategory?.id,
      question: 'How do I register for upcoming seminars and training programs?',
      answer: 'Browse available seminars in the "Seminars" section, select the training you want to attend, and click "Register". You will receive a confirmation email with the seminar details, schedule, and location. Registration is first-come, first-served, so register early as slots are limited.',
      orderIndex: 1,
      createdById: adminId,
    },
    {
      categoryId: seminarCategory?.id,
      question: 'Are the training seminars free?',
      answer: 'Yes, all training seminars and workshops provided through the Farmer Connect platform are completely free for registered farmers. This includes training materials, certificates of completion, and sometimes meals and snacks depending on the program sponsor.',
      orderIndex: 2,
      createdById: adminId,
    },
    {
      categoryId: seminarCategory?.id,
      question: 'Will I receive a certificate after completing a seminar?',
      answer: 'Yes, participants who attend the full duration of the seminar will receive a Certificate of Participation or Certificate of Completion. These certificates are recognized by the Department of Agriculture and can be useful for accessing other agricultural programs and benefits.',
      orderIndex: 3,
      createdById: adminId,
    },

    // FINANCIAL ASSISTANCE (4 questions)
    {
      categoryId: financialCategory?.id,
      question: 'What types of financial assistance are available for farmers?',
      answer: 'Several programs are available including: Production loans through agricultural banks, Crop insurance subsidies, Emergency assistance for calamity-affected farmers, and Livelihood grants for diversification projects. Check with your municipal agriculture office for current programs and eligibility requirements.',
      orderIndex: 1,
      createdById: adminId,
    },
    {
      categoryId: financialCategory?.id,
      question: 'Do I need collateral to apply for a production loan?',
      answer: 'It depends on the lending institution and loan amount. Some programs offer collateral-free loans for small-scale farmers, while larger loans may require land titles or other assets as collateral. The ACPC (Agricultural Credit Policy Council) offers various credit schemes with flexible requirements.',
      orderIndex: 2,
      createdById: adminId,
    },
    {
      categoryId: financialCategory?.id,
      question: 'How do I apply for crop insurance?',
      answer: 'Register with the Philippine Crop Insurance Corporation (PCIC) through your municipal agriculture office. You will need your RSBSA registration, proof of farm ownership or lease, and information about your planted crops. Premium subsidies are available for qualified farmers, significantly reducing insurance costs.',
      orderIndex: 3,
      createdById: adminId,
    },
    {
      categoryId: financialCategory?.id,
      question: 'What should I do if my crops are damaged by typhoon or drought?',
      answer: 'Immediately report crop damage to your barangay agricultural technician and municipal agriculture office. Take photos of the damage. If you have crop insurance, file a claim with PCIC within 72 hours. Emergency assistance programs may also be available depending on the calamity declaration.',
      orderIndex: 4,
      createdById: adminId,
    },

    // ACCOUNT AND REGISTRATION (3 questions)
    {
      categoryId: accountCategory?.id,
      question: 'How do I create an account on Farmer Connect?',
      answer: 'Click "Sign Up" on the homepage, fill in your basic information (name, email, mobile number), create a username and password, and verify your email. After registration, complete your farmer profile with your RSBSA number, farm location, and crop information to access all platform features.',
      orderIndex: 1,
      createdById: adminId,
    },
    {
      categoryId: accountCategory?.id,
      question: 'I forgot my password. How can I reset it?',
      answer: 'Click "Forgot Password" on the login page, enter your registered email address, and check your inbox for a password reset link. The link is valid for 24 hours. If you don\'t receive the email, check your spam folder or contact support for assistance.',
      orderIndex: 2,
      createdById: adminId,
    },
    {
      categoryId: accountCategory?.id,
      question: 'Can I update my profile information after registration?',
      answer: 'Yes, you can update your profile anytime by logging in and going to "My Profile" section. You can change your contact information, farm details, and profile picture. However, some information like RSBSA number may require verification by admin before changes are approved.',
      orderIndex: 3,
      createdById: adminId,
    },
  ];

  // Use createMany for batch insert (more efficient for Aiven free tier)
  const validFaqs = faqs.filter(faq => faq.categoryId);
  await prisma.fAQ.createMany({
    data: validFaqs,
    skipDuplicates: true,
  });

  console.log(`✅ Created ${validFaqs.length} FAQs across ${categories.length} categories`);
}
