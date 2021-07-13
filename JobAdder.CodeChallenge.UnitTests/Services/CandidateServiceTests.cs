using JobAdder.CodeChallenge.Models;
using JobAdder.CodeChallenge.Services;
using Moq;
using Moq.Protected;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace JobAdder.CodeChallenge.UnitTests.Services
{
  public class CandidateServiceTests
  {
    public CandidateServiceTests()
    {
      _httpMessageHandlerMock = new Mock<HttpMessageHandler>();
      _sut = new CandidateService(new HttpClient(_httpMessageHandlerMock.Object));
    }

    private readonly Mock<HttpMessageHandler> _httpMessageHandlerMock;
    private readonly ICandidateService _sut;

    private static ICollection<Candidate> _candidateData =>
      new List<Candidate>
      {
        new Candidate { CandidateId = 1, Name = "Candidate01", SkillTags = new List<string> { "skill1", "Skill2", "skill5" } },
        new Candidate { CandidateId = 2, Name = "Candidate02", SkillTags = new List<string> { "skill4", "Skill9", "skill4", "skill2" } },
        new Candidate { CandidateId = 3, Name = "Candidate03", SkillTags = new List<string> { "skill5", " Skill2", "skill5" } },
        new Candidate { CandidateId = 4, Name = "Candidate04", SkillTags = new List<string> { "skill1", "Skill8", "skill5" } },
        new Candidate { CandidateId = 5, Name = "Candidate05", SkillTags = new List<string> { "skill1 " } },
        new Candidate { CandidateId = 6, Name = "Candidate06", SkillTags = new List<string> { "skill3", "Skill2", "skill5", "skill5", "Skill2" } },
        new Candidate { CandidateId = 7, Name = "Candidate07", SkillTags = new List<string> { "skill1", "Skill2", "skill7" } },
        new Candidate { CandidateId = 8, Name = "Candidate08", SkillTags = new List<string> { "skill5", "Skill7", "skill5", "skill6" } },
        new Candidate { CandidateId = 9, Name = "Candidate09", SkillTags = new List<string> { "skill8", "Skill2", "skill5" } },
        new Candidate { CandidateId = 10, Name = "Candidate10", SkillTags = new List<string> { "skill9", "Skill1" } },
      };

    private void SetupHttpMessageHandlerMock(Mock<HttpMessageHandler> httpMessageHandlerMock, HttpResponseMessage httpResponseMessage, Expression httpRequestMessageMock = null)
    {
      httpMessageHandlerMock
        .Protected()
        .Setup<Task<HttpResponseMessage>>(
          "SendAsync",
          httpRequestMessageMock == null ? ItExpr.IsAny<HttpRequestMessage>() : httpRequestMessageMock,
          ItExpr.IsAny<CancellationToken>()
        ).ReturnsAsync(httpResponseMessage);
    }

    #region FindAllAsync

    [Fact]
    public async Task FindAllAsync_ReturnsCandidates_WhenValidJsonIsReturnedByTheApi()
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent(JsonSerializer.Serialize(_candidateData))
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act
      var result = await _sut.FindAllAsync();

      // assert
      Assert.True(result.Any());
    }


    [Fact]
    public async Task FindAllAsync_ThrowsJsonException_WhenInvalidJsonIsReturnedByTheApi()
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent("not json")
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act & assert
      await Assert.ThrowsAsync<JsonException>(async () => await _sut.FindAllAsync());
    }

    [Fact]
    public async Task FindAllAsync_ReturnsEmptyList_WhenHttpRequestFails()
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.InternalServerError
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act
      var result = await _sut.FindAllAsync();

      // assert
      Assert.False(result.Any());
    }

    #endregion

    #region FindAsync

    [Fact]
    public async Task FindAsync_ReturnsCandidates_WhenValidJsonIsReturnedByTheApi()
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent(JsonSerializer.Serialize(_candidateData))
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act
      var result = await _sut.FindAsync();

      // assert
      Assert.True(result.Items.Any());
    }


    [Fact]
    public async Task FindAsync_ThrowsJsonException_WhenInvalidJsonIsReturnedByTheApi()
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent("not json")
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act & assert
      await Assert.ThrowsAsync<JsonException>(async () => await _sut.FindAsync());
    }

    [Fact]
    public async Task FindAsync_ReturnsEmptyListOfCandidates_WhenHttpRequestFails()
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.InternalServerError
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act
      var result = await _sut.FindAsync();

      // assert
      Assert.Equal(0, result.PageIndex);
      Assert.Equal(10, result.PageSize);
      Assert.Equal(0, result.TotalItems);
      Assert.Empty(result.Items);
    }

    [Theory]
    [InlineData(0, 4, 4)]
    [InlineData(0, 0, 10)]
    [InlineData(0, -1, 10)]
    [InlineData(0, 11, 10)]
    [InlineData(1, 5, 5)]
    [InlineData(1, 6, 4)]
    [InlineData(-1, 3, 3)]
    public async Task FindAsync_ReturnsExpectedNumberOfCandidates_WhenPageIndexAndPageSizeAreProvided(int pageIndex, int pageSize, int expectedCount)
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent(JsonSerializer.Serialize(_candidateData))
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act
      var result = await _sut.FindAsync(pageIndex, pageSize);

      // assert
      Assert.True(result.Items.Count == expectedCount);
    }

    [Theory]
    [InlineData(0, 10, new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 })]
    [InlineData(0, 4, new int[] { 1, 2, 3, 4 })]
    [InlineData(1, 3, new int[] { 4, 5, 6 })]
    [InlineData(2, 2, new int[] { 5, 6 })]
    [InlineData(9, 1, new int[] { 10 })]
    [InlineData(-1, 3, new int[] { 1, 2, 3 })]
    [InlineData(-1, -1, new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 })]
    public async Task FindAsync_ReturnsExpectedCandidates_WhenPageIndexAndPageSizeAreProvided(int pageIndex, int pageSize, int[] expectedCandidateIDs)
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent(JsonSerializer.Serialize(_candidateData))
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act
      var result = await _sut.FindAsync(pageIndex, pageSize);

      // assert
      Assert.True(Enumerable.SequenceEqual(result.Items.Select(x => x.CandidateId), expectedCandidateIDs));
    }

    [Theory]
    [InlineData(0, 4, 10)]
    [InlineData(0, 0, 10)]
    [InlineData(0, -1, 10)]
    [InlineData(0, 11, 10)]
    [InlineData(1, 5, 10)]
    [InlineData(1, 6, 10)]
    [InlineData(-5, 3, 10)]
    public async Task FindAsync_ReturnsExpectedTotalItems(int pageIndex, int pageSize, int expectedTotalItems)
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent(JsonSerializer.Serialize(_candidateData))
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act
      var result = await _sut.FindAsync(pageIndex, pageSize);

      // assert
      Assert.Equal(expectedTotalItems, result.TotalItems);
    }

    [Theory]
    [InlineData(0, 4, 0)]
    [InlineData(0, 0, 0)]
    [InlineData(0, -1, 0)]
    [InlineData(0, 11, 0)]
    [InlineData(1, 5, 1)]
    [InlineData(1, 6, 1)]
    [InlineData(-5, 3, 0)]
    public async Task FindAsync_ReturnsExpectedPageIndex(int pageIndex, int pageSize, int expectedPageIndex)
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent(JsonSerializer.Serialize(_candidateData))
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act
      var result = await _sut.FindAsync(pageIndex, pageSize);

      // assert
      Assert.Equal(expectedPageIndex, result.PageIndex);
    }

    [Theory]
    [InlineData(0, 4, 4)]
    [InlineData(0, 0, 10)]
    [InlineData(0, -1, 10)]
    [InlineData(0, 11, 11)]
    [InlineData(1, 5, 5)]
    [InlineData(1, 6, 6)]
    [InlineData(-5, 3, 3)]
    public async Task FindAsync_ReturnsExpectedPageSize(int pageIndex, int pageSize, int expectedPageSize)
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent(JsonSerializer.Serialize(_candidateData))
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act
      var result = await _sut.FindAsync(pageIndex, pageSize);

      // assert
      Assert.Equal(expectedPageSize, result.PageSize);
    }

    #endregion

    #region GetByIDAsync

    [Fact]
    public async Task GetByIDAsync_ReturnsACandidate_WhenValidJsonIsReturnedByTheApi()
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent(JsonSerializer.Serialize(_candidateData))
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act
      var result = await _sut.GetByIDAsync(1);

      // assert
      Assert.NotNull(result);
    }

    [Fact]
    public async Task GetByIDAsync_ThrowsJsonException_WhenInvalidJsonIsReturnedByTheApi()
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent("not json")
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act & assert
      await Assert.ThrowsAsync<JsonException>(async () => await _sut.GetByIDAsync(1));
    }

    [Fact]
    public async Task GetByIDAsync_ReturnsNull__WhenHttpRequestFails()
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.InternalServerError
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act
      var result = await _sut.GetByIDAsync(1);

      // assert
      Assert.Null(result);
    }

    [Theory]
    [InlineData(1, 1)]
    [InlineData(2, 2)]
    [InlineData(10, 10)]
    public async Task GetByIDAsync_ReturnsExpectedCandidate(int candidateID, int expectedCandidateID)
    {
      // arrange
      var httpResponseMessage = new HttpResponseMessage
      {
        StatusCode = HttpStatusCode.OK,
        Content = new StringContent(JsonSerializer.Serialize(_candidateData))
      };
      SetupHttpMessageHandlerMock(_httpMessageHandlerMock, httpResponseMessage);

      // act
      var result = await _sut.GetByIDAsync(candidateID);

      // assert
      Assert.Equal(expectedCandidateID, result.CandidateId);
    }

    #endregion
  }
}
