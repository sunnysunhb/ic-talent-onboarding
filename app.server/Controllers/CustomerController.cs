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
    public class CustomerController : ControllerBase
    {
        private readonly IndustryConnectObdContext _context;

        public CustomerController(IndustryConnectObdContext context)
        {
            _context = context;
        }

        // GET: api/Customer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            try
            {
                Console.WriteLine("Fetching customers from database...");
                var customers = await _context.Customers.ToListAsync();
                Console.WriteLine($"Found {customers.Count} customers");
                return customers;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching customers: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/Customer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID must be greater than 0");
            }

            try 
            {
                Console.WriteLine($"Fetching customer with ID: {id}");
                var customer = await _context.Customers.FindAsync(id);

                if (customer == null)
                {
                    Console.WriteLine($"Customer with ID {id} not found");
                    return NotFound();
                }

                Console.WriteLine($"Successfully retrieved customer ID {id}");
                return customer;
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error fetching customer: {ex.Message}");
                return StatusCode(500, "Error accessing database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching customer: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/Customer/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, Customer customer)
        {
            // Basic validation
            if (id <= 0)
            {
                return BadRequest("ID must be greater than 0");
            }

            // Business logic validation
            if (id != customer.Id)
            {
                return BadRequest("ID in URL does not match ID in request body");
            }

            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                // Reload the updated customer from database
                var updatedCustomer = await _context.Customers.FindAsync(id);
                return Ok(updatedCustomer);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!CustomerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return StatusCode(500, new { 
                        message = "Concurrency error while updating customer",
                        error = ex.Message 
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {
                    message = "Internal server error",
                    error = ex.Message
                });
            }
        }

        // POST: api/Customer
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
        {
            try
            {
                Console.WriteLine($"Creating new customer: {customer.Name}");
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();
                Console.WriteLine($"Successfully created customer ID {customer.Id}");

                return CreatedAtAction("GetCustomer", new { id = customer.Id }, customer);
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error creating customer: {ex.Message}");
                return StatusCode(500, "Error saving customer to database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating customer: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/Customer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            // Basic validation
            if (id <= 0)
            {
                return BadRequest("ID must be greater than 0");
            }

            try 
            {
                var customer = await _context.Customers
                    .Include(c => c.Sales)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (customer == null)
                {
                    return NotFound();
                }

                if (customer.Sales.Any())
                {
                    return BadRequest($"Cannot delete customer. Customer has {customer.Sales.Count} associated sales records.");
                }

                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();
                
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting customer: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }
    }
}
