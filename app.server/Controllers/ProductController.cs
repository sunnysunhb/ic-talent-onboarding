using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using app.server.Models;

namespace app.server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IndustryConnectObdContext _context;

        public ProductController(IndustryConnectObdContext context)
        {
            _context = context;
        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            try
            {
                Console.WriteLine("Fetching products from database...");
                var products = await _context.Products.ToListAsync();
                Console.WriteLine($"Found {products.Count} products");
                return products;
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error fetching products: {ex.Message}");
                return StatusCode(500, "Error accessing database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching products: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID must be greater than 0");
            }

            try 
            {
                Console.WriteLine($"Fetching product with ID: {id}");
                var product = await _context.Products.FindAsync(id);

                if (product == null)
                {
                    Console.WriteLine($"Product with ID {id} not found");
                    return NotFound();
                }

                Console.WriteLine($"Successfully retrieved product ID {id}");
                return product;
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error fetching product: {ex.Message}");
                return StatusCode(500, "Error accessing database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching product: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/Product/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            // Basic validation
            if (id <= 0)
            {
                return BadRequest("ID must be greater than 0");
            }

            // Business logic validation
            if (id != product.Id)
            {
                return BadRequest("ID in URL does not match ID in request body");
            }

            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound();
            }

            try
            {
                Console.WriteLine($"Updating product ID {id}");
                _context.Entry(existingProduct).CurrentValues.SetValues(product);
                await _context.SaveChangesAsync();
                Console.WriteLine($"Successfully updated product ID {id}");

                return Ok(product);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                Console.WriteLine($"Concurrency error updating product: {ex.Message}");
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return StatusCode(500, new { 
                        message = "Concurrency error while updating product",
                        error = ex.Message 
                    });
                }
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error updating product: {ex.Message}");
                return StatusCode(500, "Error saving product to database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating product: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/Product
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetProduct", new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            // Basic validation
            if (id <= 0)
            {
                return BadRequest("ID must be greater than 0");
            }

            try 
            {
                Console.WriteLine($"Deleting product ID {id}");
                var product = await _context.Products.FindAsync(id);
                
                if (product == null)
                {
                    Console.WriteLine($"Product with ID {id} not found");
                    return NotFound();
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                Console.WriteLine($"Successfully deleted product ID {id}");
                
                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error deleting product: {ex.Message}");
                return StatusCode(500, "Error deleting product from database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting product: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
