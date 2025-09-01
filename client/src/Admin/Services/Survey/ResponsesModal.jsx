import React, { useEffect, useMemo, useState } from 'react';
import { surveyFormsAPI } from './surveyFormsAPI.js';

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
    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
      {answers.map((a, idx) => (
        <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">{a.field?.label || 'Field'}</div>
          <div className="text-sm text-gray-800 break-words">
            {Array.isArray(a.answer) ? a.answer.join(', ') : String(a.answer ?? '')}
          </div>
        </div>
      ))}
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100000] p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span aria-hidden="true">🧾</span>
              <h3 className="text-lg font-semibold text-gray-900 truncate" title={survey?.title}>Responses — {survey?.title}</h3>
            </div>
            <p className="text-xs text-gray-600">View submissions per user</p>
          </div>
          <button aria-label="Close responses" onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none" title="Close">×</button>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[calc(90vh-140px)] overflow-hidden">
          {loading ? (
            <div className="py-10 text-center text-gray-600">Loading…</div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">{error}</div>
          ) : groups.length === 0 ? (
            <div className="py-10 text-center text-gray-500">No responses yet</div>
          ) : (
            <div className="h-full flex gap-4">
      {/* Sidebar: Users */}
              <div className="w-80 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <div className="text-[11px] text-gray-600 mb-2">Users</div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        aria-label="Search users"
                        value={userSearch}
                        onChange={(e)=>setUserSearch(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Search name or email"
                      />
                    </div>
                    <select
                      aria-label="Sort users"
                      value={userSort}
                      onChange={(e)=>setUserSort(e.target.value)}
                      className="px-2 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                      title="Sort users"
                    >
                      <option value="recent">Recent</option>
                      <option value="name">Name</option>
                    </select>
                  </div>
                  <div className="mt-2 text-[11px] text-gray-500">{filteredGroups.length} user{filteredGroups.length!==1?'s':''}</div>
                </div>
                <div className="overflow-y-auto">
                  {filteredGroups.map(g => {
                    const isActive = g.key === selectedGroupKey;
        const last = g.items[0]?.submittedAt ? formatDateTime(g.items[0].submittedAt) : '';
                    const initials = (g.label || 'A').split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase();
                    return (
                      <button
                        key={g.key}
                        onClick={() => { setSelectedGroupKey(g.key); setExpandedItems(new Set()); }}
                        className={`w-full flex items-center gap-3 p-3 border-b border-gray-100 text-left hover:bg-gray-50 ${isActive ? 'bg-indigo-50/70' : ''}`}
                        aria-current={isActive ? 'true' : 'false'}
                      >
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{initials}</div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm text-gray-900 truncate">{g.label}</div>
                          <div className="text-[11px] text-gray-500 truncate">{g.email || '—'}</div>
                          <div className="text-[11px] text-gray-500 truncate">{g.items.length} response{g.items.length>1?'s':''}{last ? ` • ${last}` : ''}</div>
                        </div>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full border ${isActive ? 'bg-white text-indigo-700 border-indigo-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`} aria-label={`${g.items.length} responses`}>{g.items.length}</span>
                      </button>
                    );
                  })}
                  {filteredGroups.length === 0 && (
                    <div className="p-6 text-center text-sm text-gray-500">No users match your search</div>
                  )}
                </div>
              </div>

              {/* Main content: Selected user's responses */}
              <div className="flex-1 min-w-0 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                {/* Overall stats */}
                <div className="p-3 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="text-[11px] text-gray-500">Total Responses</div>
                      <div className="text-lg font-semibold text-gray-900">{stats.totalResponses}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="text-[11px] text-gray-500">Unique Users</div>
                      <div className="text-lg font-semibold text-gray-900">{stats.uniqueUsers}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="text-[11px] text-gray-500">Total Answers</div>
                      <div className="text-lg font-semibold text-gray-900">{stats.totalAnswers}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="text-[11px] text-gray-500">Last Submitted</div>
                      <div className="text-sm font-medium text-gray-900">{formatDateTime(stats.lastSubmittedAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Selected user's responses list */}
                <div className="flex-1 overflow-y-auto p-3">
                  {(() => {
                    const sel = groups.find(g => g.key === selectedGroupKey);
                    if (!sel) return <div className="py-10 text-center text-gray-500">Select a user to view responses</div>;
                    const userResponses = sel.items.length;
                    const userAnswers = sel.items.reduce((sum, r) => sum + (r.answers?.length || 0), 0);
                    const ts = sel.items.map(r => new Date(r.submittedAt).getTime()).filter(Boolean).sort((a,b)=>a-b);
                    const userFirst = ts[0];
                    const userLast = ts[ts.length-1];
                    return (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {(sel.label || 'A').split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-gray-900 truncate">{sel.label}</div>
                              <div className="text-xs text-gray-500 truncate">{sel.email || '—'}</div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">{sel.items.length} submission{sel.items.length>1?'s':''}</div>
                        </div>
                        {/* Selected user stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="text-[11px] text-gray-500">User Responses</div>
                            <div className="text-lg font-semibold text-gray-900">{userResponses}</div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="text-[11px] text-gray-500">Answers by User</div>
                            <div className="text-lg font-semibold text-gray-900">{userAnswers}</div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="text-[11px] text-gray-500">First Submitted</div>
                            <div className="text-sm font-medium text-gray-900">{formatDateTime(userFirst)}</div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="text-[11px] text-gray-500">Last Submitted</div>
                            <div className="text-sm font-medium text-gray-900">{formatDateTime(userLast)}</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {sel.items.map((r) => (
                            <div key={r.id} className="border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => toggleItem(r.id)}
                                className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50"
                                aria-expanded={expandedItems.has(r.id)}
                                aria-controls={`resp-${r.id}`}
                              >
                                <div className="text-left">
                                  <div className="font-medium text-gray-900">Submitted {formatDateTime(r.submittedAt)}</div>
                                  <div className="text-xs text-gray-500">{(r.answers||[]).length} answers</div>
                                </div>
                                <span className="text-gray-500" aria-hidden="true">{expandedItems.has(r.id) ? '▾' : '▸'}</span>
                              </button>
                              {expandedItems.has(r.id) && (
                                <div id={`resp-${r.id}`} className="p-3">
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
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {pagination ? (
              <>Page {pagination.currentPage} of {pagination.totalPages} • {pagination.totalItems} total</>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p-1))}
              disabled={!pagination || pagination.currentPage <= 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
            >Previous</button>
            <button
              onClick={() => setPage((p) => (pagination ? Math.min(pagination.totalPages, p+1) : p+1))}
              disabled={!pagination || pagination.currentPage >= pagination.totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
            >Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsesModal;
