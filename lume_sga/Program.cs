using Microsoft.EntityFrameworkCore;
using lume_sga.Data;
using lume_sga.Services;
using lume_sga.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ChamadoService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        builder => builder.WithOrigins("http://localhost:5173") 
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

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<lume_sga.Data.AppDbContext>();

        context.Database.EnsureCreated();
        Console.WriteLine("Banco de dados verificado/criado com sucesso!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao criar o banco: {ex.Message}");
    }
}

app.Run();