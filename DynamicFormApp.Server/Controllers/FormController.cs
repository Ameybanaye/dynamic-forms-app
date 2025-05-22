using DynamicFormApp.Server.Data;
using DynamicFormApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DynamicFormApp.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FormController(AppDbContext context) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateForm(Form form)
    {
        form.CreatedBy = 1;
        form.PublicId = Guid.NewGuid().ToString("N");
        if (string.IsNullOrEmpty(form.BannerUrl) == false)
            form.BannerUrl = Path.GetFileName(new Uri(form.BannerUrl).AbsolutePath);
        context.Forms.Add(form);
        await context.SaveChangesAsync();
        return Ok(form);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetForm(int id)
    {
        var form = await context.Forms
            .Include(f => f.Fields)
            .ThenInclude(o => o.Options)
            .FirstOrDefaultAsync(f => f.Id == id);
        return form == null ? NotFound() : Ok(form);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllForms()
    {
        var forms = await context.Forms
            .Where(f => f.Active)
            .Select(f => new FormListDto
            {
                Id = f.Id,
                Title = f.Title,
                Description = f.Description,
                CreatedDate = f.CreatedDate,
                PublicId = f.PublicId,
                ResponseCount = context.FormResponses.Count(r => r.FormId == f.Id)
            })
            .ToListAsync();
        ;
        return Ok(forms);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateForm(int id, Form updatedForm)
    {
        var existing = await context.Forms
            .Include(f => f.Fields)
            .ThenInclude(o => o.Options)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (existing == null) return NotFound();

        // Basic updates
        existing.Title = updatedForm.Title;
        existing.Description = updatedForm.Description;
        existing.PrivacyPolicy = updatedForm.PrivacyPolicy;
        if (string.IsNullOrEmpty(updatedForm.BannerUrl) == false)
            existing.BannerUrl = Path.GetFileName(new Uri(updatedForm.BannerUrl).AbsolutePath);

        // Remove old fields/options
        context.FormFields.RemoveRange(existing.Fields);
        await context.SaveChangesAsync();

        // Add new ones
        updatedForm.Fields.ForEach(f => f.FormId = id);
        context.FormFields.AddRange(updatedForm.Fields);

        await context.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> SoftDelete(int id)
    {
        var form = await context.Forms.FindAsync(id);
        if (form == null) return NotFound();

        form.Active = false;
        form.ModifiedDate = DateTime.UtcNow;
        await context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("public/{publicId}")]
    public async Task<IActionResult> GetFormByPublicId(string publicId)
    {
        var form = await context.Forms
            .Include(f => f.Fields).ThenInclude(f => f.Options)
            .FirstOrDefaultAsync(f => f.PublicId == publicId && f.Active);

        return form == null ? NotFound() : Ok(form);
    }
}