using System.Security.Cryptography.X509Certificates;

namespace DynamicFormApp.Server.Models;

public class FormField : BaseEntity
{
    public int Id { get; set; }
    public int FormId { get; set; }
    public string Label { get; set; }
    public string Type { get; set; } // "dropdown" or "checkbox"
    public bool IsRequired { get; set; }

    public int? Min { get; set; }

    public int? Max { get; set; }
    public List<FieldOption> Options { get; set; }

    public bool AllowAlphabetOnly { get; set; }

    public string ValidationMode { get; set; } = "open";

    public string? CustomSpecialChars { get; set; }

    public bool IsPhoneNumber { get; set; }
}