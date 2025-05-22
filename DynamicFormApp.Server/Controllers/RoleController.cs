using DynamicFormApp.Server.Data;
using DynamicFormApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DynamicFormApp.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoleController(AppDbContext context) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> AddRole(Role role)
    {
        role.CreatedBy = 1;
        context.Roles.Add(role);
        await context.SaveChangesAsync();
        return Ok(role);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRole(int id, Role updatedRole)
    {
        var role = await context.Roles.FindAsync(id);
        if (role == null) return NotFound();

        role.Name = updatedRole.Name;
        role.ModifiedBy = 1;
        role.ModifiedDate = DateTime.UtcNow;
        await context.SaveChangesAsync();
        return Ok(role);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        var role = await context.Roles.FindAsync(id);
        if (role == null) return NotFound();

        role.Active = false;
        role.ModifiedBy = 1;
        role.ModifiedDate = DateTime.UtcNow;
        await context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveRoles()
    {
        var roles = await context.Roles.Where(r => r.Active).ToListAsync();
        return Ok(roles);
    }
}