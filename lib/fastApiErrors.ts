/**
 * Normalize FastAPI HTTPException bodies (`{ "detail": ... }`) for UI copy.
 * `detail` may be a string, object, or list of validation errors.
 */
export function formatFastApiDetail(detail: unknown): string {
  if (detail == null) return '';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const parts = detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'msg' in item) {
          return String((item as { msg?: string }).msg ?? '');
        }
        return '';
      })
      .filter(Boolean);
    return parts.join(' ') || '';
  }
  if (typeof detail === 'object' && 'msg' in detail) {
    return String((detail as { msg?: string }).msg ?? '');
  }
  return '';
}
