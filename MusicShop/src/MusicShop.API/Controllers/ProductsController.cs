using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MusicShop.API.Infrastructure;
using MusicShop.Application.Common;
using MusicShop.Application.DTOs.Shop;
using MusicShop.Application.UseCases.Shop.Products.Commands.CreateProduct;
using MusicShop.Application.UseCases.Shop.Products.Commands.CreateProductVariant;
using MusicShop.Application.UseCases.Shop.Products.Commands.DeactivateProduct;
using MusicShop.Application.UseCases.Shop.Products.Commands.DeleteProductVariant;
using MusicShop.Application.UseCases.Shop.Products.Commands.UpdateProduct;
using MusicShop.Application.UseCases.Shop.Products.Commands.UpdateProductVariant;
using MusicShop.Application.UseCases.Shop.Products.Queries.GetProductById;
using MusicShop.Application.UseCases.Shop.Products.Queries.GetProductBySlug;
using MusicShop.Application.UseCases.Shop.Products.Queries.GetProductVariants;
using MusicShop.Application.UseCases.Shop.Products.Queries.GetProducts;
using MusicShop.Domain.Common;

namespace MusicShop.API.Controllers;

public sealed class ProductsController(IMediator mediator) : BaseApiController
{
    // ── Products ────────────────────────────────────────────────────────────

    [HttpGet]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProductListItemDto>>>> GetProducts(
        [FromQuery] GetProductsQuery query,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(query, cancellationToken);
        return HandlePaginatedResult(result);
    }

    [HttpGet("{slug}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProductDetailDto>>> GetProductBySlug(
        string slug,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetProductBySlugQuery(slug), cancellationToken);
        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpGet("admin/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProductDetailDto>>> GetProductById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetProductByIdQuery(id), cancellationToken);
        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<Guid>>> CreateProduct(
        [FromBody] CreateProductCommand command,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(command, cancellationToken);
        return HandleCreatedResult(result, nameof(GetProductBySlug), _ => new { slug = command.Slug });
    }

    [Authorize(Roles = "admin")]
    [HttpPatch("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProduct(
        Guid id,
        [FromBody] UpdateProductRequest request,
        CancellationToken cancellationToken)
    {
        Result result = await mediator.Send(new UpdateProductCommand(
            id, 
            request.Name, 
            request.Slug, 
            request.Description, 
            request.IsActive, 
            request.IsPreorder, 
            request.PreorderReleaseDate, 
            request.LimitedQty), cancellationToken);

        return HandleNoContentResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeactivateProduct(
        Guid id,
        CancellationToken cancellationToken)
    {
        Result result = await mediator.Send(new DeactivateProductCommand(id), cancellationToken);
        return HandleNoContentResult(result);
    }



    // ── Variants ────────────────────────────────────────────────────────────
    // Not using GetBySlug for variants internal query as it's more efficient by ID if we have it, 
    // but the route should be SEO friendly. 
    // Actually, variants are sub-resources. We can keep ID for simplicity or use Slug.
    // Let's use Slug for the parent product in the route.

    [HttpGet("{slug}/variants")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProductVariantDto>>>> GetVariants(
        string slug,
        CancellationToken cancellationToken)
    {
        // We might need GetProductBySlug internal logic first to get the Product ID
        var productResult = await mediator.Send(new GetProductBySlugQuery(slug), cancellationToken);
        if (productResult.IsFailure) return MapError(productResult.Error);

        var result = await mediator.Send(new GetProductVariantsQuery(productResult.Value.Id), cancellationToken);
        return HandleResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpPost("{id:guid}/variants")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<Guid>>> CreateVariant(
        Guid id,
        [FromBody] CreateProductVariantRequest request,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new CreateProductVariantCommand(
            id, 
            request.VariantName, 
            request.Price, 
            request.StockQty, 
            request.IsSigned, 
            request.ImageUrl, 
            request.VinylAttributes, 
            request.CdAttributes, 
            request.CassetteAttributes), cancellationToken);

        return HandleCreatedResult(result, nameof(GetVariants), _ => new { slug = "placeholder" }); 
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id:guid}/variants/{variantId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateVariant(
        Guid id,
        Guid variantId,
        [FromBody] UpdateProductVariantRequest request,
        CancellationToken cancellationToken)
    {
        Result result = await mediator.Send(new UpdateProductVariantCommand(
            id, 
            variantId, 
            request.VariantName, 
            request.Price, 
            request.StockQty, 
            request.IsSigned, 
            request.IsAvailable, 
            request.VinylAttributes, 
            request.CdAttributes, 
            request.CassetteAttributes), cancellationToken);

        return HandleNoContentResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id:guid}/variants/{variantId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteVariant(
        Guid id,
        Guid variantId,
        CancellationToken cancellationToken)
    {
        Result result = await mediator.Send(new DeleteProductVariantCommand(id, variantId), cancellationToken);
        return HandleNoContentResult(result);
    }
}
