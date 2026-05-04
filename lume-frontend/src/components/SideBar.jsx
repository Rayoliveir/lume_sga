import React from 'react';
import { LayoutDashboard, BarChart3, Settings } from 'lucide-react';

export default function Sidebar({ abaAtiva, setAbaAtiva }) {
    return (
        <nav className="fixed top-0 left-0 h-full w-20 bg-navy-dark flex flex-col items-center py-8 gap-8 text-white shadow-2xl z-30">
            <div className="text-lemon font-black text-2xl tracking-tighter">L</div>

            <div className="flex flex-col gap-6 flex-1">
                <button
                    onClick={() => setAbaAtiva('DASHBOARD')}
                    title="Gestão de Chamados"
                    className={`p-3 rounded-xl transition-all duration-300 ${abaAtiva === 'DASHBOARD'
                            ? 'bg-navy-light text-lemon shadow-lg scale-110'
                            : 'hover:text-lemon opacity-50 hover:opacity-100'
                        }`}
                >
                    <LayoutDashboard size={24} />
                </button>

                <button
                    onClick={() => setAbaAtiva('RELATORIOS')}
                    title="Relatórios e SLA"
                    className={`p-3 rounded-xl transition-all duration-300 ${abaAtiva === 'RELATORIOS'
                            ? 'bg-navy-light text-lemon shadow-lg scale-110'
                            : 'hover:text-lemon opacity-50 hover:opacity-100'
                        }`}
                >
                    <BarChart3 size={24} />
                </button>

                <button
                    onClick={() => setAbaAtiva('CADASTROS')}
                    title="Configurações de Cadastro"
                    className={`p-3 rounded-xl transition-all duration-300 ${abaAtiva === 'CADASTROS'
                            ? 'bg-navy-light text-lemon shadow-lg scale-110'
                            : 'hover:text-lemon opacity-50 hover:opacity-100'
                        }`}
                >
                    <Settings size={24} />
                </button>
            </div>

            {/*<div className="w-8 h-8 rounded-full bg-navy-light border border-white/10" />*/}
        </nav>
    );
}