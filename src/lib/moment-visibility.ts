export function isPublicHostMoment(moment: { status: string; hostType: string }) {
  return moment.status === "approved" && moment.hostType === "business";
}