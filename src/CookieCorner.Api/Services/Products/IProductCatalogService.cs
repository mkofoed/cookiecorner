using CookieCorner.Api.Models.Products;

namespace CookieCorner.Api.Services.Products;

public interface IProductCatalogService
{
    Task<IReadOnlyList<Product>> GetProductsAsync(CancellationToken cancellationToken);

    Task<Product?> GetProductAsync(int id, CancellationToken cancellationToken);
}
