import React from 'react';
import RequestStatusBadge from './RequestStatusBadge';
import RequestTimeline from './RequestTimeline';
import RequestActionPanel from './RequestActionPanel';

/**
 * RequestDetailModal Component
 * Shows full details of a single request with timeline and actions
 */
const RequestDetailModal = ({ 
  request, 
  onClose, 
  onCancel, 
  onConfirmPickup, 
  onConfirmReturn, 
  onRequestExtension,
  isDark = false 
}) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className={`${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border-2`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b-2 ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-file-lines text-2xl text-green-600"></i>
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                Request Details
              </h2>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Request #{request.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`text-2xl ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition`}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Item Information */}
          <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl p-5`}>
            <div className="flex items-start gap-4">
              {request.itemImage && (
                <img 
                  src={request.itemImage} 
                  alt={request.itemName}
                  className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                      {request.itemName}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <i className="fa-solid fa-tag mr-1"></i>
                      {request.itemCategory}
                    </p>
                  </div>
                  <RequestStatusBadge status={request.status} size="md" />
                </div>
                
                {request.itemDescription && (
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                    {request.itemDescription}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Request Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl p-4`}>
              <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-3 flex items-center gap-2`}>
                <i className="fa-solid fa-info-circle text-blue-600"></i>
                Request Details
              </h4>
              <div className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex justify-between">
                  <span className="font-medium">Quantity:</span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">
                    {request.quantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Requested:</span>
                  <span>{new Date(request.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                {request.itemDateLimit && (
                  <div className="flex justify-between">
                    <span className="font-medium">Max Borrow Period:</span>
                    <span className="text-green-600 font-semibold">{request.itemDateLimit} days</span>
                  </div>
                )}
              </div>
            </div>

            <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl p-4`}>
              <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-3 flex items-center gap-2`}>
                <i className="fa-solid fa-calendar text-green-600"></i>
                Dates
              </h4>
              <div className={`space-y-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="flex justify-between">
                  <span className="font-medium">Pickup Date:</span>
                  <span>{new Date(request.pickupDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
                {request.returnDate ? (
                  <div className="flex justify-between">
                    <span className="font-medium">Return Date:</span>
                    <span>{new Date(request.returnDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="font-medium">Return Date:</span>
                    <span className="italic text-gray-400">Not specified</span>
                  </div>
                )}
                {request.actual_pickup && (
                  <div className="flex justify-between">
                    <span className="font-medium">Actual Pickup:</span>
                    <span className="text-green-600 font-semibold">
                      {new Date(request.actual_pickup).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {request.actual_return && (
                  <div className="flex justify-between">
                    <span className="font-medium">Actual Return:</span>
                    <span className="text-blue-600 font-semibold">
                      {new Date(request.actual_return).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Request Note */}
          {request.requestNote && (
            <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl p-4`}>
              <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-2 flex items-center gap-2`}>
                <i className="fa-solid fa-note-sticky text-yellow-600"></i>
                Your Note
              </h4>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'} whitespace-pre-wrap`}>
                {request.requestNote}
              </p>
            </div>
          )}

          {/* Admin Notes / Rejection Reason */}
          {request.adminNotes && (
            <div className={`${isDark ? 'bg-red-900/20 border-red-500/50' : 'bg-red-50 border-red-300'} border-2 rounded-xl p-4`}>
              <h4 className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-700'} mb-2 flex items-center gap-2`}>
                <i className="fa-solid fa-exclamation-triangle"></i>
                Admin Note
              </h4>
              <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                {request.adminNotes}
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 rounded-xl p-5`}>
            <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} mb-4 flex items-center gap-2`}>
              <i className="fa-solid fa-route text-blue-600"></i>
              Request Progress
            </h4>
            <RequestTimeline request={request} isDark={isDark} />
          </div>

          {/* Action Panel */}
          {['Pending', 'Approved'].includes(request.status) && (
            <RequestActionPanel
              request={request}
              onCancel={onCancel}
              onConfirmPickup={onConfirmPickup}
              onConfirmReturn={onConfirmReturn}
              onRequestExtension={onRequestExtension}
              isDark={isDark}
            />
          )}
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 px-6 py-4 border-t-2 ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${
              isDark 
                ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailModal;
