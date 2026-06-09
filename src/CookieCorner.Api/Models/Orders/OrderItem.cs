using CookieCorner.Api.Models.Products;

namespace CookieCorner.Api.Models.Orders;

public sealed record OrderItem(
    int Id,
    int ProductId,
    string ProductName,
    BearSize? ProductSize,
    string? ProductColor,
    int Quantity,
    decimal UnitPrice,
    decimal LineTotal,
    ProductConfiguration? Configuration);
