import { useState } from 'react';
import { LogIn, Loader2 } from 'lucide-react';

export default function TelaLogin({ onLogin }) {
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    // Banco de dados fictício de funcionários no Front-end
    const funcionariosValidos = [
        { matricula: '1234', senha: '123', nome: 'Suporte Lume' },
        { matricula: '2026', senha: 'admin', nome: 'Coordenador SGA' }
    ];

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setErro('');
        setLoading(true);

        // Simula o delay da API (1.2 segundos)
        setTimeout(() => {
            const usuarioEncontrado = funcionariosValidos.find(
                f => f.matricula === matricula && f.senha === senha
            );

            if (usuarioEncontrado) {
                // Se achou, passa os dados do usuário para o App.jsx
                onLogin(usuarioEncontrado);
            } else {
                setErro('Matrícula ou senha incorretos.');
                setLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

                {/* Cabeçalho do Login */}
                <div className="text-center mb-8">
                    <div className="bg-navy-dark w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                        <LogIn className="text-lemon w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-navy-dark">LUME SGA</h2>
                    <p className="text-sm text-gray-400 mt-1">Insira suas credenciais para acessar o painel</p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Matrícula</label>
                        <input
                            type="text"
                            required
                            disabled={loading}
                            placeholder="Ex: 1234"
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-lemon bg-gray-50 text-sm disabled:opacity-50"
                            value={matricula}
                            onChange={e => setMatricula(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Senha</label>
                        <input
                            type="password"
                            required
                            disabled={loading}
                            placeholder="••••••"
                            className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-lemon bg-gray-50 text-sm disabled:opacity-50"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                        />
                    </div>

                    {/* Mensagem de Erro */}
                    {erro && (
                        <div className="bg-red-50 text-red-600 border border-red-100 text-xs p-3 rounded-xl font-medium">
                            {erro}
                        </div>
                    )}

                    {/* Botão de Entrar */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-navy-dark hover:bg-navy-light text-white font-bold p-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin text-lemon" />
                                Authenticating...
                            </>
                        ) : (
                            'Entrar no Sistema'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}