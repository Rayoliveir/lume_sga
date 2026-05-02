import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChamados();
  }, []);

  const fetchChamados = async () => {
    try {
      const response = await axios.get(`${API_URL}/Chamados`);
      setChamados(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar chamados:", error);
      setLoading(false);
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

      {/* Conteúdo Principal */}
      <main className="ml-20 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-navy-dark italic">LUME <span className="text-navy-light font-light">SGA</span></h1>
            <p className="text-gray-500">Sistema de Gestão de Atendimentos</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Buscar chamado..." 
                className="pl-10 pr-4 py-2 rounded-lg border-none bg-white shadow-sm focus:ring-2 focus:ring-lemon outline-none transition w-64"
              />
            </div>
            <button className="bg-lemon text-navy-dark px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all">
              <Plus size={20} /> NOVO CHAMADO
            </button>
          </div>
        </header>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card 
            title="Total Geral" 
            value={chamados.length} 
            icon={<LayoutDashboard className="text-navy-light" />} 
          />
          <Card 
            title="Em Aberto" 
            value={abertos} 
            icon={<Clock className="text-blue-500" />} 
          />
          <Card 
            title="Atrasados (SLA)" 
            value={atrasados} 
            icon={<AlertTriangle className="text-red-500" />} 
            isCritical={atrasados > 0}
          />
        </div>

        {/* Lista de Chamados */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-navy-light text-white">
              <tr>
                <th className="p-5 font-semibold">CÓD</th>
                <th className="p-5 font-semibold">TÍTULO</th>
                <th className="p-5 font-semibold">SETOR</th>
                <th className="p-5 font-semibold">STATUS</th>
                <th className="p-5 font-semibold">SLA</th>
                <th className="p-5 font-semibold text-center">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {chamados.map((c) => (
                <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${c.estaAtrasado ? 'bg-red-50/30' : ''}`}>
                  <td className="p-5 text-gray-400 font-mono text-sm">#{c.id}</td>
                  <td className="p-5">
                    <p className="font-bold text-navy-dark">{c.titulo}</p>
                    <p className="text-xs text-gray-400">{new Date(c.dataAbertura).toLocaleString()}</p>
                  </td>
                  <td className="p-5 text-gray-600 font-medium">{c.setorNome}</td>
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
                      <button className="bg-navy-dark text-white text-xs px-4 py-2 rounded hover:bg-navy-light transition">CHECK-IN</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {chamados.length === 0 && !loading && (
            <div className="p-10 text-center text-gray-400 italic">Nenhum chamado encontrado no banco de dados.</div>
          )}
        </div>
      </main>
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
  const styles = {
    0: "bg-blue-100 text-blue-700", 
    1: "bg-amber-100 text-amber-700", 
    2: "bg-green-100 text-green-700", 
  };
  const labels = { 0: "Aberto", 1: "Em Progresso", 2: "Concluído" };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

export default App;