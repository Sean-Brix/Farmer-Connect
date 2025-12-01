import prisma from '../config/database.js';

const defaultSettings = [
  // EIC (Equipment in Circulation) Settings
  {
    key: 'eic_max_simultaneous_borrows',
    value: '3',
    description: 'Maximum number of active EIC requests per user at the same time',
    category: 'eic',
    dataType: 'number'
  },
  {
    key: 'eic_max_quantity_per_request',
    value: '5',
    description: 'Maximum quantity that can be requested per EIC request',
    category: 'eic',
    dataType: 'number'
  },
  {
    key: 'eic_cooldown_days',
    value: '7',
    description: 'Number of days user must wait after returning before making a new request',
    category: 'eic',
    dataType: 'number'
  },
  {
    key: 'eic_auto_late_enabled',
    value: 'true',
    description: 'Enable automatic late_return status updates via cron job',
    category: 'eic',
    dataType: 'boolean'
  },
  
  // Distribution Settings
  {
    key: 'distribution_max_requests_per_month',
    value: '2',
    description: 'Maximum number of distribution requests per user per month',
    category: 'distribution',
    dataType: 'number'
  },
  {
    key: 'distribution_max_quantity_per_request',
    value: '10',
    description: 'Maximum quantity that can be requested per distribution request',
    category: 'distribution',
    dataType: 'number'
  },
  {
    key: 'distribution_waitlist_enabled',
    value: 'false',
    description: 'Enable waitlist feature for out-of-stock distribution items',
    category: 'distribution',
    dataType: 'boolean'
  },
  
  // Notification Settings
  {
    key: 'notification_reminder_days',
    value: '3,1',
    description: 'Days before due date to send reminder notifications (comma-separated)',
    category: 'notification',
    dataType: 'string'
  },
  {
    key: 'notification_email_enabled_default',
    value: 'true',
    description: 'Default email notification preference for new users',
    category: 'notification',
    dataType: 'boolean'
  },
  
  // Scheduling & Pickup Settings
  {
    key: 'eic_max_pickups_per_day',
    value: '10',
    description: 'Maximum number of EIC pickups allowed per day',
    category: 'scheduling',
    dataType: 'number'
  },
  {
    key: 'distribution_max_pickups_per_day',
    value: '20',
    description: 'Maximum number of distribution pickups allowed per day',
    category: 'scheduling',
    dataType: 'number'
  },
  {
    key: 'allow_weekend_pickups',
    value: 'false',
    description: 'Allow pickups on Saturday and Sunday',
    category: 'scheduling',
    dataType: 'boolean'
  },
  {
    key: 'max_advance_booking_days',
    value: '30',
    description: 'How far in advance users can schedule pickups (in days)',
    category: 'scheduling',
    dataType: 'number'
  },
  {
    key: 'auto_no_pickup_days',
    value: '3',
    description: 'Days after scheduled pickup date before auto-setting to No_Pickup status',
    category: 'scheduling',
    dataType: 'number'
  },
  {
    key: 'auto_no_return_days',
    value: '7',
    description: 'Days after scheduled return date before auto-setting to No_Return status',
    category: 'scheduling',
    dataType: 'number'
  }
];

async function seedSystemSettings() {
  console.log('🌱 Seeding system settings...');
  
  try {
    for (const setting of defaultSettings) {
      const result = await prisma.systemSettings.upsert({
        where: { key: setting.key },
        update: {
          description: setting.description,
          category: setting.category,
          dataType: setting.dataType
        },
        create: setting
      });
      
      console.log(`✅ ${setting.key}: ${setting.value}`);
    }
    
    console.log('\n✨ System settings seeded successfully!');
    console.log(`Total settings: ${defaultSettings.length}`);
    console.log('\n📊 Settings by category:');
    console.log(`  EIC: 4 settings`);
    console.log(`  Distribution: 3 settings`);
    console.log(`  Notification: 2 settings`);
    console.log(`  Scheduling: 6 settings`);
  } catch (error) {
    console.error('❌ Error seeding system settings:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSystemSettings();
}

export default seedSystemSettings;
