import { useState } from 'react';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, ArrowLeftRight,
  CreditCard, TrendingUp, Clock, CheckCircle, XCircle, Plus
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  sender: string;
  receiver: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

const initialTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 50000,
    sender: 'Bank Account',
    receiver: 'Wallet',
    status: 'completed',
    date: 'Jun 1, 2026',
    description: 'Initial deposit',
  },
  {
    id: '2',
    type: 'transfer',
    amount: 25000,
    sender: 'Sarah Johnson',
    receiver: 'Michael Rodriguez',
    status: 'completed',
    date: 'Jun 3, 2026',
    description: 'Seed funding - TechWave AI',
  },
  {
    id: '3',
    type: 'withdraw',
    amount: 5000,
    sender: 'Wallet',
    receiver: 'Bank Account',
    status: 'completed',
    date: 'Jun 5, 2026',
    description: 'Withdrawal',
  },
  {
    id: '4',
    type: 'transfer',
    amount: 10000,
    sender: 'Jennifer Lee',
    receiver: 'Sarah Johnson',
    status: 'pending',
    date: 'Jun 7, 2026',
    description: 'Series A investment',
  },
  {
    id: '5',
    type: 'deposit',
    amount: 15000,
    sender: 'Bank Account',
    receiver: 'Wallet',
    status: 'failed',
    date: 'Jun 8, 2026',
    description: 'Top up attempt',
  },
];

export default function PaymentPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [activeTab, setActiveTab] = useState<'all' | 'deposit' | 'withdraw' | 'transfer'>('all');
  const [activeModal, setActiveModal] = useState<'deposit' | 'withdraw' | 'transfer' | 'fund' | null>(null);
  const [amount, setAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [description, setDescription] = useState('');
  const [walletBalance, setWalletBalance] = useState(35000);
  const [successMsg, setSuccessMsg] = useState('');

  const filteredTransactions = activeTab === 'all'
    ? transactions
    : transactions.filter((t) => t.type === activeTab);

  const statusColor = (status: Transaction['status']) => {
    if (status === 'completed') return 'bg-green-100 text-green-700';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const statusIcon = (status: Transaction['status']) => {
    if (status === 'completed') return <CheckCircle size={14} />;
    if (status === 'pending') return <Clock size={14} />;
    return <XCircle size={14} />;
  };

  const typeIcon = (type: Transaction['type']) => {
    if (type === 'deposit') return <ArrowDownLeft size={16} className="text-green-600" />;
    if (type === 'withdraw') return <ArrowUpRight size={16} className="text-red-600" />;
    return <ArrowLeftRight size={16} className="text-blue-600" />;
  };

  const typeColor = (type: Transaction['type']) => {
    if (type === 'deposit') return 'bg-green-100';
    if (type === 'withdraw') return 'bg-red-100';
    return 'bg-blue-100';
  };

  const handleAction = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    const num = Number(amount);

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: activeModal as 'deposit' | 'withdraw' | 'transfer',
      amount: num,
      sender: activeModal === 'deposit' ? 'Bank Account' : 'Sarah Johnson',
      receiver: activeModal === 'withdraw' ? 'Bank Account' : receiver || 'Michael Rodriguez',
      status: 'completed',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: description || (activeModal === 'deposit' ? 'Deposit' : activeModal === 'withdraw' ? 'Withdrawal' : 'Transfer'),
    };

    if (activeModal === 'deposit') setWalletBalance((b) => b + num);
    else if (activeModal === 'withdraw') setWalletBalance((b) => b - num);
    else if (activeModal === 'transfer') setWalletBalance((b) => b - num);
    else if (activeModal === 'fund') setWalletBalance((b) => b - num);

    setTransactions([newTx, ...transactions]);
    setSuccessMsg(`${activeModal?.charAt(0).toUpperCase()}${activeModal?.slice(1)} of $${num.toLocaleString()} successful!`);
    setActiveModal(null);
    setAmount('');
    setReceiver('');
    setDescription('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Center</h1>
        <p className="text-gray-500 mt-1">Manage your wallet, transactions and investments</p>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl flex items-center gap-2 text-sm font-medium">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      {/* Wallet + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {/* Wallet Balance */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet size={20} />
              <span className="text-sm font-medium opacity-80">Wallet Balance</span>
            </div>
            <CreditCard size={20} className="opacity-60" />
          </div>
          <p className="text-4xl font-bold mb-1">${walletBalance.toLocaleString()}</p>
          <p className="text-sm opacity-70">Available Balance</p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveModal('deposit')}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs py-2 rounded-lg transition font-medium"
            >
              + Deposit
            </button>
            <button
              onClick={() => setActiveModal('withdraw')}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs py-2 rounded-lg transition font-medium"
            >
              - Withdraw
            </button>
            <button
              onClick={() => setActiveModal('transfer')}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white text-xs py-2 rounded-lg transition font-medium"
            >
              ⇄ Transfer
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-green-50 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <ArrowDownLeft size={18} />
            <span className="text-sm font-medium">Total Received</span>
          </div>
          <p className="text-2xl font-bold text-green-700">
            ${transactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((a, t) => a + t.amount, 0).toLocaleString()}
          </p>
          <p className="text-xs text-green-600 mt-1">From all deposits</p>
        </div>

        <div className="bg-purple-50 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-purple-700 mb-2">
            <TrendingUp size={18} />
            <span className="text-sm font-medium">Total Invested</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            ${transactions.filter(t => t.type === 'transfer' && t.status === 'completed').reduce((a, t) => a + t.amount, 0).toLocaleString()}
          </p>
          <p className="text-xs text-purple-600 mt-1">In funded deals</p>
        </div>
      </div>

      {/* Fund Deal Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-5 mb-6 flex items-center justify-between">
        <div className="text-white">
          <h3 className="font-bold text-lg">Fund a Deal</h3>
          <p className="text-sm opacity-80 mt-0.5">Invest directly in entrepreneurs from your wallet</p>
        </div>
        <button
          onClick={() => setActiveModal('fund')}
          className="bg-white text-blue-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 transition flex items-center gap-2"
        >
          <Plus size={16} />
          Fund Now
        </button>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Transaction History</h2>
          <span className="text-xs text-gray-400">{transactions.length} transactions</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 pt-3 border-b border-gray-100">
          {(['all', 'deposit', 'withdraw', 'transfer'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Description</th>
                <th className="text-left px-4 py-3 font-medium">Sender</th>
                <th className="text-left px-4 py-3 font-medium">Receiver</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className={`w-8 h-8 rounded-lg ${typeColor(tx.type)} flex items-center justify-center`}>
                      {typeIcon(tx.type)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-800 font-medium">{tx.description}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{tx.sender}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{tx.receiver}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${tx.type === 'deposit' ? 'text-green-600' : tx.type === 'withdraw' ? 'text-red-600' : 'text-blue-600'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium w-fit ${statusColor(tx.status)}`}>
                      {statusIcon(tx.status)}
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 capitalize">
              {activeModal === 'fund' ? '💼 Fund a Deal' : activeModal === 'deposit' ? '💰 Deposit Funds' : activeModal === 'withdraw' ? '🏦 Withdraw Funds' : '⇄ Transfer Funds'}
            </h3>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Amount (USD)</label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              {(activeModal === 'transfer' || activeModal === 'fund') && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block font-medium">
                    {activeModal === 'fund' ? 'Entrepreneur Name' : 'Receiver Name'}
                  </label>
                  <input
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={activeModal === 'fund' ? 'e.g. Sarah Johnson' : 'e.g. Michael Rodriguez'}
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-gray-500 mb-1 block font-medium">Description (optional)</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Seed funding round"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 mb-4 text-xs text-blue-700">
              💡 Current balance: <strong>${walletBalance.toLocaleString()}</strong>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setActiveModal(null); setAmount(''); setReceiver(''); setDescription(''); }}
                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={!amount}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50 font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}