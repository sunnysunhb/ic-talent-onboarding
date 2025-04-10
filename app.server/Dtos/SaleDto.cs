namespace app.server.Dtos;

public class SaleDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int CustomerId { get; set; }
    public int StoreId { get; set; }
    public DateTime? DateSold { get; set; }
}
