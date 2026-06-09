using CookieCorner.Api.Configuration;
using CookieCorner.Api.Integrations.HyggeFrame;
using CookieCorner.Api.Services.Products;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

builder.Services.Configure<HyggeFrameOptions>(
    builder.Configuration.GetSection(HyggeFrameOptions.SectionName));
builder.Services.AddHttpClient<IHyggeFrameApiClient, HyggeFrameApiClient>();
builder.Services.AddScoped<IProductCatalogService, ProductCatalogService>();
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
