using app.server.Models;
using app.server.Dtos;

namespace app.server.Mappers;

public static class CustomerMapper
{
    public static Customer DtoToEntity(CustomerDto customerDto)
    {
        return new Customer
        {
            Id = customerDto.Id,
            Name = customerDto.Name ?? string.Empty,
            Address = customerDto.Address ?? string.Empty
        };
    }

    public static CustomerDto EntityToDto(Customer customer)
    {
        return new CustomerDto
        {
            Id = customer.Id,
            Name = customer.Name,
            Address = customer.Address
        };
    }
}
