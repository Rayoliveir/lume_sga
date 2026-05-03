using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lume_sga.Data; // Importante para achar o AppDbContext

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
}