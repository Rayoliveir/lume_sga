using Microsoft.EntityFrameworkCore;
using lume_sga.Data;
using lume_sga.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar o Banco de Dados (Adicione isso!)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Registrar o Service de Negócio
builder.Services.AddScoped<ChamadoService>();

builder.Services.AddControllers();

// Configuração do OpenAPI (Padrão .NET 9)
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure o pipeline de requisições
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    // Se quiser usar a interface visual do Swagger, podemos adicionar depois
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();