namespace DynamicFormApp.Server.Models;

public class FieldOption : BaseEntity
{
    public int Id { get; set; }
    public int FieldId { get; set; }
    public string Value { get; set; }
}