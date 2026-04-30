using Microsoft.EntityFrameworkCore;
using lume_sga.Data;
using lume_sga.Services;
using lume_sga.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Banco de Dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Services
builder.Services.AddScoped<ChamadoService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 3. Swagger Simplificado (Sem usar o namespace Microsoft.OpenApi.Models)
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 4. Interface Visual
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Lume SGA v1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();