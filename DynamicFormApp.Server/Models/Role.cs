using System.Text.Json.Serialization;

namespace DynamicFormApp.Server.Models
{
    public class Role : BaseEntity
    {
        public int Id { get; set; } 
        public string Name { get; set; }
    }

}
