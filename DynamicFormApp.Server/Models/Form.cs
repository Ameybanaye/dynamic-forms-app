using System.ComponentModel.DataAnnotations;

namespace DynamicFormApp.Server.Models;

public class Form : BaseEntity
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string? PrivacyPolicy { get; set; }

    public List<FormField> Fields { get; set; }

    public string PublicId { get; set; } = Guid.NewGuid().ToString("N");
    public string? BannerUrl { get; set; }
}