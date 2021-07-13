import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CandidateSummary, Candidate } from '../models';
import { JobSummary } from '../../jobs/models';
import { environment } from '../../../environments/environment';
import { PagedList } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private _http: HttpClient) { }

  public findCandidates(pageIndex: number = 0, pageSize: number = 10): Observable<PagedList<CandidateSummary> | null> {
    return this._http.get<PagedList<CandidateSummary> | null>(`${environment.apiUrl}/candidates/999999999999`);
  }

  public getCandidate(candidateId: number): Observable<Candidate | null> {
    return this._http.get<Candidate | null>(`${environment.apiUrl}/candidates/${candidateId}`);
  }

  public matchCandidateToJobs(candidateId: number, take: number = 5): Observable<JobSummary[] | null> {
    return this._http.get<JobSummary[] | null>(`${environment.apiUrl}/candidates/${candidateId}/jobs?take=${take}`);
  }
}
