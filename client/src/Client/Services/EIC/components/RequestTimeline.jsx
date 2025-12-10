import React from 'react';
import { getTimelineSteps } from '../utils/statusHelpers';

/**
 * RequestTimeline Component
 * Visual timeline showing request journey
 */
const RequestTimeline = ({ request, isDark = false }) => {
  const steps = getTimelineSteps(
    request.status,
    request.pickupDate,
    request.returnDate,
    request.actual_pickup,
    request.actual_return
  );

  const getStepColor = (step) => {
    if (step.completed) {
      return isDark ? 'text-green-400 border-green-400' : 'text-green-600 border-green-600';
    }
    if (step.active) {
      return isDark ? 'text-blue-400 border-blue-400' : 'text-blue-600 border-blue-600';
    }
    return isDark ? 'text-gray-600 border-gray-600' : 'text-gray-400 border-gray-400';
  };

  const getLineColor = (step, nextStep) => {
    if (step.completed && nextStep?.completed) {
      return isDark ? 'bg-green-400' : 'bg-green-600';
    }
    if (step.completed && nextStep?.active) {
      return isDark ? 'bg-blue-400' : 'bg-blue-600';
    }
    return isDark ? 'bg-gray-600' : 'bg-gray-300';
  };

  return (
    <div className="py-4">
      <div className="flex items-start justify-between relative">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.label} className="flex flex-col items-center flex-1 relative">
              {/* Timeline Node */}
              <div className={`w-10 h-10 rounded-full border-4 ${getStepColor(step)} ${step.active ? 'bg-current' : isDark ? 'bg-gray-800' : 'bg-white'} flex items-center justify-center z-10 shadow-lg`}>
                <i className={`fa-solid ${step.icon} text-sm ${step.completed || step.active ? 'text-white' : ''}`}></i>
              </div>
              
              {/* Timeline Line */}
              {!isLast && (
                <div 
                  className={`absolute top-5 left-1/2 w-full h-1 ${getLineColor(step, steps[index + 1])} -z-0`}
                  style={{ transform: 'translateY(-50%)' }}
                ></div>
              )}
              
              {/* Label */}
              <div className="text-center mt-3 w-full px-1">
                <div className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {step.label}
                </div>
                {step.date && (
                  <div className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {new Date(step.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestTimeline;
