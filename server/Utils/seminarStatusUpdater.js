import prisma from '../config/database.js';

/**
 * Automatically update seminar status based on current date and time
 * Status transitions:
 * - Upcoming -> Ongoing (when start_date and start_time reached)
 * - Ongoing -> Completed (when end_date and end_time passed)
 */
export async function updateSeminarStatuses() {
    try {
        const now = new Date();
        const currentDate = new Date(now.toISOString().split('T')[0]); // Get date without time
        const currentTime = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        }); // Format: HH:MM

        // Find seminars that need status updates
        const seminarsToUpdate = await prisma.seminar.findMany({
            where: {
                OR: [
                    {
                        // Upcoming seminars that should be Ongoing
                        status: 'Upcoming',
                        start_date: {
                            lte: currentDate
                        }
                    },
                    {
                        // Ongoing seminars that should be Completed
                        status: 'Ongoing',
                        end_date: {
                            lt: currentDate
                        }
                    },
                    {
                        // Ongoing seminars ending today - need time check
                        status: 'Ongoing',
                        end_date: currentDate
                    }
                ]
            }
        });

        const updates = [];

        for (const seminar of seminarsToUpdate) {
            let newStatus = seminar.status;

            // Check if should transition from Upcoming to Ongoing
            if (seminar.status === 'Upcoming') {
                const startDate = new Date(seminar.start_date);
                const startTime = seminar.start_time;

                if (startDate < currentDate || 
                    (startDate.getTime() === currentDate.getTime() && startTime <= currentTime)) {
                    // Also check if not already past end date/time
                    const endDate = new Date(seminar.end_date);
                    const endTime = seminar.end_time;
                    
                    if (endDate < currentDate || 
                        (endDate.getTime() === currentDate.getTime() && endTime < currentTime)) {
                        newStatus = 'Completed';
                    } else {
                        newStatus = 'Ongoing';
                    }
                }
            }

            // Check if should transition from Ongoing to Completed
            else if (seminar.status === 'Ongoing') {
                const endDate = new Date(seminar.end_date);
                const endTime = seminar.end_time;

                if (endDate < currentDate || 
                    (endDate.getTime() === currentDate.getTime() && endTime < currentTime)) {
                    newStatus = 'Completed';
                }
            }

            // Update if status changed
            if (newStatus !== seminar.status) {
                updates.push({
                    id: seminar.id,
                    title: seminar.title,
                    oldStatus: seminar.status,
                    newStatus: newStatus
                });

                await prisma.seminar.update({
                    where: { id: seminar.id },
                    data: { 
                        status: newStatus,
                        updatedAt: new Date()
                    }
                });
            }
        }

        if (updates.length > 0) {
            console.log(`[SeminarStatusUpdater] Updated ${updates.length} seminar(s):`);
            updates.forEach(u => {
                console.log(`  - "${u.title}": ${u.oldStatus} → ${u.newStatus}`);
            });
        }

        return updates;
    } catch (error) {
        console.error('[SeminarStatusUpdater] Error updating seminar statuses:', error);
        throw error;
    }
}

/**
 * Validate seminar date and time logic
 */
export function validateSeminarDates(seminarData) {
    const errors = [];
    const now = new Date();

    // Parse dates
    const startDate = new Date(seminarData.start_date);
    const endDate = new Date(seminarData.end_date);
    const regDeadline = new Date(seminarData.registration_deadline);

    // 1. Validate start date is not in the past
    if (startDate < now && seminarData.status === 'Upcoming') {
        errors.push('Start date cannot be in the past for upcoming seminars');
    }

    // 2. Validate end date is after start date
    if (endDate < startDate) {
        errors.push('End date must be after or equal to start date');
    }

    // 3. Validate end time is after start time if same day
    if (startDate.toISOString().split('T')[0] === endDate.toISOString().split('T')[0]) {
        const startTime = seminarData.start_time;
        const endTime = seminarData.end_time;
        
        if (startTime && endTime && endTime <= startTime) {
            errors.push('End time must be after start time when seminar occurs on the same day');
        }
    }

    // 4. Validate registration deadline is before start date
    if (regDeadline >= startDate) {
        errors.push('Registration deadline must be before the seminar start date');
    }

    // 5. Validate capacity is positive
    if (seminarData.capacity && seminarData.capacity <= 0) {
        errors.push('Capacity must be a positive number');
    }

    // 6. Validate time format (HH:MM)
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (seminarData.start_time && !timePattern.test(seminarData.start_time)) {
        errors.push('Start time must be in HH:MM format (24-hour)');
    }
    if (seminarData.end_time && !timePattern.test(seminarData.end_time)) {
        errors.push('End time must be in HH:MM format (24-hour)');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

export default {
    updateSeminarStatuses,
    validateSeminarDates
};
