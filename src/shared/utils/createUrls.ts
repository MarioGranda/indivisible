export function getDaoUrl(dao: string) {
    return `/${dao}`;
  }

export function getPolygonscanUrl(txHash: string) {
  return `https://mumbai.polygonscan.com/${txHash}`
}
