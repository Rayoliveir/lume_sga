import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ModalChamado({
    isOpen,
    fecharModal,
    editandoId,
    handleSubmit,
    novoChamado,
    setNovoChamado,
    setores,
    prioridades,
    deletarChamado
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-navy-dark/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className={`p-6 text-white flex justify-between items-center ${editandoId ? 'bg-blue-600' : 'bg-navy-dark'}`}>
                    <h2 className="text-xl font-bold">{editandoId ? `Editar Chamado #${editandoId}` : 'Novo Atendimento'}</h2>
                    <button onClick={fecharModal}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-navy-dark mb-1">Título</label>
                        <input type="text" required value={novoChamado.titulo} onChange={e => setNovoChamado({ ...novoChamado, titulo: e.target.value })} className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-lemon" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-navy-dark mb-1">Setor</label>
                        <select required value={novoChamado.setorId} onChange={e => setNovoChamado({ ...novoChamado, setorId: e.target.value })} className="w-full border rounded-lg p-2 outline-none">
                            <option value="">Selecione...</option>
                            {setores.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-navy-dark mb-1">Prioridade</label>
                        <select required value={novoChamado.prioridadeId} onChange={e => setNovoChamado({ ...novoChamado, prioridadeId: e.target.value })} className="w-full border rounded-lg p-2 outline-none">
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
                            <button type="button" onClick={() => deletarChamado(editandoId)} className="w-full mt-2 py-2 text-red-500 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-50 rounded-lg transition">
                                <Trash2 size={14} /> EXCLUIR CHAMADO
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
