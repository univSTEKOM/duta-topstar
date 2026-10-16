// Lets any "Daftar" button open the registration dialog directly.
// Buttons stay plain #daftar links, so without JS (or before the form mounts) they still scroll there.

const OPEN_EVENT = "ts:open-registration";
let formReady = false;

export function setRegistrationReady(ready: boolean) {
  formReady = ready;
}

export function openRegistration(event?: { preventDefault: () => void }) {
  if (!formReady) return;
  event?.preventDefault();
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenRegistration(listener: () => void) {
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}
