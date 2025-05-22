namespace DynamicFormApp.Server.Models;

public class BaseEntity
{
    public int? CreatedBy { get; set; } // FK to Users, optional
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public int? ModifiedBy { get; set; } // FK to Users, optional
    public DateTime? ModifiedDate { get; set; }
    public bool Active { get; set; } = true;
}