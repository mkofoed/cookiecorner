using CookieCorner.Api.Integrations.HyggeFrame;
using CookieCorner.Api.Models.Orders;
using CookieCorner.Api.Models.Products;
using CookieCorner.Api.Models.Storefront;

namespace CookieCorner.Api.Services.Orders;

public sealed class OrderCheckoutService(
    IHyggeFrameApiClient hyggeFrameApiClient,
    IOrderHistoryStore orderHistoryStore) : IOrderCheckoutService
{
    public async Task<Order> PlaceOrderAsync(PlaceOrderRequest request, CancellationToken cancellationToken)
    {
        Validate(request);

        var hyggeFrameRequest = new HyggeFrameCreateOrderRequest
        {
            CustomerName = request.CustomerName,
            CustomerEmail = request.CustomerEmail,
            CustomerPhone = request.CustomerPhone,
            ShippingAddress = request.ShippingAddress,
            City = request.City,
            HyggeCountry = HyggeCountry.CookieCorner.ToString(),
            Notes = request.Notes,
            Items = request.Items.Select(item => new HyggeFrameOrderItemRequest
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity
            }).ToArray()
        };

        var order = await hyggeFrameApiClient.CreateOrderAsync(hyggeFrameRequest, cancellationToken);
        var mappedOrder = OrderMapper.Map(order);
        await orderHistoryStore.SaveAsync(mappedOrder, cancellationToken);

        return mappedOrder;
    }

    public async Task<Order?> RefreshOrderAsync(int id, CancellationToken cancellationToken)
    {
        var order = await hyggeFrameApiClient.GetOrderAsync(id, cancellationToken);

        if (order is null)
        {
            return null;
        }

        var mappedOrder = OrderMapper.Map(order);
        await orderHistoryStore.SaveAsync(mappedOrder, cancellationToken);

        return mappedOrder;
    }

    private static void Validate(PlaceOrderRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CustomerName))
        {
            throw new ArgumentException("Customer name is required.", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.CustomerEmail))
        {
            throw new ArgumentException("Customer email is required.", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.ShippingAddress))
        {
            throw new ArgumentException("Shipping address is required.", nameof(request));
        }

        if (string.IsNullOrWhiteSpace(request.City))
        {
            throw new ArgumentException("City is required.", nameof(request));
        }

        if (request.Items.Count == 0)
        {
            throw new ArgumentException("At least one order item is required.", nameof(request));
        }

        if (request.Items.Any(item => item.Quantity <= 0))
        {
            throw new ArgumentException("All order item quantities must be greater than zero.", nameof(request));
        }
    }
}
