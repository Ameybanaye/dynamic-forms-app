using System.Text.Json.Serialization;

namespace DynamicFormApp.Server.Models;

public class FormResponse : BaseEntity
{
    public int Id { get; set; }
    public int FormId { get; set; }

    //[JsonIgnore]
    //public Form Form { get; set; }
    public string ResponseJson { get; set; } // Store dynamic values
}