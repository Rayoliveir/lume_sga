using Microsoft.EntityFrameworkCore;
using lume_sga.Models;

namespace lume_sga.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Setor> Setores { get; set; }
    public DbSet<Prioridade> Prioridades { get; set; }
    public DbSet<Chamado> Chamados { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Seed: Popula o banco com as prioridades padrão conforme seu requisito
        modelBuilder.Entity<Prioridade>().HasData(
            new Prioridade { Id = 1, Nome = "Baixa", TempoEstimadoHoras = 48 },
            new Prioridade { Id = 2, Nome = "Média", TempoEstimadoHoras = 24 },
            new Prioridade { Id = 3, Nome = "Alta", TempoEstimadoHoras = 4 }
        );
    }
}