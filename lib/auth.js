export function getAuthedUserIdFromRequest(request) {
  const raw = request.cookies.get("tbp_uid")?.value || "";
  const userId = Number(raw);
  if (!userId || Number.isNaN(userId) || userId < 1) {
    return null;
  }
  return userId;
}
