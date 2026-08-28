import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus, Trash2, AlertTriangle } from 'lucide-react';

interface CashFlowItem {
  id: string;
  name: string;
  amount: number;
  category: 'base_income' | 'income_stream' | 'subscription' | 'unexpected_expense';
  billingCycle: 'monthly' | 'yearly' | 'one_time';
  tag: string;
}

export function App() {
  const [items, setItems] = useState<CashFlowItem[]>([
    { id: '1', name: 'Base Salary', amount: 4500.00, category: 'base_income', billingCycle: 'monthly', tag: 'Primary' },
    { id: '2', name: 'Quarterly Dividend', amount: 150.00, category: 'income_stream', billingCycle: 'monthly', tag: 'Investment' },
    { id: '3', name: 'Hosting Server', amount: 28.38, category: 'subscription', billingCycle: 'monthly', tag: 'Infrastructure' },
    { id: '4', name: 'Emergency Equipment Repair', amount: 350.00, category: 'unexpected_expense', billingCycle: 'one_time', tag: 'Emergency' },
  ]);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<CashFlowItem['category']>('subscription');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly' | 'one_time'>('monthly');
  const [tag, setTag] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    const newItem: CashFlowItem = {
      id: Date.now().toString(),
      name,
      amount: parseFloat(amount),
      category,
      billingCycle,
      tag: tag || 'General',
    };

    setItems([...items, newItem]);
    setName('');
    setAmount('');
    setTag('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateMonthly = (item: CashFlowItem) => {
    if (item.billingCycle === 'yearly') return item.amount / 12;
    return item.amount;
  };

  const totalBase = items
    .filter(i => i.category === 'base_income')
    .reduce((acc, i) => acc + calculateMonthly(i), 0);

  const totalStreams = items
    .filter(i => i.category === 'income_stream')
    .reduce((acc, i) => acc + calculateMonthly(i), 0);

  const totalExpenses = items
    .filter(i => i.category === 'subscription')
    .reduce((acc, i) => acc + calculateMonthly(i), 0);

  const totalUnexpected = items
    .filter(i => i.category === 'unexpected_expense')
    .reduce((acc, i) => acc + i.amount, 0);

  const netCashFlow = (totalBase + totalStreams) - (totalExpenses + totalUnexpected);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b0f19', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid #1e293b', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#0284c7', padding: '0.6rem', borderRadius: '10px', display: 'flex' }}>
              <Wallet style={{ color: '#ffffff', width: '24px', height: '24px' }} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: '700', margin: 0, color: '#f8fafc', letterSpacing: '-0.025em' }}>Cash Flow</h1>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Financial Ledger & Analysis</span>
            </div>
          </div>
          <div style={{ backgroundColor: '#1e293b', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #334155', fontSize: '0.875rem', color: '#94a3b8' }}>
            Port 9600 • Live
          </div>
        </div>

        {/* Financial Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          
          <div style={{ backgroundColor: '#131b2e', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>Base Salary</span>
              <DollarSign style={{ color: '#4ade80', width: '18px', height: '18px' }} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#4ade80' }}>${totalBase.toFixed(2)}</div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Monthly baseline</span>
          </div>

          <div style={{ backgroundColor: '#131b2e', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>Income Streams</span>
              <TrendingUp style={{ color: '#38bdf8', width: '18px', height: '18px' }} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#38bdf8' }}>${totalStreams.toFixed(2)}</div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Dividends, bonuses & credits</span>
          </div>

          <div style={{ backgroundColor: '#131b2e', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>Subscriptions</span>
              <TrendingDown style={{ color: '#f87171', width: '18px', height: '18px' }} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#f87171' }}>${totalExpenses.toFixed(2)}</div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Recurring costs</span>
          </div>

          <div style={{ backgroundColor: '#131b2e', padding: '1.25rem', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>One-Time / Unexpected</span>
              <AlertTriangle style={{ color: '#fbbf24', width: '18px', height: '18px' }} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fbbf24' }}>${totalUnexpected.toFixed(2)}</div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Emergency outlays</span>
          </div>

          <div style={{ backgroundColor: '#131b2e', padding: '1.25rem', borderRadius: '12px', border: netCashFlow >= 0 ? '1px solid #0284c7' : '1px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500' }}>Net Cash Flow</span>
              <Wallet style={{ color: netCashFlow >= 0 ? '#38bdf8' : '#ef4444', width: '18px', height: '18px' }} />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: netCashFlow >= 0 ? '#f8fafc' : '#ef4444' }}>
              ${netCashFlow.toFixed(2)}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Remaining net balance</span>
          </div>

        </div>

        {/* Entry Management Form */}
        <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1e293b', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginTop: 0, marginBottom: '1rem', color: '#f1f5f9' }}>Add Financial Entry</h3>
          <form onSubmit={handleAddItem} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', alignItems: 'center' }}>
            
            <input
              type="text"
              placeholder="Name (e.g. Tire Replacement)"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ backgroundColor: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.8rem', color: '#f8fafc', fontSize: '0.875rem' }}
            />

            <input
              type="number"
              step="0.01"
              placeholder="Amount ($)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{ backgroundColor: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.8rem', color: '#f8fafc', fontSize: '0.875rem' }}
            />

            <select
              value={category}
              onChange={e => {
                const cat = e.target.value as CashFlowItem['category'];
                setCategory(cat);
                if (cat === 'unexpected_expense') setBillingCycle('one_time');
              }}
              style={{ backgroundColor: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.8rem', color: '#f8fafc', fontSize: '0.875rem' }}
            >
              <option value="subscription">Subscription (Expense)</option>
              <option value="unexpected_expense">Unexpected / One-Time</option>
              <option value="income_stream">Income Stream (Credit)</option>
              <option value="base_income">Base Salary</option>
            </select>

            <select
              value={billingCycle}
              onChange={e => setBillingCycle(e.target.value as 'monthly' | 'yearly' | 'one_time')}
              style={{ backgroundColor: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.8rem', color: '#f8fafc', fontSize: '0.875rem' }}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="one_time">One-Time</option>
            </select>

            <input
              type="text"
              placeholder="Tag (e.g. Emergency)"
              value={tag}
              onChange={e => setTag(e.target.value)}
              style={{ backgroundColor: '#0b0f19', border: '1px solid #334155', borderRadius: '8px', padding: '0.6rem 0.8rem', color: '#f8fafc', fontSize: '0.875rem' }}
            />

            <button
              type="submit"
              style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.6rem 1rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <Plus style={{ width: '16px', height: '16px' }} /> Add Entry
            </button>
          </form>
        </div>

        {/* Ledger Table */}
        <div style={{ backgroundColor: '#131b2e', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0, color: '#f1f5f9' }}>Financial Ledger</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{items.length} Total Entries</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b', color: '#64748b', backgroundColor: '#0f172a' }}>
                <th style={{ padding: '0.75rem 1.5rem' }}>Name</th>
                <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                <th style={{ padding: '0.75rem 1rem' }}>Cycle</th>
                <th style={{ padding: '0.75rem 1rem' }}>Tag</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '0.75rem 1.5rem', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#f8fafc' }}>{item.name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: item.category === 'subscription' ? '#3f1a1c' : item.category === 'unexpected_expense' ? '#3e2b0e' : item.category === 'income_stream' ? '#0c2a4a' : '#0e382b',
                      color: item.category === 'subscription' ? '#f87171' : item.category === 'unexpected_expense' ? '#fbbf24' : item.category === 'income_stream' ? '#38bdf8' : '#4ade80',
                      border: item.category === 'subscription' ? '1px solid #7f1d1d' : item.category === 'unexpected_expense' ? '1px solid #78350f' : item.category === 'income_stream' ? '1px solid #0369a1' : '1px solid #15803d'
                    }}>
                      {item.category === 'subscription' ? 'Subscription' : item.category === 'unexpected_expense' ? 'One-Time' : item.category === 'income_stream' ? 'Income Stream' : 'Base Salary'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#94a3b8', textTransform: 'capitalize' }}>{item.billingCycle.replace('_', ' ')}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ backgroundColor: '#1e293b', color: '#94a3b8', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                      {item.tag}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '700', color: (item.category === 'subscription' || item.category === 'unexpected_expense') ? '#f87171' : '#4ade80' }}>
                    {(item.category === 'subscription' || item.category === 'unexpected_expense') ? '-' : '+'}${item.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.3rem', borderRadius: '4px' }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
