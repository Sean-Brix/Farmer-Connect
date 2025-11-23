import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import FirebaseImageTest from './Testing/FirebaseImageTest';
import CachedProfilesViewer from './Caching/CachedProfilesViewer';

const DevPage = () => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('testing');
    const [activeScript, setActiveScript] = useState('firebase-image');

    const tabs = {
        testing: {
            label: 'Testing',
            icon: '🧪',
            scripts: [
                { id: 'firebase-image', label: 'Firebase Image Upload/Delete', component: FirebaseImageTest },
                { id: 'api-endpoints', label: 'API Endpoints Test', component: null },
                { id: 'socket-connection', label: 'Socket Connection Test', component: null },
            ]
        },
        caching: {
            label: 'Caching',
            icon: '💾',
            scripts: [
                { id: 'cached-profiles', label: 'View Cached User Profiles', component: CachedProfilesViewer },
                { id: 'cache-performance', label: 'Cache Performance Stats', component: null },
                { id: 'cache-settings', label: 'Cache Configuration', component: null },
            ]
        },
        seeding: {
            label: 'Seeding',
            icon: '🌱',
            scripts: [
                { id: 'seed-accounts', label: 'Seed Accounts', component: null },
                { id: 'seed-inquiries', label: 'Seed Inquiries', component: null },
                { id: 'seed-crops', label: 'Seed Crop Data', component: null },
            ]
        },
        reset: {
            label: 'Reset',
            icon: '🔄',
            scripts: [
                { id: 'reset-database', label: 'Reset Database', component: null },
                { id: 'clear-cache', label: 'Clear Server Cache', component: null },
                { id: 'reset-migrations', label: 'Reset Migrations', component: null },
            ]
        },
        simulate: {
            label: 'Simulate',
            icon: '🎭',
            scripts: [
                { id: 'simulate-users', label: 'Simulate User Activity', component: null },
                { id: 'simulate-load', label: 'Load Testing', component: null },
                { id: 'simulate-errors', label: 'Error Scenarios', component: null },
            ]
        }
    };

    const currentTab = tabs[activeTab];
    const currentScript = currentTab.scripts.find(s => s.id === activeScript);
    const ScriptComponent = currentScript?.component;

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">🛠️</span>
                            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Developer Tools
                            </h1>
                        </div>
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Environment: <span className="font-semibold text-yellow-500">Development</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Main Tabs */}
                <div className="flex space-x-1 mb-6">
                    {Object.entries(tabs).map(([key, tab]) => (
                        <button
                            key={key}
                            onClick={() => {
                                setActiveTab(key);
                                setActiveScript(tab.scripts[0]?.id);
                            }}
                            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                                activeTab === key
                                    ? theme === 'dark'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-blue-500 text-white shadow-lg'
                                    : theme === 'dark'
                                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            <span className="text-xl">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar - Script List */}
                    <div className="col-span-3">
                        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden`}>
                            <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'}`}>
                                <h2 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Scripts
                                </h2>
                            </div>
                            <div className="p-2">
                                {currentTab.scripts.map(script => (
                                    <button
                                        key={script.id}
                                        onClick={() => setActiveScript(script.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-all ${
                                            activeScript === script.id
                                                ? theme === 'dark'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-500 text-white'
                                                : theme === 'dark'
                                                ? 'text-gray-300 hover:bg-gray-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <div className="font-medium">{script.label}</div>
                                        {!script.component && (
                                            <div className="text-xs mt-1 opacity-75">Coming soon</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-span-9">
                        <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden min-h-[600px]`}>
                            {ScriptComponent ? (
                                <ScriptComponent />
                            ) : (
                                <div className="flex items-center justify-center h-[600px]">
                                    <div className="text-center">
                                        <div className="text-6xl mb-4">🚧</div>
                                        <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            Coming Soon
                                        </h3>
                                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                                            This script is under development
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevPage;
