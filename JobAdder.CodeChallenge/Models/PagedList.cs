using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JobAdder.CodeChallenge.Models
{
  class PagedList<T> : IPagedList<T> where T: class
  {
   
    public int PageSize { get; set; }
    public int PageIndex { get; set; }
    public ICollection<T> Items { get; set; }
    public int TotalItems { get; set; }
  }
}
