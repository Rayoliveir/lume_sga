namespace lume_sga.Models {
    public enum StatusChamado { Aberto, Iniciado, Finalizado, Cancelado }
    public class Chamado {
        public int Id { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;

        
        public int SetorId { get; set; }
        public Setor? Setor { get; set; }

        public int PrioridadeId { get; set; }
        public Prioridade? Prioridade { get; set; }

        public StatusChamado Status { get; set; } = StatusChamado.Aberto;
        public DateTime DataAbertura { get; set; } = DateTime.Now;
        public DateTime? DataHoraInicio { get; set; }
        public DateTime? DataHoraTermino { get; set; }
        public string? SolucaoAplicada { get; set; }
    }
}