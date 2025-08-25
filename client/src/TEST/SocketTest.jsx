import React, { useState, useEffect } from 'react';
import { initializeInquirySocket, createNewInquiry, sendMessage } from '../utils/inquirySocket';
import { initializeAdminInquirySocket, getAllInquiries, sendAdminReply, updateInquiryStatus } from '../utils/adminInquirySocket';

const SocketTest = () => {
  const [clientConnected, setClientConnected] = useState(false);
  const [adminConnected, setAdminConnected] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [testMessage, setTestMessage] = useState('This is a test inquiry message from the client');
  const [replyMessage, setReplyMessage] = useState('This is a test reply from admin');

  const addTestResult = (test, status, message) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testClientSocket = () => {
    try {
      const { connectInquirySocket, disconnectInquirySocket } = initializeInquirySocket({
        onInquiriesList: (data) => {
          addTestResult('Client Socket', 'success', `Received ${data.length} inquiries`);
        },
        onInquiryCreated: (data) => {
          addTestResult('Client Socket', 'success', 'Inquiry created successfully');
        },
        onMessageSent: (data) => {
          addTestResult('Client Socket', 'success', 'Message sent successfully');
        },
        onNewReply: (data) => {
          addTestResult('Client Socket', 'success', 'Received admin reply');
        },
        onStatusUpdated: (data) => {
          addTestResult('Client Socket', 'success', `Status updated to: ${data.status}`);
        },
        onConnect: () => {
          setClientConnected(true);
          addTestResult('Client Socket', 'success', 'Connected successfully');
        },
        onDisconnect: () => {
          setClientConnected(false);
          addTestResult('Client Socket', 'info', 'Disconnected');
        },
        onError: (error) => {
          addTestResult('Client Socket', 'error', `Error: ${error.message}`);
        }
      });

      connectInquirySocket();
      addTestResult('Client Socket', 'info', 'Connection initiated');

    } catch (error) {
      addTestResult('Client Socket', 'error', `Failed to initialize: ${error.message}`);
    }
  };

  const testAdminSocket = () => {
    try {
      const { connectAdminInquirySocket, disconnectAdminInquirySocket } = initializeAdminInquirySocket({
        onInquiriesList: (data) => {
          setInquiries(data);
          addTestResult('Admin Socket', 'success', `Received ${data.length} inquiries`);
        },
        onNewInquiry: (data) => {
          addTestResult('Admin Socket', 'success', 'New inquiry received');
          setInquiries(prev => [data.inquiry, ...prev]);
        },
        onNewMessage: (data) => {
          addTestResult('Admin Socket', 'success', 'New message received');
        },
        onReplyAdded: (data) => {
          addTestResult('Admin Socket', 'success', 'Reply added successfully');
        },
        onStatusUpdated: (data) => {
          addTestResult('Admin Socket', 'success', 'Status updated');
        },
        onConnect: () => {
          setAdminConnected(true);
          addTestResult('Admin Socket', 'success', 'Connected successfully');
          // Automatically fetch inquiries when connected
          setTimeout(() => getAllInquiries(), 1000);
        },
        onDisconnect: () => {
          setAdminConnected(false);
          addTestResult('Admin Socket', 'info', 'Disconnected');
        },
        onError: (error) => {
          addTestResult('Admin Socket', 'error', `Error: ${error.message}`);
        }
      });

      connectAdminInquirySocket('Admin');
      addTestResult('Admin Socket', 'info', 'Connection initiated');

    } catch (error) {
      addTestResult('Admin Socket', 'error', `Failed to initialize: ${error.message}`);
    }
  };

  const testCreateInquiry = () => {
    if (!clientConnected) {
      addTestResult('Test', 'error', 'Client not connected');
      return;
    }

    createNewInquiry({
      message: testMessage,
      subject: 'Test Inquiry'
    });
    addTestResult('Test', 'info', 'Creating new inquiry...');
  };

  const testSendReply = () => {
    if (!adminConnected || !selectedInquiry) {
      addTestResult('Test', 'error', 'Admin not connected or no inquiry selected');
      return;
    }

    sendAdminReply({
      inquiryId: selectedInquiry.id,
      message: replyMessage
    });
    addTestResult('Test', 'info', 'Sending admin reply...');
  };

  const testUpdateStatus = () => {
    if (!adminConnected || !selectedInquiry) {
      addTestResult('Test', 'error', 'Admin not connected or no inquiry selected');
      return;
    }

    updateInquiryStatus({
      inquiryId: selectedInquiry.id,
      status: 'resolved'
    });
    addTestResult('Test', 'info', 'Updating status to resolved...');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Real-Time Socket Integration Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Client Socket</h2>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-3 h-3 rounded-full ${clientConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{clientConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className="space-y-2">
            <button 
              onClick={testClientSocket}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            >
              Connect Client Socket
            </button>
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Test message..."
              className="w-full px-3 py-2 border rounded"
            />
            <button 
              onClick={testCreateInquiry}
              disabled={!clientConnected}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full disabled:bg-gray-400"
            >
              Create Test Inquiry
            </button>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Admin Socket</h2>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-3 h-3 rounded-full ${adminConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span>{adminConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className="space-y-2">
            <button 
              onClick={testAdminSocket}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
            >
              Connect Admin Socket
            </button>
            {inquiries.length > 0 && (
              <select
                value={selectedInquiry?.id || ''}
                onChange={(e) => setSelectedInquiry(inquiries.find(i => i.id === e.target.value))}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select an inquiry...</option>
                {inquiries.map(inquiry => (
                  <option key={inquiry.id} value={inquiry.id}>
                    {inquiry.subject || inquiry.message?.substring(0, 30) + '...'}
                  </option>
                ))}
              </select>
            )}
            <input
              type="text"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Admin reply..."
              className="w-full px-3 py-2 border rounded"
            />
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={testSendReply}
                disabled={!adminConnected || !selectedInquiry}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                Send Reply
              </button>
              <button 
                onClick={testUpdateStatus}
                disabled={!adminConnected || !selectedInquiry}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Test Results</h2>
          <button 
            onClick={clearResults}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Clear
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500 italic">No test results yet. Run a test to see results.</p>
          ) : (
            <div className="space-y-2">
              {testResults.map(result => (
                <div 
                  key={result.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    result.status === 'success' ? 'bg-green-50 border-green-500' :
                    result.status === 'error' ? 'bg-red-50 border-red-500' :
                    'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{result.test}</div>
                      <div className="text-sm text-gray-600">{result.message}</div>
                    </div>
                    <div className="text-xs text-gray-500">{result.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Real-Time Test Instructions:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Connect both client and admin sockets</li>
          <li>• Create a test inquiry from client side</li>
          <li>• Select the inquiry in admin side and send a reply</li>
          <li>• Test status updates and see real-time synchronization</li>
          <li>• Check console for additional socket debug information</li>
          <li>• Green dot = connected, Red dot = disconnected</li>
        </ul>
      </div>
    </div>
  );
};

export default SocketTest;
