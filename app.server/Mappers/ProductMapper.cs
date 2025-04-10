using app.server.Models;
using app.server.Dtos;

namespace app.server.Mappers;

public static class ProductMapper
{
    public static Product DtoToEntity(ProductDto productDto)
    {
        return new Product
        {
            Id = productDto.Id,
            Name = productDto.Name ?? string.Empty,
            Price = productDto.Price ?? 0
        };
    }

    public static ProductDto EntityToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price
        };
    }
}
