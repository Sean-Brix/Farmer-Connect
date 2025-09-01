import React, { useEffect, useState } from 'react';
import { surveyFormsAPI } from '../../Survey/surveyFormsAPI.js';

const SendFormModal = ({ isOpen, onClose, onSend }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forms, setForms] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await surveyFormsAPI.getAll({ status: 'active', limit: 20, page: 1, sortBy: 'createdAt', sortOrder: 'desc', search });
        setForms(res.data || []);
      } catch (e) {
        setError(e?.message || 'Failed to load forms');
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Send Form</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-4">
          <div className="mb-3">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search active forms..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-2 text-sm mb-3">{error}</div>
          )}
          {loading ? (
            <div className="py-8 text-center text-gray-500">Loading forms…</div>
          ) : forms.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No active forms found</div>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {forms.map(form => (
                <li key={form.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{form.title}</div>
                    <div className="text-xs text-gray-500">{form.category} • {form.status}</div>
                  </div>
                  <button
                    onClick={() => onSend?.(form)}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                  >
                    Send
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 text-right">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  );
};

export default SendFormModal;
