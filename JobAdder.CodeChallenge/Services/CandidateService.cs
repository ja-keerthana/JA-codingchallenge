using JobAdder.CodeChallenge.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace JobAdder.CodeChallenge.Services
{
  public class CandidateService : ICandidateService
  {
    public CandidateService(HttpClient httpClient)
    {
      _httpClient = httpClient ?? new HttpClient();
    }

    private readonly HttpClient _httpClient;

    public async Task<ICollection<Candidate>> FindAllAsync()
    {
      var response = await _httpClient.GetAsync("http://private-76432-jobadder1.apiary-mock.com/candidates");
      if (!response.IsSuccessStatusCode)
        throw new NotImplementedException();

      var json = response.Content.ReadAsStringAsync().Result;

      var jsonSerializerOptions = new JsonSerializerOptions
      {
        PropertyNameCaseInsensitive = true
      };

      return JsonSerializer.Deserialize<ICollection<Candidate>>(json, jsonSerializerOptions);
    }

    public async Task<IPagedList<Candidate>> FindAsync(int pageIndex = 0, int pageSize = 10)
    {
      pageIndex = pageIndex < 0 ? 0 : pageIndex;
      pageSize = pageSize <= 0 ? 10 : pageSize;

      var candidates = await FindAllAsync();
      var candidatesList = new PagedList<Candidate>();
      if (candidates == null || candidates.Count == 0) return candidatesList;

      if (pageIndex * pageSize >= candidates.Count) throw new ArgumentOutOfRangeException();
      var pagedCandidates = candidates.Skip(pageIndex * pageSize).Take(pageSize).ToList();
      
      candidatesList.PageIndex = pageIndex;
      candidatesList.PageSize = pageSize;
      candidatesList.Items = pagedCandidates;
      candidatesList.TotalItems = candidates.Count;

      return candidatesList;
    }

    public async Task<Candidate> GetByIDAsync(int candidateID)
    {
      var response = await _httpClient.GetAsync("http://private-76432-jobadder1.apiary-mock.com/candidates");
      if (!response.IsSuccessStatusCode)
        throw new NotImplementedException();

      var json = response.Content.ReadAsStringAsync().Result;

      var jsonSerializerOptions = new JsonSerializerOptions
      {
        PropertyNameCaseInsensitive = true
      };

      var candidates = JsonSerializer.Deserialize<ICollection<Candidate>>(json, jsonSerializerOptions);

      return candidates.Single(x => x.CandidateId == candidateID);
    }
  }
}
