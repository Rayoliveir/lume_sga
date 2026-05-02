using Microsoft.EntityFrameworkCore;
using lume_sga.Data;
using lume_sga.Services;
using lume_sga.Models;

var builder = WebApplication.CreateBuilder(args);

// Banco de Dados
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<ChamadoService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

var app = builder.Build();

//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Lume SGA v1");
        c.RoutePrefix = string.Empty;
    });
//}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();