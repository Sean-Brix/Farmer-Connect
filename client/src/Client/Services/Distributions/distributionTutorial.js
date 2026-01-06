import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

export const createDistributionTutorial = () => {
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
        title: 'Welcome to Seedling Distribution! 🌱',
        text: `
            <p>This guide will walk you through the process of requesting seedlings from our distribution system.</p>
            <p><strong>You'll learn how to:</strong></p>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Search and filter available seedlings</li>
                <li>Request seedlings for your farm</li>
                <li>Track your requests and monthly limits</li>
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
        id: 'search',
        title: 'Search for Seedlings',
        text: 'Use this search bar to find specific seedling varieties by name or description.',
        attachTo: {
            element: '[data-tutorial="search-bar"]',
            on: 'bottom'
        },
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
        id: 'filter',
        title: 'Filter by Seed Type',
        text: 'Click here to filter seedlings by type: Rice, Corn, or High Value Crops.',
        attachTo: {
            element: '[data-tutorial="filter-button"]',
            on: 'bottom'
        },
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
        id: 'monthly-limit',
        title: 'Active Request Limit',
        text: 'Keep track of your active request limit here. You can have up to 2 active requests at a time (Pending, Approved, or Picked Up).',
        attachTo: {
            element: '[data-tutorial="monthly-limit"]',
            on: 'bottom'
        },
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
        id: 'my-requests',
        title: 'View Your Requests',
        text: 'Click this button to view all your distribution requests and their statuses.',
        attachTo: {
            element: '[data-tutorial="my-requests-button"]',
            on: 'left'
        },
        buttons: [
            {
                text: 'Back',
                action: tour.back,
                classes: 'shepherd-button-secondary'
            },
            {
                text: 'View Requests',
                action: () => {
                    const button = document.querySelector('[data-tutorial="my-requests-button"]');
                    if (button) {
                        button.click();
                        setTimeout(() => tour.next(), 300);
                    } else {
                        tour.next();
                    }
                }
            }
        ]
    });

    tour.addStep({
        id: 'requests-modal',
        title: 'Your Requests Dashboard',
        text: 'This modal shows all your distribution requests with different status tabs: Pending, Approved, Ready, Collected, Rejected, and Cancelled.',
        attachTo: {
            element: '[data-tutorial="requests-modal"]',
            on: 'bottom'
        },
        scrollTo: false,
        modalOverlayOpeningPadding: 0,
        buttons: [
            {
                text: 'Back',
                action: () => {
                    const closeButton = document.querySelector('[data-tutorial="close-requests-modal"]');
                    if (closeButton) {
                        closeButton.click();
                        setTimeout(() => tour.back(), 200);
                    } else {
                        tour.back();
                    }
                },
                classes: 'shepherd-button-secondary'
            },
            {
                text: 'Close Modal',
                action: () => {
                    const closeButton = document.querySelector('[data-tutorial="close-requests-modal"]');
                    if (closeButton) {
                        closeButton.click();
                        setTimeout(() => tour.next(), 200);
                    } else {
                        tour.next();
                    }
                }
            }
        ]
    });

    tour.addStep({
        id: 'seedling-card',
        title: 'Seedling Information',
        text: 'Each card shows the seedling variety, available quantity, and distribution unit. Click "Request" to make a distribution request.',
        attachTo: {
            element: '[data-tutorial="seedling-card"]',
            on: 'right'
        },
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
        id: 'request-button',
        title: 'Request Seedlings',
        text: 'Click this button to open the request form for this seedling variety.',
        attachTo: {
            element: '[data-tutorial="request-button"]',
            on: 'right'
        },
        buttons: [
            {
                text: 'Back',
                action: tour.back,
                classes: 'shepherd-button-secondary'
            },
            {
                text: 'Open Form',
                action: () => {
                    const button = document.querySelector('[data-tutorial="request-button"]');
                    if (button) {
                        button.click();
                        setTimeout(() => tour.next(), 400);
                    } else {
                        tour.next();
                    }
                }
            }
        ]
    });

    tour.addStep({
        id: 'request-form',
        title: 'Distribution Request Form',
        text: `
            <p>Fill out this form to submit your seedling request:</p>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li><strong>Pickup Date:</strong> Choose when you'll collect the seedlings</li>
                <li><strong>Quantity:</strong> Specify how many units you need</li>
                <li><strong>Farm Location:</strong> Your farm's address</li>
                <li><strong>Area to Plant:</strong> Size of your planting area</li>
                <li><strong>Planting Method:</strong> Direct seeding or transplanting</li>
            </ul>
        `,
        attachTo: {
            element: '[data-tutorial="request-modal"]',
            on: 'bottom'
        },
        scrollTo: false,
        modalOverlayOpeningPadding: 0,
        buttons: [
            {
                text: 'Back',
                action: () => {
                    const closeButton = document.querySelector('[data-tutorial="close-request-modal"]');
                    if (closeButton) {
                        closeButton.click();
                        setTimeout(() => tour.back(), 200);
                    } else {
                        tour.back();
                    }
                },
                classes: 'shepherd-button-secondary'
            },
            {
                text: 'Close Form',
                action: () => {
                    const closeButton = document.querySelector('[data-tutorial="close-request-modal"]');
                    if (closeButton) {
                        closeButton.click();
                        setTimeout(() => tour.next(), 200);
                    } else {
                        tour.next();
                    }
                }
            }
        ]
    });

    tour.addStep({
        id: 'pagination',
        title: 'Browse More Seedlings',
        text: 'Use the pagination controls to view more available seedlings across multiple pages.',
        attachTo: {
            element: '[data-tutorial="pagination"]',
            on: 'top'
        },
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
        title: 'You\'re All Set! 🎉',
        text: `
            <p>You now know how to request seedlings from our distribution system!</p>
            <p><strong>Remember:</strong></p>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Check available quantities before requesting</li>
                <li>You can make up to 2 requests per month</li>
                <li>Track your requests through "My Requests"</li>
                <li>Admins will review and approve your requests</li>
            </ul>
            <p style="margin-top: 15px;">Start requesting seedlings for your farm now!</p>
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
