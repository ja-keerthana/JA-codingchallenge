import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobSummary, Job } from '../models';
import { CandidateSummary } from '../../candidates/models';
import { environment } from '../../../environments/environment';
import { PagedList } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private _http: HttpClient) { }

  public findJobs(pageIndex: number = 0, pageSize: number = 10): Observable<PagedList<JobSummary> | null> {
    return this._http.get<PagedList<JobSummary> | null>(`${environment.apiUrl}/jobs/9999999999`);
  }

  public getJob(jobId: number): Observable<Job | null> {
    return this._http.get<Job | null>(`${environment.apiUrl}/jobs/${jobId}`);
  }

  public matchJobToCandidates(jobId: number, take: number = 5): Observable<CandidateSummary[] | null> {
    return this._http.get<CandidateSummary[] | null>(`${environment.apiUrl}/jobs/${jobId}/candidates?take=${take}`);
  }
}
