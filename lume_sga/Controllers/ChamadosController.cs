using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lume_sga.Data;
using lume_sga.Models;
using lume_sga.DTOs;
using lume_sga.Services;

namespace lume_sga.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ChamadosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ChamadoService _service;

    public ChamadosController(AppDbContext context, ChamadoService service)
    {
        _context = context;
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ChamadoReadDto>>> GetChamados()
    {
        var chamados = await _context.Chamados
            .Include(c => c.Setor)
            .Include(c => c.Prioridade)
            .ToListAsync();

        var retorno = chamados.Select(c => new ChamadoReadDto
        {
            Id = c.Id,
            Titulo = c.Titulo,
            SetorNome = c.Setor?.Nome ?? "N/A",
            PrioridadeNome = c.Prioridade?.Nome ?? "N/A",
            Status = c.Status,
            DataAbertura = c.DataAbertura,
            HorasDecorridas = c.DataHoraInicio.HasValue
                ? (c.DataHoraTermino ?? DateTime.Now).Subtract(c.DataHoraInicio.Value).TotalHours
                : 0,
            EstaAtrasado = c.DataHoraInicio.HasValue && !c.DataHoraTermino.HasValue &&
                (DateTime.Now - c.DataHoraInicio.Value).TotalHours > (c.Prioridade?.TempoEstimadoHoras ?? 0)
        });

        return Ok(retorno);
    }

    public class FinalizarChamadoDto
    {
        public string Solucao { get; set; } = string.Empty;
    }


    [HttpPost]
    public async Task<ActionResult> AbrirChamado(ChamadoCreateDto dto)
    {
        var chamado = new Chamado
        {
            Titulo = dto.Titulo,
            Descricao = dto.Descricao,
            SetorId = dto.SetorId,
            PrioridadeId = dto.PrioridadeId,
            Status = StatusChamado.Aberto
        };

        _context.Chamados.Add(chamado);
        await _context.SaveChangesAsync();
        return Ok(chamado);
    }

    [HttpPost("{id}/check-in")]
    public async Task<IActionResult> CheckIn(int id)
    {
        var sucesso = await _service.RealizarCheckIn(id);
        if (!sucesso) return BadRequest("Não foi possível iniciar o chamado. Verifique o ID ou Status.");
        return Ok("Atendimento iniciado com sucesso!");
    }

    [HttpPost("{id}/check-out")]
    public async Task<IActionResult> CheckOut(int id, [FromBody] FinalizarChamadoDto dto)
    {
        var sucesso = await _service.RealizarCheckOut(id, dto.Solucao);

        if (!sucesso)
            return BadRequest("Erro ao finalizar. O chamado deve estar 'Iniciado'.");

        return Ok("Chamado finalizado com sucesso!");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateChamado(int id, [FromBody] Chamado chamadoAtualizado)
    {
        if (id != chamadoAtualizado.Id) return BadRequest("ID divergente.");

        var chamadoNoBanco = await _context.Chamados.FindAsync(id);
        if (chamadoNoBanco == null) return NotFound();

        chamadoNoBanco.Titulo = chamadoAtualizado.Titulo;
        chamadoNoBanco.SetorId = chamadoAtualizado.SetorId;
        chamadoNoBanco.PrioridadeId = chamadoAtualizado.PrioridadeId;
        chamadoNoBanco.Descricao = chamadoAtualizado.Descricao;
        chamadoNoBanco.Status = chamadoAtualizado.Status; 

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ChamadoExists(id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteChamado(int id)
    {
        var chamado = await _context.Chamados.FindAsync(id);
        if (chamado == null) return NotFound();

        chamado.Status = StatusChamado.Cancelado;

        _context.Entry(chamado).State = EntityState.Modified;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool ChamadoExists(int id) => _context.Chamados.Any(e => e.Id == id);
}