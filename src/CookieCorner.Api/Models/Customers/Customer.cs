using CookieCorner.Api.Models.Storefront;

namespace CookieCorner.Api.Models.Customers;

public sealed record Customer(
    int Id,
    string Name,
    string Email,
    string? PhoneNumber,
    string ShippingAddress,
    string City,
    HyggeCountry Country,
    DateTimeOffset CreatedAt);
