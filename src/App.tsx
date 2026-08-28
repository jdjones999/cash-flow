import React, { useState } from 'react';

interface Entry {
  id: string;
  name: string;
  amount: number;
  type: 'base_income' | 'income_stream' | 'subscription';
}

export function App() {
  const [entries, setEntries] = useState<Entry[]>([
    { id: '1', name: 'Base Salary', amount: 4000, type: 'base_income' },
    { id: '2', name: 'Quarterly Dividend', amount: 123, type: 'income_stream' },
    { id: '3', name: 'Server Hosting', amount: 28.38, type: 'subscription' },
  ]);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<Entry['type']>('subscription');

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;
    setEntries([...entries, { id: Date.now().toString(), name, amount: parseFloat(amount), type }]);
    setName('');
    setAmount('');
  };

  const totalBase = entries.filter(e => e.type === 'base_income').reduce((acc, e) => acc + e.amount, 0);
  const totalStreams = entries.filter(e => e.type === 'income_stream').reduce((acc, e) => acc + e.amount, 0);
  const totalExpenses = entries.filter(e => e.type === 'subscription').reduce((acc, e) => acc + e.amount, 0);
  const netCashFlow = (totalBase + totalStreams) - totalExpenses;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#38bdf8' }}>Cash Flow</h1>
      
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Base Income</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>${totalBase.toFixed(2)}</div>
        </div>
        <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Income Streams</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' }}>${totalStreams.toFixed(2)}</div>
        </div>
        <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Subscriptions</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f87171' }}>${totalExpenses.toFixed(2)}</div>
        </div>
        <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '12px', border: '1px solid #38bdf8' }}>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Net Monthly Cash Flow</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: netCashFlow >= 0 ? '#4ade80' : '#f87171' }}>
            ${netCashFlow.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Entry Form */}
      <form onSubmit={addEntry} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input 
          placeholder="Name" 
          value={name} 
          onChange={e => setName(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff', flex: '1' }}
        />
        <input 
          type="number" 
          placeholder="Amount" 
          value={amount} 
          onChange={e => setAmount(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff', width: '120px' }}
        />
        <select 
          value={type} 
          onChange={e => setType(e.target.value as Entry['type'])}
          style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
        >
          <option value="subscription">Subscription (Expense)</option>
          <option value="income_stream">Income Stream (Credit)</option>
          <option value="base_income">Base Income</option>
        </select>
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          Add
        </button>
      </form>

      {/* Item List */}
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1rem' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Entries</h3>
        {entries.map(item => (
          <div key={item.id} style={{ display: 'flex', justify: 'space-between', borderBottom: '1px solid #334155', padding: '0.75rem 0' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{item.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.type.replace('_', ' ').toUpperCase()}</div>
            </div>
            <div style={{ fontWeight: 'bold', color: item.type === 'subscription' ? '#f87171' : '#4ade80' }}>
              {item.type === 'subscription' ? '-' : '+'}${item.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
