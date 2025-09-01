import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = '/api/survey-forms';

const Field = ({ field, value, onChange }) => {
  const common = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200';
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
          {(field.options || []).map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </select>
      );
    case 'RADIO':
      return (
        <div className="space-y-3">
          {(field.options || []).map((opt, i) => (
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
          {(field.options || []).map((opt, i) => {
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

const FillSurvey = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const requiredSet = useMemo(() => new Set((form?.fields || []).filter(f => f.required).map(f => f.id)), [form]);

  useEffect(() => {
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
  }, [surveyId]);

  const setField = (fieldId, v) => setValues(prev => ({ ...prev, [fieldId]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    // Build answers array in expected format
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
        body: JSON.stringify({ answers, metadata: { source: 'inquiry-link' } })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to submit');
      }
      navigate('/survey?submitted=1');
    } catch (e) {
      setError(e?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading form…</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!form) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200">{form.category}</span>
          </div>
          {form.description && <p className="text-gray-600 text-lg leading-relaxed">{form.description}</p>}
          <div className="mt-4 text-sm text-gray-500 bg-gray-50 inline-block px-3 py-1 rounded-full">
            {(form.fields?.length || 0)} fields
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <form className="space-y-6" onSubmit={onSubmit}>
            {(form.fields || []).map((field) => (
              <div key={field.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <Field field={field} value={values[field.id]} onChange={(v) => setField(field.id, v)} />
              </div>
            ))}

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={() => window.history.back()} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="submit" disabled={submitting} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50">
                {submitting ? 'Submitting…' : 'Submit Response'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FillSurvey;
