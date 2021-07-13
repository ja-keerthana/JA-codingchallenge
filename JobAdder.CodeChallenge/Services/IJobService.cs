using JobAdder.CodeChallenge.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JobAdder.CodeChallenge.Services
{
  public interface IJobService
  {
    Task<ICollection<Job>> FindAllAsync();
    Task<IPagedList<Job>> FindAsync(int pageIndex = 0, int pageSize = 10);
    Task<Job> GetByIDAsync(int jobId);
  }
}
