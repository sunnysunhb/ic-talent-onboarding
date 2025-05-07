using app.server.Dtos;
using app.server.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace app.server.Mappers
{
    public class SaleMapper
    {
        private readonly IndustryConnectObdContext _dbContext;

        public SaleMapper(IndustryConnectObdContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Sale> DtoToEntity(SaleDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            return new Sale
            {
                Id = dto.Id,
                CustomerId = dto.CustomerId,
                ProductId = dto.ProductId,
                StoreId = dto.StoreId,
                DateSold = dto.DateSold
            };
        }

        public async Task<SaleDto> EntityToDto(Sale entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            var productName = await _dbContext.Products
                .Where(p => p.Id == entity.ProductId)
                .Select(p => p.Name)
                .FirstOrDefaultAsync();

            var customerName = await _dbContext.Customers
                .Where(c => c.Id == entity.CustomerId)
                .Select(c => c.Name)
                .FirstOrDefaultAsync();

            var storeName = await _dbContext.Stores
                .Where(s => s.Id == entity.StoreId)
                .Select(s => s.Name)
                .FirstOrDefaultAsync();

            return new SaleDto
            {
                Id = entity.Id,
                CustomerId = entity.CustomerId,
                ProductId = entity.ProductId,
                StoreId = entity.StoreId,
                ProductName = productName,
                CustomerName = customerName,
                StoreName = storeName,
                DateSold = entity.DateSold
            };
        }

    }
}
