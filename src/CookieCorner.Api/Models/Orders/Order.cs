using CookieCorner.Api.Models.Storefront;

namespace CookieCorner.Api.Models.Orders;

public sealed record Order(
    int Id,
    string OrderNumber,
    int CustomerId,
    string CustomerName,
    string CustomerEmail,
    HyggeCountry Country,
    OrderStatus Status,
    string? Notes,
    string ShippingAddress,
    decimal TotalAmount,
    DateTimeOffset CreatedAt,
    DateTimeOffset UpdatedAt,
    IReadOnlyCollection<OrderItem> Items);
