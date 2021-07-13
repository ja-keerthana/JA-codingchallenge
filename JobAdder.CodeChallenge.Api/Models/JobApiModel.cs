using System.Collections.Generic;

namespace JobAdder.CodeChallenge.Api.Models
{
  public class JobApiModel : JobSummaryApiModel
  {    
    public string Company { get; set; }
    public ICollection<string> Skills { get; set; } = new List<string>();
  }
}
