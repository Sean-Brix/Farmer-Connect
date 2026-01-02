import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

/**
 * Creates and configures the EIC Tutorial
 * Guides users through the Equipment, Inputs & Commodities borrowing process
 */
export function createEICTutorial() {
  const tutorial = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: 'eic-tutorial-step',
      scrollTo: { behavior: 'smooth', block: 'center' },
      cancelIcon: {
        enabled: true
      },
      arrow: false
    }
  });

  tutorial.addStep({
    id: 'welcome',
    text: `
      <div class="tutorial-content">
        <h3 class="tutorial-title">Welcome to EIC Borrowing</h3>
        <p class="tutorial-description">
          Need farming equipment, tools, or inputs? You're in the right place! 
          This quick tutorial will show you how to browse available items and submit requests.
        </p>
        <p class="tutorial-hint">
          <i class="fa-solid fa-lightbulb"></i>
          Takes about 1 minute
        </p>
      </div>
    `,
    buttons: [
      {
        text: 'Skip',
        classes: 'tutorial-btn-secondary',
        action: tutorial.cancel
      },
      {
        text: 'Show Me How',
        classes: 'tutorial-btn-primary',
        action: tutorial.next
      }
    ],
    modalOverlayOpeningPadding: 0
  });

  tutorial.addStep({
    id: 'search-bar',
    text: `
      <div class="tutorial-content">
        <h3 class="tutorial-title">Search Equipment</h3>
        <p class="tutorial-description">
          Use the search bar to quickly find specific equipment by name, category, or description.
        </p>
        <p class="tutorial-example">
          <strong>Try:</strong> "tractor", "irrigation", or "harvesting"
        </p>
      </div>
    `,
    attachTo: {
      element: '[data-tutorial="search-bar"]',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        classes: 'tutorial-btn-secondary',
        action: tutorial.back
      },
      {
        text: 'Next',
        classes: 'tutorial-btn-primary',
        action: tutorial.next
      }
    ]
  });

  tutorial.addStep({
    id: 'filter-button',
    text: `
      <div class="tutorial-content">
        <h3 class="tutorial-title">Filter by Category</h3>
        <p class="tutorial-description">
          Click here to filter equipment by category like Farming Equipment, Harvesting Tools, or Irrigation Systems.
        </p>
        <p class="tutorial-hint">
          <i class="fa-solid fa-filter"></i>
          Narrow down your search to find exactly what you need
        </p>
      </div>
    `,
    attachTo: {
      element: '[data-tutorial="filter-button"]',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        classes: 'tutorial-btn-secondary',
        action: tutorial.back
      },
      {
        text: 'Next',
        classes: 'tutorial-btn-primary',
        action: tutorial.next
      }
    ]
  });

  tutorial.addStep({
    id: 'active-counter',
    text: `
      <div class="tutorial-content">
        <h3 class="tutorial-title">Active Request Counter</h3>
        <p class="tutorial-description">
          This shows how many active requests you currently have. There's a limit to prevent overextension.
        </p>
        <p class="tutorial-warning">
          <i class="fa-solid fa-exclamation-triangle"></i>
          When you reach the maximum, you'll need to complete existing requests before making new ones
        </p>
      </div>
    `,
    attachTo: {
      element: '[data-tutorial="active-counter"]',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        classes: 'tutorial-btn-secondary',
        action: tutorial.back
      },
      {
        text: 'Next',
        classes: 'tutorial-btn-primary',
        action: tutorial.next
      }
    ]
  });

  tutorial.addStep({
    id: 'my-requests-button',
    text: `
      <div class="tutorial-content">
        <h3 class="tutorial-title">My Requests</h3>
        <p class="tutorial-description">
          View all your equipment requests in one place - active, completed, and cancelled.
        </p>
        <p class="tutorial-hint">
          <i class="fa-solid fa-list"></i>
          Track pickup dates, return dates, and request statuses
        </p>
      </div>
    `,
    attachTo: {
      element: '[data-tutorial="my-requests-button"]',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        classes: 'tutorial-btn-secondary',
        action: tutorial.back
      },
      {
        text: 'View My Requests',
        classes: 'tutorial-btn-primary',
        action() {
          const button = document.querySelector('[data-tutorial="my-requests-button"]');
          if (button) {
            setTimeout(() => {
              button.click();
              setTimeout(() => tutorial.next(), 400);
            }, 100);
          } else {
            tutorial.next();
          }
        }
      }
    ]
  });

  tutorial.addStep({
    id: 'my-requests-modal',
    text: `
      <div class="tutorial-content">
        <h3 class="tutorial-title">Request Management</h3>
        <p class="tutorial-description">
          Here you can see all your requests organized by tabs:
        </p>
        <ul class="tutorial-list">
          <li><strong>Active:</strong> Ongoing requests you need to track</li>
          <li><strong>History:</strong> Completed or closed requests</li>
          <li><strong>Cancelled:</strong> Requests you've cancelled</li>
        </ul>
        <p class="tutorial-hint">
          <i class="fa-solid fa-clock"></i>
          Click on any request to view details and take actions
        </p>
      </div>
    `,
    attachTo: {
      element: '[data-tutorial="my-requests-modal"]',
      on: 'bottom'
    },
    scrollTo: false,
    modalOverlayOpeningPadding: 0,
    buttons: [
      {
        text: 'Back',
        classes: 'tutorial-btn-secondary',
        action() {
          const closeBtn = document.querySelector('[data-tutorial="close-requests-modal"]');
          if (closeBtn) {
            closeBtn.click();
            setTimeout(() => tutorial.back(), 200);
          } else {
            tutorial.back();
          }
        }
      },
      {
        text: 'Next',
        classes: 'tutorial-btn-primary',
        action() {
          const closeBtn = document.querySelector('[data-tutorial="close-requests-modal"]');
          if (closeBtn) {
            closeBtn.click();
            setTimeout(() => tutorial.next(), 200);
          } else {
            tutorial.next();
          }
        }
      }
    ]
  });

  tutorial.addStep({
    id: 'equipment-cards',
    text: `
      <div class="tutorial-content">
        <h3 class="tutorial-title">Equipment Cards</h3>
        <p class="tutorial-description">
          Each card shows important details about the equipment:
        </p>
        <ul class="tutorial-list">
          <li><strong>Image:</strong> Visual reference of the item</li>
          <li><strong>Availability:</strong> How many units are in stock</li>
          <li><strong>Borrowing limits:</strong> Maximum quantity and duration</li>
          <li><strong>Status:</strong> Whether you can request it now</li>
        </ul>
      </div>
    `,
    attachTo: {
      element: '[data-tutorial="equipment-card"]:first-of-type',
      on: 'right'
    },
    scrollTo: { behavior: 'smooth', block: 'center' },
    buttons: [
      {
        text: 'Back',
        classes: 'tutorial-btn-secondary',
        action: tutorial.back
      },
      {
        text: 'Next',
        classes: 'tutorial-btn-primary',
        action: tutorial.next
      }
    ]
  });

  tutorial.addStep({
    id: 'request-button',
    text: `
      <div class="tutorial-content">
        <h3 class="tutorial-title">Submit a Request</h3>
        <p class="tutorial-description">
          When you find equipment you need, click the "Request" button to start the borrowing process.
        </p>
        <p class="tutorial-warning">
          <i class="fa-solid fa-ban"></i>
          If the button is disabled, you might have an active request for this item or reached your limit
        </p>
      </div>
    `,
    attachTo: {
      element: '[data-tutorial="request-button"]:first-of-type',
      on: 'right'
    },
    scrollTo: { behavior: 'smooth', block: 'center' },
    buttons: [
      {
        text: 'Back',
        classes: 'tutorial-btn-secondary',
        action: tutorial.back
      },
      {
        text: 'Open Request Form',
        classes: 'tutorial-btn-primary',
        action() {
          const button = document.querySelector('[data-tutorial="request-button"]:not([disabled])');
          if (button) {
            setTimeout(() => {
              button.click();
              setTimeout(() => tutorial.next(), 400);
            }, 100);
          } else {
            tutorial.next();
          }
        }
      }
    ]
  });

  tutorial.addStep({
    id: 'request-modal',
    text: `
      <div class="tutorial-content">
        <h3 class="tutorial-title">Request Form</h3>
        <p class="tutorial-description">
          Fill out this form to submit your equipment request:
        </p>
        <ul class="tutorial-list">
          <li><strong>Pickup Date:</strong> When you'll collect the equipment</li>
          <li><strong>Return Date:</strong> When you'll bring it back</li>
          <li><strong>Quantity:</strong> How many units you need</li>
          <li><strong>Purpose:</strong> Optional note about your intended use</li>
        </ul>
        <p class="tutorial-hint">
          <i class="fa-solid fa-calendar"></i>
          Make sure to respect quantity and duration limits
        </p>
      </div>
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
        classes: 'tutorial-btn-secondary',
        action() {
          const closeBtn = document.querySelector('[data-tutorial="close-request-modal"]');
          if (closeBtn) {
            closeBtn.click();
            setTimeout(() => tutorial.back(), 200);
          } else {
            tutorial.back();
          }
        }
      },
      {
        text: 'Next',
        classes: 'tutorial-btn-primary',
        action() {
          const closeBtn = document.querySelector('[data-tutorial="close-request-modal"]');
          if (closeBtn) {
            closeBtn.click();
            setTimeout(() => tutorial.next(), 200);
          } else {
            tutorial.next();
          }
        }
      }
    ]
  });

  tutorial.addStep({
    id: 'pagination',
    text: `
      <div class="tutorial-content">
        <h3 class="tutorial-title">Browse More Equipment</h3>
        <p class="tutorial-description">
          Use the pagination controls to view more equipment items. Each page shows up to 8 items.
        </p>
        <p class="tutorial-hint">
          <i class="fa-solid fa-arrow-left"></i>
          <i class="fa-solid fa-arrow-right"></i>
          Navigate between pages to explore all available equipment
        </p>
      </div>
    `,
    attachTo: {
      element: '[data-tutorial="pagination"]',
      on: 'top'
    },
    buttons: [
      {
        text: 'Back',
        classes: 'tutorial-btn-secondary',
        action: tutorial.back
      },
      {
        text: 'Next',
        classes: 'tutorial-btn-primary',
        action: tutorial.next
      }
    ]
  });

  tutorial.addStep({
    id: 'complete',
    text: `
      <div class="tutorial-content">
        <h3 class="tutorial-title">You're All Set! 🎉</h3>
        <p class="tutorial-description">
          You now know how to browse equipment, submit requests, and track your borrowings.
        </p>
        <p class="tutorial-hint">
          <strong>Pro Tips:</strong>
        </p>
        <ul class="tutorial-list">
          <li>Plan your pickup and return dates carefully</li>
          <li>Respect quantity limits to give others a chance</li>
          <li>Return equipment on time to avoid late fees</li>
          <li>Check "My Requests" regularly for updates</li>
        </ul>
        <p class="tutorial-success">
          <i class="fa-solid fa-handshake"></i>
          Need help again? Click the help icon anytime!
        </p>
      </div>
    `,
    buttons: [
      {
        text: 'Got It!',
        classes: 'tutorial-btn-primary',
        action: tutorial.complete
      }
    ],
    modalOverlayOpeningPadding: 0
  });

  return tutorial;
}
