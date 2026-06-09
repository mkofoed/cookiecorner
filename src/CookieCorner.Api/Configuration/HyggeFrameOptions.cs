namespace CookieCorner.Api.Configuration;

public sealed class HyggeFrameOptions
{
    public const string SectionName = "HyggeFrame";

    public string? BaseUrl { get; init; }

    public string? ApiKey { get; init; }
}
