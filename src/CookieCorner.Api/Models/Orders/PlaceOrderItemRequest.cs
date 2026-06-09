namespace CookieCorner.Api.Models.Orders;

public sealed record PlaceOrderItemRequest(
    int ProductId,
    int Quantity);
