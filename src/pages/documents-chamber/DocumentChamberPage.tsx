import { useState } from 'react';
import {
  FileText, Upload, Eye, PenTool, CheckCircle,
  Clock, Edit3, Trash2, Download, Shield
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'draft' | 'in-review' | 'signed';
  uploadedAt: string;
  signedBy?: string;
}

const initialDocuments: Document[] = [
  {
    id: '1',
    name: 'Investment Agreement v2.pdf',
    type: 'PDF',
    size: '2.4 MB',
    status: 'signed',
    uploadedAt: 'Jun 1, 2026',
    signedBy: 'Michael Rodriguez',
  },
  {
    id: '2',
    name: 'Term Sheet - TechWave AI.pdf',
    type: 'PDF',
    size: '1.1 MB',
    status: 'in-review',
    uploadedAt: 'Jun 5, 2026',
  },
  {
    id: '3',
    name: 'NDA Agreement Draft.docx',
    type: 'DOCX',
    size: '0.8 MB',
    status: 'draft',
    uploadedAt: 'Jun 7, 2026',
  },
];

export default function DocumentChamberPage() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'in-review' | 'signed'>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signature, setSignature] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const filteredDocs = activeTab === 'all'
    ? documents
    : documents.filter((d) => d.status === activeTab);

  const statusColor = (status: Document['status']) => {
    if (status === 'signed') return 'bg-green-100 text-green-700';
    if (status === 'in-review') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-600';
  };

  const statusIcon = (status: Document['status']) => {
    if (status === 'signed') return <CheckCircle size={14} />;
    if (status === 'in-review') return <Clock size={14} />;
    return <Edit3 size={14} />;
  };

  const handleStatusChange = (id: string, status: Document['status']) => {
    setDocuments(documents.map((d) => d.id === id ? { ...d, status } : d));
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  const handleSign = () => {
    if (!signature.trim() || !selectedDoc) return;
    setDocuments(documents.map((d) =>
      d.id === selectedDoc.id
        ? { ...d, status: 'signed', signedBy: signature }
        : d
    ));
    setSelectedDoc({ ...selectedDoc, status: 'signed', signedBy: signature });
    setShowSignModal(false);
    setSignature('');
  };

  const handleUpload = () => {
    if (!newDocName.trim()) return;
    const newDoc: Document = {
      id: Date.now().toString(),
      name: newDocName.endsWith('.pdf') ? newDocName : newDocName + '.pdf',
      type: 'PDF',
      size: '1.0 MB',
      status: 'draft',
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setDocuments([...documents, newDoc]);
    setNewDocName('');
    setShowUploadModal(false);
  };

  const counts = {
    all: documents.length,
    draft: documents.filter((d) => d.status === 'draft').length,
    'in-review': documents.filter((d) => d.status === 'in-review').length,
    signed: documents.filter((d) => d.status === 'signed').length,
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-500 mt-1">Manage deals, contracts and agreements</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <Upload size={16} />
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', count: counts.all, color: 'bg-blue-50 text-blue-700' },
          { label: 'Draft', count: counts.draft, color: 'bg-gray-50 text-gray-700' },
          { label: 'In Review', count: counts['in-review'], color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Signed', count: counts.signed, color: 'bg-green-50 text-green-700' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{stat.count}</p>
            <p className="text-sm font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 border-b border-gray-200">
            {(['all', 'draft', 'in-review', 'signed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'in-review' ? 'In Review' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          {/* Upload Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center mb-4 transition-colors ${
              dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              setShowUploadModal(true);
            }}
          >
            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Drag & drop files here or</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              browse to upload
            </button>
            <p className="text-xs text-gray-400 mt-1">Supports PDF, DOCX, DOC</p>
          </div>

          {/* Documents */}
          <div className="space-y-3">
            {filteredDocs.length === 0 && (
              <p className="text-center text-gray-400 py-8 text-sm">No documents found</p>
            )}
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedDoc?.id === doc.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{doc.type} · {doc.size} · {doc.uploadedAt}</p>
                      {doc.signedBy && (
                        <p className="text-xs text-green-600 mt-0.5">✓ Signed by {doc.signedBy}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(doc.status)}`}>
                      {statusIcon(doc.status)}
                      {doc.status === 'in-review' ? 'In Review' : doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}
                      className="text-gray-300 hover:text-red-500 transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Document Preview */}
        <div>
          {selectedDoc ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              {/* Preview */}
              <div className="bg-gray-50 rounded-t-xl p-6 flex flex-col items-center justify-center min-h-48 border-b border-gray-100">
                <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mb-3">
                  <FileText size={32} className="text-red-600" />
                </div>
                <p className="text-sm font-medium text-gray-800 text-center">{selectedDoc.name}</p>
                <p className="text-xs text-gray-400 mt-1">{selectedDoc.type} · {selectedDoc.size}</p>
              </div>

              {/* Actions */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(selectedDoc.status)}`}>
                    {statusIcon(selectedDoc.status)}
                    {selectedDoc.status === 'in-review' ? 'In Review' : selectedDoc.status.charAt(0).toUpperCase() + selectedDoc.status.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Uploaded</span>
                  <span className="text-gray-700">{selectedDoc.uploadedAt}</span>
                </div>

                {selectedDoc.signedBy && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Signed by</span>
                    <span className="text-green-600 font-medium">{selectedDoc.signedBy}</span>
                  </div>
                )}

                {/* Status Change */}
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Change Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {(['draft', 'in-review', 'signed'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedDoc.id, s)}
                        disabled={selectedDoc.status === s}
                        className={`text-xs px-2 py-1 rounded-lg transition ${
                          selectedDoc.status === s
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {s === 'in-review' ? 'In Review' : s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 space-y-2">
                  <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-200 transition">
                    <Eye size={15} />
                    Preview Document
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-200 transition">
                    <Download size={15} />
                    Download
                  </button>
                  {selectedDoc.status !== 'signed' && (
                    <button
                      onClick={() => setShowSignModal(true)}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                      <PenTool size={15} />
                      E-Sign Document
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
              <Shield size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">Select a document to preview and manage</p>
            </div>
          )}
        </div>
      </div>

      {/* E-Sign Modal */}
      {showSignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-1">E-Sign Document</h3>
            <p className="text-sm text-gray-500 mb-4">"{selectedDoc?.name}"</p>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 mb-4 bg-gray-50">
              <p className="text-xs text-gray-400 mb-3 text-center">Type your full name as signature</p>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-medium"
                placeholder="Your full name"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
              />
              {signature && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-100 text-center">
                  <p className="text-2xl font-bold text-blue-700" style={{ fontFamily: 'cursive' }}>
                    {signature}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Digital Signature Preview</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-start gap-2">
              <Shield size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                By signing, you agree this is a legally binding electronic signature.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowSignModal(false); setSignature(''); }}
                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSign}
                disabled={!signature.trim()}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
              >
                Sign Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Upload Document</h3>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-4 bg-gray-50">
              <Upload size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Enter document name</p>
            </div>

            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Document name (e.g. Investment Agreement.pdf)"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setShowUploadModal(false); setNewDocName(''); }}
                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!newDocName.trim()}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}