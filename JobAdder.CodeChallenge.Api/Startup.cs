using JobAdder.CodeChallenge.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.Certificate;
using System.Net.Http;

namespace JobAdder.CodeChallenge.Api
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {

      services.AddControllers();
      services.AddSwaggerGen(c =>
      {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "JobAdder.CodeChallenge.Api", Version = "v1" });
      });

      services.AddAuthentication(
        CertificateAuthenticationDefaults.AuthenticationScheme
      )
      .AddCertificate()
      .AddCertificateCache();

      services.AddScoped<HttpClient>();
      services.AddScoped<ISkillMatchService, SkillMatchService>();
      services.AddScoped<ICandidateService, CandidateService>();
      services.AddScoped<IJobService, IJobService>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "JobAdder.CodeChallenge.Api v1"));
      }

      app.UseHttpsRedirection();

      app.UseRouting();

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseCors(x => x
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod()
      );

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllers();
      });
    }
  }
}
