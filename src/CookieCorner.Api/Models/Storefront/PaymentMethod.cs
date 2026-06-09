namespace CookieCorner.Api.Models.Storefront;

public sealed record PaymentMethod(
    string Code,
    string DisplayName,
    bool IsEnabled);
