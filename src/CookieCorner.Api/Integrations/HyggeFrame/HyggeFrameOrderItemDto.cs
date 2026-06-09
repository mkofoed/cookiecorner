using System.Text.Json.Serialization;

namespace CookieCorner.Api.Integrations.HyggeFrame;

public sealed class HyggeFrameOrderItemDto
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("productId")]
    public int ProductId { get; init; }

    [JsonPropertyName("productName")]
    public string? ProductName { get; init; }

    [JsonPropertyName("productSize")]
    public string? ProductSize { get; init; }

    [JsonPropertyName("productColor")]
    public string? ProductColor { get; init; }

    [JsonPropertyName("quantity")]
    public int Quantity { get; init; }

    [JsonPropertyName("unitPrice")]
    public decimal UnitPrice { get; init; }

    [JsonPropertyName("lineTotal")]
    public decimal LineTotal { get; init; }
}
