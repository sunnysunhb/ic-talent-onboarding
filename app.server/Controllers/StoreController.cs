using System;
using System.Collections.Generic;
using System.Linq;
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
    public class StoreController : ControllerBase
    {
        private readonly IndustryConnectObdContext _context;

        public StoreController(IndustryConnectObdContext context)
        {
            _context = context;
        }

        // GET: api/Store
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreDto>>> GetStores()
        {
            var stores = await _context.Stores.ToListAsync();
            return stores.Select(s => StoreMapper.EntityToDto(s)).ToList();
        }

        // GET: api/Store/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreDto>> GetStore(int id)
        {
            var store = await _context.Stores.FindAsync(id);

            if (store == null)
            {
                return NotFound();
            }

            return StoreMapper.EntityToDto(store);
        }

        // PUT: api/Store/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStore(int id, StoreDto storeDto)
        {
            if (id != storeDto.Id)
            {
                return BadRequest("ID in URL does not match ID in request body");
            }

            var store = await _context.Stores.FindAsync(id);
            if (store == null)
            {
                return NotFound();
            }

            try
            {
                store.Name = storeDto.Name ?? store.Name;
                store.Address = storeDto.Address ?? store.Address;
                
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StoreExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            return Ok(StoreMapper.EntityToDto(store));
        }

        // POST: api/Store
        [HttpPost]
        public async Task<ActionResult<StoreDto>> PostStore(StoreDto storeDto)
        {
            try
            {
                var store = StoreMapper.DtoToEntity(storeDto);
                _context.Stores.Add(store);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetStore", new { id = store.Id }, StoreMapper.EntityToDto(store));
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
            var store = await _context.Stores.FindAsync(id);
            if (store == null)
            {
                return NotFound();
            }

            try
            {
                _context.Stores.Remove(store);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool StoreExists(int id)
        {
            return _context.Stores.Any(e => e.Id == id);
        }
    }
}
