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
    LogOut
} from 'lucide-react';

const API_URL = "http://localhost:5251/api";

function App() {
    const [chamados, setChamados] = useState([]);
    const [setores, setSetores] = useState([]);
    const [prioridades, setPrioridades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState('TODOS');
    const [busca, setBusca] = useState('');
    const [novoChamado, setNovoChamado] = useState({
        titulo: '',
        descricao: 'Descrição padrão via sistema',
        setorId: '',
        status: 0,
        prioridadeId: ''
    });

    const formatarTempo = (horas) => {
        if (horas <= 0) return "---";
        const totalMinutos = Math.floor(horas * 60);
        const h = Math.floor(totalMinutos / 60);
        const m = totalMinutos % 60;
        return h > 0 ? `${h}h ${m}min` : `${m}min`;
    };

    const realizarCheckIn = async (id) => {
        try {
            await axios.post(`${API_URL}/Chamados/${id}/check-in`);
            await fetchChamados();
        } catch (error) {
            console.error("Erro ao realizar check-in:", error);
            alert(error.response?.data || "Erro ao iniciar atendimento.");
        }
    };

    const realizarCheckOut = async (id) => {
        const solucao = prompt("Descreva a solução aplicada:");
        if (!solucao) return;

        try {
            const url = `${API_URL}/Chamados/${id}/check-out`;
            await axios.post(url, { solucao: solucao });
            fetchChamados();
            alert("Finalizado com sucesso!");
        } catch (error) {
            console.error("Erro ao finalizar:", error.response);
            alert("Erro ao finalizar chamado.");
        }
    };

    const chamadosFiltrados = chamados.filter(c => {
        const correspondeStatus =
            filtroStatus === 'TODOS' ||
            (filtroStatus === 'ABERTO' && c.status === 0) ||
            (filtroStatus === 'INICIADO' && c.status === 1) ||
            (filtroStatus === 'FINALIZADO' && c.status === 2);

        const correspondeBusca = c.titulo.toLowerCase().includes(busca.toLowerCase());

        return correspondeStatus && correspondeBusca;
    });

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
        } catch (error) {
            console.error("Erro chamados", error);
            setLoading(false);
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            Titulo: novoChamado.titulo,
            Descricao: novoChamado.descricao || "Sem descrição",
            SetorId: Number(novoChamado.setorId),
            PrioridadeId: Number(novoChamado.prioridadeId),
            Status: 0
        };

        try {
            await axios.post(`${API_URL}/Chamados`, payload);
            setIsModalOpen(false);
            fetchChamados();
            setNovoChamado({ titulo: '', descricao: 'Descrição padrão', setorId: '', prioridadeId: '', status: 0 });
        } catch (error) {
            alert("Erro: Verifique se selecionou Setor e Prioridade.", error);
        }
    };

    const abertos = chamados.filter(c => c.status === 0).length;
    const atrasados = chamados.filter(c => c.estaAtrasado).length;

    return (
        <div className="min-h-screen bg-alice">
            {/* Navbar Lateral */}
            <nav className="fixed top-0 left-0 h-full w-20 bg-navy-dark flex flex-col items-center py-8 gap-8 text-white shadow-2xl">
                <div className="text-lemon font-black text-2xl">L</div>
                <div className="flex flex-col gap-6 flex-1">
                    <button className="p-3 bg-navy-light rounded-xl text-lemon"><LayoutDashboard size={24} /></button>
                    <button className="p-3 hover:text-lemon transition"><User size={24} /></button>
                </div>
                <button className="p-3 hover:text-red-400 transition"><LogOut size={24} /></button>
            </nav>

            <main className="ml-20 p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-navy-dark italic">LUME <span className="text-navy-light font-light">SGA</span></h1>
                        <p className="text-gray-500">Gestão de Atendimentos</p>
                    </div>
                </header>

                {/* Cards Informativos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card title="Total Geral" value={chamados.length} icon={<LayoutDashboard className="text-navy-light" />} />
                    <Card title="Em Aberto" value={abertos} icon={<Clock className="text-blue-500" />} />
                    <Card title="Atrasados (SLA)" value={atrasados} icon={<AlertTriangle className="text-red-500" />} isCritical={atrasados > 0} />
                </div>

                {/* Barra de Filtros e Busca */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div className="flex gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100 w-fit">
                        {['TODOS', 'ABERTO', 'INICIADO', 'FINALIZADO'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFiltroStatus(status)}
                                className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${filtroStatus === status
                                    ? 'bg-navy-dark text-white shadow-md'
                                    : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                {status === 'INICIADO' ? 'EM PROGRESSO' : status}
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
                                onChange={(e) => setBusca(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-lg border-none bg-white shadow-sm focus:ring-2 focus:ring-lemon outline-none transition w-64"
                            />
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-lemon text-navy-dark px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all">
                            <Plus size={20} /> NOVO CHAMADO
                        </button>
                    </div>
                </div>

                {/* Tabela de Chamados */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <table className="w-full text-left">
                        <thead className="bg-navy-light text-white">
                            <tr>
                                <th className="p-5 font-semibold">CÓD</th>
                                <th className="p-5 font-semibold">TÍTULO</th>
                                <th className="p-5 font-semibold">SETOR</th>
                                <th className="p-5 font-semibold">HORAS</th>
                                <th className="p-5 font-semibold">STATUS</th>
                                <th className="p-5 font-semibold">SLA</th>
                                <th className="p-5 font-semibold text-center">AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chamadosFiltrados.map((c) => (
                                <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${c.estaAtrasado ? 'bg-red-50/30' : ''}`}>
                                    <td className="p-5 text-gray-400 font-mono text-sm">#{c.id}</td>
                                    <td className="p-5">
                                        <p className="font-bold text-navy-dark">{c.titulo}</p>
                                        <p className="text-xs text-gray-400">{new Date(c.dataAbertura).toLocaleString()}</p>
                                    </td>
                                    <td className="p-5 text-gray-600 font-medium">{c.setorNome}</td>
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 uppercase font-bold">Consumido</span>
                                            <span className={`text-sm ${c.estaAtrasado ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                                                {formatarTempo(c.horasDecorridas)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <StatusBadge status={c.status} />
                                    </td>
                                    <td className="p-5">
                                        {c.estaAtrasado ? (
                                            <div className="flex items-center gap-1 text-red-600 font-black animate-pulse">
                                                <AlertTriangle size={16} /> FORA DO PRAZO
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 text-green-600 font-medium">
                                                <CheckCircle size={16} /> NO PRAZO
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-5">
                                        <div className="flex justify-center gap-2">
                                            {c.status === 0 && (
                                                <button onClick={() => realizarCheckIn(c.id)} className="bg-navy-dark text-white text-xs px-4 py-2 rounded hover:bg-navy-light transition font-bold">
                                                    CHECK-IN
                                                </button>
                                            )}
                                            {c.status === 1 && (
                                                <button onClick={() => realizarCheckOut(c.id)} className="bg-green-600 text-white text-xs px-4 py-2 rounded hover:bg-green-700 transition font-bold">
                                                    FINALIZAR
                                                </button>
                                            )}
                                            {c.status === 2 && (
                                                <span className="text-gray-400 text-xs font-bold italic">CONCLUÍDO</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {chamadosFiltrados.length === 0 && !loading && (
                        <div className="p-10 text-center text-gray-400 italic">Nenhum chamado encontrado com esses filtros.</div>
                    )}
                </div>
            </main>

            {/* Modal de Novo Chamado */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="bg-navy-dark p-6 text-white flex justify-between items-center">
                            <h2 className="text-xl font-bold">Novo Chamado</h2>
                            <button onClick={() => setIsModalOpen(false)} className="hover:text-lemon text-gray-400">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-navy-dark mb-1">Título</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-lemon outline-none"
                                    placeholder="Ex: Teclado não funciona"
                                    onChange={(e) => setNovoChamado({ ...novoChamado, titulo: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-navy-dark mb-1">Setor</label>
                                <select
                                    required
                                    className="w-full border border-gray-200 rounded-lg p-2 outline-none"
                                    value={novoChamado.setorId}
                                    onChange={(e) => setNovoChamado({ ...novoChamado, setorId: e.target.value })}
                                >
                                    <option value="">Selecione um setor...</option>
                                    {setores.map(s => (
                                        <option key={s.id} value={s.id}>{s.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-navy-dark mb-1">Prioridade</label>
                                <select
                                    required
                                    className="w-full border border-gray-200 rounded-lg p-2 outline-none"
                                    value={novoChamado.prioridadeId}
                                    onChange={(e) => setNovoChamado({ ...novoChamado, prioridadeId: e.target.value })}
                                >
                                    <option value="">Selecione a urgência...</option>
                                    {prioridades.map(p => (
                                        <option key={p.id} value={p.id}>{p.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-bold text-gray-500 hover:bg-gray-50">
                                    CANCELAR
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-lemon text-navy-dark rounded-lg font-bold hover:brightness-90 transition">
                                    CRIAR CHAMADO
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function Card({ title, value, icon, isCritical }) {
    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border-b-4 transition-transform hover:scale-105 ${isCritical ? 'border-red-500' : 'border-lemon'}`}>
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
        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}

export default App;