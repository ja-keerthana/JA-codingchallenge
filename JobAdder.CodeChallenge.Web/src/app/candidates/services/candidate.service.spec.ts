import { createHttpFactory, SpectatorHttpFactory, SpectatorHttp, HttpMethod } from '@ngneat/spectator';
import { CandidateService } from './candidate.service';
import { environment } from '../../../environments/environment';

describe('CandidateService', () => {
  let spectator: SpectatorHttp<CandidateService>;

  const createHttp: SpectatorHttpFactory<CandidateService> = createHttpFactory(CandidateService);

  beforeEach(() => {
    spectator = createHttp();
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  it('should find candidates', () => {
    // arrange
    const pageIndex: number = 0;
    const pageSize: number = 10;
    const url: string = `${environment.apiUrl}/candidates?pageIndex=${pageIndex}&pageSize=${pageSize}`;

    // act
    spectator.service.findCandidates(pageIndex, pageSize).subscribe();

    // assert
    spectator.expectOne(url, HttpMethod.GET);
  });

  it('should get candidate', () => {
    // arrange
    const candidateId: number = 42;
    const url: string = `${environment.apiUrl}/candidates/${candidateId}`;

    // act
    spectator.service.getCandidate(candidateId).subscribe();

    // assert
    spectator.expectOne(url, HttpMethod.GET);
  });

  it('should match candidate to jobs', () => {
    // arrange
    const candidateId: number = 42;
    const take: number = 5;
    const url: string = `${environment.apiUrl}/candidates/${candidateId}/jobs?take=${take}`;

    // act
    spectator.service.matchCandidateToJobs(candidateId, take).subscribe();

    // assert
    spectator.expectOne(url, HttpMethod.GET);
  });
});
