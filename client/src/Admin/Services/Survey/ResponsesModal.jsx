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

const ResponsesModal = ({ isOpen, onClose, survey }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [data, setData] = useState({ surveyForm: null, responses: [] });
  const [pagination, setPagination] = useState(null);
  const [selectedGroupKey, setSelectedGroupKey] = useState(null);
  const [expandedItems, setExpandedItems] = useState(() => new Set());

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

  // Select first group by default when data changes
  useEffect(() => {
    if (!selectedGroupKey && groups.length > 0) {
      setSelectedGroupKey(groups[0].key);
    } else if (selectedGroupKey && !groups.find(g => g.key === selectedGroupKey)) {
      setSelectedGroupKey(groups[0]?.key || null);
    }
  }, [groups, selectedGroupKey]);

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
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Responses — {survey?.title}</h3>
            <p className="text-xs text-gray-600">Grouped by user</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
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
              <div className="w-72 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
                  {groups.length} user{groups.length>1?'s':''}
                </div>
                <div className="overflow-y-auto">
                  {groups.map(g => {
                    const isActive = g.key === selectedGroupKey;
                    const last = g.items[0]?.submittedAt ? new Date(g.items[0].submittedAt).toLocaleString() : '';
                    const initials = (g.label || 'A').split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase();
                    return (
                      <button
                        key={g.key}
                        onClick={() => { setSelectedGroupKey(g.key); setExpandedItems(new Set()); }}
                        className={`w-full flex items-center gap-3 p-3 border-b border-gray-100 text-left hover:bg-gray-50 ${isActive ? 'bg-indigo-50' : ''}`}
                      >
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{initials}</div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm text-gray-900 truncate">{g.label}{g.email ? ` (${g.email})` : ''}</div>
                          <div className="text-[11px] text-gray-500 truncate">{g.items.length} response{g.items.length>1?'s':''}{last ? ` • ${last}` : ''}</div>
                        </div>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full border ${isActive ? 'bg-white text-indigo-700 border-indigo-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{g.items.length}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main content: Selected user's responses */}
              <div className="flex-1 min-w-0 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                {/* Overall stats */}
                <div className="p-3 bg-gray-50 border-b border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-2">
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
                    <div className="text-sm font-medium text-gray-900">{stats.lastSubmittedAt ? new Date(stats.lastSubmittedAt).toLocaleString() : '—'}</div>
                  </div>
                </div>

                {/* Selected user's responses list */}
                <div className="flex-1 overflow-y-auto p-3">
                  {(() => {
                    const sel = groups.find(g => g.key === selectedGroupKey);
                    if (!sel) return <div className="py-10 text-center text-gray-500">Select a user to view responses</div>;
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{sel.label}{sel.email ? ` (${sel.email})` : ''}</div>
                            <div className="text-xs text-gray-500">{sel.items.length} submission{sel.items.length>1?'s':''}</div>
                          </div>
                        </div>
                        {sel.items.map((r) => (
                          <div key={r.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button onClick={() => toggleItem(r.id)} className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50">
                              <div className="text-left">
                                <div className="font-medium text-gray-900">Submitted {new Date(r.submittedAt).toLocaleString()}</div>
                                <div className="text-xs text-gray-500">{(r.answers||[]).length} answers</div>
                              </div>
                              <span className="text-gray-500">{expandedItems.has(r.id) ? '▾' : '▸'}</span>
                            </button>
                            {expandedItems.has(r.id) && (
                              <div className="p-3">
                                <AnswerView answers={r.answers || []} />
                              </div>
                            )}
                          </div>
                        ))}
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
