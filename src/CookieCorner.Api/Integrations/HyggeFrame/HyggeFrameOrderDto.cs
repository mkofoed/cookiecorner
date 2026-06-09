using System.Text.Json.Serialization;

namespace CookieCorner.Api.Integrations.HyggeFrame;

public sealed class HyggeFrameOrderDto
{
    [JsonPropertyName("id")]
    public int Id { get; init; }

    [JsonPropertyName("orderNumber")]
    public string? OrderNumber { get; init; }

    [JsonPropertyName("customerId")]
    public int CustomerId { get; init; }

    [JsonPropertyName("customerName")]
    public string? CustomerName { get; init; }

    [JsonPropertyName("customerEmail")]
    public string? CustomerEmail { get; init; }

    [JsonPropertyName("hyggeCountry")]
    public string? HyggeCountry { get; init; }

    [JsonPropertyName("status")]
    public string? Status { get; init; }

    [JsonPropertyName("notes")]
    public string? Notes { get; init; }

    [JsonPropertyName("shippingAddress")]
    public string? ShippingAddress { get; init; }

    [JsonPropertyName("totalAmount")]
    public decimal TotalAmount { get; init; }

    [JsonPropertyName("createdAt")]
    public DateTimeOffset CreatedAt { get; init; }

    [JsonPropertyName("updatedAt")]
    public DateTimeOffset UpdatedAt { get; init; }

    [JsonPropertyName("items")]
    public List<HyggeFrameOrderItemDto>? Items { get; init; }
}
