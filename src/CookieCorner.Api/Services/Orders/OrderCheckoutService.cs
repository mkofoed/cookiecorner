using CookieCorner.Api.Integrations.HyggeFrame;
using CookieCorner.Api.Models.Orders;
using CookieCorner.Api.Models.Products;
using CookieCorner.Api.Models.Storefront;

namespace CookieCorner.Api.Services.Orders;

public sealed class OrderCheckoutService(IHyggeFrameApiClient hyggeFrameApiClient) : IOrderCheckoutService
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
        return Map(order);
    }

    private static Order Map(HyggeFrameOrderDto dto)
    {
        return new Order(
            dto.Id,
            dto.OrderNumber ?? string.Empty,
            dto.CustomerId,
            dto.CustomerName ?? string.Empty,
            dto.CustomerEmail ?? string.Empty,
            ParseCountry(dto.HyggeCountry),
            ParseStatus(dto.Status),
            dto.Notes,
            dto.ShippingAddress ?? string.Empty,
            dto.TotalAmount,
            dto.CreatedAt,
            dto.UpdatedAt,
            dto.Items?.Select(item => new OrderItem(
                item.Id,
                item.ProductId,
                item.ProductName ?? string.Empty,
                ParseBearSize(item.ProductSize),
                item.ProductColor,
                item.Quantity,
                item.UnitPrice,
                item.LineTotal,
                null)).ToArray() ?? []);
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

    private static BearSize? ParseBearSize(string? size)
    {
        return Enum.TryParse<BearSize>(size, ignoreCase: true, out var parsedSize)
            ? parsedSize
            : null;
    }

    private static HyggeCountry ParseCountry(string? country)
    {
        return Enum.TryParse<HyggeCountry>(country, ignoreCase: true, out var parsedCountry)
            ? parsedCountry
            : HyggeCountry.CookieCorner;
    }

    private static OrderStatus ParseStatus(string? status)
    {
        return Enum.TryParse<OrderStatus>(status, ignoreCase: true, out var parsedStatus)
            ? parsedStatus
            : OrderStatus.Pending;
    }
}
