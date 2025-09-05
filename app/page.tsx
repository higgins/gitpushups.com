import { getLeaderboard } from '@/lib/api'
import { AccordionItem } from '@/components/ui/accordion'
import { GitHook } from '@/components/GitHook'
import { Buffer } from 'buffer'
import { Montserrat } from 'next/font/google'
import { AppStoreBadge } from '@/components/AppStore'

const montserrat = Montserrat({ subsets: ['latin'] })

export default async function LandingPage({
  searchParams,
}: {
  searchParams?: { shareId?: string }
}) {
  if (searchParams?.shareId) {
    try {
      const username = Buffer.from(searchParams.shareId, 'base64').toString('utf8')
      await fetch('https://api.gitpushups.com/shareLink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
    } catch (err) {
      console.error('Failed to send share link', err)
    }
  }

  const data = await getLeaderboard()
  let totalPushups: number | string = 'thousands of'
  try {
    const res = await fetch('https://api.gitpushups.com/totalPushups', {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const json = await res.json() as any;
      if (typeof json.total === 'number') {
        totalPushups = json.total
      }
    } else {
      console.error('Failed to fetch total pushups', res.statusText)
    }
  } catch (err) {
    console.error('Error fetching total pushups', err)
  }

  return (
    <main className={`mx-auto max-w-[600px] p-4 space-y-6 ${montserrat.className}`} >
      <div className="flex flex-row items-center">
        <h1 className="text-4xl lg:text-5xl font-bold">
          Do pushups...<br />or we'll block your commits.
        </h1>
        <img className="h-[10rem]" src="/punch.gif" />
      </div>
      <section id="how-it-works" className="space-y-2">
        <img className="h-[48px]" src="/howitworks.png" />
        <ol className="list-decimal list-inside space-y-2">
          <li className="text-xl font-semibold">
            Download the app
            <AppStoreBadge appStoreUrl={"https://testflight.apple.com/join/z6vqttNG"} />
          </li>
          <li className="text-xl font-semibold">
            Add this rule to your <code>.git/hooks/pre-commit</code>:
            <GitHook />
          </li>
        </ol>
      </section>
      <section id="stats">
        <img className="h-[48px] mt-8" src="/thestats.png" />
        <div className="flex flex-row justify-start items-center">
          <p className="text-xl text-gray-600">
            Developers like you have done{' '}
            <span className="font-bold">
              {typeof totalPushups === 'number'
                ? totalPushups.toLocaleString()
                : totalPushups}{' '}
              pushups
            </span>
            ...and counting!
          </p>
          <img className="h-24" src="/oneHanded.gif" />
        </div>
      </section>
      <section id="faq">
        <img className="h-[48px]" src="/faq.png" />
        <div className="divide-y">
          <AccordionItem title="Wait...what?">This is a habit stacking tool. You are already coding, add this to your routine and you'll get stronger.</AccordionItem>
          <AccordionItem title="Why pushups?">You can do them anywhere, with no equipment and they are great for you.</AccordionItem>
          <AccordionItem title="Is it free?">Yep. You can help make sure it stays around by paying for the Pro version.</AccordionItem>
          <AccordionItem title="What's in the Pro version?">Daily goals and a contribution graph.</AccordionItem>
          <AccordionItem title="Help! I got too swol!">No such thing.</AccordionItem>
          <AccordionItem title="What if I already have a workout routine?">
            <>
              <span>That's green-guy mentality. Pushups supplement any routine.</span>
              <img className="h-24" src="/greenMidWit.gif" />
            </>
          </AccordionItem>
          <AccordionItem title="But...science?">
            <>
              <span>The technique is based on <a className="font-bold" target="_blank" href="https://www.reddit.com/r/bodyweightfitness/comments/9zrpga/grease_the_groove_is_truly_a_miracle/">"greasing the groove"</a>: practice good form, frequently, at submaximal intensity to build neuromuscular efficiency.</span>
            </>
          </AccordionItem>
          <AccordionItem title="Who made this?">Hi, I'm <a className="font-bold" target="_blank" href="https://x.com/justinprojects">Justin</a> and love making fun products.</AccordionItem>
        </div>
      </section>
    </main >
  )
}
