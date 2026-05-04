import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function ModalFinalizar({ show, solucao, setSolucao, onCancel, onConfirm }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-navy-dark/90 backdrop-blur-md flex items-center justify-center z-[55] p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-emerald-100 p-4 rounded-3xl">
                            <CheckCircle size={32} className="text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-navy-dark">Finalizar Chamado</h2>
                            <p className="text-gray-500 font-medium">O que foi feito para resolver?</p>
                        </div>
                    </div>

                    <textarea
                        className="w-full h-40 bg-alice rounded-3xl p-6 outline-none focus:ring-4 focus:ring-emerald-100 transition-all border-none resize-none text-navy-dark font-medium"
                        placeholder="Descreva a solução técnica aqui..."
                        value={solucao}
                        onChange={(e) => setSolucao(e.target.value)}
                    />

                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-4 font-bold text-gray-400 hover:text-navy-dark transition"
                        >
                            CANCELAR
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={!solucao}
                            className="flex-[2] bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition disabled:opacity-30"
                        >
                            CONFIRMAR E FINALIZAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}