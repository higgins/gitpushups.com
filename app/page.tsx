import { getLeaderboard } from '@/lib/api'
import { AccordionItem } from '@/components/ui/accordion'
import { GitHook } from '@/components/GitHook'
import { Buffer } from 'buffer'
import { Montserrat } from 'next/font/google'
import { AppStoreBadge } from '@/components/AppStore'
import { PlayStoreBadge } from '@/components/PlayStore'

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
      <div className="flex flex-row items-center gap-2">
        <h1
          className="
                     font-bold
                     text-6xl
                     max-[430px]:text-4xl   /* iPhone 14/15/Pro widths */
                     "
        >
          Do pushups...<br />or we'll block your commits.
        </h1>

        <img
          src="/punch.gif"
          className="
               h-[20rem]             /* default desktop/tablet */
               shrink-0 w-auto
               max-[430px]:h-40      /* ~160px on iPhone 14/15 */
               "
          alt="Punching mascot"
        />
      </div>
      <section id="how-it-works" className="space-y-2">
        <h3 className="text-3xl max-[375px]:text-2xl font-bold mt-10">
          How it works
        </h3>
        <ol className="list-decimal list-inside space-y-2">
          <li className="text-xl mb-6">
            Download the app
            <div className="flex flex-row justify-start gap-2">
              <AppStoreBadge appStoreUrl={"https://apps.apple.com/us/app/git-pushups/id6747657596"} />
              <PlayStoreBadge appStoreUrl={"https://play.google.com/store/apps/details?id=com.gitpushups.android"} />
            </div>
          </li>
          <li className="text-xl">
            Add this rule to your <code>.git/hooks/</code> dir:
            <GitHook />
          </li>
          <li className="text-xl">
            Get back to coding! If you don't do pushups everyday, your git-hook will error.
          </li>
        </ol>
      </section>
      <section id="stats" className="bg-gradient-to-b from-[#FC803F] to-[#EA1A72] p-5 text-white rounded-xl">
        <h3 className="text-3xl font-bold text-black italic mb-0 pb-0">
          The Stats
        </h3>
        <div className="flex flex-row justify-start items-start">
          <p className="text-xl">
            Developers like you have done...{' '}<br />
            <span className="text-5xl font-bold">
              {typeof totalPushups === 'number'
                ? totalPushups.toLocaleString()
                : totalPushups}{' '}
              pushups
            </span><br />
            ...and counting!
          </p>
          <img className="h-36" src="/oneHanded.gif" />
        </div>
      </section>
      <section id="faq">
        <h3 className="text-4xl lg:text-5xl font-bold">
          FAQ
        </h3>
        <div className="divide-y">
          <AccordionItem title="Wait...what?">This is a habit stacking tool. You are already coding, add this to your routine and you'll get stronger.</AccordionItem>
          <AccordionItem title="Why pushups?">You can do them anywhere, with no equipment and they are great for you.</AccordionItem>
          <AccordionItem title="Is it free?">Yep. You can help make sure it stays around by paying for the Pro version.</AccordionItem>
          <AccordionItem title="What's in the Pro version?">Daily goals and a contribution graph. iOS users can also sync their workouts to Apple Health.</AccordionItem>
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
          <AccordionItem
            id="how-to-delete-my-account"
            title="How do I delete my account?"
          >
            In order to delete your account, open the mobile app, view your profile and click the "delete my account" button.
          </AccordionItem>
        </div>
      </section>
    </main >
  )
}
