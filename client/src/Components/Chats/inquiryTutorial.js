import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

export const createInquiryTutorial = () => {
    const tour = new Shepherd.Tour({
        defaultStepOptions: {
            cancelIcon: {
                enabled: true
            },
            classes: 'shepherd-theme-custom',
            scrollTo: { behavior: 'smooth', block: 'center' },
            arrow: false
        },
        useModalOverlay: true
    });

    tour.addStep({
        id: 'welcome',
        title: 'Welcome to Customer Support! 💬',
        text: `
            <p>This guide will help you navigate our customer support system.</p>
            <p><strong>You'll learn how to:</strong></p>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Use the FAQ Bot for quick answers</li>
                <li>Browse help categories and topics</li>
                <li>Escalate to a live agent when needed</li>
                <li>Track your inquiries and chat history</li>
            </ul>
        `,
        buttons: [
            {
                text: 'Skip',
                action: tour.cancel,
                classes: 'shepherd-button-secondary'
            },
            {
                text: 'Start Tour',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'chat-header',
        title: 'Chat Interface',
        text: 'This is your chat support interface. You can minimize, view history, or close the chat using these controls.',
        attachTo: {
            element: '[data-tutorial="chat-header"]',
            on: 'bottom'
        },
        scrollTo: false,
        modalOverlayOpeningPadding: 0,
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'help-categories',
        title: 'Browse Help Categories',
        text: 'Start by selecting a category that matches your question. Our FAQ bot will show you relevant answers.',
        attachTo: {
            element: '[data-tutorial="category-buttons"]',
            on: 'bottom'
        },
        scrollTo: false,
        modalOverlayOpeningPadding: 0,
        buttons: [
            {
                text: 'Back',
                action: tour.back,
                classes: 'shepherd-button-secondary'
            },
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'message-area',
        title: 'Chat Messages',
        text: 'Your conversation appears here. Bot messages have answers and helpful links. Admin responses appear when you escalate to a live agent.',
        attachTo: {
            element: '[data-tutorial="message-list"]',
            on: 'top'
        },
        scrollTo: false,
        modalOverlayOpeningPadding: 0,
        buttons: [
            {
                text: 'Back',
                action: tour.back,
                classes: 'shepherd-button-secondary'
            },
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'chat-input',
        title: 'Type Your Message',
        text: 'Use this input to type messages, attach files, or ask follow-up questions. You can also escalate to a live agent from here.',
        attachTo: {
            element: '[data-tutorial="chat-input"]',
            on: 'top'
        },
        scrollTo: false,
        modalOverlayOpeningPadding: 0,
        buttons: [
            {
                text: 'Back',
                action: tour.back,
                classes: 'shepherd-button-secondary'
            },
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'escalate-button',
        title: 'Need More Help?',
        text: 'If the FAQ bot can\'t answer your question, click this button to escalate to a live admin agent. They\'ll respond as soon as possible.',
        attachTo: {
            element: '[data-tutorial="escalate-button"]',
            on: 'top'
        },
        scrollTo: false,
        modalOverlayOpeningPadding: 0,
        buttons: [
            {
                text: 'Back',
                action: tour.back,
                classes: 'shepherd-button-secondary'
            },
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'inquiry-history',
        title: 'View Inquiry History',
        text: 'Click here to view all your past inquiries and their statuses. You can resume previous conversations anytime.',
        attachTo: {
            element: '[data-tutorial="history-button"]',
            on: 'bottom'
        },
        scrollTo: false,
        modalOverlayOpeningPadding: 0,
        buttons: [
            {
                text: 'Back',
                action: tour.back,
                classes: 'shepherd-button-secondary'
            },
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'complete',
        title: 'You\'re Ready! 🎉',
        text: `
            <p>You now know how to use our customer support system!</p>
            <p><strong>Quick Tips:</strong></p>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Try the FAQ bot first for instant answers</li>
                <li>Escalate to an agent for complex issues</li>
                <li>Check your inquiry history for updates</li>
                <li>Attach images or documents when helpful</li>
                <li>Mark inquiries as resolved when your issue is fixed</li>
            </ul>
            <p style="margin-top: 15px;">Need help? Just click the chat button anytime!</p>
        `,
        buttons: [
            {
                text: 'Finish',
                action: tour.complete
            }
        ]
    });

    return tour;
};
