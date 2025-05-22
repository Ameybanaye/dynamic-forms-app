namespace DynamicFormApp.Server.Models;

public class FormListDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime CreatedDate { get; set; }
    public int ResponseCount { get; set; }
    public string PublicId { get; set; }
}