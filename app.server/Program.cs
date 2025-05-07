using app.server.Models;
using Microsoft.EntityFrameworkCore;
using app.server.Mappers;

var builder = WebApplication.CreateBuilder(args);

// Add CORS with more secure defaults
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins(
            "http://localhost:5173",
            "https://localhost:5173",
            "http://localhost:5158",
            "https://localhost:5158",
            "http://localhost:5174",
            "https://localhost:5174",
            "http://localhost:3000",
            "https://localhost:3000",
            "http://localhost:5175",
            "https://localhost:5175"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Configure JSON serialization
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.WriteIndented = true;
        options.JsonSerializerOptions.IgnoreNullValues = true;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<IndustryConnectObdContext>(option =>
    option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnectionString")));

// Register mappers
builder.Services.AddScoped<SaleMapper>();

var app = builder.Build();

// Configure the HTTP request pipeline.
// Always enable Swagger for troubleshooting
app.UseSwagger();
app.UseSwaggerUI(options => 
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty; // Make Swagger UI the root page
});

// Use CORS before other middleware
app.UseCors();

// app.UseHttpsRedirection();  // 临时禁用HTTPS重定向解决CORS问题

app.MapControllers();

// Use port 5158 to match frontend configuration
app.Urls.Add("http://localhost:5158");

app.Run();
