/**
 * querySelector that also pierces open shadow roots at any depth.
 */
export function querySelectorDeep<T extends Element = Element>(
  selector: string,
  root: Document | ShadowRoot | Element = document,
): T | null {
  const match = root.querySelector<T>(selector);
  if (match) {
    return match;
  }

  for (const el of root.querySelectorAll<Element>("*")) {
    if (el.shadowRoot) {
      const nested = querySelectorDeep<T>(selector, el.shadowRoot);
      if (nested) {
        return nested;
      }
    }
  }

  return null;
}
