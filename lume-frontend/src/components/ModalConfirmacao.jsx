import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ModalConfirmacao({ show, titulo, mensagem, onConfirm, onCancel }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-navy-dark/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 text-center">
                    <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-xl font-black text-navy-dark mb-2">{titulo}</h2>
                    <p className="text-gray-500 text-sm mb-6">{mensagem}</p>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={onConfirm}
                            className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-100"
                        >
                            CONFIRMAR EXCLUSÃO
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full py-3 font-bold text-gray-400 hover:text-navy-dark transition"
                        >
                            CANCELAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}