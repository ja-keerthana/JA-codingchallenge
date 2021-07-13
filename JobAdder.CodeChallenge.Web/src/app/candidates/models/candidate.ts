import { CandidateSummary } from './candidate-summary';

export interface Candidate extends CandidateSummary {
    skillTags: string[];
}