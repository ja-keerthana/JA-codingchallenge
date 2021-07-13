import { JobSummary } from './job-summary';

export interface Job extends JobSummary
{    
  company: string;
  skills: string[];
}