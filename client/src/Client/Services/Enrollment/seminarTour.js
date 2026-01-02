import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

export function createSeminarTutorial() {
  const tutorial = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      classes: 'shepherd-theme-custom',
      scrollTo: { behavior: 'smooth', block: 'center' },
      cancelIcon: {
        enabled: true
      }
    }
  });

  tutorial.addStep({
    id: 'welcome',
    title: '👋 Welcome! Need Help?',
    text: `
      <p class="mb-3" style="color: #374151;">First time here? Let us show you how to browse and enroll in agricultural seminars.</p>
      <p class="font-semibold" style="color: #059669;">This quick guide will help you get started!</p>
    `,
    modalOverlayOpeningPadding: 0,
    popperOptions: {
      modifiers: [{ name: 'offset', options: { offset: [0, 0] } }]
    },
    buttons: [
      {
        text: 'Skip',
        classes: 'shepherd-button-secondary',
        action: tutorial.cancel
      },
      {
        text: 'Show Me How',
        classes: 'shepherd-button-primary',
        action: tutorial.next
      }
    ]
  });

  tutorial.addStep({
    id: 'my-seminars-button',
    title: '📋 My Registered Seminars',
    text: `
      <p class="mb-2" style="color: #374151;">Click this button to view all seminars you've registered for.</p>
      <p class="text-sm" style="color: #6B7280;">You can check your enrollment status, cancel registrations, and see upcoming seminars you're attending.</p>
    `,
    attachTo: {
      element: '[data-tutorial="my-seminars-btn"]',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tutorial.back
      },
      {
        text: 'Next',
        classes: 'shepherd-button-primary',
        action: function() {
          // Open modal before moving to next step
          const btn = document.querySelector('[data-tutorial="my-seminars-btn"]');
          if (btn) btn.click();
          setTimeout(() => tutorial.next(), 400);
        }
      }
    ]
  });

  tutorial.addStep({
    id: 'my-seminars-modal',
    title: '📚 Your Seminar Dashboard',
    text: `
      <p class="mb-2" style="color: #374151;">This modal shows all your registered seminars with important details:</p>
      <ul class="list-disc list-inside text-sm space-y-1" style="color: #6B7280;">
        <li>Enrollment status (Pending, Approved, Rejected)</li>
        <li>Seminar date, time, and location</li>
        <li>Options to view details or cancel registration</li>
      </ul>
      <p class="text-sm mt-2" style="color: #059669; font-weight: 600;">You can manage all your seminars from here!</p>
    `,
    buttons: [
      {
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: function() {
          // Close the modal when going back
          const closeBtn = document.querySelector('[data-tutorial="close-modal"]');
          if (closeBtn) closeBtn.click();
          setTimeout(() => tutorial.back(), 300);
        }
      },
      {
        text: 'Got It',
        classes: 'shepherd-button-primary',
        action: function() {
          // Close the modal
          const closeBtn = document.querySelector('[data-tutorial="close-modal"]');
          if (closeBtn) closeBtn.click();
          setTimeout(() => tutorial.next(), 300);
        }
      }
    ]
  });

  tutorial.addStep({
    id: 'search-bar',
    title: '🔍 Search Seminars',
    text: `
      <p class="mb-2" style="color: #374151;">Use the search bar to find seminars by title, speaker, or location.</p>
      <p class="text-sm" style="color: #6B7280;">The search will automatically filter seminars as you type.</p>
    `,
    attachTo: {
      element: '[data-tutorial="search-input"]',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tutorial.back
      },
      {
        text: 'Next',
        classes: 'shepherd-button-primary',
        action: tutorial.next
      }
    ]
  });

  tutorial.addStep({
    id: 'filter-button',
    title: '🎯 Filter Options',
    text: `
      <p class="mb-2" style="color: #374151;">Click here to change what you're searching by:</p>
      <ul class="list-disc list-inside text-sm space-y-1" style="color: #6B7280;">
        <li><strong style="color: #374151;">Title:</strong> Search by seminar name</li>
        <li><strong style="color: #374151;">Speaker:</strong> Find seminars by speaker name</li>
        <li><strong style="color: #374151;">Location:</strong> Search by venue or location</li>
      </ul>
    `,
    attachTo: {
      element: '[data-tutorial="filter-btn"]',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tutorial.back
      },
      {
        text: 'Next',
        classes: 'shepherd-button-primary',
        action: tutorial.next
      }
    ]
  });

  tutorial.addStep({
    id: 'seminar-cards',
    title: '📚 Seminar Cards',
    text: `
      <p class="mb-2" style="color: #374151;">Each card displays important information about a seminar:</p>
      <ul class="list-disc list-inside text-sm space-y-1" style="color: #6B7280;">
        <li>Seminar title and description</li>
        <li>Speaker name and location</li>
        <li>Date, time, and duration</li>
        <li>Number of participants</li>
        <li>Capacity (slots available)</li>
      </ul>
    `,
    attachTo: {
      element: '[data-tutorial="seminar-card"]',
      on: 'top'
    },
    buttons: [
      {
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tutorial.back
      },
      {
        text: 'Next',
        classes: 'shepherd-button-primary',
        action: tutorial.next
      }
    ]
  });

  tutorial.addStep({
    id: 'view-details',
    title: '👁️ View Details',
    text: `
      <p class="mb-2" style="color: #374151;">Click the "View Details" button to see complete information about the seminar.</p>
      <p class="text-sm" style="color: #6B7280;">You'll see the full description, prerequisites, agenda, and more details.</p>
    `,
    attachTo: {
      element: '[data-tutorial="view-details-btn"]',
      on: 'top'
    },
    buttons: [
      {
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tutorial.back
      },
      {
        text: 'Next',
        classes: 'shepherd-button-primary',
        action: tutorial.next
      }
    ]
  });

  tutorial.addStep({
    id: 'enroll-button',
    title: '✅ Enroll in Seminars',
    text: `
      <p class="mb-2" style="color: #374151;">To enroll, simply click the "Apply Now" button on any seminar card.</p>
      <p class="text-sm font-semibold mb-2" style="color: #D97706;">⚠️ Important:</p>
      <ul class="list-disc list-inside text-sm space-y-1" style="color: #6B7280;">
        <li>You must be logged in to enroll</li>
        <li>Check if slots are still available</li>
        <li>You can cancel your enrollment later if needed</li>
      </ul>
    `,
    attachTo: {
      element: '[data-tutorial="enroll-btn"]',
      on: 'top'
    },
    buttons: [
      {
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tutorial.back
      },
      {
        text: 'Next',
        classes: 'shepherd-button-primary',
        action: tutorial.next
      }
    ]
  });

  tutorial.addStep({
    id: 'pagination',
    title: '📄 Navigation',
    text: `
      <p class="mb-2" style="color: #374151;">Use the pagination buttons at the bottom to browse through all available seminars.</p>
      <p class="text-sm" style="color: #6B7280;">Each page shows up to 6 seminars at a time.</p>
    `,
    attachTo: {
      element: '[data-tutorial="pagination"]',
      on: 'top'
    },
    buttons: [
      {
        text: 'Back',
        classes: 'shepherd-button-secondary',
        action: tutorial.back
      },
      {
        text: 'Next',
        classes: 'shepherd-button-primary',
        action: tutorial.next
      }
    ]
  });

  tutorial.addStep({
    id: 'complete',
    title: '🎉 You\'re Ready!',
    text: `
      <p class="mb-3" style="color: #374151;">Great! You now know how to:</p>
      <ul class="list-disc list-inside text-sm space-y-1 mb-3" style="color: #6B7280;">
        <li>Search and filter seminars</li>
        <li>View seminar details</li>
        <li>Enroll in seminars</li>
        <li>Check your registrations</li>
      </ul>
      <p class="font-semibold" style="color: #059669;">Need help again? Click the help icon (?) anytime!</p>
    `,
    buttons: [
      {
        text: 'Got It!',
        classes: 'shepherd-button-primary',
        action: tutorial.complete
      }
    ]
  });

  return tutorial;
}
