using System.Net.Http.Headers;
using System.Text.Json;
using CookieCorner.Api.Configuration;
using Microsoft.Extensions.Options;

namespace CookieCorner.Api.Integrations.HyggeFrame;

public sealed class HyggeFrameApiClient(
    HttpClient httpClient,
    IOptions<HyggeFrameOptions> options) : IHyggeFrameApiClient
{
    private static readonly JsonSerializerOptions JsonSerializerOptions = new(JsonSerializerDefaults.Web);
    private readonly HyggeFrameOptions options = options.Value;

    public async Task<IReadOnlyList<HyggeFrameProductDto>> GetProductsAsync(CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, "api/products");
        ApplyApiKey(request);

        using var response = await httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var products = await JsonSerializer.DeserializeAsync<List<HyggeFrameProductDto>>(
            stream,
            JsonSerializerOptions,
            cancellationToken);

        return products ?? [];
    }

    public async Task<HyggeFrameProductDto?> GetProductAsync(int id, CancellationToken cancellationToken)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, $"api/products/{id}");
        ApplyApiKey(request);

        using var response = await httpClient.SendAsync(request, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return null;
        }

        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        return await JsonSerializer.DeserializeAsync<HyggeFrameProductDto>(
            stream,
            JsonSerializerOptions,
            cancellationToken);
    }

    public async Task<HyggeFrameOrderDto> CreateOrderAsync(
        HyggeFrameCreateOrderRequest orderRequest,
        CancellationToken cancellationToken)
    {
        ApplyBaseAddress();

        using var response = await httpClient.PostAsJsonAsync(
            "api/orders",
            orderRequest,
            JsonSerializerOptions,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var order = await JsonSerializer.DeserializeAsync<HyggeFrameOrderDto>(
            stream,
            JsonSerializerOptions,
            cancellationToken);

        return order ?? throw new InvalidOperationException("HyggeFrame returned an empty order payload.");
    }

    public void ConfigureBaseAddress()
    {
        if (string.IsNullOrWhiteSpace(options.BaseUrl))
        {
            throw new InvalidOperationException("HyggeFrame:BaseUrl is not configured.");
        }

        var normalizedBaseUrl = NormalizeBaseUrl(options.BaseUrl);

        if (!Uri.TryCreate(normalizedBaseUrl, UriKind.Absolute, out var baseUri))
        {
            throw new InvalidOperationException("HyggeFrame:BaseUrl must be an absolute URI.");
        }

        httpClient.BaseAddress = baseUri;
        httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    private static string NormalizeBaseUrl(string baseUrl)
    {
        var normalized = baseUrl.Trim();

        if (normalized.EndsWith("/swagger/", StringComparison.OrdinalIgnoreCase))
        {
            normalized = normalized[..^"/swagger/".Length];
        }
        else if (normalized.EndsWith("/swagger", StringComparison.OrdinalIgnoreCase))
        {
            normalized = normalized[..^"/swagger".Length];
        }

        return normalized.EndsWith('/') ? normalized : $"{normalized}/";
    }

    private void ApplyApiKey(HttpRequestMessage request)
    {
        if (string.IsNullOrWhiteSpace(options.ApiKey))
        {
            throw new InvalidOperationException("HyggeFrame:ApiKey is not configured.");
        }

        ApplyBaseAddress();

        request.Headers.Add("X-Api-Key", options.ApiKey);
    }

    private void ApplyBaseAddress()
    {
        if (string.IsNullOrWhiteSpace(options.ApiKey))
        {
            throw new InvalidOperationException("HyggeFrame:ApiKey is not configured.");
        }

        if (httpClient.BaseAddress is null)
        {
            ConfigureBaseAddress();
        }

        if (!httpClient.DefaultRequestHeaders.Contains("X-Api-Key"))
        {
            httpClient.DefaultRequestHeaders.Add("X-Api-Key", options.ApiKey);
        }
    }
}
