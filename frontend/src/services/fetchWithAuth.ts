export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
) {
  const res = await fetch(input, init);
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("auth_token");
    window.location.href = "/login?expired=1";
    throw new Error("Session expired. Please log in again.");
  }
  return res;
}
