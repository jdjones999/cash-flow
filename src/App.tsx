import React, { useState } from 'react';
import { 
  LayoutDashboard, DollarSign, Calendar as CalendarIcon, AlertTriangle, 
  Wallet, Plus, Trash2, Edit3, Check, X, LogIn, LogOut, ChevronLeft, ChevronRight, TrendingUp
} from 'lucide-react';

interface CashFlowItem {
  id: string;
  name: string;
  amount: number;
  category: 'income' | 'subscription' | 'unexpected_expense';
  billingCycle: 'monthly' | 'yearly' | 'one_time';
  tag: string;
  dueDate?: number;
}

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'income' | 'subscriptions' | 'unexpected' | 'calendar'>('dashboard');

  const [items, setItems] = useState<CashFlowItem[]>([
    { id: '1', name: 'Base Salary', amount: 4500.00, category: 'income', billingCycle: 'monthly', tag: 'Primary', dueDate: 1 },
    { id: '2', name: 'Dividend Payout', amount: 123.00, category: 'income', billingCycle: 'monthly', tag: 'Investment', dueDate: 15 },
    { id: '3', name: 'Server Hosting', amount: 28.38, category: 'subscription', billingCycle: 'monthly', tag: 'Infrastructure', dueDate: 5 },
    { id: '4', name: 'Cloud Storage', amount: 9.99, category: 'subscription', billingCycle: 'monthly', tag: 'Software', dueDate: 12 },
    { id: '5', name: 'Emergency Equipment Repair', amount: 350.00, category: 'unexpected_expense', billingCycle: 'one_time', tag: 'Emergency', dueDate: 20 },
  ]);

  // Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [tag, setTag] = useState('');
  const [dueDate, setDueDate] = useState('1');

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editTag, setEditTag] = useState('');

  // Calendar State
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsAuthenticated(true);
      setActiveTab('dashboard');
    }
  };

  const calculateMonthly = (item: CashFlowItem) => {
    if (item.billingCycle === 'yearly') return item.amount / 12;
    return item.amount;
  };

  const totalIncome = items
    .filter(i => i.category === 'income')
    .reduce((acc, i) => acc + calculateMonthly(i), 0);

  const totalSubscriptions = items
    .filter(i => i.category === 'subscription')
    .reduce((acc, i) => acc + calculateMonthly(i), 0);

  const totalUnexpected = items
    .filter(i => i.category === 'unexpected_expense')
    .reduce((acc, i) => acc + i.amount, 0);

  const totalExpenses = totalSubscriptions + totalUnexpected;
  const netCashFlow = totalIncome - totalExpenses;

  // Find most expensive item
  const mostExpensive = items.length > 0 
    ? [...items].sort((a, b) => b.amount - a.amount)[0]
    : null;

  const handleAddItem = (category: CashFlowItem['category'], billingCycle: CashFlowItem['billingCycle']) => {
    if (!name || !amount) return;

    const newItem: CashFlowItem = {
      id: Date.now().toString(),
      name,
      amount: parseFloat(amount),
      category,
      billingCycle,
      tag: tag || 'General',
      dueDate: parseInt(dueDate) || 1,
    };

    setItems([...items, newItem]);
    setName('');
    setAmount('');
    setTag('');
  };

  const startEdit = (item: CashFlowItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditAmount(item.amount.toString());
    setEditTag(item.tag);
  };

  const saveEdit = (id: string) => {
    setItems(items.map(item => item.id === id ? {
      ...item,
      name: editName,
      amount: parseFloat(editAmount) || item.amount,
      tag: editTag
    } : item));
    setEditingId(null);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0f19', justifyContent: 'center', alignItems: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ backgroundColor: '#0f172a', padding: '2.5rem', borderRadius: '16px', border: '1px solid #1e293b', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: '#2563eb', padding: '0.6rem', borderRadius: '10px', display: 'flex' }}>
              <Wallet style={{ color: '#ffffff', width: '24px', height: '24px' }} />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc' }}>Cash Flow</span>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#f8fafc', marginBottom: '0.5rem', textAlign: 'center' }}>Sign in to your account</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem', textAlign: 'center' }}>Enter your email to access your financial dashboard</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Email Address</label>
              <input
                type="email"
                required
                placeholder="user@neoconn.local"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', backgroundColor: '#131b2e', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', color: '#f8fafc', fontSize: '0.875rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', backgroundColor: '#131b2e', border: '1px solid #334155', borderRadius: '8px', padding: '0.75rem', color: '#f8fafc', fontSize: '0.875rem', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.75rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <LogIn style={{ width: '18px', height: '18px' }} /> Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const renderDashboardOverview = () => {
    const budgetUsedPercent = totalIncome > 0 ? Math.min(Math.round((totalExpenses / totalIncome) * 100), 100) : 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Cost History Chart & Budget Overview Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          
          {/* Cost History Visualizer */}
          <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', border: '1px solid #1e293b', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <TrendingUp style={{ color: '#38bdf8', width: '20px', height: '20px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f8fafc', margin: 0 }}>Cost History</h3>
            </div>

            {/* Simulated Chart Container */}
            <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 1rem 1rem 1rem', borderBottom: '1px solid #1e293b', position: 'relative' }}>
              
              {/* Y-Axis Gridlines */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: 0.1, pointerEvents: 'none' }}>
                <div style={{ borderTop: '1px solid #fff' }}></div>
                <div style={{ borderTop: '1px solid #fff' }}></div>
                <div style={{ borderTop: '1px solid #fff' }}></div>
              </div>

              {/* Data Point Marker */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                <div style={{ backgroundColor: '#1e293b', border: '1px solid #3b82f6', color: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', marginBottom: '0.75rem', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}>
                  <div>2026/08</div>
                  <div style={{ color: '#38bdf8', fontWeight: '700' }}>Cost : ${totalExpenses.toFixed(2)}</div>
                </div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2563eb', border: '2px solid #38bdf8' }}></div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>2026/08</span>
              </div>
            </div>
          </div>

          {/* Budget Overview Card */}
          <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', border: '1px solid #1e293b', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f8fafc', marginBottom: '1.5rem' }}>Budget Overview</h3>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Budget used</span>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Monthly Income</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#38bdf8' }}>${totalExpenses.toFixed(2)}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f8fafc' }}>${totalIncome.toFixed(2)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', backgroundColor: '#0b0f19', borderRadius: '999px', height: '8px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                <div style={{ width: `${budgetUsedPercent}%`, backgroundColor: '#2563eb', height: '100%', borderRadius: '999px' }}></div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '1.5rem' }}>
                <span>{budgetUsedPercent}% budget used</span>
                <span>Remaining: ${(totalIncome - totalExpenses).toFixed(2)}</span>
              </div>

              {/* Most Expensive Item Highlight */}
              {mostExpensive && (
                <div style={{ backgroundColor: '#0b0f19', border: '1px solid #1e293b', padding: '0.85rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block' }}>MOST EXPENSIVE</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc' }}>{mostExpensive.name}</span>
                  </div>
                  <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#38bdf8' }}>${mostExpensive.amount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #1e293b', fontSize: '0.85rem', color: '#94a3b8' }}>
              <span>Total Subscriptions</span>
              <span style={{ fontWeight: '700', color: '#f8fafc' }}>{items.filter(i => i.category === 'subscription').length}</span>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderItemTable = (filteredItems: CashFlowItem[], categoryName: string, categoryType: CashFlowItem['category'], defaultCycle: CashFlowItem['billingCycle']) => (
    <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', border: '1px solid #1e293b', padding: '1.5rem', marginTop: '1.5rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f8fafc', marginBottom: '1rem' }}>Manage {categoryName}</h3>
      
      {/* Add Entry Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem', backgroundColor: '#0b0f19', padding: '1rem', borderRadius: '8px', border: '1px solid #1e293b' }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ backgroundColor: '#131b2e', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem 0.8rem', color: '#f8fafc', fontSize: '0.875rem' }}
        />
        <input
          type="number"
          step="0.01"
          placeholder="Amount ($)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ backgroundColor: '#131b2e', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem 0.8rem', color: '#f8fafc', fontSize: '0.875rem' }}
        />
        <input
          type="text"
          placeholder="Tag"
          value={tag}
          onChange={e => setTag(e.target.value)}
          style={{ backgroundColor: '#131b2e', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem 0.8rem', color: '#f8fafc', fontSize: '0.875rem' }}
        />
        <input
          type="number"
          min="1"
          max="31"
          placeholder="Due Day (1-31)"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          style={{ backgroundColor: '#131b2e', border: '1px solid #334155', borderRadius: '6px', padding: '0.5rem 0.8rem', color: '#f8fafc', fontSize: '0.875rem' }}
        />
        <button
          onClick={() => handleAddItem(categoryType, defaultCycle)}
          style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
        >
          <Plus style={{ width: '16px', height: '16px' }} /> Add
        </button>
      </div>

      {/* Item List */}
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #1e293b', color: '#64748b' }}>
            <th style={{ padding: '0.75rem' }}>Name</th>
            <th style={{ padding: '0.75rem' }}>Tag</th>
            <th style={{ padding: '0.75rem' }}>Day of Month</th>
            <th style={{ padding: '0.75rem', textAlign: 'right' }}>Amount ($)</th>
            <th style={{ padding: '0.75rem', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
              {editingId === item.id ? (
                <>
                  <td style={{ padding: '0.75rem' }}>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={{ backgroundColor: '#0b0f19', border: '1px solid #334155', color: '#fff', borderRadius: '4px', padding: '0.3rem 0.5rem', width: '90%' }} />
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <input type="text" value={editTag} onChange={e => setEditTag(e.target.value)} style={{ backgroundColor: '#0b0f19', border: '1px solid #334155', color: '#fff', borderRadius: '4px', padding: '0.3rem 0.5rem', width: '90%' }} />
                  </td>
                  <td style={{ padding: '0.75rem', color: '#94a3b8' }}>{item.dueDate || 1}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <input type="number" step="0.01" value={editAmount} onChange={e => setEditAmount(e.target.value)} style={{ backgroundColor: '#0b0f19', border: '1px solid #334155', color: '#fff', borderRadius: '4px', padding: '0.3rem 0.5rem', width: '90px', textAlign: 'right' }} />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <button onClick={() => saveEdit(item.id)} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.3rem 0.5rem', marginRight: '0.4rem', cursor: 'pointer' }}><Check style={{ width: '14px', height: '14px' }} /></button>
                    <button onClick={() => setEditingId(null)} style={{ backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.3rem 0.5rem', cursor: 'pointer' }}><X style={{ width: '14px', height: '14px' }} /></button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ padding: '0.75rem', fontWeight: '600', color: '#f8fafc' }}>{item.name}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ backgroundColor: '#1e293b', color: '#94a3b8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>{item.tag}</span>
                  </td>
                  <td style={{ padding: '0.75rem', color: '#94a3b8' }}>Day {item.dueDate || 1}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700', color: categoryType === 'income' ? '#4ade80' : '#f87171' }}>
                    ${item.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <button onClick={() => startEdit(item)} style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginRight: '0.5rem' }}><Edit3 style={{ width: '15px', height: '15px' }} /></button>
                    <button onClick={() => removeItem(item.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 style={{ width: '15px', height: '15px' }} /></button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCalendar = () => {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const selectedDayItems = items.filter(i => i.dueDate === selectedDay);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', border: '1px solid #1e293b', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f8fafc', margin: 0 }}>August 2026</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{ backgroundColor: '#0b0f19', border: '1px solid #334155', color: '#fff', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer' }}><ChevronLeft style={{ width: '16px', height: '16px' }} /></button>
              <button style={{ backgroundColor: '#0b0f19', border: '1px solid #334155', color: '#fff', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer' }}><ChevronRight style={{ width: '16px', height: '16px' }} /></button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textTransform: 'uppercase', fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textAlign: 'center', marginBottom: '0.5rem' }}>
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
            {days.map(day => {
              const dayItems = items.filter(i => i.dueDate === day);
              const isSelected = selectedDay === day;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    backgroundColor: isSelected ? '#1e293b' : '#0b0f19',
                    border: isSelected ? '1px solid #2563eb' : '1px solid #1e293b',
                    borderRadius: '8px',
                    minHeight: '75px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isSelected ? '#38bdf8' : '#94a3b8' }}>{day}</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                    {dayItems.map(item => (
                      <div
                        key={item.id}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: item.category === 'income' ? '#4ade80' : item.category === 'subscription' ? '#f87171' : '#fbbf24'
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', border: '1px solid #1e293b', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f8fafc', marginBottom: '1rem' }}>
            Scheduled for Day {selectedDay}
          </h3>

          {selectedDayItems.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No payments or deposits scheduled for this date.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedDayItems.map(item => (
                <div key={item.id} style={{ backgroundColor: '#0b0f19', padding: '0.85rem', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#f8fafc', fontWeight: '600', fontSize: '0.9rem' }}>{item.name}</div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>{item.category.replace('_', ' ')}</span>
                  </div>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: item.category === 'income' ? '#4ade80' : '#f87171' }}>
                    ${item.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0f19', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', marginBottom: '2.5rem' }}>
          <div style={{ backgroundColor: '#2563eb', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
            <Wallet style={{ color: '#ffffff', width: '20px', height: '20px' }} />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc' }}>Cash Flow</span>
        </div>

        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', paddingLeft: '0.5rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          MENU
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.85rem', borderRadius: '8px', border: 'none', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left',
              backgroundColor: activeTab === 'dashboard' ? '#2563eb' : 'transparent',
              color: activeTab === 'dashboard' ? '#ffffff' : '#94a3b8'
            }}
          >
            <LayoutDashboard style={{ width: '18px', height: '18px' }} /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab('income')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.85rem', borderRadius: '8px', border: 'none', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left',
              backgroundColor: activeTab === 'income' ? '#2563eb' : 'transparent',
              color: activeTab === 'income' ? '#ffffff' : '#94a3b8'
            }}
          >
            <DollarSign style={{ width: '18px', height: '18px' }} /> Income / Base Salary
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.85rem', borderRadius: '8px', border: 'none', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left',
              backgroundColor: activeTab === 'subscriptions' ? '#2563eb' : 'transparent',
              color: activeTab === 'subscriptions' ? '#ffffff' : '#94a3b8'
            }}
          >
            <CalendarIcon style={{ width: '18px', height: '18px' }} /> Subscriptions / Recurring
          </button>

          <button
            onClick={() => setActiveTab('unexpected')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.85rem', borderRadius: '8px', border: 'none', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left',
              backgroundColor: activeTab === 'unexpected' ? '#2563eb' : 'transparent',
              color: activeTab === 'unexpected' ? '#ffffff' : '#94a3b8'
            }}
          >
            <AlertTriangle style={{ width: '18px', height: '18px' }} /> One-Time Expenses
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.85rem', borderRadius: '8px', border: 'none', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left',
              backgroundColor: activeTab === 'calendar' ? '#2563eb' : 'transparent',
              color: activeTab === 'calendar' ? '#ffffff' : '#94a3b8'
            }}
          >
            <CalendarIcon style={{ width: '18px', height: '18px' }} /> Calendar
          </button>
        </nav>

        <button
          onClick={() => setIsAuthenticated(false)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#131b2e', border: '1px solid #1e293b', color: '#ef4444', padding: '0.6rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', marginTop: 'auto' }}
        >
          <LogOut style={{ width: '16px', height: '16px' }} /> Sign Out
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#f8fafc', margin: 0, textTransform: 'capitalize' }}>
              {activeTab === 'subscriptions' ? 'Subscriptions / Recurring' : activeTab === 'unexpected' ? 'One-Time Expenses' : activeTab === 'income' ? 'Income & Base Salary' : activeTab}
            </h1>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Logged in as {email || 'user'}</span>
          </div>
        </div>

        {/* Global Overview Cards (Always Visible) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#131b2e', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Income</span>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#4ade80', marginTop: '0.25rem' }}>${totalIncome.toFixed(2)}</div>
          </div>
          <div style={{ backgroundColor: '#131b2e', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Recurring Subscriptions</span>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#f87171', marginTop: '0.25rem' }}>${totalSubscriptions.toFixed(2)}</div>
          </div>
          <div style={{ backgroundColor: '#131b2e', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>One-Time Expenses</span>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fbbf24', marginTop: '0.25rem' }}>${totalUnexpected.toFixed(2)}</div>
          </div>
          <div style={{ backgroundColor: '#131b2e', padding: '1.25rem', borderRadius: '12px', border: netCashFlow >= 0 ? '1px solid #2563eb' : '1px solid #ef4444' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Net Cash Flow</span>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: netCashFlow >= 0 ? '#38bdf8' : '#ef4444', marginTop: '0.25rem' }}>${netCashFlow.toFixed(2)}</div>
          </div>
        </div>

        {/* Tab Specific Content */}
        {activeTab === 'dashboard' && renderDashboardOverview()}
        {activeTab === 'income' && renderItemTable(items.filter(i => i.category === 'income'), 'Income & Base Salary', 'income', 'monthly')}
        {activeTab === 'subscriptions' && renderItemTable(items.filter(i => i.category === 'subscription'), 'Subscriptions / Recurring', 'subscription', 'monthly')}
        {activeTab === 'unexpected' && renderItemTable(items.filter(i => i.category === 'unexpected_expense'), 'One-Time Expenses', 'unexpected_expense', 'one_time')}
        {activeTab === 'calendar' && renderCalendar()}

      </div>
    </div>
  );
}
