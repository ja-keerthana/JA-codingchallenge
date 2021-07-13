using JobAdder.CodeChallenge.Api.Models;
using JobAdder.CodeChallenge.Models;
using JobAdder.CodeChallenge.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace JobAdder.CodeChallenge.Api.Controllers
{
  [Route("jobs")]
  [ApiController]
  public class JobsController : ControllerBase
  {
    public JobsController(IJobService jobService, ICandidateService candidateService, ISkillMatchService skillMatchService)
    {
      _jobService = jobService;
      _candidateService = candidateService;
      _skillMatchService = skillMatchService;
    }

    private readonly IJobService _jobService;
    private readonly ICandidateService _candidateService;
    private readonly ISkillMatchService _skillMatchService;

    [HttpGet("")]
    public async Task<IActionResult> Find([FromQuery] int pageIndex = 0, [FromQuery] int pageSize = 10)
    {
      var paginatedJobs = await _jobService.FindAsync(pageIndex, pageSize);

      var model = paginatedJobs.ToPagedListApiModel();

      return Ok(model);
    }

    [HttpGet("{jobId:int:min(1)}")]
    public async Task<IActionResult> Get(int jobId)
    {
      var job = await _jobService.GetByIDAsync(jobId);

      var model = job.ToApiModel();

      return Ok(model);
    }

    [HttpGet("{jobId:int:min(1)}/candidates")]
    public async Task<IActionResult> MatchCandidates(int jobId, [FromQuery] int take = 5)
    {
      var job = await _jobService.GetByIDAsync(jobId);
      if (job == null)
        return NotFound();

      var candidates = await _candidateService.FindAllAsync();
      if (!candidates.Any())
        return Ok(new PagedListApiModel<Candidate>());

      var bestMatchedCandidates = _skillMatchService.GetBestCandidatesForJob(job, candidates, take);
      if (!bestMatchedCandidates.Any())
        return Ok(new PagedListApiModel<Candidate>());

      var model = bestMatchedCandidates.Select(x => x.ToSummaryApiModel());
      return Ok(model);
    }
  }
}
