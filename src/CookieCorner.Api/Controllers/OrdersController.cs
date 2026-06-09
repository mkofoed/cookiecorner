using CookieCorner.Api.Models.Orders;
using CookieCorner.Api.Services.Orders;
using Microsoft.AspNetCore.Mvc;

namespace CookieCorner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class OrdersController(IOrderCheckoutService orderCheckoutService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> PlaceOrder(
        [FromBody] PlaceOrderRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            var order = await orderCheckoutService.PlaceOrderAsync(request, cancellationToken);
            return Ok(order);
        }
        catch (ArgumentException exception)
        {
            var details = new ValidationProblemDetails(new Dictionary<string, string[]>
            {
                [nameof(PlaceOrderRequest)] = [exception.Message]
            });

            return BadRequest(details);
        }
        catch (InvalidOperationException exception)
        {
            return Problem(
                detail: exception.Message,
                statusCode: StatusCodes.Status503ServiceUnavailable,
                title: "HyggeFrame API configuration is incomplete.");
        }
        catch (HttpRequestException exception)
        {
            return Problem(
                detail: exception.Message,
                statusCode: StatusCodes.Status502BadGateway,
                title: "Unable to place the order through HyggeFrame.");
        }
    }
}
