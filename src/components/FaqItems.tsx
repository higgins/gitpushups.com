import { AccordionItem } from "@/components/ui/accordion"
import { SUPPORT_PAYMENT_URL } from '@/lib/support'

export function FaqItems({ landing = false }: { landing?: boolean }) {
  return <div className="faq-items">
          {!landing && <> <AccordionItem title="Wait...what?">This is a habit stacking tool. You are already coding, add this to your routine and you’ll get stronger.</AccordionItem> </>}
          <AccordionItem title="Why pushups?">You can do them anywhere, with no equipment and they are great for you.</AccordionItem>
          {!landing && <> <AccordionItem title="Is it free?">Yes. All features are free, with no subscription required.</AccordionItem> </>}
          {landing ? <AccordionItem title="Can I sync with Apple Health?">Yes. iOS users can sync their workouts to Apple Health.</AccordionItem> : <AccordionItem title="What's included?">Daily goals and a contribution graph. iOS users can also sync their workouts to Apple Health. These features are available to everyone.</AccordionItem>}
          <AccordionItem title="Help! I got too swol!">No such thing.</AccordionItem>
          <AccordionItem title="What if I already have a workout routine?">
            <>
              <span>That’s green-guy mentality. Pushups supplement any routine.</span>
              <img className="h-24" src="/greenMidWit.gif" alt="The green GitPushups character" />
            </>
          </AccordionItem>
          {!landing && <> <AccordionItem title="But...science?">
            <>
              <span>The technique is based on <a className="font-bold" target="_blank" href="https://www.reddit.com/r/bodyweightfitness/comments/9zrpga/grease_the_groove_is_truly_a_miracle/">&quot;greasing the groove&quot;</a>: practice good form, frequently, at submaximal intensity to build neuromuscular efficiency.</span>
            </>
          </AccordionItem> </>}
          <AccordionItem title="I have a feature request!">
            <>
              <div>I’d like to keep this project simple. Simple is good.</div><br />
              <div>That being said, if you have an idea you think makes the service better, I’m all ears!</div><br /><div>Hit me up on any channel you find me at or create an issue on the <a className="font-bold" href="https://github.com/higgins/gitpushups.com" target="_blank">github repo</a>.</div>
            </>
          </AccordionItem>
          <AccordionItem title="I found a bug!">
            <>
              <span>Oops! Create an issue on the <a className="font-bold" href="https://github.com/higgins/gitpushups.com" target="_blank">github repo</a> or send me a DM.</span>
            </>
          </AccordionItem>
          <AccordionItem
            id="how-to-delete-my-account"
            title="How do I delete my account?"
          >
            <>
              <div>Open the mobile app, view your profile and click the &quot;delete my account&quot; button. This cannot be undone.</div><br />
              <div>You’ll lose the memories...but those gains are yours forever.</div>
            </>
          </AccordionItem>
          <AccordionItem title="How can I support this project?">
            Tell your friends or <a className="font-bold underline underline-offset-4" href={SUPPORT_PAYMENT_URL}>send me a tip</a>
          </AccordionItem>
          <AccordionItem title="Who made this?" id="who-made-this">
            <>
              Hi, I’m <a className="font-bold" target="_blank" href="https://encapsulate.me">Justin</a> and love making fun products.
              <div className="flex items-center gap-2 mt-2">
                <a href="https://github.com/higgins" target="_blank" aria-label="GitHub">
                  <img src="https://cdn.simpleicons.org/github/000000" alt="" className="h-5 w-5" />
                </a>
                <a href="https://x.com/justinprojects" target="_blank" aria-label="X">
                  <img src="https://cdn.simpleicons.org/x/000000" alt="" className="h-5 w-5" />
                </a>
                <a href="https://bsky.app/profile/justinprojects.bsky.social" target="_blank" aria-label="Bluesky">
                  <img src="https://cdn.simpleicons.org/bluesky/000000" alt="" className="h-5 w-5" />
                </a>
                <a href="mailto:justinhiggy@gmail.com" aria-label="Email">
                  <img src="https://cdn.simpleicons.org/gmail/000000" alt="" className="h-5 w-5" />
                </a>
                <a href="https://www.tiktok.com/@justinprojects" target="_blank" aria-label="TikTok">
                  <img src="https://cdn.simpleicons.org/tiktok/000000" alt="" className="h-5 w-5" />
                </a>
              </div>
            </>
          </AccordionItem>
  </div>
}
