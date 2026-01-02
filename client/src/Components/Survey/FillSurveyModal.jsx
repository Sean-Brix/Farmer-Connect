import React, { useEffect, useMemo, useState } from 'react';

const API_BASE = '/api/survey-forms';

const Field = ({ field, value, onChange }) => {
  const common = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200';
  
  // Safely parse options - handle case where options might be a JSON string
  const getOptions = () => {
    if (!field.options) return [];
    if (Array.isArray(field.options)) return field.options;
    if (typeof field.options === 'string') {
      try {
        const parsed = JSON.parse(field.options);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // If it's not valid JSON, treat as comma-separated string
        return field.options.split(',').map(opt => opt.trim()).filter(opt => opt);
      }
    }
    return [];
  };
  
  const options = getOptions();
  
  switch (field.type) {
    case 'TEXT':
      return <input type="text" className={common} placeholder={field.placeholder} value={value || ''} onChange={e => onChange(e.target.value)} />;
    case 'TEXTAREA':
      return <textarea rows={4} className={`${common} resize-none`} placeholder={field.placeholder} value={value || ''} onChange={e => onChange(e.target.value)} />;
    case 'EMAIL':
      return <input type="email" className={common} placeholder={field.placeholder} value={value || ''} onChange={e => onChange(e.target.value)} />;
    case 'NUMBER':
      return <input type="number" className={common} placeholder={field.placeholder} value={value || ''} onChange={e => onChange(e.target.value)} />;
    case 'DATE':
      return <input type="date" className={common} value={value || ''} onChange={e => onChange(e.target.value)} />;
    case 'SELECT':
      return (
        <select className={common} value={value || ''} onChange={e => onChange(e.target.value)}>
          <option value="">Choose an option...</option>
          {options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
      );
    case 'RADIO':
      return (
        <div className="space-y-3">
          {options.map((opt, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name={`field-${field.id}`} value={opt} checked={value === opt} onChange={() => onChange(opt)} className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500" />
              <span className="text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      );
    case 'CHECKBOX':
      return (
        <div className="space-y-3">
          {options.map((opt, i) => {
            const arr = Array.isArray(value) ? value : [];
            const checked = arr.includes(opt);
            const toggle = () => {
              const next = checked ? arr.filter(v => v !== opt) : [...arr, opt];
              onChange(next);
            };
            return (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={checked} onChange={toggle} className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                <span className="text-gray-700">{opt}</span>
              </label>
            );
          })}
        </div>
      );
    case 'FILE':
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="text-gray-400 mb-2">📎</div>
          <p className="text-sm text-gray-500">File uploads aren’t supported here</p>
        </div>
      );
    default:
      return <input type="text" className={common} value={value || ''} onChange={e => onChange(e.target.value)} />;
  }
};

const FillSurveyModal = ({ isOpen, onClose, surveyId, title }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const requiredSet = useMemo(() => new Set((form?.fields || []).filter(f => f.required).map(f => f.id)), [form]);

  useEffect(() => {
    if (!isOpen || !surveyId) return;
  (async () => {
      setLoading(true);
      setError(null);
      try {
    const res = await fetch(`${API_BASE}/forms/${surveyId}/public`);
        if (!res.ok) throw new Error('Failed to load form');
    const data = await res.json();
    setForm(data?.data || null);
      } catch (e) {
        setError(e?.message || 'Failed to load form');
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, surveyId]);

  const setField = (fieldId, v) => setValues(prev => ({ ...prev, [fieldId]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    const answers = (form.fields || []).reduce((arr, f) => {
      const v = values[f.id];
      if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) {
        if (f.required) {
          setError(`Please complete required field: ${f.label}`);
          return null;
        }
        return arr;
      }
      arr.push({ fieldId: f.id, answer: v });
      return arr;
    }, []);
    if (answers === null) return;
    setSubmitting(true);
    setError(null);
    try {
  const res = await fetch(`${API_BASE}/responses/${surveyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, metadata: { source: 'inquiry-modal' } })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to submit');
      }
      setSubmitted(true);
    } catch (e) {
      setError(e?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100000] p-4" 
      style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
      <h3 className="text-lg font-semibold text-gray-900">{title || form?.title || 'Form'}</h3>
      {!submitted && form && <p className="text-sm text-gray-600">Please fill out the form</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="py-12 text-center text-gray-600">Loading…</div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">{error}</div>
          ) : submitted ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-3">✅</div>
              <div className="text-gray-800 font-semibold">Thanks! Your response was submitted.</div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6">
              <form className="space-y-6" onSubmit={onSubmit}>
                {(form?.fields || []).map((field) => (
                  <div key={field.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <Field field={field} value={values[field.id]} onChange={(v) => setField(field.id, v)} />
                  </div>
                ))}
                <div className="flex items-center justify-end gap-3">
                  <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Close</button>
                  <button type="submit" disabled={submitting} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50">
                    {submitting ? 'Submitting…' : 'Submit Response'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
  {!loading && !error && submitted && (
          <div className="p-4 border-t border-gray-200 text-right">
            <button onClick={onClose} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Done</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FillSurveyModal;
