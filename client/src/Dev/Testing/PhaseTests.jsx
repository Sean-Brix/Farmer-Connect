import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const PhaseTests = () => {
  const { isDark } = useTheme();
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [expandedExplanations, setExpandedExplanations] = useState({});

  const phases = [
    {
      id: 'phase1',
      name: 'Phase 1: Critical Frontend Validations',
      description: 'Tests for max_quantity_per_request validation and client-side checks',
      tests: [
        {
          id: 'max-qty-validation',
          name: 'Max Quantity Validation',
          description: 'Verifies that users cannot request more than the allowed quantity per request',
          steps: [
            '1. Navigate to EIC Request page',
            '2. Select an item with max_quantity_per_request set',
            '3. Try to request more than the maximum allowed',
            '4. Should show error message and prevent submission'
          ],
          expectedResult: 'Request blocked with clear error message',
          testFunction: async () => {
            // Placeholder for actual test
            return { success: true, message: 'Manual test - verify in EIC page' };
          }
        },
        {
          id: 'date-validation',
          name: 'Date Limit Validation',
          description: 'Checks if date_limit prevents requests beyond the allowed advance period',
          steps: [
            '1. Go to EIC Request page',
            '2. Try to select a pickup date beyond the date_limit',
            '3. Should disable dates beyond the limit',
            '4. Show warning message if limit exists'
          ],
          expectedResult: 'Dates beyond limit are disabled in picker',
          testFunction: async () => {
            return { success: true, message: 'Manual test - check date picker' };
          }
        }
      ]
    },
    {
      id: 'phase2',
      name: 'Phase 2: Admin UI for date_limit',
      description: 'Tests for admin controls to manage date_limit per item',
      tests: [
        {
          id: 'edit-date-limit',
          name: 'Edit Date Limit',
          description: 'Admin can set/update date_limit for items',
          steps: [
            '1. Login as Admin',
            '2. Go to Admin > Inventory > EIC',
            '3. Click Edit on any item',
            '4. Change the date_limit value',
            '5. Save and verify change persists'
          ],
          expectedResult: 'Date limit saved and reflected in database',
          testFunction: async () => {
            return { success: true, message: 'Manual test - check admin panel' };
          }
        }
      ]
    },
    {
      id: 'phase3',
      name: 'Phase 3: Due Date Dashboard',
      description: 'Tests for tracking borrowed items and due dates',
      tests: [
        {
          id: 'due-tracking',
          name: 'Due Tracking Stats',
          description: 'Verifies dashboard shows correct counts for due items',
          steps: [
            '1. Login as Admin',
            '2. Navigate to Admin > Services > EIC > Due Tracking',
            '3. Check "Items Due Today" count',
            '4. Check "Items Due This Week" count',
            '5. Verify counts match actual database records'
          ],
          expectedResult: 'Accurate counts displayed for all categories',
          testFunction: async () => {
            try {
              const response = await fetch('/api/eic/request/due-tracking', {
                credentials: 'include'
              });
              const data = await response.json();
              return {
                success: response.ok,
                message: `Found ${data.summary?.dueToday || 0} items due today`,
                data: data.summary
              };
            } catch (error) {
              return { success: false, message: error.message };
            }
          }
        },
        {
          id: 'due-list',
          name: 'Due Items List',
          description: 'Shows correct items in each category',
          steps: [
            '1. Click on any stat card',
            '2. Verify list shows items matching that category',
            '3. Check item details are correct',
            '4. Test image fallback for missing images'
          ],
          expectedResult: 'List matches category, images load or fallback',
          testFunction: async () => {
            return { success: true, message: 'Manual test - click stat cards' };
          }
        }
      ]
    },
    {
      id: 'phase4',
      name: 'Phase 4: Auto late_return Status',
      description: 'Tests for automatic status updates via cron job',
      tests: [
        {
          id: 'cron-status',
          name: 'Cron Job Status',
          description: 'Checks if cron job is running',
          steps: [
            '1. Go to Admin > Services > EIC > Settings',
            '2. Check Auto Status Update toggle',
            '3. Verify cron job status (running/stopped)'
          ],
          expectedResult: 'Cron status displayed correctly',
          testFunction: async () => {
            try {
              const response = await fetch('/api/cron/status', {
                credentials: 'include'
              });
              const data = await response.json();
              return {
                success: response.ok,
                message: `Cron is ${data.running ? 'running' : 'stopped'}`,
                data
              };
            } catch (error) {
              return { success: false, message: error.message };
            }
          }
        },
        {
          id: 'manual-trigger',
          name: 'Manual Trigger Test',
          description: 'Tests manual execution of overdue check',
          steps: [
            '1. Go to Settings in EIC admin',
            '2. Click "Run Now" button',
            '3. Wait for completion message',
            '4. Check if overdue items updated to late_return'
          ],
          expectedResult: 'Overdue items status updated successfully',
          testFunction: async () => {
            try {
              const response = await fetch('/api/cron/trigger', {
                method: 'POST',
                credentials: 'include'
              });
              const data = await response.json();
              return {
                success: data.success,
                message: data.message,
                data
              };
            } catch (error) {
              return { success: false, message: error.message };
            }
          }
        }
      ]
    },
    {
      id: 'phase5',
      name: 'Phase 5: Notification System',
      description: 'Tests for in-app and email notifications',
      tests: [
        {
          id: 'notification-bell',
          name: 'Notification Bell',
          description: 'Verifies notification bell shows unread count',
          steps: [
            '1. Login as any user',
            '2. Check navbar for notification bell',
            '3. Badge should show unread count',
            '4. Click bell to open dropdown'
          ],
          expectedResult: 'Bell visible with correct count badge',
          testFunction: async () => {
            try {
              const response = await fetch('/api/notifications/unread-count', {
                credentials: 'include'
              });
              const data = await response.json();
              return {
                success: response.ok,
                message: `You have ${data.count} unread notification(s)`,
                data
              };
            } catch (error) {
              return { success: false, message: error.message };
            }
          }
        },
        {
          id: 'notification-list',
          name: 'Notification List',
          description: 'Tests fetching and displaying notifications',
          steps: [
            '1. Click notification bell',
            '2. Dropdown should show recent notifications',
            '3. Unread notifications highlighted',
            '4. Click notification to navigate'
          ],
          expectedResult: 'Notifications display correctly',
          testFunction: async () => {
            try {
              const response = await fetch('/api/notifications?limit=5', {
                credentials: 'include'
              });
              const data = await response.json();
              return {
                success: response.ok,
                message: `Loaded ${data.notifications?.length || 0} recent notifications`,
                data: data.notifications
              };
            } catch (error) {
              return { success: false, message: error.message };
            }
          }
        },
        {
          id: 'notification-settings',
          name: 'Notification Preferences',
          description: 'Tests user notification settings',
          steps: [
            '1. Go to Settings > Notifications',
            '2. Toggle email notifications on/off',
            '3. Toggle individual notification types',
            '4. Verify settings save automatically'
          ],
          expectedResult: 'Settings save and persist',
          testFunction: async () => {
            try {
              const response = await fetch('/api/notifications/settings', {
                credentials: 'include'
              });
              const data = await response.json();
              return {
                success: response.ok,
                message: 'Settings loaded successfully',
                data: data.settings
              };
            } catch (error) {
              return { success: false, message: error.message };
            }
          }
        },
        {
          id: 'notification-trigger',
          name: 'Notification Trigger Test',
          description: 'Creates test notification to verify system works',
          steps: [
            '1. Approve/Reject an EIC request as admin',
            '2. User should receive notification',
            '3. Check notification appears in bell',
            '4. If email enabled, check email sent'
          ],
          expectedResult: 'Notification created and delivered',
          testFunction: async () => {
            return { success: true, message: 'Manual test - approve/reject request' };
          }
        }
      ]
    }
  ];

  const runTest = async (phaseId, testId) => {
    const phase = phases.find(p => p.id === phaseId);
    const test = phase?.tests.find(t => t.id === testId);
    
    if (!test) return;

    setTestResults(prev => ({
      ...prev,
      [`${phaseId}-${testId}`]: { loading: true }
    }));

    try {
      const result = await test.testFunction();
      setTestResults(prev => ({
        ...prev,
        [`${phaseId}-${testId}`]: { loading: false, ...result }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [`${phaseId}-${testId}`]: { loading: false, success: false, message: error.message }
      }));
    }
  };

  const togglePhase = (phaseId) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  const toggleExplanation = (phaseId, testId) => {
    const key = `${phaseId}-${testId}`;
    setExpandedExplanations(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Phase Testing Suite
        </h2>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Test each implemented phase to ensure functionality works as expected
        </p>
      </div>

      <div className="space-y-3">
        {phases.map(phase => (
          <div
            key={phase.id}
            className={`border rounded-lg overflow-hidden ${
              isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
            }`}
          >
            {/* Phase Header */}
            <button
              onClick={() => togglePhase(phase.id)}
              className={`w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-50 transition-colors ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`text-xl ${expandedPhase === phase.id ? 'text-blue-500' : ''}`}>
                  {expandedPhase === phase.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                <div className="text-left">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {phase.name}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {phase.description}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}>
                {phase.tests.length} test{phase.tests.length !== 1 ? 's' : ''}
              </div>
            </button>

            {/* Phase Tests */}
            {expandedPhase === phase.id && (
              <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                {phase.tests.map(test => {
                  const testKey = `${phase.id}-${test.id}`;
                  const result = testResults[testKey];
                  const showExplanation = expandedExplanations[testKey] || false;

                  return (
                    <div
                      key={test.id}
                      className={`p-6 border-b last:border-b-0 ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      {/* Test Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {test.name}
                          </h4>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {test.description}
                          </p>
                        </div>
                        <button
                          onClick={() => runTest(phase.id, test.id)}
                          disabled={result?.loading}
                          className={`ml-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                            result?.loading
                              ? 'bg-gray-500 cursor-not-allowed'
                              : isDark
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {result?.loading ? 'Running...' : 'Run Test'}
                        </button>
                      </div>

                      {/* Test Result */}
                      {result && !result.loading && (
                        <div
                          className={`p-3 rounded-lg mb-3 flex items-start space-x-2 ${
                            result.success
                              ? isDark
                                ? 'bg-green-900/30 border border-green-700'
                                : 'bg-green-50 border border-green-200'
                              : isDark
                              ? 'bg-red-900/30 border border-red-700'
                              : 'bg-red-50 border border-red-200'
                          }`}
                        >
                          {result.success ? (
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                          ) : (
                            <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                          )}
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              result.success
                                ? isDark ? 'text-green-300' : 'text-green-800'
                                : isDark ? 'text-red-300' : 'text-red-800'
                            }`}>
                              {result.message}
                            </p>
                            {result.data && (
                              <pre className={`mt-2 text-xs overflow-auto ${
                                isDark ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {JSON.stringify(result.data, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Explanation Toggle */}
                      <button
                        onClick={() => toggleExplanation(phase.id, test.id)}
                        className={`flex items-center space-x-2 text-sm font-medium ${
                          isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        <AlertCircle size={16} />
                        <span>{showExplanation ? 'Hide' : 'Show'} Test Steps</span>
                      </button>

                      {/* Explanation Content */}
                      {showExplanation && (
                        <div
                          className={`mt-3 p-4 rounded-lg ${
                            isDark ? 'bg-gray-900 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <h5 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Manual Test Steps:
                          </h5>
                          <ol className={`space-y-1 mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {test.steps.map((step, idx) => (
                              <li key={idx} className="text-sm">{step}</li>
                            ))}
                          </ol>
                          <div className={`pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              Expected Result:
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {test.expectedResult}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhaseTests;
