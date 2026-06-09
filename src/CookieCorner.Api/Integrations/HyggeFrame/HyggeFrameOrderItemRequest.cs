using System.Text.Json.Serialization;

namespace CookieCorner.Api.Integrations.HyggeFrame;

public sealed class HyggeFrameOrderItemRequest
{
    [JsonPropertyName("productId")]
    public int ProductId { get; init; }

    [JsonPropertyName("quantity")]
    public int Quantity { get; init; }
}
