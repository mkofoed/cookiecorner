using System.Text.Json;
using System.Text.Json.Serialization;
using CookieCorner.Api.Models.Orders;
using StackExchange.Redis;
using StoredOrder = CookieCorner.Api.Models.Orders.Order;

namespace CookieCorner.Api.Services.Orders;

public sealed class RedisOrderHistoryStore(IConnectionMultiplexer connectionMultiplexer) : IOrderHistoryStore
{
    private const string OrderHashKey = "cookiecorner:orders";
    private const string OrderIdHashKey = "cookiecorner:orders:ids";
    private const string OrderIndexKey = "cookiecorner:orders:index";
    private static readonly JsonSerializerOptions JsonSerializerOptions = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() }
    };

    public async Task SaveAsync(StoredOrder order, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var database = connectionMultiplexer.GetDatabase();
        var orderKey = GetOrderKey(order);
        var payload = JsonSerializer.Serialize(order, JsonSerializerOptions);

        var transaction = database.CreateTransaction();
        _ = transaction.HashSetAsync(OrderHashKey, orderKey, payload);
        _ = transaction.HashSetAsync(OrderIdHashKey, order.Id, orderKey);
        _ = transaction.SortedSetAddAsync(
            OrderIndexKey,
            orderKey,
            order.CreatedAt.ToUnixTimeMilliseconds());

        await transaction.ExecuteAsync();
    }

    public async Task<IReadOnlyCollection<StoredOrder>> GetOrdersAsync(CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var database = connectionMultiplexer.GetDatabase();
        var orderKeys = await database.SortedSetRangeByRankAsync(
            OrderIndexKey,
            0,
            99,
            StackExchange.Redis.Order.Descending);

        if (orderKeys.Length == 0)
        {
            return [];
        }

        var values = await database.HashGetAsync(OrderHashKey, orderKeys);
        return values
            .Where(value => value.HasValue)
            .Select(value => JsonSerializer.Deserialize<StoredOrder>(value.ToString(), JsonSerializerOptions))
            .OfType<StoredOrder>()
            .ToArray();
    }

    public async Task<StoredOrder?> GetOrderAsync(string orderNumber, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var database = connectionMultiplexer.GetDatabase();
        var value = await database.HashGetAsync(OrderHashKey, orderNumber);

        if (!value.HasValue)
        {
            return null;
        }

        return JsonSerializer.Deserialize<StoredOrder>(value.ToString(), JsonSerializerOptions);
    }

    public async Task<StoredOrder?> GetOrderAsync(int id, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var database = connectionMultiplexer.GetDatabase();
        var orderKey = await database.HashGetAsync(OrderIdHashKey, id);

        if (!orderKey.HasValue)
        {
            return null;
        }

        return await GetOrderAsync(orderKey.ToString(), cancellationToken);
    }

    private static string GetOrderKey(StoredOrder order)
    {
        return string.IsNullOrWhiteSpace(order.OrderNumber)
            ? order.Id.ToString()
            : order.OrderNumber;
    }
}
