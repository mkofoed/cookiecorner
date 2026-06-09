using CookieCorner.Api.Models.Orders;

namespace CookieCorner.Api.Services.Orders;

public interface IOrderCheckoutService
{
    Task<Order> PlaceOrderAsync(PlaceOrderRequest request, CancellationToken cancellationToken);

    Task<Order?> RefreshOrderAsync(int id, CancellationToken cancellationToken);
}
