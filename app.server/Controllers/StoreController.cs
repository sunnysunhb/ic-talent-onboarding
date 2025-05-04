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
    public class StoreController : ControllerBase
    {
        private readonly IndustryConnectObdContext _context;

        public StoreController(IndustryConnectObdContext context)
        {
            _context = context;
        }

        // GET: api/Store
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Store>>> GetStores()
        {
            try
            {
                Console.WriteLine("Fetching stores from database...");
                var stores = await _context.Stores.ToListAsync();
                Console.WriteLine($"Found {stores.Count} stores");
                return stores;
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error fetching stores: {ex.Message}");
                return StatusCode(500, "Error accessing database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching stores: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Store/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Store>> GetStore(int id)
        {
            if (id <= 0)
            {
                return BadRequest("ID must be greater than 0");
            }

            try 
            {
                Console.WriteLine($"Fetching store with ID: {id}");
                var store = await _context.Stores.FindAsync(id);

                if (store == null)
                {
                    Console.WriteLine($"Store with ID {id} not found");
                    return NotFound();
                }

                Console.WriteLine($"Successfully retrieved store ID {id}");
                return store;
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error fetching store: {ex.Message}");
                return StatusCode(500, "Error accessing database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching store: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/Store/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStore(int id, Store store)
        {
            // Basic validation
            if (id <= 0)
            {
                return BadRequest("ID must be greater than 0");
            }

            // Business logic validation
            if (id != store.Id)
            {
                return BadRequest("ID in URL does not match ID in request body");
            }

            var existingStore = await _context.Stores.FindAsync(id);
            if (existingStore == null)
            {
                return NotFound();
            }

            try
            {
                Console.WriteLine($"Updating store ID {id}");
                existingStore.Name = store.Name ?? existingStore.Name;
                existingStore.Address = store.Address ?? existingStore.Address;
                
                await _context.SaveChangesAsync();
                Console.WriteLine($"Successfully updated store ID {id}");

                return Ok(existingStore);
            }
            catch (DbUpdateConcurrencyException ex)
            {
                Console.WriteLine($"Concurrency error updating store: {ex.Message}");
                if (!StoreExists(id))
                {
                    return NotFound();
                }
                else
                {
                    return StatusCode(500, new { 
                        message = "Concurrency error while updating store",
                        error = ex.Message 
                    });
                }
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error updating store: {ex.Message}");
                return StatusCode(500, "Error saving store to database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating store: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/Store
        [HttpPost]
        public async Task<ActionResult<Store>> PostStore(Store store)
        {
            try
            {
                _context.Stores.Add(store);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetStore", new { id = store.Id }, store);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/Store/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStore(int id)
        {
            // Basic validation
            if (id <= 0)
            {
                return BadRequest("ID must be greater than 0");
            }

            try 
            {
                Console.WriteLine($"Deleting store ID {id}");
                var store = await _context.Stores.FindAsync(id);
                
                if (store == null)
                {
                    Console.WriteLine($"Store with ID {id} not found");
                    return NotFound();
                }

                _context.Stores.Remove(store);
                await _context.SaveChangesAsync();
                Console.WriteLine($"Successfully deleted store ID {id}");
                
                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error deleting store: {ex.Message}");
                return StatusCode(500, "Error deleting store from database");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting store: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        private bool StoreExists(int id)
        {
            return _context.Stores.Any(e => e.Id == id);
        }
    }
}
