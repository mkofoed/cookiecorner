using System.Text.Json.Serialization;

namespace CookieCorner.Api.Integrations.HyggeFrame;

public sealed class HyggeFrameCreateOrderRequest
{
    [JsonPropertyName("customerName")]
    public required string CustomerName { get; init; }

    [JsonPropertyName("customerEmail")]
    public required string CustomerEmail { get; init; }

    [JsonPropertyName("customerPhone")]
    public string? CustomerPhone { get; init; }

    [JsonPropertyName("shippingAddress")]
    public required string ShippingAddress { get; init; }

    [JsonPropertyName("city")]
    public required string City { get; init; }

    [JsonPropertyName("hyggeCountry")]
    public required string HyggeCountry { get; init; }

    [JsonPropertyName("items")]
    public required IReadOnlyCollection<HyggeFrameOrderItemRequest> Items { get; init; }

    [JsonPropertyName("notes")]
    public string? Notes { get; init; }
}
