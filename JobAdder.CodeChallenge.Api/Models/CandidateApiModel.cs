using System.Collections.Generic;

namespace JobAdder.CodeChallenge.Api.Models
{
  public class CandidateApiModel : CandidateSummaryApiModel
  {
    public ICollection<string> SkillTags { get; set; } = new List<string>();
  }
}
