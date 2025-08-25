import React, { useState, useEffect } from 'react';
import { createNewInquiry, sendMessage } from '../utils/inquirySocket';
import { sendAdminReply, updateInquiryStatus } from '../utils/adminInquirySocket';

const QuickSocketTest = () => {
  const [logs, setLogs] = useState([]);
  const [testInquiryId, setTestInquiryId] = useState(null);

  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testFullFlow = async () => {
    addLog('🚀 Starting full socket test flow...', 'info');
    
    try {
      // Step 1: Create inquiry
      addLog('📝 Creating new inquiry...', 'info');
      const inquiryData = await createNewInquiry({
        message: 'Test message for socket flow',
        subject: 'Socket Test'
      });
      
      if (inquiryData?.inquiryId) {
        setTestInquiryId(inquiryData.inquiryId);
        addLog(`✅ Inquiry created: ${inquiryData.inquiryId}`, 'success');
        
        // Step 2: Wait a bit then send admin reply
        setTimeout(async () => {
          addLog('💬 Sending admin reply...', 'info');
          try {
            await sendAdminReply({
              inquiryId: inquiryData.inquiryId,
              message: 'This is an admin response to your inquiry.'
            });
            addLog('✅ Admin reply sent successfully', 'success');
            
            // Step 3: Update status to resolved
            setTimeout(async () => {
              addLog('🔄 Updating status to resolved...', 'info');
              try {
                await updateInquiryStatus({
                  inquiryId: inquiryData.inquiryId,
                  status: 'resolved'
                });
                addLog('✅ Status updated to resolved', 'success');
                addLog('🎉 Full test flow completed!', 'success');
              } catch (error) {
                addLog(`❌ Status update failed: ${error.message}`, 'error');
              }
            }, 2000);
            
          } catch (error) {
            addLog(`❌ Admin reply failed: ${error.message}`, 'error');
          }
        }, 2000);
        
      } else {
        addLog('❌ Failed to create inquiry', 'error');
      }
      
    } catch (error) {
      addLog(`❌ Test failed: ${error.message}`, 'error');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Quick Socket Test</h1>
      
      <div className="mb-6 space-x-4">
        <button 
          onClick={testFullFlow}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          🚀 Test Full Socket Flow
        </button>
        <button 
          onClick={clearLogs}
          className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Clear Logs
        </button>
      </div>

      {testInquiryId && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            <strong>Test Inquiry ID:</strong> <code className="bg-blue-100 px-2 py-1 rounded">{testInquiryId}</code>
          </p>
        </div>
      )}

      <div className="border rounded-lg">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Test Logs</h2>
        </div>
        <div className="max-h-96 overflow-y-auto p-4">
          {logs.length === 0 ? (
            <p className="text-gray-500 italic">No logs yet. Run a test to see results.</p>
          ) : (
            <div className="space-y-2">
              {logs.map(log => (
                <div 
                  key={log.id}
                  className={`flex justify-between items-start p-3 rounded ${
                    log.type === 'success' ? 'bg-green-50 text-green-800' :
                    log.type === 'error' ? 'bg-red-50 text-red-800' :
                    'bg-blue-50 text-blue-800'
                  }`}
                >
                  <span>{log.message}</span>
                  <span className="text-xs opacity-75">{log.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">Test Overview:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Creates a new inquiry from client side</li>
          <li>• Waits 2 seconds, then sends admin reply</li>
          <li>• Waits 2 more seconds, then updates status to resolved</li>
          <li>• Check both client and admin UI for real-time updates</li>
          <li>• Should see no database errors in console</li>
        </ul>
      </div>
    </div>
  );
};

export default QuickSocketTest;
