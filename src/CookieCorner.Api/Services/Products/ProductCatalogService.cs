using CookieCorner.Api.Integrations.HyggeFrame;
using CookieCorner.Api.Models.Products;

namespace CookieCorner.Api.Services.Products;

public sealed class ProductCatalogService(IHyggeFrameApiClient hyggeFrameApiClient) : IProductCatalogService
{
    public async Task<IReadOnlyList<Product>> GetProductsAsync(CancellationToken cancellationToken)
    {
        var products = await hyggeFrameApiClient.GetProductsAsync(cancellationToken);
        return products.Select(Map).ToArray();
    }

    public async Task<Product?> GetProductAsync(int id, CancellationToken cancellationToken)
    {
        var product = await hyggeFrameApiClient.GetProductAsync(id, cancellationToken);
        return product is null ? null : Map(product);
    }

    private static Product Map(HyggeFrameProductDto dto)
    {
        return new Product(
            dto.Id,
            dto.Name ?? "Unnamed Hyggefis",
            dto.Description,
            ParseBearSize(dto.Size),
            dto.Color,
            dto.Price,
            dto.StockQuantity,
            dto.IsAvailable,
            dto.CreatedAt);
    }

    private static BearSize? ParseBearSize(string? size)
    {
        return Enum.TryParse<BearSize>(size, ignoreCase: true, out var parsedSize)
            ? parsedSize
            : null;
    }
}
