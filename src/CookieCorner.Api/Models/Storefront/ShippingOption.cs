namespace CookieCorner.Api.Models.Storefront;

public sealed record ShippingOption(
    string Code,
    string DisplayName,
    decimal Price,
    int EstimatedDeliveryDays);
