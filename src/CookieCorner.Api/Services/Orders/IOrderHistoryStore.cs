using CookieCorner.Api.Models.Orders;

namespace CookieCorner.Api.Services.Orders;

public interface IOrderHistoryStore
{
    Task SaveAsync(Order order, CancellationToken cancellationToken);

    Task<IReadOnlyCollection<Order>> GetOrdersAsync(CancellationToken cancellationToken);

    Task<Order?> GetOrderAsync(int id, CancellationToken cancellationToken);

    Task<Order?> GetOrderAsync(string orderNumber, CancellationToken cancellationToken);
}
