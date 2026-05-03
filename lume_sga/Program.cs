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

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        builder => builder.WithOrigins("http://localhost:5173") // Porta padrão do Vite
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

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
app.UseCors("AllowReact");
app.MapControllers();

app.Run();