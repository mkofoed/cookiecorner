using Microsoft.AspNetCore.Mvc;

namespace CookieCorner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class HealthController(IConfiguration configuration) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            service = "CookieCorner.Api",
            status = "ok",
            framework = ".NET 10",
            hasApiKey = !string.IsNullOrWhiteSpace(configuration["HyggeFrame:ApiKey"])
        });
    }
}
