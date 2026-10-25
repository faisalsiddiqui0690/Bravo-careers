import { useState, useEffect } from 'react';
import api from '../services/api';
import AdminToast from '../components/AdminToast';

const inputCls = 'w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors';

const Label = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
    {children}
  </label>
);

const Section = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    {children}
  </div>
);

export default function AdminAnalytics() {
  const [form, setForm] = useState({
    projectsCount: '150+', clientsCount: '50+', statesCount: '15+', clientRate: '98%',
    webPct: 72, appPct: 55, crmPct: 38,
    monthlyData: '30,50,38,70,55,85,62,90,72,95,80,100',
    activityTitle: 'E-Commerce Platform launched',
    activitySub: 'Fashion Retail Co. · just now',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    api.getAnalytics().then(data => {
      if (data) setForm({
        projectsCount: data.projectsCount,
        clientsCount:  data.clientsCount,
        statesCount:   data.statesCount,
        clientRate:    data.clientRate,
        webPct: data.webPct,
        appPct: data.appPct,
        crmPct: data.crmPct,
        monthlyData:   data.monthlyData,
        activityTitle: data.activityTitle,
        activitySub:   data.activitySub,
      });
      setLoading(false);
    });
  }, []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    const res = await api.updateAnalytics(form);
    setSaving(false);
    if (res.success) {
      setToast({ message: 'Analytics updated successfully', type: 'success' });
    } else {
      setToast({ message: res.error || 'Failed to update analytics', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hero Analytics</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Update the stats shown in the homepage hero dashboard
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-all disabled:opacity-50"
        >
          {saving ? (
            <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* KPI Cards */}
      <Section title="KPI Cards" icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      }>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Projects Count', key: 'projectsCount' },
            { label: 'Clients Count',  key: 'clientsCount'  },
            { label: 'States Count',   key: 'statesCount'   },
            { label: 'Client Rate',    key: 'clientRate'    },
          ].map(({ label, key }) => (
            <div key={key}>
              <Label>{label}</Label>
              <input className={inputCls} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={label} />
            </div>
          ))}
        </div>
      </Section>

      {/* Progress Bars */}
      <Section title="Service Progress Bars" icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      }>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Web %', key: 'webPct' },
            { label: 'App %', key: 'appPct' },
            { label: 'CRM %', key: 'crmPct' },
          ].map(({ label, key }) => (
            <div key={key}>
              <Label>{label} <span className="normal-case text-gray-400">(0–100)</span></Label>
              <input
                type="number" min="0" max="100"
                className={inputCls}
                value={form[key]}
                onChange={e => set(key, Number(e.target.value))}
              />
              <div className="mt-2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-600">
                <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${form[key]}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Monthly Chart */}
      <Section title="Monthly Bar Chart Data" icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      }>
        <div>
          <Label>12 monthly values, comma-separated (Jan–Dec)</Label>
          <input
            className={inputCls}
            value={form.monthlyData}
            onChange={e => set('monthlyData', e.target.value)}
            placeholder="30,50,38,70,55,85,62,90,72,95,80,100"
          />
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
            Each value is a percentage height (0–100). Exactly 12 values required.
          </p>
          {/* Preview */}
          <div className="mt-3 flex items-end gap-1 h-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
            {form.monthlyData.split(',').slice(0, 12).map((v, i) => (
              <div key={i} className="flex-1 rounded-t-sm bg-blue-500/60" style={{ height: `${Math.min(100, Math.max(0, Number(v.trim()) || 0))}%` }} />
            ))}
          </div>
        </div>
      </Section>

      {/* Activity Feed */}
      <Section title="Activity Feed" icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      }>
        <div className="space-y-4">
          <div>
            <Label>Activity Title</Label>
            <input className={inputCls} value={form.activityTitle} onChange={e => set('activityTitle', e.target.value)} placeholder="E-Commerce Platform launched" />
          </div>
          <div>
            <Label>Activity Subtitle</Label>
            <input className={inputCls} value={form.activitySub} onChange={e => set('activitySub', e.target.value)} placeholder="Fashion Retail Co. · just now" />
          </div>
        </div>
      </Section>

      <AdminToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
