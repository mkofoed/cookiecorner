namespace CookieCorner.Api.Models.Orders;

public sealed record PlaceOrderRequest(
    string CustomerName,
    string CustomerEmail,
    string? CustomerPhone,
    string ShippingAddress,
    string City,
    string? Notes,
    IReadOnlyCollection<PlaceOrderItemRequest> Items);
