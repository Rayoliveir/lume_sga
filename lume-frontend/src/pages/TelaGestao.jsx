import React from 'react';
import {
    LayoutDashboard,
    Clock,
    AlertTriangle,
    Search,
    Plus,
    Edit
} from 'lucide-react';

export default function TelaGestao({
    chamados,
    filtroStatus,
    setFiltroStatus,
    busca,
    setBusca,
    setIsModalOpen,
    chamadosFiltrados,
    formatarTempo,
    abrirEdicao,
    realizarCheckIn,
    iniciarFinalizacao
}) {
    return (
        <div className="animate-in fade-in duration-500">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-navy-dark italic">
                    LUME <span className="text-navy-light font-light">SGA</span>
                </h1>
                <p className="text-gray-500">Gestão de Atendimentos</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-lemon">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</p>
                            <p className="text-3xl font-black text-navy-dark">{chamados.length}</p>
                        </div>
                        <div className="text-navy-light"><LayoutDashboard /></div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-lemon">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Em Aberto</p>
                            <p className="text-3xl font-black text-navy-dark">
                                {chamados.filter(c => c.status === 0).length}
                            </p>
                        </div>
                        <div className="text-navy-light"><Clock className="text-blue-500" /></div>
                    </div>
                </div>

                <div className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 transition-all ${chamados.filter(c => c.estaAtrasado).length > 0 ? 'border-red-500 animate-pulse' : 'border-lemon'}`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Atrasados</p>
                            <p className="text-3xl font-black text-navy-dark">
                                {chamados.filter(c => c.estaAtrasado).length}
                            </p>
                        </div>
                        <div className="text-navy-light"><AlertTriangle className="text-red-500" /></div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div className="flex gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                    {['TODOS', 'ABERTO', 'INICIADO', 'FINALIZADO', 'DELETADO'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFiltroStatus(s)}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition ${filtroStatus === s ? 'bg-navy-dark text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                        >
                            {s === 'INICIADO' ? 'EM PROGRESSO' : s}
                        </button>
                    ))}
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-lg bg-white shadow-sm outline-none w-64 border-none"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-lemon text-navy-dark px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-md"
                    >
                        <Plus size={20} /> NOVO CHAMADO
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-navy-light text-white font-semibold">
                        <tr>
                            <th className="p-5">CÓD</th>
                            <th className="p-5">TÍTULO</th>
                            <th className="p-5">SETOR</th>
                            <th className="p-5">HORAS</th>
                            <th className="p-5">STATUS</th>
                            <th className="p-5">SLA</th>
                            <th className="p-5 text-center">AÇÕES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chamadosFiltrados.map(c => (
                            <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${c.estaAtrasado ? 'bg-red-50/30' : ''}`}>
                                <td className="p-5 font-mono text-sm text-gray-400">#{c.id}</td>
                                <td className="p-5">
                                    <p className="font-bold text-navy-dark">{c.titulo}</p>
                                    <p className="text-xs text-gray-400">{new Date(c.dataAbertura).toLocaleString()}</p>
                                </td>
                                <td className="p-5 text-gray-600">{c.setorNome}</td>
                                <td className="p-5 text-sm">{formatarTempo(c.horasDecorridas)}</td>
                                <td className="p-5">
                                    <StatusBadge status={c.status} />
                                </td>

                                {/* COLUNA SLA RESTAURADA AQUI */}
                                {/* COLUNA SLA COM MEMÓRIA DE ATRASO */}
                                <td className="p-5">
                                    {c.status >= 2 ? (
                                        // Se o chamado está FINALIZADO ou DELETADO
                                        c.estaAtrasado ? (
                                            <span className="flex items-center gap-1 text-red-700 font-bold text-[10px] bg-red-200 px-2 py-1 rounded-full w-fit border border-red-300">
                                                <AlertTriangle size={12} /> ATENDIDO FORA DO PRAZO
                                            </span>
                                        ) : (
                                            <span className="text-emerald-700 font-bold text-[10px] bg-emerald-200 px-2 py-1 rounded-full w-fit flex items-center gap-1 border border-emerald-300">
                                                ATENDIDO NO PRAZO
                                            </span>
                                        )
                                    ) : (
                                        // Se o chamado ainda está ABERTO ou EM PROGRESSO
                                        c.estaAtrasado ? (
                                            <span className="flex items-center gap-1 text-red-600 font-bold text-[10px] bg-red-100 px-2 py-1 rounded-full w-fit animate-pulse">
                                                <AlertTriangle size={12} /> FORA DO PRAZO
                                            </span>
                                        ) : (
                                            <span className="text-emerald-600 font-bold text-[10px] bg-emerald-100 px-2 py-1 rounded-full w-fit flex items-center gap-1">
                                                NO PRAZO
                                            </span>
                                        )
                                    )}
                                </td>

                                <td className="p-5">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => abrirEdicao(c)}
                                            disabled={c.status >= 2}
                                            className={`p-2 rounded-lg transition ${c.status >= 2 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'}`}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        {c.status === 0 && <button onClick={() => realizarCheckIn(c.id)} className="text-xs font-bold text-blue-600 hover:underline">CHECK-IN</button>}
                                        {c.status === 1 && (
                                            <button onClick={() => iniciarFinalizacao(c.id)} className="ml-2 text-xs font-black text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded">
                                                FINALIZAR
                                            </button>
                                        )}
                                        {c.status >= 2 && <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest self-center">Arquivado</span>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const configs = {
        0: { label: 'ABERTO', bg: 'bg-blue-100', text: 'text-blue-600' },
        1: { label: 'PROGRESSO', bg: 'bg-amber-100', text: 'text-amber-600' },
        2: { label: 'FINALIZADO', bg: 'bg-emerald-100', text: 'text-emerald-600' },
        3: { label: 'DELETADO', bg: 'bg-red-100', text: 'text-red-600' }
    };
    const c = configs[status] || configs[0];
    return <span className={`px-3 py-1 rounded-full text-[10px] font-black ${c.bg} ${c.text}`}>{c.label}</span>;
}