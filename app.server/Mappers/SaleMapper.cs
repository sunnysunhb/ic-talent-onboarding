using app.server.Models;
using app.server.Dtos;

namespace app.server.Mappers;

public static class SaleMapper
{
    public static Sale DtoToEntity(SaleDto saleDto)
    {
        return new Sale
        {
            Id = saleDto.Id,
            ProductId = saleDto.ProductId,
            CustomerId = saleDto.CustomerId,
            StoreId = saleDto.StoreId,
            DateSold = saleDto.DateSold ?? DateTime.Now
        };
    }

    public static SaleDto EntityToDto(Sale sale)
    {
        return new SaleDto
        {
            Id = sale.Id,
            ProductId = sale.ProductId,
            CustomerId = sale.CustomerId,
            StoreId = sale.StoreId,
            DateSold = sale.DateSold
        };
    }
}
