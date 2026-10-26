import React, { useState } from 'react';
import { FORMULA_VAULT } from '../../data/formulasData';
import { FormulaItem } from '../../types/physics';
import { Search, Bookmark, BookmarkCheck, FileText, Sparkles, Filter, ChevronDown } from 'lucide-react';

interface FormulasViewProps {
  bookmarkedIds: string[];
  onToggleBookmark: (formulaId: string) => void;
}

export const FormulasView: React.FC<FormulasViewProps> = ({
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Kinematics', 'Optics', 'Oscillations', 'Energy', 'Electromagnetism'];

  const filteredFormulas = FORMULA_VAULT.filter((f) => {
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory;
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.latex.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 p-4 md:p-8 text-slate-100">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>High School Physics Equation Vault</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            Formulas, Units & Derivations
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Complete quick reference sheet with SI units, parameter definitions, and bookmarks.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          {/* Search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search equations or variables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-sky-500 text-slate-950'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFormulas.map((f) => {
            const isBookmarked = bookmarkedIds.includes(f.id);

            return (
              <div
                key={f.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-3 flex flex-col justify-between transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      {f.category}
                    </span>

                    <button
                      onClick={() => onToggleBookmark(f.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark formula'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-3.5 h-3.5" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-bold text-white text-base">{f.name}</h3>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center font-mono text-base md:text-lg text-amber-300 shadow-inner">
                    {f.latex}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{f.description}</p>
                </div>

                {/* Variable Breakdown */}
                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Variables & Units
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    {f.variables.map((v, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                        <span className="font-mono text-sky-400 font-bold">{v.symbol}:</span>
                        <span className="truncate">{v.meaning}</span>
                        <span className="text-slate-400 font-mono">[{v.unit}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
