using System;
using JobAdder.CodeChallenge.Models;
using System.Collections.Generic;
using System.Linq;

namespace JobAdder.CodeChallenge.Services
{
  public class SkillMatchService : ISkillMatchService
  {

    private class MatchingCandidate
    {
      public Candidate candidate;
      public List<string> skillsMatched;
      public MatchingCandidate(Candidate candidate,List<string> skillsMatched)
      {
        this.candidate = candidate;
        this.skillsMatched = skillsMatched;
      }
    }

    private class MatchingJob
    {
      public Job job;
      public List<string> skillsMatched;
      public MatchingJob(Job job, List<string> skillsMatched)
      {
        this.job = job;
        this.skillsMatched = skillsMatched;
      }
    }

    public ICollection<Candidate> GetBestCandidatesForJob(Job job, IEnumerable<Candidate> candidates, int take = 5)
    {

      List<MatchingCandidate> matchingCandidates = new List<MatchingCandidate>();
      foreach(var candidate in candidates)
      {
        var matchedSkills = CalculateMatchingSkills(job.Skills.ToList(), candidate.SkillTags.ToList());
        if(matchedSkills.Count > 0) { matchingCandidates.Add(new MatchingCandidate(candidate, matchedSkills.ToList())); }
      }

      matchingCandidates = matchingCandidates.OrderBy(x => x.skillsMatched.Count).ToList();
      if (matchingCandidates.Count == 0)
        return new List<Candidate>();
      
      
      List<Candidate> matchedCandidates = matchingCandidates.Select(x => x.candidate).Take(take).ToList();
      return matchedCandidates;
    }

    private ICollection<string> CalculateMatchingSkills(List<string> requiredSkills, List<string> actualSkills)
    {
      if (requiredSkills == null || actualSkills == null)
        return null;

      return requiredSkills.Intersect(actualSkills).ToList();
    }

    public ICollection<Job> GetBestJobsForCandidate(Candidate candidate, IEnumerable<Job> jobs, int take = 5)
    {
      List<MatchingJob> matchingJobs = new List<MatchingJob>();
      foreach (var job in jobs)
      {
        var matchedSkills = CalculateMatchingSkills(candidate.SkillTags.ToList(), job.Skills.ToList());
        if (matchedSkills.Count > 0) { matchingJobs.Add(new MatchingJob(job, matchedSkills.ToList())); }
      }

      matchingJobs = matchingJobs.OrderBy(x => x.skillsMatched.Count).ToList();
      if (matchingJobs.Count == 0)
        return new List<Job>();


      List<Job> matchedJobs = matchingJobs.Select(x => x.job).Take(take).ToList();
      return matchedJobs;
    }
  }
}
