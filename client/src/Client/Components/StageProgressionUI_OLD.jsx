import React, { useState, useEffect } from 'react';

/**
 * Stage Progression UI Component
 * Displays crop growth stages as a level-based progression system
 * Shows completed, current, and upcoming stages with gamified visual design
 * Now integrated with backend stage validation system
 */
export default function StageProgressionUI({ 
  crop, 
  theme = 'light',
  onSubmitReport,
  onMessageAdmin
}) {
  const [stageInfo, setStageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTargetStage, setSelectedTargetStage] = useState(null);

  useEffect(() => {
    if (!crop?.id) return;

    const fetchStageInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/seed-track/crops/${crop.id}/stage-info`);
        if (!response.ok) {
          throw new Error('Failed to fetch stage information');
        }
        const data = await response.json();
        if (data.success && data.stageInfo) {
          setStageInfo(data.stageInfo);
        }
      } catch (err) {
        console.error('Error fetching stage info:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStageInfo();
    
    // Refresh stage info every 30 seconds
    const interval = setInterval(fetchStageInfo, 30000);
    return () => clearInterval(interval);
  }, [crop?.id]);

  if (loading && !stageInfo) {
    return (
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading stage information...
        </p>
      </div>
    );
  }

  if (error || !stageInfo) {
    return (
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <p className={`text-center ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
          {error || 'No stage information available for this crop'}
        </p>
      </div>
    );
  }

  const { 
    currentStageName, 
    currentStageIndex, 
    totalStages, 
    daysRemaining,
    currentStageStartDate,
    currentStageEndDate,
    currentStageDetails,
    pendingReports = [],
    allStages = []
  } = stageInfo;

  const isCompleted = currentStageIndex >= totalStages;

  const getStageIcon = (status, index) => {
    if (status === 'completed') return '✅';
    if (status === 'current') return '🌟';
    if (status === 'next') return '🔓';
    return '🔒';
  };

  const getStageColor = (status) => {
    if (status === 'completed') return theme === 'dark' ? 'bg-green-900 border-green-500' : 'bg-green-50 border-green-400';
    if (status === 'current') return theme === 'dark' ? 'bg-blue-900 border-blue-400' : 'bg-blue-50 border-blue-400';
    if (status === 'next') return theme === 'dark' ? 'bg-yellow-900 border-yellow-500' : 'bg-yellow-50 border-yellow-400';
    return theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-100 border-gray-300';
  };

  // Calculate stage progress for current stage
  const currentStageProgress = !isCompleted && currentStageStartDate && currentStageEndDate ? (() => {
    const today = new Date();
    const startDate = new Date(currentStageStartDate);
    const endDate = new Date(currentStageEndDate);
    const totalDuration = endDate - startDate;
    const elapsedDuration = today - startDate;
    return Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
  })() : 0;

  return (
    <div className="space-y-6">
      {/* Completion Banner */}
      {isCompleted && (
        <div className={`rounded-xl border-2 p-6 text-center ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-green-900 to-green-800 border-green-400' 
            : 'bg-gradient-to-br from-green-50 to-green-100 border-green-400'
        }`}>
          <div className="text-6xl mb-4">🎉</div>
          <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            All Stages Completed!
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-green-200' : 'text-green-800'}`}>
            Your crop has successfully completed all growth stages. Time to harvest!
          </p>
        </div>
      )}

      {/* Pending Reports Alert */}
      {pendingReports.length > 0 && (
        <div className={`rounded-xl border-2 p-6 mb-6 ${{
          theme === 'dark' 
            ? 'bg-gradient-to-br from-yellow-900 to-yellow-800 border-yellow-400' 
            : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400'
        }`}>
          <div className="flex items-start gap-4">
            <div className="text-4xl">📋</div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {pendingReports.length} Pending Report{pendingReports.length !== 1 ? 's' : ''}
              </h3>
              <div className="space-y-3">
                {pendingReports.map((report) => {
                  const isOverdue = report.isOverdue;
                  return (
                    <div 
                      key={report.id}
                      className={`p-3 rounded-lg border ${{
                        theme === 'dark' 
                          ? isOverdue ? 'bg-red-900/30 border-red-500' : 'bg-yellow-900/30 border-yellow-500'
                          : isOverdue ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            {report.stageName} Report
                            {isOverdue && (
                              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                OVERDUE
                              </span>
                            )}
                          </div>
                          <div className="text-xs opacity-80 mt-1">
                            Due: {new Date(report.reportDueDate).toLocaleDateString()}
                            {isOverdue && ` (${Math.abs(Math.ceil((new Date(report.reportDueDate) - new Date()) / (1000 * 60 * 60 * 24)))} days late)`}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedTargetStage(report.stageIndex);
                            onSubmitReport && onSubmitReport(crop, report.stageIndex);
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${{
                            theme === 'dark'
                              ? isOverdue 
                                ? 'bg-red-600 hover:bg-red-500 text-white'
                                : 'bg-yellow-600 hover:bg-yellow-500 text-white'
                              : isOverdue
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          }`}
                        >
                          Submit Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Stage Highlight */}
      {!isCompleted && currentStageDetails && (
        <div className={`rounded-xl border-2 p-6 ${
          theme === 'dark' 
            ? 'bg-gradient-to-br from-blue-900 to-blue-800 border-blue-400' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400'
        }`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                theme === 'dark' ? 'bg-blue-700' : 'bg-blue-200'
              }`}>
                🌟
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Current Stage: {currentStageName}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  Stage {currentStageIndex + 1} of {totalStages}
                </span>
              </div>
              {currentStageDetails.description && (
                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                  {currentStageDetails.description}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>Duration: </span>
                  <span className={theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}>{currentStageDetails.duration}</span>
                </div>
                <div>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>Expected End: </span>
                  <span className={theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}>
                    {new Date(currentStageEndDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className={theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}>Stage Progress</span>
                  <span className={theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}>{Math.round(currentStageProgress)}%</span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-blue-950' : 'bg-blue-200'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                    style={{ width: `${currentStageProgress}%` }}
                  />
                </div>
              </div>

              {/* Key Activities */}
              {currentStageDetails.activities && Array.isArray(currentStageDetails.activities) && currentStageDetails.activities.length > 0 && (
                <div className="mb-4">
                  <h4 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                    📝 Key Activities:
                  </h4>
                  <ul className="space-y-1">
                    {currentStageDetails.activities.slice(0, 3).map((activity, idx) => (
                      <li key={idx} className={`text-sm flex items-start gap-2 ${theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}`}>
                        <span className="text-green-500 flex-shrink-0">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Report Status Messages */}
              {hasReportForCurrentStage && (
                <div className={`mb-4 p-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-purple-900/30 border-purple-600 text-purple-200' 
                    : 'bg-purple-50 border-purple-400 text-purple-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✅</span>
                    <div className="text-sm">
                      <div className="font-semibold">Report submitted for this stage!</div>
                      <div className="text-xs opacity-80">
                        {daysRemaining > 0 
                          ? `Wait ${daysRemaining} more day${daysRemaining !== 1 ? 's' : ''} before advancing to next stage`
                          : 'Stage duration complete - will advance on next report submission'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!hasReportForCurrentStage && !canSubmitReport && daysRemaining > 0 && (
                <div className={`mb-4 p-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-yellow-900/30 border-yellow-600 text-yellow-200' 
                    : 'bg-yellow-50 border-yellow-400 text-yellow-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏳</span>
                    <div className="text-sm">
                      <div className="font-semibold">Report locked for {daysRemaining} more day{daysRemaining !== 1 ? 's' : ''}</div>
                      <div className="text-xs opacity-80">Wait for the stage duration to pass before submitting</div>
                    </div>
                  </div>
                </div>
              )}

              {!hasReportForCurrentStage && canSubmitReport && (
                <div className={`mb-4 p-3 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-green-900/30 border-green-600 text-green-200' 
                    : 'bg-green-50 border-green-400 text-green-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <div className="text-sm">
                      <div className="font-semibold">Ready to submit report!</div>
                      <div className="text-xs opacity-80">Stage duration has passed - you can now submit your report</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Report Button */}
              <button
                onClick={() => canSubmitReport && !hasReportForCurrentStage && onSubmitReport && onSubmitReport(crop)}
                disabled={!canSubmitReport || hasReportForCurrentStage}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                  canSubmitReport && !hasReportForCurrentStage
                    ? theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-500 shadow-lg hover:shadow-green-500/50 transform hover:scale-105 cursor-pointer'
                      : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                {hasReportForCurrentStage 
                  ? '✅ Report Already Submitted' 
                  : canSubmitReport 
                    ? '📊 Submit Stage Report' 
                    : '🔒 Report Not Available Yet'
                }
              </button>

              {/* Message Admin Button */}
              <button
                onClick={() => onMessageAdmin && onMessageAdmin(crop)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/50 transform hover:scale-105'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                💬 Message Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage Progression Path */}
      {allStages.length > 0 && (
        <div className={`rounded-xl border p-6 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Growth Journey - All Stages
          </h3>
          
          <div className="space-y-4">
            {allStages.map((stage, index) => {
              const hasReport = stage.hasReport;
              const reportStatus = stage.reportStatus;
              const isCurrent = index === currentStageIndex;
              const isNext = index === currentStageIndex + 1;
              const isLocked = index > currentStageIndex;
              
              let status = 'locked';
              if (hasReport && reportStatus === 'Submitted') status = 'completed';
              else if (isCurrent) status = 'current';
              else if (isNext) status = 'next';
              
              const hasPendingReport = hasReport && (reportStatus === 'Pending' || reportStatus === 'Late');

              return (
                <div key={index} className="relative">
                  {/* Connection Line */}
                  {index < allStages.length - 1 && (
                    <div className={`absolute left-8 top-16 w-0.5 h-8 ${
                      isStageCompleted
                        ? 'bg-green-400' 
                        : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                    }`} />
                  )}
                  
                  {/* Stage Card */}
                  <div className={`border-2 rounded-lg p-4 transition-all duration-300 ${
                    getStageColor(status)
                  } ${isCurrent ? 'shadow-lg scale-105' : ''}`}>
                    <div className="flex items-start gap-4">
                      {/* Level Icon */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold border-2 ${{
                        hasReport && reportStatus === 'Submitted' ? 'bg-green-500 border-green-600 text-white' :
                        hasPendingReport ? 'bg-yellow-500 border-yellow-600 text-white' :
                        isCurrent ? 'bg-blue-500 border-blue-600 text-white animate-pulse' :
                        isNext ? 'bg-yellow-400 border-yellow-500 text-gray-900' :
                        theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-500' : 'bg-gray-200 border-gray-300 text-gray-500'
                      }`}>
                        {isLocked ? '🔒' : index + 1}
                      </div>

                      {/* Stage Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-2xl">{getStageIcon(status, index)}</span>
                          <h4 className={`font-bold text-base ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {stage.name}
                          </h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-semibold animate-pulse">
                              ACTIVE
                            </span>
                          )}
                          {hasReport && reportStatus === 'Submitted' && (
                            <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-semibold">
                              ✓ SUBMITTED
                            </span>
                          )}
                          {reportStatus === 'Pending' && (
                            <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full font-semibold">
                              📋 PENDING
                            </span>
                          )}
                          {reportStatus === 'Late' && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-semibold">
                              ⚠️ OVERDUE
                            </span>
                          )}
                        </div>

                        {!isLocked && (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
                              <div>
                                <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Duration: 
                                </span>
                                <span className={`ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                                  {stage.duration}
                                </span>
                              </div>
                              {stage.reportDueDate && hasPendingReport && (
                                <div>
                                  <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Report Due: 
                                  </span>
                                  <span className={`ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                                    {new Date(stage.reportDueDate).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              {stage.reportSubmittedAt && reportStatus === 'Submitted' && (
                                <div>
                                  <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Submitted: 
                                  </span>
                                  <span className={`ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                                    {new Date(stage.reportSubmittedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Stage Progress Bar (only for current stage) */}
                            {isCurrent && (
                              <div className="mt-2">
                                <div className={`h-2 rounded-full overflow-hidden ${
                                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                                }`}>
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                                    style={{ width: `${currentStageProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        {isLocked && (
                          <p className={`text-sm italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            Complete previous stages to unlock
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Overall Progress Stats */}
      <div className={`rounded-xl border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          📈 Overall Progress
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900' : 'bg-green-50'}`}>
            <div className="text-2xl font-bold text-green-600">
              {completedStages}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-green-200' : 'text-green-700'}`}>Completed</div>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
            <div className="text-2xl font-bold text-blue-600">
              {isCompleted ? 0 : 1}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>Current</div>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {totalStages - completedStages - (isCompleted ? 0 : 1)}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Upcoming</div>
          </div>
        </div>

        {/* Overall completion percentage */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Overall Progress</span>
            <span className={`font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
              {Math.round((completedStages / totalStages) * 100)}%
            </span>
          </div>
          <div className={`h-4 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(completedStages / totalStages) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
