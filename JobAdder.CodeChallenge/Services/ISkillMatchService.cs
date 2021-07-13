using JobAdder.CodeChallenge.Models;
using System.Collections.Generic;

namespace JobAdder.CodeChallenge.Services
{
  public interface ISkillMatchService
  {
    ICollection<Candidate> GetBestCandidatesForJob(Job job, IEnumerable<Candidate> candidates, int take = 5);
    ICollection<Job> GetBestJobsForCandidate(Candidate candidate, IEnumerable<Job> jobs, int take = 5);
  }
}
