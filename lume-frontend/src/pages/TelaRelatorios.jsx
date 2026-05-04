import React from 'react';
import {
    BarChart3,
    PieChart as PieIcon,
    Clock,
    AlertTriangle,
    CheckCircle
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    //Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';

export default function TelaRelatorios({ chamados, setores }) {

    const prepararDadosRelatorio = () => {
        const statusData = [
            { name: 'Abertos', value: chamados.filter(c => c.status === 0).length, color: '#3b82f6' },
            { name: 'Em Processo', value: chamados.filter(c => c.status === 1).length, color: '#f59e0b' },
            { name: 'Concluídos', value: chamados.filter(c => c.status === 2).length, color: '#10b981' },
            { name: 'Cancelados', value: chamados.filter(c => c.status === 3).length, color: '#ef4444' },
        ];

        const setorMap = {};
        setores.forEach(s => {
            setorMap[s.nome] = { nome: s.nome, total: 0, Alta: 0, Media: 0, Baixa: 0 };
        });

        chamados.forEach(c => {
            const nomeSetor = c.setorNome || "N/A";
            if (setorMap[nomeSetor]) {
                setorMap[nomeSetor].total += 1;
                const pNome = c.prioridadeNome;
                if (setorMap[nomeSetor][pNome] !== undefined) {
                    setorMap[nomeSetor][pNome] += 1;
                }
            }
        });

        const barData = Object.values(setorMap).sort((a, b) => b.total - a.total);
        return { statusData, barData };
    };

    const { statusData, barData } = prepararDadosRelatorio();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold text-navy-dark">
                    Indicadores <span className="text-navy-light font-light">Estratégicos</span>
                </h1>
                <p className="text-gray-500">Visão em tempo real da performance de atendimento</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Chamados" value={chamados.length} icon={<BarChart3 />} color="bg-blue-500" />
                <StatCard title="Em Aberto" value={statusData[0].value} icon={<Clock />} color="bg-amber-500" />
                <StatCard title="Concluídos" value={statusData[2].value} icon={<CheckCircle />} color="bg-emerald-500" />
                <StatCard title="Críticos" value={chamados.filter(c => c.prioridadeNome === 'Alta').length} icon={<AlertTriangle />} color="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <h3 className="text-xl font-black text-navy-dark mb-6 flex items-center gap-2">
                        <PieIcon className="text-lemon" /> Distribuição por Status
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                    <h3 className="text-xl font-black text-navy-dark mb-6">Volume por Setor</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="nome" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="total" fill="#1e293b" radius={[10, 10, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-50 flex items-center gap-5">
            <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>
                {React.cloneElement(icon, { size: 28 })}
            </div>
            <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-black text-navy-dark">{value}</p>
            </div>
        </div>
    );
}