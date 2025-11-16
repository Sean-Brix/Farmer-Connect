import React, { useState, useEffect } from 'react';

/**
 * Stage Progression UI Component
 * Displays crop growth stages as a level-based progression system
 * Shows completed, current, and upcoming stages with gamified visual design
 */
export default function StageProgressionUI({ 
  crop, 
  theme = 'light',
  onSubmitReport 
}) {
  const [currentStageInfo, setCurrentStageInfo] = useState(null);
  const [stageProgress, setStageProgress] = useState([]);

  useEffect(() => {
    if (!crop?.guideline?.stages) return;

    const stages = crop.guideline.stages;
    const currentIndex = crop.currentStageIndex || 0;
    const plantingDate = new Date(crop.plantingDate);
    const today = new Date();
    const daysFromPlanting = Math.floor((today - plantingDate) / (1000 * 60 * 60 * 24));

    // Calculate expected dates for each stage
    let cumulativeDays = 0;
    const stagesWithDates = stages.map((stage, index) => {
      const stageDurationDays = calculateStageDays(stage);
      const expectedStartDay = cumulativeDays;
      const expectedEndDay = cumulativeDays + stageDurationDays;
      cumulativeDays = expectedEndDay;

      // Determine stage status
      let status = 'locked';
      let progress = 0;

      if (index < currentIndex) {
        status = 'completed';
        progress = 100;
      } else if (index === currentIndex) {
        status = 'current';
        // Calculate progress within current stage
        const daysIntoStage = daysFromPlanting - expectedStartDay;
        progress = Math.min(100, Math.max(0, (daysIntoStage / stageDurationDays) * 100));
      } else if (index === currentIndex + 1) {
        status = 'next';
      }

      return {
        ...stage,
        index,
        status,
        progress,
        expectedStartDay,
        expectedEndDay,
        expectedStartDate: new Date(plantingDate.getTime() + expectedStartDay * 24 * 60 * 60 * 1000),
        expectedEndDate: new Date(plantingDate.getTime() + expectedEndDay * 24 * 60 * 60 * 1000),
        durationDays: stageDurationDays,
      };
    });

    setStageProgress(stagesWithDates);
    setCurrentStageInfo(stagesWithDates[currentIndex]);
  }, [crop]);

  const calculateStageDays = (stage) => {
    if (!stage.durationValue || !stage.durationUnit) return 0;
    const value = parseInt(stage.durationValue);
    if (stage.durationUnit === 'days') return value;
    if (stage.durationUnit === 'weeks') return value * 7;
    if (stage.durationUnit === 'months') return value * 30;
    return 0;
  };

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

  if (!crop?.guideline?.stages || stageProgress.length === 0) {
    return (
      <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          No guideline stages available for this crop
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Stage Highlight */}
      {currentStageInfo && (
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
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Current Stage: {currentStageInfo.stageName}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  Stage {(crop.currentStageIndex || 0) + 1} of {stageProgress.length}
                </span>
              </div>
              <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                {currentStageInfo.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>Duration: </span>
                  <span className={theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}>{currentStageInfo.duration}</span>
                </div>
                <div>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>Expected End: </span>
                  <span className={theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}>
                    {currentStageInfo.expectedEndDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className={theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}>Stage Progress</span>
                  <span className={theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}>{Math.round(currentStageInfo.progress)}%</span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-blue-950' : 'bg-blue-200'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                    style={{ width: `${currentStageInfo.progress}%` }}
                  />
                </div>
              </div>

              {/* Key Activities */}
              {currentStageInfo.activities && (() => {
                // Parse activities if it's a JSON string
                const activitiesArray = typeof currentStageInfo.activities === 'string' 
                  ? JSON.parse(currentStageInfo.activities) 
                  : currentStageInfo.activities;
                
                return Array.isArray(activitiesArray) && activitiesArray.length > 0 && (
                  <div className="mb-4">
                    <h4 className={`text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                      📝 Key Activities:
                    </h4>
                    <ul className="space-y-1">
                      {activitiesArray.slice(0, 3).map((activity, idx) => (
                        <li key={idx} className={`text-sm flex items-start gap-2 ${theme === 'dark' ? 'text-blue-100' : 'text-blue-900'}`}>
                          <span className="text-green-500 flex-shrink-0">•</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

              {/* Submit Report Button */}
              <button
                onClick={() => onSubmitReport && onSubmitReport(crop)}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-green-600 hover:bg-green-500 shadow-lg hover:shadow-green-500/50'
                    : 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                }`}
              >
                📊 Submit Stage Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stage Progression Path */}
      <div className={`rounded-xl border p-6 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Growth Journey - All Stages
        </h3>
        
        <div className="space-y-4">
          {stageProgress.map((stage, index) => (
            <div key={stage.id || index} className="relative">
              {/* Connection Line */}
              {index < stageProgress.length - 1 && (
                <div className={`absolute left-8 top-16 w-0.5 h-8 ${
                  stage.status === 'completed' 
                    ? 'bg-green-400' 
                    : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`} />
              )}
              
              {/* Stage Card */}
              <div className={`border-2 rounded-lg p-4 transition-all duration-300 ${
                getStageColor(stage.status)
              } ${stage.status === 'current' ? 'shadow-lg scale-105' : ''}`}>
                <div className="flex items-start gap-4">
                  {/* Level Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold border-2 ${
                    stage.status === 'completed' ? 'bg-green-500 border-green-600 text-white' :
                    stage.status === 'current' ? 'bg-blue-500 border-blue-600 text-white animate-pulse' :
                    stage.status === 'next' ? 'bg-yellow-400 border-yellow-500 text-gray-900' :
                    theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-500' : 'bg-gray-200 border-gray-300 text-gray-500'
                  }`}>
                    {stage.status === 'locked' ? '🔒' : index + 1}
                  </div>

                  {/* Stage Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{getStageIcon(stage.status, index)}</span>
                      <h4 className={`font-bold text-base ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {stage.stageName}
                      </h4>
                      {stage.status === 'current' && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-semibold animate-pulse">
                          ACTIVE
                        </span>
                      )}
                      {stage.status === 'completed' && (
                        <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-semibold">
                          DONE
                        </span>
                      )}
                    </div>

                    {stage.status !== 'locked' && (
                      <>
                        <p className={`text-sm mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {stage.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                          <div>
                            <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Duration: 
                            </span>
                            <span className={`ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                              {stage.duration}
                            </span>
                          </div>
                          <div>
                            <span className={`font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Days: 
                            </span>
                            <span className={`ml-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                              {stage.expectedStartDay}-{stage.expectedEndDay}
                            </span>
                          </div>
                        </div>

                        {/* Stage Progress Bar (only for current stage) */}
                        {stage.status === 'current' && (
                          <div className="mt-2">
                            <div className={`h-2 rounded-full overflow-hidden ${
                              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                            }`}>
                              <div 
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                                style={{ width: `${stage.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Activities Preview */}
                        {stage.activities && stage.status !== 'locked' && (() => {
                          // Parse activities if it's a JSON string
                          const activitiesArray = typeof stage.activities === 'string' 
                            ? JSON.parse(stage.activities) 
                            : stage.activities;
                          
                          return Array.isArray(activitiesArray) && activitiesArray.length > 0 && (
                            <div className="mt-2">
                              <details className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <summary className="cursor-pointer hover:underline font-semibold">
                                  {activitiesArray.length} Activities
                                </summary>
                                <ul className="mt-1 ml-4 space-y-0.5">
                                  {activitiesArray.map((activity, idx) => (
                                    <li key={idx} className="flex items-start gap-1">
                                      <span className="text-green-500">•</span>
                                      <span>{activity}</span>
                                    </li>
                                  ))}
                                </ul>
                              </details>
                            </div>
                          );
                        })()}
                      </>
                    )}

                    {stage.status === 'locked' && (
                      <p className={`text-sm italic ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        Complete previous stages to unlock
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
              {stageProgress.filter(s => s.status === 'completed').length}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-green-200' : 'text-green-700'}`}>Completed</div>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}`}>
            <div className="text-2xl font-bold text-blue-600">
              {stageProgress.filter(s => s.status === 'current').length}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-blue-200' : 'text-blue-700'}`}>Current</div>
          </div>
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {stageProgress.filter(s => s.status === 'locked').length}
            </div>
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Upcoming</div>
          </div>
        </div>

        {/* Overall completion percentage */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Seedling Progress</span>
            <span className={`font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
              {Math.round(((crop.currentStageIndex || 0) / stageProgress.length) * 100)}%
            </span>
          </div>
          <div className={`h-4 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${((crop.currentStageIndex || 0) / stageProgress.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
