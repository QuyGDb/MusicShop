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

namespace MusicShop.API.Controllers;

public sealed class ProductsController(IMediator mediator) : BaseApiController
{
    // ── Products ────────────────────────────────────────────────────────────

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ProductListItemDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<ProductListItemDto>>>> GetProducts(
        [FromQuery] GetProductsQuery query,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(query, cancellationToken);
        return HandlePaginatedResult(result);
    }

    [HttpGet("{slug}")]
    [ProducesResponseType(typeof(ApiResponse<ProductDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ProductDetailDto>>> GetProductBySlug(
        string slug,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new GetProductBySlugQuery(slug), cancellationToken);
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
        return HandleCreatedResult(result, nameof(GetProductBySlug), new { slug = command.Slug });
    }

    [Authorize(Roles = "admin")]
    [HttpPatch("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<object>>> UpdateProduct(
        Guid id,
        [FromBody] UpdateProductCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.Id) return BadRequest();

        var result = await mediator.Send(command, cancellationToken);
        return HandleNonGenericResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<object>>> DeactivateProduct(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new DeactivateProductCommand(id), cancellationToken);
        return HandleNonGenericResult(result);
    }



    // ── Variants ────────────────────────────────────────────────────────────
    // Not using GetBySlug for variants internal query as it's more efficient by ID if we have it, 
    // but the route should be SEO friendly. 
    // Actually, variants are sub-resources. We can keep ID for simplicity or use Slug.
    // Let's use Slug for the parent product in the route.

    [HttpGet("{slug}/variants")]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ProductVariantDto>>), StatusCodes.Status200OK)]
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
        [FromBody] CreateProductVariantCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.ProductId) return BadRequest();

        var result = await mediator.Send(command, cancellationToken);
        return HandleCreatedResult(result, nameof(GetVariants), new { id });
    }

    [Authorize(Roles = "admin")]
    [HttpPut("{id:guid}/variants/{variantId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<object>>> UpdateVariant(
        Guid id,
        Guid variantId,
        [FromBody] UpdateProductVariantCommand command,
        CancellationToken cancellationToken)
    {
        if (id != command.ProductId || variantId != command.VariantId) return BadRequest();

        var result = await mediator.Send(command, cancellationToken);
        return HandleNonGenericResult(result);
    }

    [Authorize(Roles = "admin")]
    [HttpDelete("{id:guid}/variants/{variantId:guid}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<object>>> DeleteVariant(
        Guid id,
        Guid variantId,
        CancellationToken cancellationToken)
    {
        var result = await mediator.Send(new DeleteProductVariantCommand(id, variantId), cancellationToken);
        return HandleNonGenericResult(result);
    }
}
