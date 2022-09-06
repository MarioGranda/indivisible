export function getDaoUrl(dao: string) {
  return `/${dao}`;
}

export function getProposalUrl(dao: string, proposalId: number) {
  return `/${dao}/${proposalId}`;
}

export function getPolygonscanUrl(txHash: string) {
  return `https://mumbai.polygonscan.com/${txHash}`;
}
