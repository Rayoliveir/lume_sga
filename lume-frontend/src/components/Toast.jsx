import React from 'react';
import { CheckCircle, Trash2 } from 'lucide-react';

export default function Toast({ show, mensagem, tipo }) {
    if (!show) return null;

    return (
        <div className="fixed bottom-10 right-10 z-[60] animate-in slide-in-from-right-10 duration-300">
            <div className={`
                ${tipo === 'erro' ? 'bg-red-600 border-red-400' : 'bg-navy-dark border-lemon'} 
                border-l-4 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 transition-colors duration-500
            `}>
                <div className={`${tipo === 'erro' ? 'bg-white/20' : 'bg-lemon/20'} p-2 rounded-full`}>
                    {tipo === 'erro' ? (
                        <Trash2 size={24} className="text-white" />
                    ) : (
                        <CheckCircle size={24} className="text-lemon" />
                    )}
                </div>
                <div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-50">
                        {tipo === 'erro' ? 'Removido' : 'Sucesso'}
                    </p>
                    <p className="font-bold">{mensagem}</p>
                </div>
            </div>
        </div>
    );
}