import React, { useState } from 'react';
import axios from 'axios';
import { 
  Network, 
  AlertCircle, 
  Copy, 
  BarChart3, 
  ChevronRight, 
  ChevronDown,
  Info,
  CheckCircle2,
  XCircle,
  Hash
} from 'lucide-react';

const API_URL = 'http://localhost:3000/bfhl';

const TreeNode = ({ node, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = Object.keys(children).length > 0;

  return (
    <div className="ml-4 border-l border-slate-200 pl-4 py-1">
      <div 
        className={`flex items-center gap-2 py-1 px-2 rounded-md transition-colors ${hasChildren ? 'cursor-pointer hover:bg-slate-100' : ''}`}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />
        ) : (
          <div className="w-3.5" />
        )}
        <span className={`font-mono font-bold ${hasChildren ? 'text-indigo-600' : 'text-slate-700'}`}>
          {node}
        </span>
      </div>
      {hasChildren && isOpen && (
        <div className="mt-1">
          {Object.entries(children).map(([childNode, grandChildren]) => (
            <TreeNode key={childNode} node={childNode} children={grandChildren} />
          ))}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Split by comma or newline, trim, and filter out empty strings
      const data = input.split(/,|\n/).map(s => s.trim()).filter(s => s !== "");
      
      const res = await axios.post(API_URL, { data });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Network className="text-indigo-600" size={32} />
              Tree Processor
            </h1>
            <p className="text-slate-500 mt-1">Hierarchical Tree & Graph Analysis Tool</p>
          </div>
          
          {response && (
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                <Info size={12} /> User Identity
              </div>
              <div className="grid grid-cols-1 gap-1">
                <p className="text-sm font-semibold text-slate-700">ID: <span className="font-mono text-indigo-600">{response.user_id}</span></p>
                <p className="text-sm text-slate-600 italic">{response.email_id}</p>
                <p className="text-sm text-slate-600 font-mono tracking-tighter">Roll: {response.college_roll_number}</p>
              </div>
            </div>
          )}
        </header>

        {/* Input Area */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4 font-semibold text-slate-700">
            <Copy size={18} className="text-indigo-600" />
            Input Node Relationships
          </div>
          <textarea
            className="w-full h-32 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-sm placeholder:text-slate-400"
            placeholder="Enter edges (e.g., A->B, A->C) separated by commas or newlines..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="mt-4 flex justify-between items-center">
            <p className="text-xs text-slate-400">Example: A-&gt;B, B-&gt;C, hello, 1-&gt;2</p>
            <button
              onClick={handleSubmit}
              disabled={loading || !input.trim()}
              className={`px-6 py-2.5 rounded-lg font-bold text-white transition-all transform active:scale-95 flex items-center gap-2 ${
                loading || !input.trim() 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Network size={18} />
              )}
              {loading ? 'Processing...' : 'Process Graph'}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="shrink-0 mt-0.5" size={16} />
              {error}
            </div>
          )}
        </section>

        {response && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            
            {/* Left Column: Summary & Lists */}
            <div className="space-y-6">
              {/* Summary Statistics */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden relative">
                <div className="flex items-center gap-2 mb-6 font-semibold text-slate-700">
                  <BarChart3 size={18} className="text-indigo-600" />
                  Execution Summary
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                    <div className="text-xs text-emerald-600 font-bold uppercase">Total Trees</div>
                    <div className="text-3xl font-black text-emerald-700">{response.summary.total_trees}</div>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <div className="text-xs text-amber-600 font-bold uppercase">Total Cycles</div>
                    <div className="text-3xl font-black text-amber-700">{response.summary.total_cycles}</div>
                  </div>
                </div>
                <div className="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <div className="text-xs text-indigo-600 font-bold uppercase">Largest Tree Root</div>
                  <div className="text-xl font-black text-indigo-700">{response.summary.largest_tree_root || "N/A"}</div>
                </div>
              </div>

              {/* Invalid Entries */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4 font-semibold text-slate-700">
                  <XCircle size={18} className="text-rose-500" />
                  Invalid Entries
                  <span className="ml-auto bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded-full">
                    {response.invalid_entries.length}
                  </span>
                </div>
                {response.invalid_entries.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {response.invalid_entries.map((entry, i) => (
                      <span key={i} className="px-2 py-1 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded font-mono">
                        {entry || '""'}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No invalid entries detected.</p>
                )}
              </div>

              {/* Duplicate Edges */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4 font-semibold text-slate-700">
                  <Hash size={18} className="text-indigo-400" />
                  Duplicate Edges
                  <span className="ml-auto bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">
                    {response.duplicate_edges.length}
                  </span>
                </div>
                {response.duplicate_edges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {response.duplicate_edges.map((edge, i) => (
                      <span key={i} className="px-2 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs rounded font-mono">
                        {edge}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No duplicates found.</p>
                )}
              </div>
            </div>

            {/* Right Column: Hierarchies */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Network size={20} className="text-indigo-600" />
                  Hierarchies & Trees
                </h2>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                  {response.hierarchies.length} Components
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {response.hierarchies.length > 0 ? (
                  response.hierarchies.map((h, idx) => (
                    <div key={idx} className={`bg-white rounded-xl shadow-sm border-l-4 p-6 transition-all hover:shadow-md ${h.has_cycle ? 'border-amber-400 border-y border-r border-y-slate-200 border-r-slate-200' : 'border-indigo-500 border-y border-r border-y-slate-200 border-r-slate-200'}`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl ${h.has_cycle ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                            {h.root}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">Root Node: {h.root}</h3>
                            <div className="flex gap-3 mt-1">
                              {h.has_cycle ? (
                                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 uppercase tracking-tighter">
                                  <AlertCircle size={12} /> Cyclic Graph
                                </span>
                              ) : (
                                <>
                                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 uppercase tracking-tighter">
                                    <CheckCircle2 size={12} /> Valid Tree
                                  </span>
                                  <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                    Depth: {h.depth}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {h.has_cycle ? (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-amber-800 text-sm italic">
                          This component contains one or more cycles. Pure tree visualization is disabled for cyclic graphs.
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 overflow-x-auto">
                          {Object.entries(h.tree).map(([rootNode, children]) => (
                            <TreeNode key={rootNode} node={rootNode} children={children} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
                    <p className="text-slate-400">No valid hierarchies to display. Check your input format.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-slate-400 text-xs py-8">
          &copy; {new Date().getFullYear()} Tree Processor Pro • Built for Advanced Analytics
        </footer>
      </div>
    </div>
  );
};

export default App;
