using CookieCorner.Api.Models.Products;

namespace CookieCorner.Api.Models.Cart;

public sealed record CartItem(
    int ProductId,
    string ProductName,
    BearSize? ProductSize,
    string? ProductColor,
    int Quantity,
    decimal UnitPrice,
    decimal LineTotal,
    ProductConfiguration? Configuration);
