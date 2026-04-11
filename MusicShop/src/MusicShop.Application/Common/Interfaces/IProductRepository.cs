using MusicShop.Domain.Entities.Shop;
using MusicShop.Domain.Interfaces;

namespace MusicShop.Application.Common.Interfaces;

public interface IProductRepository : IRepository<Product>
{
    Task<Product?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default);
    
    // Tìm kiếm và phân trang sẽ được tích hợp trực tiếp vào Handler
    // sử dụng IQueryable nếu cần hoặc method cụ thể ở đây.
}
