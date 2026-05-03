/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LayoutDashboard,
    Clock,
    AlertTriangle,
    //CheckCircle,
    Plus,
    Search,
    LogOut,
    Settings,
    Building2,
    ShieldAlert,
    Trash2,
    Edit
} from 'lucide-react';

const API_URL = "http://localhost:5251/api";

function App() {
    // --- ESTADOS ---
    const [chamados, setChamados] = useState([]);
    const [setores, setSetores] = useState([]);
    const [prioridades, setPrioridades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState('TODOS');
    const [busca, setBusca] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('DASHBOARD');
    const [editandoId, setEditandoId] = useState(null);

    const [novoChamado, setNovoChamado] = useState({
        titulo: '',
        descricao: 'Atendimento solicitado via painel',
        setorId: '',
        prioridadeId: '',
        status: 0
    });

    // --- BUSCA DE DADOS (API) ---
    const fetchSetores = async () => {
        try {
            const response = await axios.get(`${API_URL}/Setores`);
            setSetores(response.data);
        } catch (error) { console.error("Erro setores", error); }
    };

    const fetchChamados = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/Chamados`);
            setChamados(response.data);
            setLoading(false);
        } catch (error) { console.error("Erro chamados", error); setLoading(false); }
    };

    const fetchPrioridades = async () => {
        try {
            const response = await axios.get(`${API_URL}/Prioridades`);
            setPrioridades(response.data);
        } catch (error) { console.error("Erro prioridades", error); }
    };

    useEffect(() => {
        fetchChamados();
        fetchSetores();
        fetchPrioridades();
    }, []);

    // --- FUNÇÕES DE CHAMADOS ---
    const fecharModal = () => {
        setIsModalOpen(false);
        setEditandoId(null);
        setNovoChamado({ titulo: '', descricao: 'Atendimento solicitado via painel', setorId: '', prioridadeId: '', status: 0 });
    };

    const abrirEdicao = (chamado) => {
        setNovoChamado({
            titulo: chamado.titulo,
            descricao: chamado.descricao,
            setorId: chamado.setorId,
            prioridadeId: chamado.prioridadeId,
            status: chamado.status
        });
        setEditandoId(chamado.id);
        setIsModalOpen(true);
    };

    const deletarChamado = async (id) => {
        if (!window.confirm(`Tem certeza que deseja mover o chamado #${id} para a lixeira?`)) return;

        try {
            // Chamada limpa: apenas o ID na URL, sem corpo (body) com campos obrigatórios
            await axios.delete(`${API_URL}/Chamados/${id}`);

            fecharModal();
            fetchChamados(); // Recarrega a lista
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert("Não foi possível excluir o chamado.");
        }
    };

    const handleSubmitChamado = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...novoChamado,
                setorId: Number(novoChamado.setorId),
                prioridadeId: Number(novoChamado.prioridadeId)
            };

            if (editandoId) {
                await axios.put(`${API_URL}/Chamados/${editandoId}`, { ...payload, id: editandoId });
            } else {
                await axios.post(`${API_URL}/Chamados`, payload);
            }

            fecharModal();
            fetchChamados();
        } catch (error) {
            alert("Erro ao salvar chamado.", error);
        }
    };

    const realizarCheckIn = async (id) => {
        try {
            await axios.post(`${API_URL}/Chamados/${id}/check-in`);
            fetchChamados();
        } catch (error) { alert("Erro no Check-in.", error); }
    };

    const realizarCheckOut = async (id) => {
        const solucao = prompt("Descreva a solução:");
        if (!solucao) return;
        try {
            await axios.post(`${API_URL}/Chamados/${id}/check-out`, { solucao });
            fetchChamados();
        } catch (error) { alert("Erro no Check-out.", error); }
    };

    
    const chamadosFiltrados = chamados.filter(c => {
        const statusMatch = filtroStatus === 'TODOS' || 
            (filtroStatus === 'ABERTO' && c.status === 0) ||
            (filtroStatus === 'INICIADO' && c.status === 1) ||
            (filtroStatus === 'FINALIZADO' && c.status === 2) ||
            (filtroStatus === 'DELETADO' && c.status === 3);
        return statusMatch && c.titulo.toLowerCase().includes(busca.toLowerCase());
    });

    const formatarTempo = (horas) => {
        if (horas <= 0) return "---";
        const h = Math.floor(horas);
        const m = Math.round((horas - h) * 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="min-h-screen bg-alice flex">
            {/* NAVBAR LATERAL */}
            <nav className="fixed top-0 left-0 h-full w-20 bg-navy-dark flex flex-col items-center py-8 gap-8 text-white shadow-2xl z-30">
                <div className="text-lemon font-black text-2xl">L</div>
                <div className="flex flex-col gap-6 flex-1">
                    <button onClick={() => setAbaAtiva('DASHBOARD')} className={`p-3 rounded-xl transition ${abaAtiva === 'DASHBOARD' ? 'bg-navy-light text-lemon shadow-lg' : 'hover:text-lemon'}`}>
                        <LayoutDashboard size={24} />
                    </button>
                    <button onClick={() => setAbaAtiva('CADASTROS')} className={`p-3 rounded-xl transition ${abaAtiva === 'CADASTROS' ? 'bg-navy-light text-lemon shadow-lg' : 'hover:text-lemon'}`}>
                        <Settings size={24} />
                    </button>
                </div>
                <button className="p-3 hover:text-red-400 transition"><LogOut size={24} /></button>
            </nav>

            {/* CONTEÚDO PRINCIPAL */}
            <main className="ml-20 p-8 w-full">
                {abaAtiva === 'DASHBOARD' ? (
                    <div className="animate-in fade-in duration-500">
                        <header className="mb-10">
                            <h1 className="text-3xl font-bold text-navy-dark italic">LUME <span className="text-navy-light font-light">SGA</span></h1>
                            <p className="text-gray-500">Gestão de Atendimentos</p>
                        </header>

                        {/* CARDS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <Card title="Total" value={chamados.length} icon={<LayoutDashboard />} />
                            <Card title="Em Aberto" value={chamados.filter(c => c.status === 0).length} icon={<Clock className="text-blue-500" />} />
                            <Card title="Atrasados" value={chamados.filter(c => c.estaAtrasado).length} icon={<AlertTriangle className="text-red-500" />} isCritical={chamados.filter(c => c.estaAtrasado).length > 0} />
                        </div>

                        {/* AÇÕES E BUSCA */}
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                            <div className="flex gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                {['TODOS', 'ABERTO', 'INICIADO', 'FINALIZADO', 'DELETADO'].map(s => (
                                    <button key={s} onClick={() => setFiltroStatus(s)} className={`px-4 py-2 rounded-md text-xs font-bold transition ${filtroStatus === s ? 'bg-navy-dark text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                                        {s === 'INICIADO' ? 'EM PROGRESSO' : s}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                                    <input type="text" placeholder="Buscar..." value={busca} onChange={e => setBusca(e.target.value)} className="pl-10 pr-4 py-2 rounded-lg bg-white shadow-sm outline-none w-64 border-none" />
                                </div>
                                <button onClick={() => setIsModalOpen(true)} className="bg-lemon text-navy-dark px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-md">
                                    <Plus size={20} /> NOVO CHAMADO
                                </button>
                            </div>
                        </div>

                        {/* TABELA */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            <table className="w-full text-left">
                                <thead className="bg-navy-light text-white font-semibold">
                                    <tr>
                                        <th className="p-5">CÓD</th><th className="p-5">TÍTULO</th><th className="p-5">SETOR</th><th className="p-5">SLA</th><th className="p-5">STATUS</th><th className="p-5 text-center">AÇÕES</th>
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
                                            <td className="p-5"><StatusBadge status={c.status} /></td>
                                            <td className="p-5">
                                                <div className="flex justify-center gap-2">
                                                    
                                                    <button
                                                        onClick={() => abrirEdicao(c)}
                                                        disabled={c.status >= 2}
                                                        className={`p-2 rounded-lg transition ${c.status >= 2 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-50'}`}
                                                        title={c.status >= 2 ? "Chamados encerrados não podem ser editados" : "Editar"}
                                                    >
                                                        <Edit size={18} />
                                                    </button>

                                                    
                                                    {c.status === 0 && <button onClick={() => realizarCheckIn(c.id)} className="...">CHECK-IN</button>}
                                                    {c.status === 1 && <button onClick={() => realizarCheckOut(c.id)} className="...">FINALIZAR</button>}

                                                    
                                                    {c.status >= 2 && <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest self-center">Arquivado</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <TelaCadastros setores={setores} prioridades={prioridades} onUpdate={() => { fetchSetores(); fetchPrioridades(); }} />
                )}
            </main>

            {/* MODAL (CRIAR / EDITAR) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className={`p-6 text-white flex justify-between items-center ${editandoId ? 'bg-blue-600' : 'bg-navy-dark'}`}>
                            <h2 className="text-xl font-bold">{editandoId ? `Editar Chamado #${editandoId}` : 'Novo Atendimento'}</h2>
                            <button onClick={fecharModal}>✕</button>
                        </div>
                        <form onSubmit={handleSubmitChamado} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-navy-dark mb-1">Título</label>
                                <input type="text" required value={novoChamado.titulo} onChange={e => setNovoChamado({...novoChamado, titulo: e.target.value})} className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-lemon" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-navy-dark mb-1">Setor</label>
                                <select required value={novoChamado.setorId} onChange={e => setNovoChamado({...novoChamado, setorId: e.target.value})} className="w-full border rounded-lg p-2 outline-none">
                                    <option value="">Selecione...</option>
                                    {setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-navy-dark mb-1">Prioridade</label>
                                <select required value={novoChamado.prioridadeId} onChange={e => setNovoChamado({...novoChamado, prioridadeId: e.target.value})} className="w-full border rounded-lg p-2 outline-none">
                                    <option value="">Selecione...</option>
                                    {prioridades.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2 pt-4">
                                <div className="flex gap-2">
                                    <button type="button" onClick={fecharModal} className="flex-1 px-4 py-2 border rounded-lg font-bold text-gray-500 hover:bg-gray-50 transition">CANCELAR</button>
                                    <button type="submit" className={`flex-1 px-4 py-2 rounded-lg font-bold text-white transition shadow-md ${editandoId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-lemon text-navy-dark hover:brightness-90'}`}>
                                        {editandoId ? 'SALVAR' : 'CRIAR'}
                                    </button>
                                </div>
                                
                                {editandoId && (
                                    <button
                                        type="button"
                                        onClick={() => deletarChamado(editandoId)}
                                        className="w-full mt-2 py-2 text-red-500 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={14} /> EXCLUIR CHAMADO (MOVER PARA LIXEIRA)
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- TELA DE CADASTROS ---
function TelaCadastros({ setores, prioridades, onUpdate }) {
    const [novoSetor, setNovoSetor] = useState('');
    const [novaPrioridade, setNovaPrioridade] = useState({ nome: '', tempoEstimadoHoras: 24 });

    const handleSetorSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/Setores`, { nome: novoSetor });
            setNovoSetor('');
            onUpdate();
        } catch { alert("Erro ao adicionar setor."); }
    };

    const deletarSetor = async (id) => {
        if (!window.confirm("Excluir setor?")) return;
        try {
            await axios.delete(`${API_URL}/Setores/${id}`);
            onUpdate();
        } catch { alert("Erro ao excluir. O setor pode estar em uso."); }
    };

    const handlePrioridadeSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/Prioridades`, novaPrioridade);
            setNovaPrioridade({ nome: '', tempoEstimadoHoras: 24 });
            onUpdate();
        } catch { alert("Erro ao adicionar prioridade."); }
    };

    const deletarPrioridade = async (id) => {
        if (!window.confirm("Excluir prioridade?")) return;
        try {
            await axios.delete(`${API_URL}/Prioridades/${id}`);
            onUpdate();
        } catch { alert("Erro ao excluir."); }
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
                        <h2 className="text-xl font-bold text-navy-dark">Setores</h2>
                    </div>
                    <form onSubmit={handleSetorSubmit} className="flex gap-2 mb-8">
                        <input type="text" required placeholder="Novo setor..." className="flex-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-lemon bg-gray-50 text-sm" value={novoSetor} onChange={e => setNovoSetor(e.target.value)} />
                        <button type="submit" className="bg-navy-dark text-white px-4 rounded-xl hover:bg-navy-light transition shadow-md"><Plus size={24} /></button>
                    </form>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {setores.map(s => (
                            <div key={s.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                                <span className="font-semibold text-gray-700">{s.nome}</span>
                                <button onClick={() => deletarSetor(s.id)} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={18} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PRIORIDADES */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-red-50 rounded-lg text-red-600"><ShieldAlert size={24} /></div>
                        <h2 className="text-xl font-bold text-navy-dark">Prioridades (SLA)</h2>
                    </div>
                    <form onSubmit={handlePrioridadeSubmit} className="space-y-4 mb-8">
                        <input type="text" required placeholder="Nome..." className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-lemon bg-gray-50 text-sm" value={novaPrioridade.nome} onChange={e => setNovaPrioridade({...novaPrioridade, nome: e.target.value})} />
                        <div className="flex gap-2">
                            <input type="number" required placeholder="Horas" className="flex-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-lemon bg-gray-50 text-sm" value={novaPrioridade.tempoEstimadoHoras} onChange={e => setNovaPrioridade({...novaPrioridade, tempoEstimadoHoras: Number(e.target.value)})} />
                            <button type="submit" className="bg-navy-dark text-white px-6 rounded-xl font-bold shadow-md hover:bg-navy-light transition">SALVAR</button>
                        </div>
                    </form>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {prioridades.map(p => (
                            <div key={p.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                                <div><p className="font-bold text-navy-dark">{p.nome}</p><p className="text-[10px] text-gray-400 uppercase tracking-widest">{p.tempoEstimadoHoras} Horas</p></div>
                                <button onClick={() => deletarPrioridade(p.id)} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={18} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Card({ title, value, icon, isCritical }) {
    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border-b-4 transition-all hover:translate-y-[-4px] ${isCritical ? 'border-red-500 shadow-red-100' : 'border-lemon shadow-gray-100'}`}>
            <div className="flex justify-between items-start">
                <div><p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p><p className="text-3xl font-black text-navy-dark mt-1">{value}</p></div>
                <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        0: "bg-blue-100 text-blue-700",
        1: "bg-amber-100 text-amber-700",
        2: "bg-green-100 text-green-700",
        3: "bg-gray-100 text-gray-700"
    };
    const labels = {
        0: "Aberto",
        1: "Em Progresso",
        2: "Concluído",
        3: "Cancelado"
    };
    return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${styles[status]}`}>
        {labels[status] || "S/N"}
    </span>;
}

export default App;