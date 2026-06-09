using CookieCorner.Api.Integrations.HyggeFrame;
using CookieCorner.Api.Models.Orders;
using CookieCorner.Api.Models.Products;
using CookieCorner.Api.Models.Storefront;

namespace CookieCorner.Api.Services.Orders;

internal static class OrderMapper
{
    public static Order Map(HyggeFrameOrderDto dto)
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
