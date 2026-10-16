import Image from 'next/image'
import { StepNumber } from './StepNumber'

const reasons = [
  {
    title: 'An existing routine',
    text: <>This is a <a href="https://jamesclear.com/habit-stacking"><em>habit stacking</em></a> tool. You are already coding; add this to your routine and you’ll get stronger.</>,
  },
  {
    title: 'A small interruption',
    text: <>You can do as many or as few pushups as you want. Your growth is based on the technique known as <a href="https://www.reddit.com/r/bodyweightfitness/comments/9zrpga/grease_the_groove_is_truly_a_miracle/">“greasing the groove”</a>. Practice good form, frequently, at sub-maximal intensity to build neuromuscular efficiency.</>,
  },
  {
    title: 'Repetition',
    text: <>Like coding, eventually doing pushups while you work will become second nature. That repetition will make you stronger.</>,
  },
]

export function WhyItWorksSection() {
  return <section className="why-section section-divider" aria-labelledby="why-title">
    <div className="why-copy">
      <h2 id="why-title" className="page-heading">Why this works</h2>
      <ol className="reasons-grid" role="list">
        {reasons.map((reason, index) => <li className="reason" key={reason.title}>
          <h3>
            <StepNumber number={index + 1} />
            <span>{reason.title}</span>
          </h3>
          <p>{reason.text}</p>
        </li>)}
      </ol>
    </div>
    <Image className="why-illustration" src="/mascot/why-it-works.webp" alt="The GitPushups mascot wearing glasses and writing in a notebook, facing the explanation." width={1057} height={1488} sizes="(max-width: 680px) 110px, (max-width: 900px) 190px, 240px" />
  </section>
}
