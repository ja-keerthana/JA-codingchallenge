using JobAdder.CodeChallenge.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JobAdder.CodeChallenge.Services
{
  public interface ICandidateService
  {
    Task<ICollection<Candidate>> FindAllAsync();
    Task<IPagedList<Candidate>> FindAsync(int pageIndex = 0, int pageSize = 10);
    Task<Candidate> GetByIDAsync(int candidateID);
  }
}
