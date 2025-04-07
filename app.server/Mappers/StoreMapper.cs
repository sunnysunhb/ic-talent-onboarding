using app.server.Models;
using app.server.Dtos;

namespace app.server.Mappers;

public static class StoreMapper
{
    public static Store DtoToEntity(StoreDto storeDto)
    {
        return new Store
        {
            Id = storeDto.Id,
            Name = storeDto.Name ?? string.Empty,
            Address = storeDto.Address ?? string.Empty
        };
    }

    public static StoreDto EntityToDto(Store store)
    {
        return new StoreDto
        {
            Id = store.Id,
            Name = store.Name,
            Address = store.Address
        };
    }
}
