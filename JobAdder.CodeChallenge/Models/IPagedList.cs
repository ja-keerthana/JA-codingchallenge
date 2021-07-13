using System.Collections.Generic;

namespace JobAdder.CodeChallenge.Models
{
  public interface IPagedList<T> where T : class
  {
    int PageSize { get; set; }
    int PageIndex { get; set; }
    ICollection<T> Items { get; set; }
    int TotalItems { get; set; }
  }
}
