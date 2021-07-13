using System;
using JobAdder.CodeChallenge.Models;
using System.Collections.Generic;

namespace JobAdder.CodeChallenge.Services
{
  public class SkillMatchService : ISkillMatchService
  {
    public ICollection<Candidate> GetBestCandidatesForJob(Job job, IEnumerable<Candidate> candidates, int take = 5)
    {
      throw new NotImplementedException("TODO - Implement Matching Algorithm");
    }

    public ICollection<Job> GetBestJobsForCandidate(Candidate candidate, IEnumerable<Job> jobs, int take = 5)
    {
      throw new NotImplementedException("TODO - Implement Matching Algorithm");
    }
  }
}
