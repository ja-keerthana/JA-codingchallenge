import { createHttpFactory, SpectatorHttpFactory, SpectatorHttp, HttpMethod } from '@ngneat/spectator';
import { JobService } from './job.service';
import { environment } from '../../../environments/environment';

describe('JobService', () => {
  let spectator: SpectatorHttp<JobService>;

  const createHttp: SpectatorHttpFactory<JobService> = createHttpFactory(JobService);

  beforeEach(() => {
    spectator = createHttp();
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  it('should find jobs', () => {
    // arrange
    const pageIndex: number = 0;
    const pageSize: number = 10;
    const url: string = `${environment.apiUrl}/jobs?pageIndex=${pageIndex}&pageSize=${pageSize}`;

    // act
    spectator.service.findJobs(pageIndex, pageSize).subscribe();

    // assert
    spectator.expectOne(url, HttpMethod.GET);
  });

  it('should get job', () => {
    // arrange
    const jobId: number = 42;
    const url: string = `${environment.apiUrl}/jobs/${jobId}`;

    // act
    spectator.service.getJob(jobId).subscribe();

    // assert
    spectator.expectOne(url, HttpMethod.GET);
  });

  it('should match job to candidates', () => {
    // arrange
    const jobId: number = 42;
    const take: number = 5;
    const url: string = `${environment.apiUrl}/jobs/${jobId}/candidates?take=${take}`;

    // act
    spectator.service.matchJobToCandidates(jobId, take).subscribe();

    // assert
    spectator.expectOne(url, HttpMethod.GET);
  });
});
