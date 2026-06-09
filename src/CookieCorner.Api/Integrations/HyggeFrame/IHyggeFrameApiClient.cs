namespace CookieCorner.Api.Integrations.HyggeFrame;

public interface IHyggeFrameApiClient
{
    Task<IReadOnlyList<HyggeFrameProductDto>> GetProductsAsync(CancellationToken cancellationToken);

    Task<HyggeFrameProductDto?> GetProductAsync(int id, CancellationToken cancellationToken);

    Task<HyggeFrameOrderDto?> GetOrderAsync(int id, CancellationToken cancellationToken);

    Task<HyggeFrameOrderDto> CreateOrderAsync(
        HyggeFrameCreateOrderRequest request,
        CancellationToken cancellationToken);
}
