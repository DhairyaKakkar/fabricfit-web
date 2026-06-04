export function openTrialModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-trial-modal'));
  }
}
