import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSurveyAnalytics = async (req, res) => {
    try {
        const { surveyFormId } = req.params;

        // Check if survey form exists
        const surveyForm = await prisma.surveyForm.findUnique({
            where: { id: surveyFormId },
            include: {
                fields: {
                    orderBy: { order: 'asc' }
                },
                responses: {
                    include: {
                        answers: {
                            include: {
                                field: true
                            }
                        }
                    }
                }
            }
        });

        if (!surveyForm) {
            return res.status(404).json({
                success: false,
                message: 'Survey form not found'
            });
        }

        // Generate analytics for each field
        const fieldAnalytics = {};

        surveyForm.fields.forEach(field => {
            const fieldAnswers = [];
            
            // Collect all answers for this field
            surveyForm.responses.forEach(response => {
                const answer = response.answers.find(a => a.fieldId === field.id);
                if (answer) {
                    fieldAnswers.push(answer.answer);
                }
            });

            // Generate analytics based on field type
            let analytics = {};

            switch (field.type) {
                case 'SELECT':
                case 'RADIO':
                    analytics = generateChoiceAnalytics(fieldAnswers, field.options);
                    break;
                case 'CHECKBOX':
                    analytics = generateMultipleChoiceAnalytics(fieldAnswers, field.options);
                    break;
                case 'NUMBER':
                    analytics = generateNumericAnalytics(fieldAnswers);
                    break;
                case 'TEXT':
                case 'TEXTAREA':
                case 'EMAIL':
                    analytics = generateTextAnalytics(fieldAnswers);
                    break;
                case 'DATE':
                    analytics = generateDateAnalytics(fieldAnswers);
                    break;
                default:
                    analytics = {
                        total: fieldAnswers.length,
                        type: 'basic'
                    };
            }

            fieldAnalytics[field.id] = {
                fieldInfo: {
                    id: field.id,
                    label: field.label,
                    type: field.type,
                    required: field.required
                },
                analytics,
                totalResponses: fieldAnswers.length
            };
        });

        // Overall survey analytics
        const overallAnalytics = {
            totalResponses: surveyForm.responses.length,
            totalFields: surveyForm.fields.length,
            completionRate: calculateCompletionRate(surveyForm),
            responsesByDay: generateResponseTimeline(surveyForm.responses)
        };

        res.status(200).json({
            success: true,
            data: {
                surveyForm: {
                    id: surveyForm.id,
                    title: surveyForm.title,
                    description: surveyForm.description,
                    category: surveyForm.category,
                    status: surveyForm.status
                },
                overallAnalytics,
                fieldAnalytics
            }
        });

    } catch (error) {
        console.error('Error generating survey analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate survey analytics'
        });
    }
};

// Helper functions for analytics generation

function generateChoiceAnalytics(answers, options) {
    const counts = {};
    const optionsList = options || [];
    
    // Initialize counts
    optionsList.forEach(option => {
        counts[option] = 0;
    });
    
    // Count answers
    answers.forEach(answer => {
        if (typeof answer === 'string' && answer.trim()) {
            counts[answer] = (counts[answer] || 0) + 1;
        }
    });
    
    const total = answers.length;
    const chartData = Object.entries(counts).map(([option, count]) => ({
        label: option,
        value: count,
        percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0
    }));
    
    return {
        type: 'choice',
        total,
        chartData,
        mostPopular: chartData.reduce((max, item) => item.value > max.value ? item : max, chartData[0] || { label: 'N/A', value: 0 })
    };
}

function generateMultipleChoiceAnalytics(answers, options) {
    const counts = {};
    const optionsList = options || [];
    
    // Initialize counts
    optionsList.forEach(option => {
        counts[option] = 0;
    });
    
    // Count answers (answers are arrays for checkboxes)
    answers.forEach(answer => {
        if (Array.isArray(answer)) {
            answer.forEach(choice => {
                if (typeof choice === 'string' && choice.trim()) {
                    counts[choice] = (counts[choice] || 0) + 1;
                }
            });
        }
    });
    
    const totalResponses = answers.length;
    const chartData = Object.entries(counts).map(([option, count]) => ({
        label: option,
        value: count,
        percentage: totalResponses > 0 ? ((count / totalResponses) * 100).toFixed(1) : 0
    }));
    
    return {
        type: 'multiple_choice',
        totalResponses,
        chartData,
        mostSelected: chartData.reduce((max, item) => item.value > max.value ? item : max, chartData[0] || { label: 'N/A', value: 0 })
    };
}

function generateNumericAnalytics(answers) {
    const numbers = answers
        .map(answer => parseFloat(answer))
        .filter(num => !isNaN(num));
    
    if (numbers.length === 0) {
        return {
            type: 'numeric',
            total: 0,
            average: 0,
            min: 0,
            max: 0,
            median: 0
        };
    }
    
    const sorted = numbers.sort((a, b) => a - b);
    const sum = numbers.reduce((a, b) => a + b, 0);
    const average = sum / numbers.length;
    const median = sorted.length % 2 === 0 
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
    
    return {
        type: 'numeric',
        total: numbers.length,
        average: parseFloat(average.toFixed(2)),
        min: Math.min(...numbers),
        max: Math.max(...numbers),
        median: parseFloat(median.toFixed(2)),
        distribution: generateNumericDistribution(numbers)
    };
}

function generateNumericDistribution(numbers) {
    if (numbers.length === 0) return [];
    
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const range = max - min;
    const binCount = Math.min(10, Math.ceil(Math.sqrt(numbers.length)));
    const binSize = range / binCount;
    
    const bins = Array(binCount).fill(0);
    
    numbers.forEach(num => {
        const binIndex = Math.min(Math.floor((num - min) / binSize), binCount - 1);
        bins[binIndex]++;
    });
    
    return bins.map((count, index) => ({
        range: `${(min + index * binSize).toFixed(1)} - ${(min + (index + 1) * binSize).toFixed(1)}`,
        count
    }));
}

function generateTextAnalytics(answers) {
    const textAnswers = answers.filter(answer => 
        typeof answer === 'string' && answer.trim()
    );
    
    const wordCounts = {};
    let totalWords = 0;
    
    textAnswers.forEach(answer => {
        const words = answer.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2);
        
        totalWords += words.length;
        
        words.forEach(word => {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
    });
    
    const topWords = Object.entries(wordCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([word, count]) => ({ word, count }));
    
    return {
        type: 'text',
        totalResponses: textAnswers.length,
        averageLength: textAnswers.length > 0 
            ? (textAnswers.reduce((sum, answer) => sum + answer.length, 0) / textAnswers.length).toFixed(1)
            : 0,
        totalWords,
        topWords
    };
}

function generateDateAnalytics(answers) {
    const dates = answers
        .map(answer => new Date(answer))
        .filter(date => !isNaN(date.getTime()));
    
    if (dates.length === 0) {
        return {
            type: 'date',
            total: 0
        };
    }
    
    const sorted = dates.sort((a, b) => a - b);
    
    return {
        type: 'date',
        total: dates.length,
        earliest: sorted[0].toISOString().split('T')[0],
        latest: sorted[sorted.length - 1].toISOString().split('T')[0],
        distribution: generateDateDistribution(dates)
    };
}

function generateDateDistribution(dates) {
    const yearCounts = {};
    
    dates.forEach(date => {
        const year = date.getFullYear();
        yearCounts[year] = (yearCounts[year] || 0) + 1;
    });
    
    return Object.entries(yearCounts)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([year, count]) => ({ year: parseInt(year), count }));
}

function calculateCompletionRate(surveyForm) {
    if (surveyForm.responses.length === 0) return 0;
    
    const requiredFields = surveyForm.fields.filter(field => field.required);
    if (requiredFields.length === 0) return 100;
    
    let completedResponses = 0;
    
    surveyForm.responses.forEach(response => {
        const answeredRequiredFields = requiredFields.filter(field => 
            response.answers.some(answer => answer.fieldId === field.id)
        );
        
        if (answeredRequiredFields.length === requiredFields.length) {
            completedResponses++;
        }
    });
    
    return ((completedResponses / surveyForm.responses.length) * 100).toFixed(1);
}

function generateResponseTimeline(responses) {
    const dateCounts = {};
    
    responses.forEach(response => {
        const date = new Date(response.submittedAt).toISOString().split('T')[0];
        dateCounts[date] = (dateCounts[date] || 0) + 1;
    });
    
    return Object.entries(dateCounts)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([date, count]) => ({ date, count }));
}
