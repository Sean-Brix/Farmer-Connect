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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[10000] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-200 bg-gray-50 rounded-t-2xl">
          <h3 className="text-xl font-bold text-gray-900">Send Form to Customer</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm">×</button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search active forms..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-900 font-medium"
            />
          </div>
          {error && (
            <div className="bg-red-50 text-red-800 border-2 border-red-200 rounded-xl p-3 text-sm mb-4 font-medium">{error}</div>
          )}
          {loading ? (
            <div className="py-12 text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-lg font-medium">Loading forms...</p>
            </div>
          ) : forms.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p className="text-lg font-medium">No active forms found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto border border-gray-200 rounded-xl">
              {forms.map(form => (
                <li key={form.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">{form.title}</div>
                    <div className="text-sm text-gray-600 font-medium">{form.category} • {form.status}</div>
                  </div>
                  <button
                    onClick={() => onSend?.(form)}
                    className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    Send Form
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-6 border-t-2 border-gray-200 text-right bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2.5 border-2 border-gray-400 rounded-xl text-gray-700 hover:bg-white font-semibold transition-all duration-200">Close</button>
        </div>
      </div>
    </div>
  );
};

export default SendFormModal;
