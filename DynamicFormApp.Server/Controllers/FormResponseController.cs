using DynamicFormApp.Server.Data;
using DynamicFormApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DynamicFormApp.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FormResponseController(AppDbContext context) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Submit(FormResponse response)
    {
        response.CreatedDate = DateTime.UtcNow;
        context.FormResponses.Add(response);
        await context.SaveChangesAsync();
        return Ok(new { message = "Response submitted" });
    }

    [HttpGet("form/{formId}")]
    public async Task<IActionResult> GetByForm(int formId)
    {
        var responses = await context.FormResponses
            .Where(r => r.FormId == formId)
            .OrderByDescending(r => r.CreatedDate)
            .Select(r => new {
                r.Id,
                r.FormId,
                r.ResponseJson,
                r.CreatedDate
            })
            .ToListAsync();

        return Ok(responses);
    }
}