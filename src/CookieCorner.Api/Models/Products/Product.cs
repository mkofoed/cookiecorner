namespace CookieCorner.Api.Models.Products;

public sealed record Product(
    int Id,
    string Name,
    string? Description,
    BearSize? Size,
    string? Color,
    decimal Price,
    int StockQuantity,
    bool IsAvailable,
    DateTimeOffset CreatedAt);
