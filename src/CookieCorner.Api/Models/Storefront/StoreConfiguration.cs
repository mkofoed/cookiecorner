namespace CookieCorner.Api.Models.Storefront;

public sealed record StoreConfiguration(
    HyggeCountry Country,
    string CurrencyCode,
    string Locale,
    IReadOnlyCollection<ShippingOption> ShippingOptions,
    IReadOnlyCollection<PaymentMethod> PaymentMethods);
