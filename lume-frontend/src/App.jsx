/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LayoutDashboard,
    Clock,
    AlertTriangle,
    CheckCircle,
    Plus,
    Search,
    User,
    LogOut,
    Settings,
    Building2,
    ShieldAlert
} from 'lucide-react';

const API_URL = "http://localhost:5251/api";

function App() {
    // ESTADOS GERAIS
    const [chamados, setChamados] = useState([]);
    const [setores, setSetores] = useState([]);
    const [prioridades, setPrioridades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState('TODOS');
    const [busca, setBusca] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('DASHBOARD'); // 'DASHBOARD' ou 'CADASTROS'

    // ESTADO PARA NOVO CHAMADO
    const [novoChamado, setNovoChamado] = useState({
        titulo: '',
        descricao: 'Atendimento solicitado via painel',
        setorId: '',
        prioridadeId: '',
        status: 0
    });

    // --- FUNÇÕES DE BUSCA (API) ---
    const fetchSetores = async () => {
        try {
            const response = await axios.get(`${API_URL}/Setores`);
            setSetores(response.data);
        } catch (error) { console.error("Erro ao buscar setores", error); }
    };

    const fetchChamados = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/Chamados`);
            setChamados(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar chamados", error);
            setLoading(false);
        }
    };

    const fetchPrioridades = async () => {
        try {
            const response = await axios.get(`${API_URL}/Prioridades`);
            setPrioridades(response.data);
        } catch (error) { console.error("Erro ao buscar prioridades", error); }
    };

    useEffect(() => {
        fetchChamados();
        fetchSetores();
        fetchPrioridades();
    }, []);

    // --- AÇÕES DE ATENDIMENTO ---
    const realizarCheckIn = async (id) => {
        try {
            await axios.post(`${API_URL}/Chamados/${id}/check-in`);
            fetchChamados();
        } catch (error) {
            alert(error.response?.data || "Erro ao iniciar atendimento.");
        }
    };

    const realizarCheckOut = async (id) => {
        const solucao = prompt("Descreva a solução aplicada:");
        if (!solucao) return;
        try {
            await axios.post(`${API_URL}/Chamados/${id}/check-out`, { solucao });
            fetchChamados();
            alert("Chamado finalizado!");
        } catch (error) {
            alert("Erro ao finalizar chamado.");
        }
    };

    const handleSubmitChamado = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/Chamados`, {
                ...novoChamado,
                setorId: Number(novoChamado.setorId),
                prioridadeId: Number(novoChamado.prioridadeId)
            });
            setIsModalOpen(false);
            fetchChamados();
            setNovoChamado({ titulo: '', descricao: 'Atendimento solicitado via painel', setorId: '', prioridadeId: '', status: 0 });
        } catch (error) {
            alert("Erro ao criar chamado. Verifique os campos.");
        }
    };

    // --- FILTRAGEM ---
    const chamadosFiltrados = chamados.filter(c => {
        const correspondeStatus = filtroStatus === 'TODOS' ||
            (filtroStatus === 'ABERTO' && c.status === 0) ||
            (filtroStatus === 'INICIADO' && c.status === 1) ||
            (filtroStatus === 'FINALIZADO' && c.status === 2);
        const correspondeBusca = c.titulo.toLowerCase().includes(busca.toLowerCase());
        return correspondeStatus && correspondeBusca;
    });

    const formatarTempo = (horas) => {
        if (horas <= 0) return "---";
        const totalMinutos = Math.floor(horas * 60);
        const h = Math.floor(totalMinutos / 60);
        const m = totalMinutos % 60;
        return h > 0 ? `${h}h ${m}min` : `${m}min`;
    };

    return (
        <div className="min-h-screen bg-alice flex">
            {/* BARRA LATERAL FIXA */}
            <nav className="fixed top-0 left-0 h-full w-20 bg-navy-dark flex flex-col items-center py-8 gap-8 text-white shadow-2xl z-30">
                <div className="text-lemon font-black text-2xl">L</div>
                <div className="flex flex-col gap-6 flex-1">
                    <button
                        onClick={() => setAbaAtiva('DASHBOARD')}
                        className={`p-3 rounded-xl transition-all ${abaAtiva === 'DASHBOARD' ? 'bg-navy-light text-lemon shadow-lg' : 'hover:text-lemon'}`}
                    >
                        <LayoutDashboard size={24} />
                    </button>
                    <button
                        onClick={() => setAbaAtiva('CADASTROS')}
                        className={`p-3 rounded-xl transition-all ${abaAtiva === 'CADASTROS' ? 'bg-navy-light text-lemon shadow-lg' : 'hover:text-lemon'}`}
                    >
                        <Settings size={24} />
                    </button>
                </div>
                <button className="p-3 hover:text-red-400 transition"><LogOut size={24} /></button>
            </nav>

            {/* CONTEÚDO DA PÁGINA */}
            <main className="ml-20 p-8 w-full">
                {abaAtiva === 'DASHBOARD' ? (
                    <div className="animate-in fade-in duration-500">
                        <header className="flex justify-between items-center mb-10">
                            <div>
                                <h1 className="text-3xl font-bold text-navy-dark italic">LUME <span className="text-navy-light font-light">SGA</span></h1>
                                <p className="text-gray-500">Painel de Controle de Chamados</p>
                            </div>
                        </header>

                        {/* Cards de Resumo */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <Card title="Total Geral" value={chamados.length} icon={<LayoutDashboard className="text-navy-light" />} />
                            <Card title="Em Aberto" value={chamados.filter(c => c.status === 0).length} icon={<Clock className="text-blue-500" />} />
                            <Card title="Atrasados (SLA)" value={chamados.filter(c => c.estaAtrasado).length} icon={<AlertTriangle className="text-red-500" />} isCritical={chamados.filter(c => c.estaAtrasado).length > 0} />
                        </div>

                        {/* Barra de Ações (Filtro + Busca + Botão Novo) */}
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                            <div className="flex gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                {['TODOS', 'ABERTO', 'INICIADO', 'FINALIZADO'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFiltroStatus(s)}
                                        className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${filtroStatus === s ? 'bg-navy-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
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
                                        placeholder="Buscar chamado..."
                                        value={busca}
                                        onChange={e => setBusca(e.target.value)}
                                        className="pl-10 pr-4 py-2 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-lemon outline-none transition w-64 border-none"
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

                        {/* Tabela de Dados */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            <table className="w-full text-left">
                                <thead className="bg-navy-light text-white font-semibold">
                                    <tr>
                                        <th className="p-5">CÓD</th>
                                        <th className="p-5">TÍTULO</th>
                                        <th className="p-5">SETOR</th>
                                        <th className="p-5">CONSUMIDO</th>
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
                                            <td className="p-5 text-gray-600 font-medium">{c.setorNome}</td>
                                            <td className="p-5">
                                                <span className={`text-sm ${c.estaAtrasado ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                                                    {formatarTempo(c.horasDecorridas)}
                                                </span>
                                            </td>
                                            <td className="p-5"><StatusBadge status={c.status} /></td>
                                            <td className="p-5">
                                                {c.estaAtrasado ? (
                                                    <span className="text-red-600 font-black text-xs animate-pulse flex items-center gap-1">
                                                        <AlertTriangle size={14} /> FORA DO PRAZO
                                                    </span>
                                                ) : (
                                                    <span className="text-green-600 font-bold text-xs flex items-center gap-1">
                                                        <CheckCircle size={14} /> NO PRAZO
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-5">
                                                <div className="flex justify-center gap-2">
                                                    {c.status === 0 && (
                                                        <button onClick={() => realizarCheckIn(c.id)} className="bg-navy-dark text-white text-xs px-4 py-2 rounded font-bold hover:bg-navy-light transition">CHECK-IN</button>
                                                    )}
                                                    {c.status === 1 && (
                                                        <button onClick={() => realizarCheckOut(c.id)} className="bg-green-600 text-white text-xs px-4 py-2 rounded font-bold hover:bg-green-700 transition">FINALIZAR</button>
                                                    )}
                                                    {c.status === 2 && (
                                                        <span className="text-gray-400 text-xs italic font-bold">CONCLUÍDO</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {chamadosFiltrados.length === 0 && !loading && (
                                <div className="p-10 text-center text-gray-400 italic">Nenhum chamado encontrado.</div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* TELA DE CADASTROS */
                    <TelaCadastros
                        setores={setores}
                        prioridades={prioridades}
                        onUpdate={() => { fetchSetores(); fetchPrioridades(); }}
                    />
                )}
            </main>

            {/* MODAL DE NOVO CHAMADO */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="bg-navy-dark p-6 text-white flex justify-between items-center">
                            <h2 className="text-xl font-bold">Novo Atendimento</h2>
                            <button onClick={() => setIsModalOpen(false)} className="hover:text-lemon text-gray-400">✕</button>
                        </div>
                        <form onSubmit={handleSubmitChamado} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-navy-dark mb-1">Título do Problema</label>
                                <input
                                    type="text" required
                                    className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-lemon outline-none"
                                    placeholder="Ex: Erro no sistema de notas"
                                    onChange={e => setNovoChamado({ ...novoChamado, titulo: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-navy-dark mb-1">Setor Solicitante</label>
                                <select
                                    required className="w-full border border-gray-200 rounded-lg p-2 outline-none"
                                    value={novoChamado.setorId}
                                    onChange={e => setNovoChamado({ ...novoChamado, setorId: e.target.value })}
                                >
                                    <option value="">Selecione...</option>
                                    {setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-navy-dark mb-1">Prioridade / Urgência</label>
                                <select
                                    required className="w-full border border-gray-200 rounded-lg p-2 outline-none"
                                    value={novoChamado.prioridadeId}
                                    onChange={e => setNovoChamado({ ...novoChamado, prioridadeId: e.target.value })}
                                >
                                    <option value="">Selecione...</option>
                                    {prioridades.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-bold text-gray-500 hover:bg-gray-50 transition">CANCELAR</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-lemon text-navy-dark rounded-lg font-bold hover:brightness-90 transition shadow-md">CRIAR CHAMADO</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- SUB-COMPONENTE: TELA DE CADASTROS ---
function TelaCadastros({ setores, prioridades, onUpdate }) {
    const [novoSetor, setNovoSetor] = useState('');
    const [novaPrioridade, setNovaPrioridade] = useState({ nome: '', tempoEstimadoHoras: 24 });

    const handleSetorSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/Setores`, { nome: novoSetor });
            setNovoSetor('');
            onUpdate();
            alert("Setor adicionado!");
        } catch { alert("Erro ao adicionar setor."); }
    };

    const handlePrioridadeSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/Prioridades`, novaPrioridade);
            setNovaPrioridade({ nome: '', tempoEstimadoHoras: 24 });
            onUpdate();
            alert("Prioridade adicionada!");
        } catch { alert("Erro ao adicionar prioridade."); }
    };

    return (
        <div className="max-w-5xl animate-in slide-in-from-right-10 duration-500">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-navy-dark">Configurações <span className="text-navy-light font-light">Gerais</span></h1>
                <p className="text-gray-500">Gerencie a estrutura organizacional e os prazos de SLA</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* SETORES */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Building2 size={24} /></div>
                        <h2 className="text-xl font-bold text-navy-dark">Gestão de Setores</h2>
                    </div>
                    <form onSubmit={handleSetorSubmit} className="flex gap-2 mb-8">
                        <input
                            type="text" required placeholder="Ex: RH, TI, Financeiro..."
                            className="flex-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-lemon bg-gray-50"
                            value={novoSetor} onChange={e => setNovoSetor(e.target.value)}
                        />
                        <button className="bg-navy-dark text-white px-4 rounded-xl hover:bg-navy-light transition shadow-md">
                            <Plus size={24} />
                        </button>
                    </form>
                    <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-80 pr-2">
                        {setores.map(s => (
                            <div key={s.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center group">
                                <span className="font-semibold text-gray-700">{s.nome}</span>
                                <span className="text-xs text-gray-300 font-mono">ID: {s.id}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PRIORIDADES */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-red-50 rounded-lg text-red-600"><ShieldAlert size={24} /></div>
                        <h2 className="text-xl font-bold text-navy-dark">Níveis de Prioridade (SLA)</h2>
                    </div>
                    <form onSubmit={handlePrioridadeSubmit} className="space-y-4 mb-8">
                        <input
                            type="text" required placeholder="Nome do nível (Ex: Crítico)"
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-lemon bg-gray-50"
                            value={novaPrioridade.nome} onChange={e => setNovaPrioridade({ ...novaPrioridade, nome: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <input
                                type="number" required placeholder="Prazo em Horas"
                                className="flex-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-lemon bg-gray-50"
                                value={novaPrioridade.tempoEstimadoHoras} onChange={e => setNovaPrioridade({ ...novaPrioridade, tempoEstimadoHoras: Number(e.target.value) })}
                            />
                            <button className="bg-navy-dark text-white px-6 rounded-xl font-bold shadow-md hover:bg-navy-light transition flex items-center gap-2">
                                <Plus size={20} /> ADICIONAR
                            </button>
                        </div>
                    </form>
                    <div className="grid grid-cols-1 gap-2 overflow-y-auto max-h-80 pr-2">
                        {prioridades.map(p => (
                            <div key={p.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                                <span className="font-bold text-navy-dark">{p.nome}</span>
                                <span className="bg-navy-light text-white text-xs px-3 py-1 rounded-full font-bold">
                                    {p.tempoEstimadoHoras} HORAS
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- COMPONENTES AUXILIARES ---
function Card({ title, value, icon, isCritical }) {
    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border-b-4 transition-all hover:translate-y-[-4px] ${isCritical ? 'border-red-500 shadow-red-100' : 'border-lemon shadow-gray-100'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
                    <p className="text-3xl font-black text-navy-dark mt-1">{value}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = { 0: "bg-blue-100 text-blue-700", 1: "bg-amber-100 text-amber-700", 2: "bg-green-100 text-green-700" };
    const labels = { 0: "Aberto", 1: "Em Progresso", 2: "Concluído" };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}

export default App;