using JobAdder.CodeChallenge.Models;

namespace JobAdder.CodeChallenge.Api.Models
{
  public static class ModelExtensions
  {
    public static CandidateApiModel ToApiModel(this Candidate source)
    {
      if (source == null)
        return null;

      return new CandidateApiModel
      {
        CandidateId = source.CandidateId,
        Name = source.Name,
        SkillTags = source.SkillTags,
      };
    }

    public static CandidateSummaryApiModel ToSummaryApiModel(this Candidate source)
    {
      if (source == null)
        return null;

      return new CandidateSummaryApiModel
      {
        CandidateId = source.CandidateId,
        Name = source.Name,
      };
    }

    public static JobApiModel ToApiModel(this Job source)
    {
      if (source == null)
        return null;

      return new JobApiModel
      {
        JobId = source.JobId,
        Name = source.Name,
        Company = source.Company,
        Skills = source.Skills,
      };
    }

    public static JobSummaryApiModel ToSummaryApiModel(this Job source)
    {
      if (source == null)
        return null;

      return new JobSummaryApiModel
      {
        JobId = source.JobId,
        Name = source.Name,
      };
    }

    public static PagedListApiModel<T> ToPagedListApiModel<T>(this IPagedList<T> source) where T : class
    {
      if (source == null)
        return null;

      return new PagedListApiModel<T>
      {
        PageSize = source.PageSize,
        PageIndex = source.PageIndex,
        Items = source.Items,
        TotalItems = source.TotalItems
      };
    }
  }
}
