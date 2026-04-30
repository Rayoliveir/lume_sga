using lume_sga.Data;
using lume_sga.Models;

namespace lume_sga.Services; // Verifique se esta linha está IGUAL a esta

public class ChamadoService
{
    private readonly AppDbContext _context;

    public ChamadoService(AppDbContext context) => _context = context;

    public async Task<bool> RealizarCheckIn(int chamadoId) {
        var chamado = await _context.Chamados.FindAsync(chamadoId);

        if (chamado == null || chamado.Status == StatusChamado.Finalizado || chamado.Status == StatusChamado.Cancelado)
            return false;

        chamado.DataHoraInicio = DateTime.Now;
        chamado.Status = StatusChamado.Iniciado;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RealizarCheckOut(int chamadoId, string solucao)
    {
        var chamado = await _context.Chamados.FindAsync(chamadoId);

        // Validação: Permitir apenas chamados que já foram "Iniciados"
        if (chamado == null || chamado.Status != StatusChamado.Iniciado)
            return false;

        chamado.DataHoraTermino = DateTime.Now;
        chamado.SolucaoAplicada = solucao;
        chamado.Status = StatusChamado.Finalizado;

        await _context.SaveChangesAsync();
        return true;
    }
}