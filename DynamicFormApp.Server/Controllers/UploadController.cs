using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DynamicFormApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController(IWebHostEnvironment env) : ControllerBase
    {
        [HttpPost("banner")]
        public async Task<IActionResult> UploadBanner([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file provided.");

            var uploads = Path.Combine(Directory.GetCurrentDirectory(),"uploads");
           if(Directory.Exists(uploads) == false)  Directory.CreateDirectory(uploads);

            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploads, fileName);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            var url = $"{Request.Scheme}://{Request.Host}/api/Image/{fileName}";
            return Ok(new { url });
        }
    }
}
