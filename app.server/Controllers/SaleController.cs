using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using app.server.Models;
using app.server.Dtos;
using app.server.Mappers;

namespace app.server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private readonly IndustryConnectObdContext _context;
        private readonly SaleMapper _saleMapper;

        public SaleController(IndustryConnectObdContext context, SaleMapper saleMapper)
        {
            _context = context;
            _saleMapper = saleMapper;
        }

        // GET: api/Sale
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetSales()
        {
            try
            {
                Console.WriteLine("Loading sales with related entities...");
                var salesQuery = _context.Sales
                    .Include(s => s.Product)
                    .Include(s => s.Customer)
                    .Include(s => s.Store)
                    .Where(s => s.Product != null && s.Customer != null && s.Store != null)
                    .AsNoTracking();

                Console.WriteLine($"Found {await salesQuery.CountAsync()} sales in database");

                var sales = await salesQuery.ToListAsync();
                var saleDtos = new List<SaleDto>();
                
                foreach (var sale in sales)
                {
                    saleDtos.Add(await _saleMapper.EntityToDto(sale));
                }

                Console.WriteLine($"Successfully mapped {saleDtos.Count} sales to DTOs");
                return saleDtos;
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error fetching sales: {ex.Message}");
                return StatusCode(500, "Error accessing database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching sales: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Sale/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SaleDto>> GetSale(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID must be greater than 0");
            }

            try 
            {
                Console.WriteLine($"Fetching sale with ID: {id}");
                var sale = await _context.Sales
                    .Include(s => s.Product)
                    .Include(s => s.Customer)
                    .Include(s => s.Store)
                    .Where(s => s.Id == id && s.Product != null && s.Customer != null && s.Store != null)
                    .FirstOrDefaultAsync();
                    
                if (sale == null)
                {
                    return NotFound();
                }
                
                var saleDto = await _saleMapper.EntityToDto(sale);

                if (saleDto == null)
                {
                    Console.WriteLine($"Sale with ID {id} not found");
                    return NotFound();
                }

                Console.WriteLine($"Successfully retrieved sale ID {id}");
                return saleDto;
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error fetching sale: {ex.Message}");
                return StatusCode(500, "Error accessing database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching sale: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/Sale/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSale(int id, [FromBody] SaleDto saleDto)
        {
            // Basic validation
            if (id <= 0)
            {
                return BadRequest("ID must be greater than 0");
            }

            // Business logic validation
            if (id != saleDto.Id)
            {
                return BadRequest("ID in URL does not match ID in request body");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                Console.WriteLine($"Updating sale ID {id}");
                var sale = await _saleMapper.DtoToEntity(saleDto);
                _context.Entry(sale).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                Console.WriteLine($"Successfully updated sale ID {id}");

                // 重新加载更新后的记录并转换为DTO
                var updatedSale = await _context.Sales
                    .Include(s => s.Product)
                    .Include(s => s.Customer)
                    .Include(s => s.Store)
                    .FirstOrDefaultAsync(s => s.Id == id);
                
                if (updatedSale == null)
                {
                    return NotFound();
                }

                var updatedSaleDto = await _saleMapper.EntityToDto(updatedSale);
                return Ok(updatedSaleDto);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                Console.WriteLine($"Concurrency error updating sale: {ex.Message}");
                if (!SaleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return StatusCode(500, new { 
                        message = "Concurrency error while updating sale",
                        error = ex.Message 
                    });
                }
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error updating sale: {ex.Message}");
                return StatusCode(500, "Error saving sale to database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating sale: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/Sale
        [HttpPost]
        public async Task<ActionResult<SaleDto>> PostSale([FromBody] SaleDto saleDto)
        {
            try
            {
                Console.WriteLine($"Creating new sale with data: {JsonSerializer.Serialize(saleDto)}");
                
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var sale = await _saleMapper.DtoToEntity(saleDto);
                _context.Sales.Add(sale);
                await _context.SaveChangesAsync();
                Console.WriteLine($"Successfully created sale ID {sale.Id}");

                var createdSaleDto = await _saleMapper.EntityToDto(sale);
                return CreatedAtAction("GetSale", new { id = sale.Id }, createdSaleDto);
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error creating sale: {ex.Message}");
                return StatusCode(500, "Error saving sale to database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating sale: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/Sale/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            // Basic validation
            if (id <= 0)
            {
                return BadRequest("ID must be greater than 0");
            }

            try 
            {
                Console.WriteLine($"Deleting sale ID {id}");
                var sale = await _context.Sales.FindAsync(id);
                
                if (sale == null)
                {
                    Console.WriteLine($"Sale with ID {id} not found");
                    return NotFound();
                }

                _context.Sales.Remove(sale);
                await _context.SaveChangesAsync();
                Console.WriteLine($"Successfully deleted sale ID {id}");
                
                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error deleting sale: {ex.Message}");
                return StatusCode(500, "Error deleting sale from database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting sale: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        private bool SaleExists(int id)
        {
            return _context.Sales.Any(e => e.Id == id);
        }
    }
}
