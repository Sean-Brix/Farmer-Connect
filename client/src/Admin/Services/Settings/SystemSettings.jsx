import { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Settings, Save, RotateCcw, Info, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SystemSettings = () => {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [editedValues, setEditedValues] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/system-settings', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key, value) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (key) => {
    const value = editedValues[key];
    if (value === undefined) return;

    setSaving(prev => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(`/api/system-settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ value })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Setting updated successfully');
        // Update local state
        setSettings(prev => ({
          ...prev,
          [Object.keys(prev).find(cat => 
            prev[cat].some(s => s.key === key)
          )]: prev[Object.keys(prev).find(cat => 
            prev[cat].some(s => s.key === key)
          )].map(s => 
            s.key === key ? { ...s, value, parsedValue: data.setting.parsedValue } : s
          )
        }));
        // Clear edited value
        setEditedValues(prev => {
          const newValues = { ...prev };
          delete newValues[key];
          return newValues;
        });
      } else {
        toast.error(data.error || 'Failed to update setting');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleReset = (key, originalValue) => {
    setEditedValues(prev => {
      const newValues = { ...prev };
      delete newValues[key];
      return newValues;
    });
  };

  const categoryInfo = {
    eic: {
      title: 'EIC (Equipment in Circulation)',
      description: 'Settings for borrowing equipment and tools',
      icon: '🔧',
      color: 'blue'
    },
    distribution: {
      title: 'Distribution',
      description: 'Settings for free item distribution program',
      icon: '📦',
      color: 'green'
    },
    notification: {
      title: 'Notifications',
      description: 'Settings for notification system',
      icon: '🔔',
      color: 'purple'
    },
    general: {
      title: 'General',
      description: 'General system settings',
      icon: '⚙️',
      color: 'gray'
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: isDark ? 'bg-blue-900/20' : 'bg-blue-50',
        border: isDark ? 'border-blue-700' : 'border-blue-200',
        text: isDark ? 'text-blue-300' : 'text-blue-700'
      },
      green: {
        bg: isDark ? 'bg-green-900/20' : 'bg-green-50',
        border: isDark ? 'border-green-700' : 'border-green-200',
        text: isDark ? 'text-green-300' : 'text-green-700'
      },
      purple: {
        bg: isDark ? 'bg-purple-900/20' : 'bg-purple-50',
        border: isDark ? 'border-purple-700' : 'border-purple-200',
        text: isDark ? 'text-purple-300' : 'text-purple-700'
      },
      gray: {
        bg: isDark ? 'bg-gray-800' : 'bg-gray-50',
        border: isDark ? 'border-gray-700' : 'border-gray-200',
        text: isDark ? 'text-gray-300' : 'text-gray-700'
      }
    };
    return colors[color] || colors.gray;
  };

  const renderInput = (setting) => {
    const currentValue = editedValues[setting.key] !== undefined 
      ? editedValues[setting.key] 
      : setting.value;

    if (setting.dataType === 'boolean') {
      return (
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={currentValue === 'true' || currentValue === true}
            onChange={(e) => handleValueChange(setting.key, e.target.checked ? 'true' : 'false')}
            className="mr-2 h-4 w-4 rounded"
          />
          <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {currentValue === 'true' || currentValue === true ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      );
    }

    if (setting.dataType === 'number') {
      return (
        <input
          type="number"
          value={currentValue}
          onChange={(e) => handleValueChange(setting.key, e.target.value)}
          className={`px-3 py-2 rounded-lg border w-32 ${
            isDark 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          min="0"
        />
      );
    }

    return (
      <input
        type="text"
        value={currentValue}
        onChange={(e) => handleValueChange(setting.key, e.target.value)}
        className={`px-3 py-2 rounded-lg border w-64 ${
          isDark 
            ? 'bg-gray-700 border-gray-600 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
        }`}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Settings className={isDark ? 'text-white' : 'text-gray-900'} size={32} />
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            System Settings
          </h1>
        </div>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Configure system-wide limits and restrictions for borrowing and distribution
        </p>
      </div>

      {/* Settings by Category */}
      <div className="space-y-6">
        {Object.entries(settings).map(([category, categorySettings]) => {
          const info = categoryInfo[category] || categoryInfo.general;
          const colors = getColorClasses(info.color);

          return (
            <div
              key={category}
              className={`border rounded-lg overflow-hidden ${
                isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}
            >
              {/* Category Header */}
              <div className={`px-6 py-4 border-b ${colors.bg} ${colors.border}`}>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{info.icon}</span>
                  <div>
                    <h2 className={`text-xl font-bold ${colors.text}`}>
                      {info.title}
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {info.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Settings List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {categorySettings.map((setting) => {
                  const isEdited = editedValues[setting.key] !== undefined;
                  const isSaving = saving[setting.key];

                  return (
                    <div
                      key={setting.key}
                      className={`px-6 py-4 ${
                        isDark ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {setting.key.split('_').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')}
                            </h3>
                            {setting.description && (
                              <button
                                className={`text-gray-400 hover:text-gray-600`}
                                title={setting.description}
                              >
                                <Info size={16} />
                              </button>
                            )}
                          </div>
                          {setting.description && (
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                              {setting.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-3">
                            {renderInput(setting)}
                            {isEdited && (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleSave(setting.key)}
                                  disabled={isSaving}
                                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${
                                    isSaving
                                      ? 'bg-gray-400 cursor-not-allowed'
                                      : 'bg-green-600 hover:bg-green-700'
                                  } text-white transition-colors`}
                                >
                                  {isSaving ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                      <span className="text-sm">Saving...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Save size={16} />
                                      <span className="text-sm">Save</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleReset(setting.key, setting.value)}
                                  disabled={isSaving}
                                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${
                                    isDark 
                                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                  } transition-colors`}
                                >
                                  <RotateCcw size={16} />
                                  <span className="text-sm">Reset</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Panel */}
      <div className={`mt-6 p-4 rounded-lg border ${
        isDark 
          ? 'bg-blue-900/20 border-blue-700' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-start space-x-3">
          <Info className={isDark ? 'text-blue-400' : 'text-blue-600'} size={20} />
          <div className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
            <p className="font-medium mb-1">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Changes take effect immediately for new requests</li>
              <li>Existing active requests are not affected by setting changes</li>
              <li>Setting values are cached for performance - changes may take up to 1 minute to propagate</li>
              <li>Invalid values will be rejected with an error message</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
