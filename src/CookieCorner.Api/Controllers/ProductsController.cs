using CookieCorner.Api.Services.Products;
using Microsoft.AspNetCore.Mvc;

namespace CookieCorner.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class ProductsController(IProductCatalogService productCatalogService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProducts(CancellationToken cancellationToken)
    {
        try
        {
            var products = await productCatalogService.GetProductsAsync(cancellationToken);
            return Ok(products);
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
                title: "Unable to retrieve products from HyggeFrame.");
        }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProduct(int id, CancellationToken cancellationToken)
    {
        try
        {
            var product = await productCatalogService.GetProductAsync(id, cancellationToken);
            return product is null ? NotFound() : Ok(product);
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
                title: "Unable to retrieve the product from HyggeFrame.");
        }
    }
}
