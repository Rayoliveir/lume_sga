using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lume_sga.Data;
using lume_sga.Models;
using lume_sga.DTOs;
using lume_sga.Services;

namespace lume_sga.Controllers;

[ApiController]
[Route("api/[controller]")]
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
            // Lógica de SLA: Se iniciado, calcula horas desde o início. Se finalizado, usa o tempo total.
            HorasDecorridas = c.DataHoraInicio.HasValue
                ? (c.DataHoraTermino ?? DateTime.Now).Subtract(c.DataHoraInicio.Value).TotalHours
                : 0,
            EstaAtrasado = c.DataHoraInicio.HasValue && !c.DataHoraTermino.HasValue &&
                (DateTime.Now - c.DataHoraInicio.Value).TotalHours > (c.Prioridade?.TempoEstimadoHoras ?? 0)
        });

        return Ok(retorno);
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
}