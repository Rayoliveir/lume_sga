using lume_sga.Data;
using lume_sga.Models;
using Microsoft.AspNetCore.Mvc;

namespace lume_sga.Controllers
{
    public class SetoresController {
        using Microsoft.AspNetCore.Mvc;
        using Microsoft.EntityFrameworkCore;
        using lume_sga.Data;
        using lume_sga.Models;

namespace lume_sga.Controllers;

    [ApiController]
    [Route("api/[controller]")]
    public class SetoresController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SetoresController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Setor>>> GetSetores()
            => await _context.Setores.ToListAsync();

        [HttpPost]
        public async Task<ActionResult<Setor>> CreateSetor(Setor setor)
        {
            _context.Setores.Add(setor);
            await _context.SaveChangesAsync();
            return Ok(setor);
        }
    }
}
}
