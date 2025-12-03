import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useCustomTranslation } from '../../hooks/useCustomTranslation';

export default function ResetPassword() {
  const { t } = useCustomTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setAlert({ show: true, message: 'Missing or invalid token', type: 'error' });
    }
  }, [token]);

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 2500);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (password.length < 6) return showAlert('Password must be at least 6 characters', 'error');
    if (password !== confirm) return showAlert('Passwords do not match', 'error');
    setLoading(true);
    try {
      const resp = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        showAlert(data.message || 'Failed to reset password', 'error');
      } else {
        showAlert('Password reset successful. Redirecting to login...', 'success');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (e2) {
      showAlert('Network error. Try again.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2">{t('auth.reset_password')}</h1>
        <p className="text-gray-600 mb-6">{t('auth.confirm_password')}</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">{t('account.new_password')}</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">{t('auth.confirm_password')}</label>
            <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <button type="submit" disabled={loading || !token} className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-60">
            {loading ? t('common.processing') : t('auth.reset_password')}
          </button>
          <div className="text-center text-sm mt-2">
            <Link to="/login" className="text-green-600">{t('auth.back_to_login')}</Link>
          </div>
        </form>
        {alert.show && (
          <div className={`mt-4 p-3 rounded ${alert.type==='success'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>
            {alert.message}
          </div>
        )}
      </div>
    </div>
  );
}
