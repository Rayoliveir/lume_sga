using Microsoft.EntityFrameworkCore;
using lume_sga.Data;
using lume_sga.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ChamadoService>();

builder.Services.AddControllers();

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();