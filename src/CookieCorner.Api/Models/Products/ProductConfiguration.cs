namespace CookieCorner.Api.Models.Products;

public sealed record ProductConfiguration(
    IReadOnlyCollection<ProductOption> SelectedOptions,
    string? Notes);
