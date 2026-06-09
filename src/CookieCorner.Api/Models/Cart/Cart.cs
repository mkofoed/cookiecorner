namespace CookieCorner.Api.Models.Cart;

public sealed record Cart(
    Guid Id,
    IReadOnlyCollection<CartItem> Items,
    decimal SubtotalAmount,
    decimal TotalAmount);
