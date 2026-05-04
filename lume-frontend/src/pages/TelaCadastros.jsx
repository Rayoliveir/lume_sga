import { useState } from 'react';
import axios from '../api/api';
import { Building2, Plus, Trash2, ShieldAlert } from 'lucide-react';

function TelaCadastros({ chamados, setores, prioridades, onUpdate, onSuccess, onDelete, confirmarAcao }) {
    const API_URL = "http://localhost:5251/api";

    const [novoSetor, setNovoSetor] = useState('');
    const [novaPrioridade, setNovaPrioridade] = useState({ nome: '', tempoEstimadoHoras: 24 });


    const handleSetorSubmit = async (e) => {
        e.preventDefault();

        const setorExiste = setores.some(s => s.nome.trim().toUpperCase() === novoSetor.trim().toUpperCase());
        if (setorExiste) {
            onDelete("Este setor já está cadastrado!");
            return;
        }

        try {
            await axios.post(`${API_URL}/Setores`, { nome: novoSetor });
            setNovoSetor('');
            onUpdate();
            onSuccess(`Setor "${novoSetor}" criado com sucesso!`);
        } catch {
            alert("Erro ao adicionar setor.");
        }
    };

    const deletarSetor = (id, nome) => { 

        console.log("ID do Setor que quer apagar:", id);
        console.log("Exemplo de SetorId no primeiro chamado:", chamados[0]?.id);
        const emUso = chamados.some(c => Number(c.id) === Number(id));
        if (emUso) {
            onDelete(`O setor "${nome}" possui chamados vinculados e não pode ser excluído.`);
            return;
        }

        confirmarAcao(
            "Excluir Setor?",
            `Tem certeza que deseja remover o setor "${nome}"?`,
            async () => {
                try {
                    await axios.delete(`${API_URL}/Setores/${id}`);
                    onUpdate();
                    onDelete("Setor removido!");
                } catch (error) {
                    console.error(error);
                    onDelete("Erro ao remover: Verifique a conexão.");
                }
            }
        );
    };

    const handlePrioridadeSubmit = async (e) => {
        e.preventDefault()
        const nomeExiste = prioridades.some(p => p.nome.trim().toUpperCase() === novaPrioridade.nome.trim().toUpperCase())
        const horasExiste = prioridades.some(p => Number(p.tempoEstimadoHoras) === Number(novaPrioridade.tempoEstimadoHoras));

        if (nomeExiste) {
            onDelete("Já existe uma prioridade com este nome!");
            return;
        }
        if (horasExiste) {
            onDelete(`Já existe uma prioridade com ${novaPrioridade.tempoEstimadoHoras} horas configuradas!`);
            return;
        }

        try {
            await axios.post(`${API_URL}/Prioridades`, novaPrioridade);
            setNovaPrioridade({ nome: '', tempoEstimadoHoras: 24 });
            onUpdate();
            onSuccess(`Prioridade "${novaPrioridade.nome}" criada com sucesso!`);
        } catch {
            alert("Erro ao adicionar prioridade.");
        }
    };

    const deletarPrioridade = (id, nome) => {
        const emUso = chamados.some(c => Number(c.prioridadeId) === Number(id));
        if (emUso) {
            onDelete(`A prioridade "${nome}" está em uso e não pode ser removida.`);
            return;
        }

        confirmarAcao(
            "Excluir Prioridade?",
            `Esta ação removerá as regras de SLA da prioridade "${nome}".`,
            async () => {
                try {
                    await axios.delete(`${API_URL}/Prioridades/${id}`);
                    onUpdate();
                    onDelete("Prioridade excluída!");
                } catch (error) {
                    console.error(error);
                    onDelete("Erro ao excluir!");
                }
            }
        );
    };

    return (
        <div className="max-w-5xl animate-in slide-in-from-right-10 duration-500">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-navy-dark">
                    Configurações <span className="text-navy-light font-light">Gerais</span>
                </h1>
                <p className="text-gray-500">Gerencie a estrutura organizacional e os prazos de SLA</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CARD SETORES */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Building2 size={24} /></div>
                        <h2 className="text-xl font-bold text-navy-dark">Setores</h2>
                    </div>

                    <form onSubmit={handleSetorSubmit} className="flex gap-2 mb-8">
                        <input
                            type="text"
                            required
                            placeholder="Novo setor..."
                            className="flex-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-lemon bg-gray-50 text-sm"
                            value={novoSetor}
                            onChange={e => setNovoSetor(e.target.value)}
                        />
                        <button type="submit" className="bg-navy-dark text-white px-4 rounded-xl hover:bg-navy-light transition shadow-md">
                            <Plus size={24} />
                        </button>
                    </form>

                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {setores.map(s => (
                            <div key={s.id} className="p-4 bg-gray-50 rounded-xl flex justify-between items-center group hover:bg-gray-100 transition">
                                <span className="font-semibold text-gray-700">{s.nome}</span>
                                <button
                                    onClick={() => deletarSetor(s.id, s.nome)}
                                    className="p-2 text-gray-300 hover:text-red-500 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CARD PRIORIDADES */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-red-50 rounded-lg text-red-600"><ShieldAlert size={24} /></div>
                        <h2 className="text-xl font-bold text-navy-dark">Prioridades (SLA)</h2>
                    </div>

                    <form onSubmit={handlePrioridadeSubmit} className="space-y-4 mb-8">
                        <input
                            type="text"
                            required
                            placeholder="Nome..."
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-lemon bg-gray-50 text-sm"
                            value={novaPrioridade.nome}
                            onChange={e => setNovaPrioridade({ ...novaPrioridade, nome: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <input
                                type="number"
                                required
                                placeholder="Horas"
                                className="flex-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-lemon bg-gray-50 text-sm"
                                value={novaPrioridade.tempoEstimadoHoras}
                                onChange={e => setNovaPrioridade({ ...novaPrioridade, tempoEstimadoHoras: Number(e.target.value) })}
                            />
                            <button type="submit" className="bg-navy-dark text-white px-6 rounded-xl font-bold shadow-md hover:bg-navy-light transition">
                                SALVAR
                            </button>
                        </div>
                    </form>

                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {prioridades.map(p => (
                            <div key={p.id} className="p-4 bg-gray-50 rounded-xl flex justify-between items-center group hover:bg-gray-100 transition">
                                <div>
                                    <p className="font-bold text-navy-dark">{p.nome}</p>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{p.tempoEstimadoHoras} Horas de Prazo</p>
                                </div>
                                <button
                                    onClick={() => deletarPrioridade(p.id, p.nome)}
                                    className="p-2 text-gray-300 hover:text-red-500 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TelaCadastros;