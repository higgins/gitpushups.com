export function StepNumber({ number }: { number: number }) {
  return <svg className="reason-number" viewBox="0 0 80 90" aria-hidden="true" focusable="false">
    <text x="8" y="75" strokeLinejoin="round">{number}</text>
  </svg>
}
