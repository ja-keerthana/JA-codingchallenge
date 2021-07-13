using JobAdder.CodeChallenge.Serialization;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace JobAdder.CodeChallenge.Models
{
  public class Job
  {
    public int JobId { get; set; }
    public string Name { get; set; }
    public string Company { get; set; }

    [JsonConverter(typeof(SkillJsonConverter))]
    public ICollection<string> Skills { get; set; } = new List<string>();
  }
}
