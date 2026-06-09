using CookieCorner.Api.Models.Orders;
using CookieCorner.Api.Services.Orders;
using Microsoft.AspNetCore.Mvc;

namespace CookieCorner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class OrdersController(
    IOrderCheckoutService orderCheckoutService,
    IOrderHistoryStore orderHistoryStore) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetOrders(CancellationToken cancellationToken)
    {
        var orders = await orderHistoryStore.GetOrdersAsync(cancellationToken);
        return Ok(orders);
    }

    [HttpGet("{orderNumber}")]
    public async Task<IActionResult> GetOrder(string orderNumber, CancellationToken cancellationToken)
    {
        var order = await orderHistoryStore.GetOrderAsync(orderNumber, cancellationToken);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpGet("by-id/{id:int}")]
    public async Task<IActionResult> GetOrderById(int id, CancellationToken cancellationToken)
    {
        try
        {
            var refreshedOrder = await orderCheckoutService.RefreshOrderAsync(id, cancellationToken);
            if (refreshedOrder is not null)
            {
                return Ok(refreshedOrder);
            }

            var cachedOrder = await orderHistoryStore.GetOrderAsync(id, cancellationToken);
            return cachedOrder is null ? NotFound() : Ok(cachedOrder);
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
                title: "Unable to refresh the order from HyggeFrame.");
        }
    }

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
