using lume_sga.Models;

namespace lume_sga.DTOs;

public class ChamadoReadDto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string SetorNome { get; set; } = string.Empty;
    public string PrioridadeNome { get; set; } = string.Empty;
    public StatusChamado Status { get; set; }
    public DateTime DataAbertura { get; set; }
    public double HorasDecorridas { get; set; }
    public bool EstaAtrasado { get; set; }
}