import React, { useEffect, useMemo, useState } from 'react';
import { surveyFormsAPI } from './surveyFormsAPI.js';
import * as XLSX from 'xlsx';

const groupByUser = (responses) => {
  const map = new Map();
  for (const r of responses) {
    const key = r.user?.id || 'anonymous';
    const label = r.user ? `${r.user.firstName || ''} ${r.user.surname || ''}`.trim() : 'Anonymous';
    const email = r.user?.email || '';
    const arr = map.get(key) || { key, label: label || email || 'Anonymous', email, items: [] };
    arr.items.push(r);
    map.set(key, arr);
  }
  // Sort groups by most recent submission desc
  const groups = Array.from(map.values());
  groups.forEach(g => g.items.sort((a,b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
  groups.sort((a,b) => new Date(b.items[0]?.submittedAt || 0) - new Date(a.items[0]?.submittedAt || 0));
  return groups;
};

const AnswerView = ({ answers }) => {
  return (
    <div className="mt-4 space-y-3">
      {answers.map((a, idx) => (
        <div key={idx} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-700 text-sm font-semibold">{idx + 1}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-gray-800 mb-2">{a.field?.label || 'Field'}</div>
              <div className="text-sm text-gray-900 leading-relaxed break-words">
                {Array.isArray(a.answer) ? (
                  <div className="flex flex-wrap gap-1">
                    {a.answer.map((item, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                        {String(item)}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="block">{String(a.answer ?? 'No answer provided')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {answers.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">No answers found for this response</p>
        </div>
      )}
    </div>
  );
};

// Date formatting helpers with month names (e.g., January 23, 2025 1:05 PM)
const formatDate = (dateLike) => {
  if (!dateLike) return '—';
  const d = new Date(dateLike);
  if (isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  }).format(d);
};

const formatDateTime = (dateLike) => {
  if (!dateLike) return '—';
  const d = new Date(dateLike);
  if (isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
  }).format(d);
};

const ResponsesModal = ({ isOpen, onClose, survey }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [data, setData] = useState({ surveyForm: null, responses: [] });
  const [pagination, setPagination] = useState(null);
  const [selectedGroupKey, setSelectedGroupKey] = useState(null);
  const [expandedItems, setExpandedItems] = useState(() => new Set());
  const [userSearch, setUserSearch] = useState('');
  const [userSort, setUserSort] = useState('recent'); // 'recent' | 'name'

  // Excel export function
  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = [];
      
      groups.forEach((group) => {
        group.items.forEach((response, idx) => {
          const row = {
            'Participant': group.label,
            'Email': group.email || 'No email',
            'Submission #': idx + 1,
            'Submitted At': formatDateTime(response.submittedAt),
          };
          
          // Add each answer as a column
          (response.answers || []).forEach((answer, ansIdx) => {
            const fieldLabel = answer.field?.label || `Field ${ansIdx + 1}`;
            const answerValue = Array.isArray(answer.answer) 
              ? answer.answer.join(', ') 
              : String(answer.answer ?? 'No answer');
            row[fieldLabel] = answerValue;
          });
          
          exportData.push(row);
        });
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Auto-fit columns
      const maxWidth = 50;
      const colWidths = [];
      const headers = Object.keys(exportData[0] || {});
      
      headers.forEach((header, i) => {
        const headerLen = header.length;
        const maxLen = exportData.reduce((max, row) => {
          const cellValue = String(row[header] || '');
          return Math.max(max, cellValue.length);
        }, headerLen);
        colWidths[i] = { wch: Math.min(maxLen + 2, maxWidth) };
      });
      
      ws['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses');

      // Generate filename
      const filename = `${survey?.title?.replace(/[^a-z0-9]/gi, '_') || 'survey'}_responses_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Write file
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export to Excel. Please try again.');
    }
  };

  useEffect(() => {
    if (!isOpen || !survey?.id) return;
    (async () => {
      setLoading(true); setError(null);
      try {
        const res = await surveyFormsAPI.getResponses(survey.id, { page, limit, sortBy: 'submittedAt', sortOrder: 'desc' });
        const payload = res?.data || {};
        setData({ surveyForm: payload.surveyForm || null, responses: payload.responses || [] });
        setPagination(res?.pagination || null);
      } catch (e) {
        setError(e?.message || 'Failed to load responses');
        setData({ surveyForm: null, responses: [] });
        setPagination(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, survey?.id, page, limit]);

  const groups = useMemo(() => groupByUser(data.responses || []), [data.responses]);

  const filteredGroups = useMemo(() => {
    const term = userSearch.trim().toLowerCase();
    let arr = groups;
    if (term) {
      arr = groups.filter(g => `${g.label} ${g.email}`.toLowerCase().includes(term));
    }
    if (userSort === 'name') {
      return [...arr].sort((a,b) => (a.label || '').localeCompare(b.label || ''));
    }
    // default: recent (already sorted by last submission desc in groupByUser)
    return arr;
  }, [groups, userSearch, userSort]);

  // Overall stats
  const stats = useMemo(() => {
    const totalResponses = data.responses?.length || 0;
    const uniqueUsers = groups.length;
    const totalAnswers = (data.responses || []).reduce((sum, r) => sum + (r.answers?.length || 0), 0);
    const lastSubmittedAt = (data.responses || [])
      .map(r => new Date(r.submittedAt).getTime())
      .filter(Boolean)
      .sort((a,b) => b-a)[0];
    return { totalResponses, uniqueUsers, totalAnswers, lastSubmittedAt };
  }, [data.responses, groups.length]);

  // Select first group by default when data or filter changes
  useEffect(() => {
    if (!selectedGroupKey && filteredGroups.length > 0) {
      setSelectedGroupKey(filteredGroups[0].key);
    } else if (selectedGroupKey && !filteredGroups.find(g => g.key === selectedGroupKey)) {
      setSelectedGroupKey(filteredGroups[0]?.key || null);
    }
  }, [filteredGroups, selectedGroupKey]);

  const toggleItem = (id) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70  flex items-center justify-center z-[100000] p-2 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-7xl w-full h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b rounded-3xl border-gray-200 bg-green-50 flex-shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg sm:text-xl" aria-hidden="true">📊</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate" title={survey?.title}>
                  Survey Responses
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 truncate" title={survey?.title}>
                  {survey?.title}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToExcel}
              disabled={groups.length === 0}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export to Excel"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden sm:inline">Export Excel</span>
            </button>
            <button 
              aria-label="Close responses" 
              onClick={onClose} 
              className="flex-shrink-0 p-1 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-lg transition-colors"
              title="Close"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="text-gray-600 font-medium">Loading responses...</span>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 m-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium shadow-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          ) : groups.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No responses yet</h4>
                <p className="text-gray-500">Responses will appear here once users submit the survey.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-2 sm:p-4 flex flex-col lg:flex-row gap-3 sm:gap-4 min-h-0">
              {/* Sidebar: Users */}
              <div className="w-full lg:w-80 lg:flex-shrink-0 border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="p-3 sm:p-4 bg-green-50 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">Survey Participants</h4>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      {filteredGroups.length}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        aria-label="Search users"
                        value={userSearch}
                        onChange={(e)=>setUserSearch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="Search participants..."
                      />
                    </div>
                    <select
                      aria-label="Sort users"
                      value={userSort}
                      onChange={(e)=>setUserSort(e.target.value)}
                      className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      title="Sort participants"
                    >
                      <option value="recent">Recent First</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-y-auto flex-1 min-h-0">
                  {filteredGroups.map(g => {
                    const isActive = g.key === selectedGroupKey;
                    const last = g.items[0]?.submittedAt ? formatDateTime(g.items[0].submittedAt) : '';
                    const initials = (g.label || 'A').split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase();
                    return (
                      <button
                        key={g.key}
                        onClick={() => { setSelectedGroupKey(g.key); setExpandedItems(new Set()); }}
                        className={`w-full flex items-center gap-3 p-3 sm:p-4 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${isActive ? 'bg-green-50 border-l-4 border-l-green-500' : ''}`}
                        aria-current={isActive ? 'true' : 'false'}
                      >
                        <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${isActive ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm text-gray-900 truncate">{g.label}</div>
                          <div className="text-xs text-gray-500 truncate">{g.email || 'No email provided'}</div>
                          <div className="text-xs text-gray-500 truncate mt-1">
                            {g.items.length} response{g.items.length>1?'s':''}
                            {last && (
                              <>
                                <span className="mx-1">•</span>
                                <span className="hidden sm:inline">{last}</span>
                                <span className="sm:hidden">{formatDate(g.items[0].submittedAt)}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${isActive ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                          {g.items.length}
                        </div>
                      </button>
                    );
                  })}
                  {filteredGroups.length === 0 && (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">No participants found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your search criteria</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Main content: Selected user's responses */}
              <div className="flex-1 min-w-0 border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
                {/* Overall stats */}
                <div className="p-3 sm:p-4 bg-green-50 border-b border-gray-200 flex-shrink-0">
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-900">Survey Overview</h4>
                    <p className="text-xs text-gray-500 mt-1">Aggregate statistics for all responses</p>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="text-xs font-medium text-gray-500">Total Responses</div>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalResponses}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <div className="text-xs font-medium text-gray-500">Unique Users</div>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.uniqueUsers}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <div className="text-xs font-medium text-gray-500">Total Answers</div>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalAnswers}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <div className="text-xs font-medium text-gray-500">Last Submitted</div>
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">{formatDateTime(stats.lastSubmittedAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Selected user's responses list */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0">
                  {(() => {
                    const sel = groups.find(g => g.key === selectedGroupKey);
                    if (!sel) return (
                      <div className="py-16 sm:py-20 text-center">
                        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">Select a participant</h4>
                        <p className="text-gray-500">Choose a participant from the sidebar to view their responses.</p>
                      </div>
                    );
                    
                    const userResponses = sel.items.length;
                    const userAnswers = sel.items.reduce((sum, r) => sum + (r.answers?.length || 0), 0);
                    const ts = sel.items.map(r => new Date(r.submittedAt).getTime()).filter(Boolean).sort((a,b)=>a-b);
                    const userFirst = ts[0];
                    const userLast = ts[ts.length-1];
                    
                    return (
                      <div className="space-y-4 sm:space-y-6">
                        {/* User header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-bold shadow-lg flex-shrink-0">
                              {(sel.label || 'A').split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="text-lg font-bold text-gray-900 truncate">{sel.label}</div>
                              <div className="text-sm text-gray-600 truncate">{sel.email || 'No email provided'}</div>
                              <div className="text-xs text-green-600 font-medium mt-1">
                                {sel.items.length} submission{sel.items.length>1?'s':''}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* User-specific stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <div className="text-xs font-medium text-gray-500">User Responses</div>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{userResponses}</div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <div className="text-xs font-medium text-gray-500">Total Answers</div>
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{userAnswers}</div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                              <div className="text-xs font-medium text-gray-500">First Submitted</div>
                            </div>
                            <div className="text-sm font-semibold text-gray-900 leading-tight">{formatDateTime(userFirst)}</div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                              <div className="text-xs font-medium text-gray-500">Last Submitted</div>
                            </div>
                            <div className="text-sm font-semibold text-gray-900 leading-tight">{formatDateTime(userLast)}</div>
                          </div>
                        </div>

                        {/* Response timeline */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 mb-4">
                            <h5 className="text-lg font-semibold text-gray-900">Response Timeline</h5>
                            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                          </div>
                          {sel.items.map((r) => (
                            <div key={r.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                              <button
                                onClick={() => toggleItem(r.id)}
                                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
                                aria-expanded={expandedItems.has(r.id)}
                                aria-controls={`resp-${r.id}`}
                              >
                                <div className="text-left flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                                      Submitted {formatDateTime(r.submittedAt)}
                                    </div>
                                    <div className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                                      <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        {(r.answers||[]).length} answers
                                      </span>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${expandedItems.has(r.id) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {expandedItems.has(r.id) ? 'Expanded' : 'Collapsed'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-lg transition-transform ${expandedItems.has(r.id) ? 'rotate-90 text-green-600' : 'text-gray-400'}`} aria-hidden="true">
                                    ▶
                                  </span>
                                </div>
                              </button>
                              {expandedItems.has(r.id) && (
                                <div id={`resp-${r.id}`} className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                                  <AnswerView answers={r.answers || []} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with pagination */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-sm text-gray-600 order-2 sm:order-1">
            {pagination ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline">Page {pagination.currentPage} of {pagination.totalPages}</span>
                <span className="sm:hidden">{pagination.currentPage}/{pagination.totalPages}</span>
                <span className="text-gray-400">•</span>
                <span>{pagination.totalItems} total</span>
              </div>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </div>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p-1))}
              disabled={!pagination || pagination.currentPage <= 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 hover:border-green-300 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </button>
            <button
              onClick={() => setPage((p) => (pagination ? Math.min(pagination.totalPages, p+1) : p+1))}
              disabled={!pagination || pagination.currentPage >= pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 hover:border-green-300 transition-colors flex items-center gap-2"
            >
              <span className="hidden sm:inline">Next</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsesModal;
