using System.Collections.Generic;

namespace JobAdder.CodeChallenge.Api.Models
{
  public class PagedListApiModel<T> where T : class
  {
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
    public ICollection<T> Items { get; set; } = new List<T>();
    public int TotalItems { get; set; }
  }
}
