namespace lume_sga.DTOs;

public record ChamadoCreateDto(
    string Titulo,
    string Descricao,
    int SetorId,
    int PrioridadeId
);