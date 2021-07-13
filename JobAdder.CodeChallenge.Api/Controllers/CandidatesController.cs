using JobAdder.CodeChallenge.Api.Models;
using JobAdder.CodeChallenge.Models;
using JobAdder.CodeChallenge.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JobAdder.CodeChallenge.Api.Controllers
{
  [Route("candidates")]
  [ApiController]
  public class CandidatesController : ControllerBase
  {
    public CandidatesController(ICandidateService candidateService, IJobService jobService, ISkillMatchService skillMatchService)
    {
      _candidateService = candidateService;
      _jobService = jobService;
      _skillMatchService = skillMatchService;
    }

    private readonly ICandidateService _candidateService;
    private readonly IJobService _jobService;
    private readonly ISkillMatchService _skillMatchService;

    [HttpGet("")]
    public async Task<IActionResult> Find([FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10)
    {
      var paginatedCandidates = await _candidateService.FindAsync(pageIndex, pageSize);

      var model = paginatedCandidates.ToPagedListApiModel();

      return Ok(model);
    }

    [HttpGet("{candidateId:int:min(1)}")]
    public async Task<IActionResult> Get(int candidateId)
    {
      var candidate = await _candidateService.GetByIDAsync(candidateId);

      var model = candidate.ToApiModel();

      return Ok(model);
    }

    [HttpGet("{candidateId:int:min(1)}/jobs")]
    public async Task<IActionResult> MatchJobs(int candidateId, [FromQuery] int take = 5)
    {
      var candidate = await _candidateService.GetByIDAsync(candidateId);
      if (candidate == null)
        return NotFound();

      var jobs = await _jobService.FindAllAsync();
      if (!jobs.Any())
        return Ok(new List<JobSummaryApiModel>());
      
      var bestMatchedJobs = _skillMatchService.GetBestJobsForCandidate(candidate, jobs, take);
      if (!bestMatchedJobs.Any())
        return Ok(new List<JobSummaryApiModel>());

      var model = bestMatchedJobs.Select(x => x.ToSummaryApiModel());
      return Ok(model);
    }
  }
}
