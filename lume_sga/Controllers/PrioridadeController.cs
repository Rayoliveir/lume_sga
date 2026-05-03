using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lume_sga.Data;
using lume_sga.Models;

namespace lume_sga.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PrioridadesController : ControllerBase
{
    private readonly AppDbContext _context;

    public PrioridadesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult> GetPrioridades()
    {
        var prioridades = await _context.Prioridades.ToListAsync();
        return Ok(prioridades);
    }

    [HttpPost]
    public async Task<IActionResult> CriarPrioridade([FromBody] Prioridade prioridade)
    {
        _context.Prioridades.Add(prioridade);
        await _context.SaveChangesAsync();
        return Ok(prioridade);
    }
}