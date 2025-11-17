import React from 'react';

export default function StagesEditor({ stages, onChange, growingPeriod }) {
  
  // Calculate total duration in days from stages
  const calculateTotalDays = () => {
    let totalDays = 0;
    stages.forEach(stage => {
      if (stage.durationValue && stage.durationUnit) {
        const value = parseInt(stage.durationValue);
        switch(stage.durationUnit) {
          case 'days': totalDays += value; break;
          case 'weeks': totalDays += value * 7; break;
          case 'months': totalDays += value * 30; break;
          default: break;
        }
      }
    });
    return totalDays;
  };

  // Calculate expected days from growing period
  const calculateExpectedDays = () => {
    if (!growingPeriod || !growingPeriod.min || !growingPeriod.unit) return { min: 0, max: 0 };
    
    const min = parseInt(growingPeriod.min);
    const max = parseInt(growingPeriod.max || growingPeriod.min);
    
    let multiplier = 1;
    switch(growingPeriod.unit) {
      case 'weeks': multiplier = 7; break;
      case 'months': multiplier = 30; break;
      default: multiplier = 1; break;
    }
    
    return { min: min * multiplier, max: max * multiplier };
  };

  const expectedDays = calculateExpectedDays();
  const totalDays = calculateTotalDays();
  const isValid = totalDays >= expectedDays.min && totalDays <= expectedDays.max;
  
  const addStage = () => {
    const newStages = [...stages, {
      stageName: '',
      durationValue: '',
      durationUnit: 'days',
      duration: '', // This will be computed
      description: '',
      activities: ['']
    }];
    onChange(newStages);
  };

  const removeStage = (index) => {
    const newStages = stages.filter((_, idx) => idx !== index);
    onChange(newStages);
  };

  const updateStage = (index, field, value) => {
    const newStages = [...stages];
    newStages[index] = { ...newStages[index], [field]: value };
    
    // Update computed duration field when durationValue or durationUnit changes
    if (field === 'durationValue' || field === 'durationUnit') {
      const stage = newStages[index];
      if (stage.durationValue && stage.durationUnit) {
        newStages[index].duration = `${stage.durationValue} ${stage.durationUnit}`;
      }
    }
    
    onChange(newStages);
  };

  const addActivity = (stageIndex) => {
    const newStages = [...stages];
    newStages[stageIndex].activities = [...newStages[stageIndex].activities, ''];
    onChange(newStages);
  };

  const removeActivity = (stageIndex, activityIndex) => {
    const newStages = [...stages];
    newStages[stageIndex].activities = newStages[stageIndex].activities.filter((_, idx) => idx !== activityIndex);
    onChange(newStages);
  };

  const updateActivity = (stageIndex, activityIndex, value) => {
    const newStages = [...stages];
    newStages[stageIndex].activities[activityIndex] = value;
    onChange(newStages);
  };

  const moveStage = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === stages.length - 1)
    ) {
      return;
    }

    const newStages = [...stages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newStages[index], newStages[targetIndex]] = [newStages[targetIndex], newStages[index]];
    onChange(newStages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-800">Growth Stages</h4>
          <p className="text-xs text-gray-500 mt-1">
            Stages must total {expectedDays.min}-{expectedDays.max} days to match the growing period.
          </p>
          {stages.length > 0 && (
            <div className={`text-xs mt-2 font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              {isValid ? '✓' : '⚠'} Current total: {totalDays} days 
              {!isValid && ` (Need: ${expectedDays.min}-${expectedDays.max} days)`}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={addStage}
          className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Stage
        </button>
      </div>

      {stages.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <div className="text-4xl mb-2">🌱</div>
          <p className="text-gray-600 text-sm">No stages added yet</p>
          <p className="text-gray-500 text-xs mt-1">Click "Add Stage" to create growth stages</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {stages.map((stage, stageIndex) => (
            <div
              key={stageIndex}
              className="border border-gray-300 rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                    {stageIndex + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    Stage {stageIndex + 1}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {/* Move Up */}
                  <button
                    type="button"
                    onClick={() => moveStage(stageIndex, 'up')}
                    disabled={stageIndex === 0}
                    className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  {/* Move Down */}
                  <button
                    type="button"
                    onClick={() => moveStage(stageIndex, 'down')}
                    disabled={stageIndex === stages.length - 1}
                    className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Remove Stage */}
                  <button
                    type="button"
                    onClick={() => removeStage(stageIndex)}
                    className="p-1 text-red-600 hover:text-red-800 ml-1"
                    title="Remove Stage"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Stage Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Stage Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={stage.stageName || ''}
                    onChange={(e) => updateStage(stageIndex, 'stageName', e.target.value)}
                    placeholder="e.g., Land Preparation, Seedling, Vegetative"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={stage.durationValue || ''}
                      onChange={(e) => updateStage(stageIndex, 'durationValue', e.target.value)}
                      placeholder="Number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                    <select
                      value={stage.durationUnit || 'days'}
                      onChange={(e) => updateStage(stageIndex, 'durationUnit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={stage.description || ''}
                  onChange={(e) => updateStage(stageIndex, 'description', e.target.value)}
                  placeholder="Describe what happens during this stage..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              {/* Activities */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-gray-700">
                    Key Activities
                  </label>
                  <button
                    type="button"
                    onClick={() => addActivity(stageIndex)}
                    className="text-xs text-green-600 hover:text-green-700 font-medium"
                  >
                    + Add Activity
                  </button>
                </div>
                <div className="space-y-2">
                  {stage.activities.map((activity, activityIndex) => (
                    <div key={activityIndex} className="flex items-center gap-2">
                      <span className="text-green-600 text-xs flex-shrink-0">•</span>
                      <input
                        type="text"
                        value={activity || ''}
                        onChange={(e) => updateActivity(stageIndex, activityIndex, e.target.value)}
                        placeholder="Activity description..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      {stage.activities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeActivity(stageIndex, activityIndex)}
                          className="p-1 text-red-600 hover:text-red-800 flex-shrink-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
