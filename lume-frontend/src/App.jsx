/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import axios from 'axios
import TelaCadastros from './pages/TelaCadastros';
import Toast from './components/Toast';
import ModalConfirmacao from './components/ModalConfirmacao';
import ModalFinalizar from './components/ModalFinalizar';
import ModalChamado from './components/ModalChamado';
import TelaRelatorios from './pages/TelaRelatorios';
import TelaGestao from './pages/TelaGestao';
import Sidebar from './components/SideBar';



const API_URL = "http://localhost:5251/api";

function App() {
    const [chamados, setChamados] = useState([]);
    const [setores, setSetores] = useState([]);
    const [prioridades, setPrioridades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filtroStatus, setFiltroStatus] = useState('TODOS');
    const [busca, setBusca] = useState('');
    const [abaAtiva, setAbaAtiva] = useState('DASHBOARD');
    const [editandoId, setEditandoId] = useState(null);
    const [toast, setToast] = useState({ show: false, mensagem: '', tipo: 'sucesso' });
    const [modalFinalizar, setModalFinalizar] = useState({ show: false, chamadoId: null, solucao: '' });
    const [modalConfirm, setModalConfirm] = useState({
        show: false,
        titulo: '',
        mensagem: '',
        onConfirm: null
    });

    const [novoChamado, setNovoChamado] = useState({
        titulo: '',
        descricao: 'Atendimento solicitado via painel',
        setorId: '',
        prioridadeId: '',
        status: 0
    });
    const fetchSetores = async () => {
        try {
            const response = await axios.get(`${API_URL}/Setores`);
            setSetores(response.data);
        } catch (error) { console.error("Erro setores", error); }
    }
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

    const mostrarMensagem = (msg, tipo = 'sucesso') => {
        setToast({ show: true, mensagem: msg, tipo: tipo });
        setTimeout(() => setToast({ show: false, mensagem: '', tipo: 'sucesso' }), 3000);
    };
    const confirmarExclusao = (titulo, mensagem, acao) => {
        setModalConfirm({
            show: true,
            titulo: titulo,
            mensagem: mensagem,
            onConfirm: async () => {
                await acao();
                setModalConfirm({ show: false, titulo: '', mensagem: '', onConfirm: null });
            }
        });
    }

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
                mostrarMensagem("Chamado atualizado!", "sucesso");
            } else {
                await axios.post(`${API_URL}/Chamados`, payload);
                mostrarMensagem("Chamado criado com sucesso!", "sucesso");
            }

            fecharModal();
            fetchChamados();
        } catch (error) {
            console.error("Erro ao salvar chamado", error);
            alert("Erro ao salvar chamado. Verifique a conexão com a API.");
        }
    };
    const deletarChamado = (id) => {
        confirmarExclusao(
            "Excluir Chamado?",
            `Tem certeza que deseja remover o chamado #${id}? Esta ação não pode ser desfeita.`,
            async () => {
                try {
                    await axios.delete(`${API_URL}/Chamados/${id}`);
                    fecharModal();
                    fetchChamados();
                    mostrarMensagem("Chamado removido!", "erro");
                } catch (error) { console.error("Erro ao deletar chamado", error); }
            }
        );
    }
    const iniciarFinalizacao = (id) => {
        setModalFinalizar({ show: true, chamadoId: id, solucao: '' });
    };
    const confirmarFinalizacao = async () => {
        if (!modalFinalizar.solucao) return;
        try {
            await axios.post(`${API_URL}/Chamados/${modalFinalizar.chamadoId}/check-out`, {
                solucao: modalFinalizar.solucao
            });
            setModalFinalizar({ show: false, chamadoId: null, solucao: '' });
            mostrarMensagem("Atendimento finalizado!", "sucesso");
            fetchChamados();
        } catch (error) {
            console.error("Erro no Check-out", error);
        }
    };
    const realizarCheckIn = async (id) => {
        try {
            await axios.post(`${API_URL}/Chamados/${id}/check-in`);
            fetchChamados();
            mostrarMensagem("Check-in realizado!", "sucesso");
        } catch (error) { console.error("Erro no Check-in", error); }
    };

    const formatarTempo = (horas) => {
        if (horas <= 0) return "---";
        const h = Math.floor(horas);
        const m = Math.round((horas - h) * 60);
        return `${h}h ${m}m`;
    };
    const chamadosFiltrados = chamados.filter(c => {
        const statusMatch = filtroStatus === 'TODOS' ||
            (filtroStatus === 'ABERTO' && c.status === 0) ||
            (filtroStatus === 'INICIADO' && c.status === 1) ||
            (filtroStatus === 'FINALIZADO' && c.status === 2) ||
            (filtroStatus === 'DELETADO' && c.status === 3);
        return statusMatch && c.titulo.toLowerCase().includes(busca.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-alice flex">
            {/* NAVBAR LATERAL */}
            <Sidebar abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />

            {/* CONTEÚDO PRINCIPAL */}
            <main className="ml-20 p-8 w-full">
                {abaAtiva === 'DASHBOARD' && (
                    <TelaGestao
                        chamados={chamados}
                        filtroStatus={filtroStatus}
                        setFiltroStatus={setFiltroStatus}
                        busca={busca}
                        setBusca={setBusca}
                        setIsModalOpen={setIsModalOpen}
                        chamadosFiltrados={chamadosFiltrados}
                        formatarTempo={formatarTempo}
                        abrirEdicao={abrirEdicao}
                        realizarCheckIn={realizarCheckIn}
                        iniciarFinalizacao={iniciarFinalizacao}
                    />
                )}

                {abaAtiva === 'RELATORIOS' && (
                    <TelaRelatorios chamados={chamados} setores={setores} />
                )}

                {abaAtiva === 'CADASTROS' && (
                    <TelaCadastros
                        chamados={chamados}
                        setores={setores}
                        prioridades={prioridades}
                        onUpdate={() => {
                            fetchSetores();
                            fetchPrioridades();
                        }}
                        onSuccess={(msg) => mostrarMensagem(msg, 'sucesso')}
                        onDelete={(msg) => mostrarMensagem(msg, 'erro')}
                        confirmarAcao={confirmarExclusao}
                    />
                )}
            </main>

            {/* MODAL */}
            <ModalFinalizar
                show={modalFinalizar.show}
                solucao={modalFinalizar.solucao}
                setSolucao={(val) => setModalFinalizar({ ...modalFinalizar, solucao: val })}
                onCancel={() => setModalFinalizar({ show: false, chamadoId: null, solucao: '' })}
                onConfirm={confirmarFinalizacao}
            />

            <ModalChamado
                isOpen={isModalOpen}
                fecharModal={fecharModal}
                editandoId={editandoId}
                handleSubmit={handleSubmitChamado}
                novoChamado={novoChamado}
                setNovoChamado={setNovoChamado}
                setores={setores}
                prioridades={prioridades}
                deletarChamado={deletarChamado}
            />

            <ModalConfirmacao
                show={modalConfirm.show}
                titulo={modalConfirm.titulo}
                mensagem={modalConfirm.mensagem}
                onConfirm={modalConfirm.onConfirm}
                onCancel={() => setModalConfirm({ ...modalConfirm, show: false })}
            />

            <Toast
                show={toast.show}
                mensagem={toast.mensagem}
                tipo={toast.tipo}
            />
        </div>
    );
}

export default App;