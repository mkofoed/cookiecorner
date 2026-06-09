using CookieCorner.Api.Configuration;
using CookieCorner.Api.Integrations.HyggeFrame;
using CookieCorner.Api.Services.Orders;
using CookieCorner.Api.Services.Products;
using System.Text.Json.Serialization;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

builder.Services.Configure<HyggeFrameOptions>(
    builder.Configuration.GetSection(HyggeFrameOptions.SectionName));
builder.Services.Configure<RedisOptions>(
    builder.Configuration.GetSection(RedisOptions.SectionName));
builder.Services.AddHttpClient<IHyggeFrameApiClient, HyggeFrameApiClient>();
builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
{
    var connectionString =
        builder.Configuration[$"{RedisOptions.SectionName}:ConnectionString"]
        ?? "redis:6379,abortConnect=false";

    return ConnectionMultiplexer.Connect(connectionString);
});
builder.Services.AddSingleton<IOrderHistoryStore, RedisOrderHistoryStore>();
builder.Services.AddScoped<IOrderCheckoutService, OrderCheckoutService>();
builder.Services.AddScoped<IProductCatalogService, ProductCatalogService>();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
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
