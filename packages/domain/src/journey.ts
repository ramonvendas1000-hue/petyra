export type JourneyStage = 'scheduled'|'checked_in'|'bathing'|'drying'|'grooming'|'finishing'|'ready'|'completed'|'cancelled';
const next: Record<JourneyStage, readonly JourneyStage[]> = {
  scheduled: ['checked_in','cancelled'],
  checked_in: ['bathing','grooming','finishing','cancelled'],
  bathing: ['drying'],
  drying: ['grooming','finishing'],
  grooming: ['finishing'],
  finishing: ['ready'],
  ready: ['completed'],
  completed: [],
  cancelled: [],
};
/** Candidate grooming workflow; server checks service checklist and event version as well. */
export function canAdvanceJourney(from: JourneyStage, to: JourneyStage): boolean {
  return next[from]?.includes(to) ?? false;
}
