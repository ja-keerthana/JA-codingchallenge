using JobAdder.CodeChallenge.Serialization;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace JobAdder.CodeChallenge.Models
{
  public class Candidate
  {
    public int CandidateId { get; set; }
    public string Name { get; set; }

    [JsonConverter(typeof(SkillJsonConverter))]
    public ICollection<string> SkillTags { get; set; } = new List<string>();
  }
}
