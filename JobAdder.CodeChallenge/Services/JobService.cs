using JobAdder.CodeChallenge.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace JobAdder.CodeChallenge.Services
{
  public class JobService : IJobService
  {
    public JobService(HttpClient httpClient)
    {
      _httpClient = httpClient ?? new HttpClient();
    }

    private readonly HttpClient _httpClient;

    public async Task<ICollection<Job>> FindAllAsync()
    {
      var response = await _httpClient.GetAsync("http://private-76432-jobadder1.apiary-mock.com/jobs");
      if (!response.IsSuccessStatusCode)
        throw new NotImplementedException();

      var json = response.Content.ReadAsStringAsync().Result;

      var jsonSerializerOptions = new JsonSerializerOptions
      {
        PropertyNameCaseInsensitive = true
      };

      return JsonSerializer.Deserialize<ICollection<Job>>(json, jsonSerializerOptions);
    }

    public async Task<IPagedList<Job>> FindAsync(int pageIndex = 0, int pageSize = 10)
    {
      pageIndex = pageIndex < 0 ? 0 : pageIndex;
      pageSize = pageSize <= 0 ? 10 : pageSize;

      var jobs = await FindAllAsync();
      var jobsList = new PagedList<Job>();
      if (jobs == null || jobs.Count == 0 ) return jobsList;
      if (pageIndex * pageSize >= jobs.Count) throw new ArgumentOutOfRangeException();
      var pagedJobs = jobs.Skip(pageIndex * pageSize).Take(pageSize).ToList();
     
      jobsList.PageIndex = pageIndex;
      jobsList.PageSize = pageSize;
      jobsList.Items = pagedJobs;
      jobsList.TotalItems = jobs.Count;

      return jobsList;
      //throw new NotImplementedException("TODO - Implement Pagination");
    }

    public async Task<Job> GetByIDAsync(int jobId)
    {
      var response = await _httpClient.GetAsync("http://private-76432-jobadder1.apiary-mock.com/jobs");
      if (!response.IsSuccessStatusCode)
        throw new NotImplementedException();

      var json = response.Content.ReadAsStringAsync().Result;

      var jsonSerializerOptions = new JsonSerializerOptions
      {
        PropertyNameCaseInsensitive = true
      };

      var jobs = JsonSerializer.Deserialize<ICollection<Job>>(json, jsonSerializerOptions);

      return jobs.Single(x => x.JobId == jobId);
    }
  }
}
