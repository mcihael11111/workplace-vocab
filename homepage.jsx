import { useState, useEffect, useCallback, useRef } from "react";


// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useWindowSize() {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return w;
}

// ─── ALL CARDS — 5 per category, 18 categories (90 total) ────────────────────

const ALL_WORDS = [

  // ── RESEARCH (5) ──────────────────────────────────────────────────────────
  { term: "Affinity Map", category: "Research", level: "Beginner",
    definition: "A method for organising large amounts of qualitative data (sticky notes, observations, quotes) into themed clusters that reveal patterns and shared meaning across a research set.",
    whyItMatters: "Design decisions made without synthesis are just guesses. An affinity map is the bridge between collecting information and understanding it. It forces a team to agree on what they actually heard, not just what they felt they heard.",
    scenario: "A team runs twelve user interviews and walks away with pages of notes, recordings, and opinions. Without an affinity map, each person prioritises what resonated with them personally. With one, the team clusters the raw data and realises nine of twelve participants mentioned the same friction point in onboarding. That insight would not have surfaced from memory alone.",
    example: "\"Let's run an affinity mapping session before the next sprint so we can prioritise properly.\"",
    related: ["User interview", "Insights", "Persona", "Customer journey map"] },

  { term: "User Interview", category: "Research", level: "Beginner",
    definition: "A one-on-one conversation between a researcher and a participant, designed to understand that person's behaviours, motivations, and pain points in their own words, without leading them toward a predetermined answer.",
    whyItMatters: "Surveys tell you what people do. Interviews tell you why. The why is where the design opportunities live, and you can only get there by listening without an agenda.",
    scenario: "A product team assumed users were abandoning checkout because of pricing. Eight interviews revealed users were confused about shipping costs appearing only at the final step. The problem was transparency, not price. No survey would have surfaced that distinction.",
    example: "\"We ran eight user interviews last week and heard the same frustration about onboarding in nearly every session. That's our signal.\"",
    related: ["Qualitative", "Persona", "Empathy map", "Pain point"] },

  { term: "Persona", category: "Research", level: "Beginner",
    definition: "A fictional but research-grounded character representing a key segment of your users. A persona captures goals, behaviours, frustrations, and context rather than demographics alone, and gives the team a shared reference point when making decisions.",
    whyItMatters: "Personas stop teams from designing for themselves. When a debate breaks out about a feature, a well-built persona gives everyone a shared, neutral reference: what would this person actually need here?",
    scenario: "A feature debate about whether to add advanced export options ran for two weeks. The team checked their persona and found their primary user was a first-time employee sharing reports with a manager, not a power user. Advanced export was irrelevant to that person. The debate ended in ten minutes.",
    example: "\"Before we finalise the navigation, can we map each option against our three personas? I want to make sure we're not optimising for the edge case.\"",
    related: ["User research", "Empathy map", "User interview", "Customer journey map"] },

  { term: "Customer Journey Map", category: "Research", level: "Intermediate",
    definition: "A visual representation of the steps a user takes when interacting with a product or service, from first awareness through to completion. It captures emotions, touchpoints, and friction at each stage of the experience.",
    whyItMatters: "Products are rarely experienced in isolation. A journey map reveals the gaps between how a team imagines the experience and how a user actually lives it. It makes the invisible visible.",
    scenario: "A team was focused on optimising the onboarding flow inside their app. A journey map revealed that most users were arriving confused because the confirmation email sent before onboarding used completely different terminology from the product itself. The real friction point was outside the product entirely.",
    example: "\"The journey map showed users were already frustrated before they reached our app because the confirmation email was confusing them.\"",
    related: ["User flow", "Persona", "Pain point", "Task flow"] },

  { term: "Usability Test", category: "Research", level: "Intermediate",
    definition: "A research method where real users attempt to complete tasks using a product while researchers observe what happens. The goal is to identify where people struggle, not to validate that the design is correct.",
    whyItMatters: "You cannot see your own blind spots. Watching a real person get stuck on something you thought was obvious is humbling and invaluable. Even five participants can surface the majority of critical usability issues.",
    scenario: "A team was confident their redesigned checkout was simpler than the original. Five usability sessions later, three participants could not find the promo code field, two were unsure whether their address had saved, and none read the error messages correctly. The redesign shipped two weeks later than planned but with all three problems fixed.",
    example: "\"We ran a usability test on the checkout flow and three out of five participants couldn't find the promo code field. That's being fixed before launch.\"",
    related: ["Heuristic evaluation", "Pain point", "Qualitative", "Insights"] },

  // ── DESIGN METHODOLOGIES (5) ──────────────────────────────────────────────
  { term: "Cognitive Load", category: "Design Methodologies", level: "Intermediate",
    definition: "The total mental effort a person uses to process and act on information at any given moment. When a design introduces too many decisions, unclear labels, or competing visual elements at once, working memory gets overloaded and users slow down, make mistakes, or leave.",
    whyItMatters: "Every element on a screen has a cost. A designer's job is not just to add things that help but to remove everything that does not. The invisible work of reducing cognitive load is often what separates a product that feels effortless from one that feels exhausting.",
    scenario: "A checkout flow asked users to select a delivery option, enter a promo code, confirm their address, review their cart, and choose a payment method all on the same screen. Testing showed users making more errors and abandoning at a higher rate than the previous multi-step flow. Breaking the screen into three focused steps reduced errors significantly and improved completion.",
    example: "\"This checkout flow has too many decisions on the same screen. We need to reduce the cognitive load or we'll lose people before they convert.\"",
    related: ["Mental model", "Chunking", "Visual hierarchy", "Affordance"] },

  { term: "Mental Model", category: "Design Methodologies", level: "Intermediate",
    definition: "The internal picture a person carries of how something works, shaped by every similar system they have used before. Good design works with that picture rather than asking users to build a new one from scratch.",
    whyItMatters: "When a product matches what users already expect, it feels intuitive without any explanation. When it contradicts what they expect, it feels broken even if it technically works. That gap between expectation and reality is where most usability problems begin.",
    scenario: "When Spotify overhauled its navigation structure, many long-time users reported feeling lost even though the new layout was arguably more organised. Their existing picture of where things lived was so embedded that the change felt wrong before it felt better. The product had not broken. Their mental model had simply not caught up yet.",
    example: "\"Before we redesign the navigation, we need to map the mental model users already have of this product or we will just replace one confusion with another.\"",
    related: ["Affordance", "Cognitive load", "Heuristic evaluation", "User research"] },

  { term: "Chunking", category: "Design Methodologies", level: "Beginner",
    definition: "Grouping related pieces of information together so the brain can process them as a single unit rather than many separate items. Named after George Miller's research into working memory limits.",
    whyItMatters: "Humans can hold roughly seven items in working memory at once. Chunking works with that limit rather than against it, making forms, navigation, and content feel manageable rather than overwhelming.",
    scenario: "A registration form with fifteen fields presented all at once had a 45% completion rate. The same fifteen fields, grouped into three labelled sections (personal details, contact information, preferences), completed at 68%. The total information required was identical. The difference was how the brain was asked to process it.",
    example: "\"Let's chunk the form into three logical sections: personal details, address, then payment. One thing at a time.\"",
    related: ["Cognitive load", "Visual hierarchy", "Miller's Law", "Proximity"] },

  { term: "Affordance", category: "Design Methodologies", level: "Intermediate",
    definition: "A property of an object, real or digital, that signals how it can be used. A button that looks pressable affords clicking. A handle affords pulling. Affordances make the correct action obvious without instruction.",
    whyItMatters: "When affordances are missing or misleading, users get stuck. When they are well designed, the interface teaches itself. The goal is to make the right action feel like the only natural thing to do.",
    scenario: "A redesigned settings page replaced all bordered buttons with flat text labels to match a new minimal aesthetic. Usability testing showed users spending significantly longer finding interactive elements. They could see the labels but could not tell which ones were clickable. The visual affordance that made buttons look pressable had been removed along with the border.",
    example: "\"The flat redesign removed all the visual affordances from the buttons and users no longer know what's clickable. We need to restore those signals before this ships.\"",
    related: ["Signifier", "Mental model", "Cognitive load", "Heuristic evaluation"] },

  { term: "Heuristic Evaluation", category: "Design Methodologies", level: "Advanced",
    definition: "A usability inspection method where experts evaluate an interface against a set of established usability principles, most commonly Jakob Nielsen's 10 heuristics, to identify violations without involving real users.",
    whyItMatters: "A heuristic evaluation catches a significant proportion of usability issues quickly and cheaply. It gives designers a principled vocabulary for raising concerns and is often the fastest way to pressure-test a design before user testing.",
    scenario: "Before launching a new onboarding flow to users, a team ran a one-day heuristic evaluation with three senior designers. They identified eleven issues: three critical (users had no way to go back between steps), five moderate (error messages were vague), and three minor (icon inconsistency). All critical issues were fixed before any user touched the product.",
    example: "\"Before we start user testing, let's do a heuristic evaluation internally to catch the obvious issues first.\"",
    related: ["Usability test", "Cognitive walkthrough", "Design principles", "User research"] },

  // ── UI ELEMENTS (5) ───────────────────────────────────────────────────────
  { term: "Call to Action", category: "UI Elements", level: "Beginner",
    definition: "A button, link, or prompt that directs a user toward a specific next step: 'Sign up', 'Get started', 'Add to cart'. A CTA is the moment a design asks the user to do something meaningful.",
    whyItMatters: "A page without a clear CTA is a page without a purpose. The clarity, placement, and visual weight of a CTA directly affects conversion. If users do not know what to do next, they will do nothing.",
    scenario: "A landing page had three buttons in the hero section: 'Learn more', 'See pricing', and 'Get started'. Analytics showed roughly equal clicks across all three, with overall conversion the lowest it had been in six months. Reducing to one primary CTA ('Start for free') and removing the others increased sign-ups by 34% without changing any other element.",
    example: "\"The hero section has three competing CTAs. We need one primary action. Everything else is noise.\"",
    related: ["Microcopy", "Hierarchy", "Primary button", "Conversion rate"] },

  { term: "Tooltip", category: "UI Elements", level: "Beginner",
    definition: "A small text label that appears when a user hovers or focuses on an element, providing additional context without cluttering the main interface. Tooltips surface secondary information on demand.",
    whyItMatters: "Tooltips are a safety net for ambiguous icons or actions. They reduce the need for inline labels while still giving users the context they need. If everything needs a tooltip, the interface has bigger problems.",
    scenario: "An analytics dashboard used icon-only controls for filtering, exporting, and sharing data. Usability sessions showed that even experienced users paused at unfamiliar icons and sometimes clicked the wrong one. Adding tooltips to all icon-only controls reduced error clicks by half without changing the visual design.",
    example: "\"The icon-only toolbar needs tooltips on every item. Not everyone will know what those icons mean without a label.\"",
    related: ["Microcopy", "Affordance", "Icon", "Hover state"] },

  { term: "Toggle", category: "UI Elements", level: "Beginner",
    definition: "A switch-style control that allows users to turn a setting on or off. A toggle represents a binary state (active or inactive) and should provide immediate visual feedback when switched.",
    whyItMatters: "Toggles feel physical and immediate, which makes them intuitive. But they cause confusion when the label does not make the current state clear. Getting this right prevents a surprisingly high volume of support tickets.",
    scenario: "A settings page used a toggle labelled 'Notifications'. After shipping, the support team received dozens of tickets asking whether the toggle turned notifications on or off. Changing the label to reflect the current state ('Notifications are on') and adding a colour change on activation resolved the confusion entirely.",
    example: "\"Use a toggle for the notification settings. Users expect to flip that on and off without hitting a save button.\"",
    related: ["Checkbox", "Radio button", "Focused state", "Feedback"] },

  { term: "Modal", category: "UI Elements", level: "Intermediate",
    definition: "A dialog that appears over the current page, blocking interaction with the content behind it until the user completes an action or dismisses it. Modals demand attention by design.",
    whyItMatters: "Modals are among the most overused patterns in digital products. They are powerful for confirmation flows, but when used for non-critical content they feel like interruptions. Only use a modal if the action truly requires full attention.",
    scenario: "A product team added a modal to promote a premium feature whenever a user clicked a certain option. Engagement data showed users who saw the modal were 40% more likely to immediately close the product. The modal was interrupting a task mid-flow to pitch something unrelated. It was replaced with a contextual inline prompt that appeared only after the user had completed their task.",
    example: "\"Don't use a modal for that. The user is mid-flow. Show the error inline instead and keep them in context.\"",
    related: ["Pop-up", "Overlay", "CTA", "Focused state"] },

  { term: "Accordion", category: "UI Elements", level: "Beginner",
    definition: "A vertically stacked list of items where each item can be expanded or collapsed to reveal or hide its content. Accordions progressively disclose information, keeping interfaces clean without removing content.",
    whyItMatters: "Accordions are ideal for FAQs, settings panels, and content-heavy pages where not everything needs to be visible at once. They respect users who want to scan and drill down rather than reading everything linearly.",
    scenario: "A product FAQ page listed 22 questions with full answers displayed one after another. Users were scrolling past most of the content to find the one answer they needed. Converting the page to an accordion reduced page height significantly and brought average time-to-answer down from 45 seconds to under 10.",
    example: "\"The product specs page is too long. Put the technical details in an accordion. Most users won't need them, but they should still be findable.\"",
    related: ["Progressive disclosure", "Cognitive load", "Navigation", "Dropdown"] },

  // ── COLOURS (5) ───────────────────────────────────────────────────────────
  { term: "Colour Theory", category: "Colours", level: "Beginner",
    definition: "The body of practical guidance for mixing colours and understanding how they interact visually and psychologically. It covers the colour wheel, harmony relationships, and the emotional associations that different colours carry.",
    whyItMatters: "Colour communicates meaning before anyone reads a word. Understanding colour theory means making intentional choices that guide attention, convey brand personality, and create accessible experiences.",
    scenario: "A product team used red for success states in their notification system because it matched the brand's primary colour. User testing showed consistent confusion: participants assumed red notifications were errors, not confirmations. Colour carries meaning independent of brand context. Moving success states to green reduced support tickets about supposed error messages by 60%.",
    example: "\"The red we're using for success states conflicts with our alert colour. That's a colour theory problem that's going to confuse users.\"",
    related: ["Colour palette", "Contrast", "Analogous", "Complementary"] },

  { term: "Contrast", category: "Colours", level: "Beginner",
    definition: "The difference in luminance between two colours, most critically between text and its background. Contrast is both a design tool for creating visual hierarchy and an accessibility requirement for readability.",
    whyItMatters: "Low contrast is hard to read for people with visual impairments but also for everyone on a bright screen, a low-quality display, or in sunlight. WCAG requires a minimum 4.5:1 ratio for normal text, and meeting it benefits every user.",
    scenario: "A redesigned marketing page used light grey body text on a white background. The design looked clean in a well-lit office. An accessibility audit found the text failed WCAG AA. Field testing on mobile phones in daylight showed the text was functionally unreadable. Darkening the text to meet the 4.5:1 requirement resolved both the compliance failure and the real-world usability problem.",
    example: "\"That light grey text on white fails WCAG AA. We need to darken it before dev handoff.\"",
    related: ["WCAG", "Accessibility", "Colour palette", "Greyscale"] },

  { term: "Colour Palette", category: "Colours", level: "Beginner",
    definition: "A curated set of colours selected to work together consistently across a product or brand, typically including a primary brand colour, secondary colours, neutrals, and semantic colours for states like error, warning, and success.",
    whyItMatters: "A well-defined palette creates visual cohesion and makes colour decisions faster. Without one, teams make choices in isolation and the product accumulates inconsistencies that erode trust over time.",
    scenario: "A product that grew without a defined colour palette had accumulated 47 different hex values for blue across its interface over three years. Each designer had chosen a slightly different shade. No two primary buttons matched exactly. Defining a palette of seven semantic colour tokens and replacing all 47 values took two weeks and immediately made the product feel more coherent.",
    example: "\"We haven't defined our semantic colours yet. What should error states look like? Let's add that to the palette before components are built.\"",
    related: ["Design token", "Style guide", "Brand identity", "Colour theory"] },

  { term: "White Space", category: "Colours", level: "Beginner",
    definition: "Also called negative space, the empty area between and around design elements. White space does not have to be white. It is simply the deliberate absence of content, used to create breathing room and visual focus.",
    whyItMatters: "Crowded layouts feel cheap and hard to navigate. White space creates hierarchy, guides the eye, and signals quality. The most considered brands treat white space as a design element, not a gap to fill.",
    scenario: "A homepage redesign added three new sections of content without removing anything. The page became dense and hard to navigate. A follow-up test removed no content at all but doubled the spacing between sections and increased padding within each one. Users described the second version as cleaner, more professional, and easier to read, despite containing identical information.",
    example: "\"The landing page feels cluttered. We don't need more content. We need more white space between sections to let each message land.\"",
    related: ["Visual hierarchy", "Layout", "Cognitive load", "Flat design"] },

  { term: "Complementary Colours", category: "Colours", level: "Intermediate",
    definition: "Colours that sit directly opposite each other on the colour wheel, such as blue and orange, or red and green. When placed together, complementary colours create high contrast and strong visual tension.",
    whyItMatters: "Complementary pairings are naturally eye-catching, making them useful for CTAs, highlights, or anything that needs to stand out. The key is using one as the dominant colour and the other sparingly as an accent. Equal use of both creates visual discomfort.",
    scenario: "A food delivery app used deep blue as its primary brand colour. The design team tested several CTA button options and found that an orange button, the complementary pair to blue, significantly outperformed blue, green, and red buttons on click-through rate. The contrast between the brand colour and the complementary CTA made the action visually unavoidable.",
    example: "\"The orange CTA on the blue background works well. Complementary colours, and the contrast draws the eye exactly where we want it.\"",
    related: ["Colour theory", "Colour palette", "Analogous", "Contrast"] },

  // ── TYPOGRAPHY (5) ────────────────────────────────────────────────────────
  { term: "Typeface", category: "Typography", level: "Beginner",
    definition: "A family of fonts sharing a consistent design, with the same letterform structure, proportions, and personality. Helvetica and Georgia are typefaces. Bold and italic are weights within those typefaces.",
    whyItMatters: "Typeface choice communicates tone before a single word is read. A serif feels editorial and established. A geometric sans feels modern and clean. Choosing well sets the character of the entire product.",
    scenario: "A legal technology company rebranded and switched from a traditional serif to a geometric sans-serif throughout their product and marketing. The switch made the product feel faster and more modern, but user research three months later showed that older professional users trusted it less. The serif had been carrying credibility signals the team had not consciously valued. The brand moved to a hybrid approach.",
    example: "\"We're using two typefaces: one for display headings, one for body. Any more than that and the page starts to feel unfocused.\"",
    related: ["Serif", "Sans serif", "Font weight", "Line height"] },

  { term: "Typographic Hierarchy", category: "Typography", level: "Beginner",
    definition: "The visual organisation of text to guide readers through content in order of importance, established through size, weight, colour, spacing, and position. It tells users where to look first, second, and third.",
    whyItMatters: "Without hierarchy, every element competes for equal attention and nothing stands out. Good typographic hierarchy makes scanning effortless. Users should understand the structure of a page before they read a single word.",
    scenario: "A product update page used the same 16px regular weight for the update title, the date, the version number, and the description. Users in testing could not immediately identify what had changed or when. Adding a clear hierarchy (32px bold title, 12px grey metadata, 16px regular description) allowed users to scan and find relevant updates in seconds rather than reading every line.",
    example: "\"The page title and the section heading are the same size. We need to establish a clearer hierarchy so users know what's most important.\"",
    related: ["Visual hierarchy", "Font weight", "Typeface", "Cognitive load"] },

  { term: "Line Height", category: "Typography", level: "Beginner",
    definition: "The vertical space between lines of text, also called leading. Expressed as a multiplier of the font size: a line height of 1.5 on 16px text gives 24px of space between baselines.",
    whyItMatters: "Too little line height makes text feel cramped and hard to track across a line. Too much creates visual disconnection between lines. The sweet spot for body copy is typically between 1.5 and 1.7.",
    scenario: "A mobile app used a line height of 1.2 for body copy to save vertical space on smaller screens. Session recordings showed users frequently re-reading lines. Increasing line height to 1.6 added approximately 15% more vertical space to text-heavy screens but reduced re-reading behaviour in usability sessions significantly.",
    example: "\"The body copy is hard to read. Can you increase the line height to 1.6? It's a small change but it will make a big difference to readability.\"",
    related: ["Typeface", "Baseline", "X-height", "Readability"] },

  { term: "Serif", category: "Typography", level: "Beginner",
    definition: "A typeface category characterised by small decorative strokes at the ends of letterforms. Times New Roman, Georgia, and Garamond are classic examples. Serifs carry associations of tradition, authority, and editorial quality.",
    whyItMatters: "Serif typefaces carry specific cultural signals, common in publishing, law, finance, and luxury. In digital products, serifs are increasingly used for display headings to add character without sacrificing the readability of a sans-serif body.",
    scenario: "A fintech startup used a clean geometric sans-serif for all product and marketing text. When they rebranded to target enterprise clients, they introduced a serif typeface for display headings. User perception testing showed the serif version was rated as significantly more trustworthy and credible by the enterprise audience, without any change to the copy itself.",
    example: "\"The display heading in a serif looks editorial and premium. That's exactly the tone we want for this content section.\"",
    related: ["Sans serif", "Typeface", "Font weight", "Hierarchy"] },

  { term: "X-height", category: "Typography", level: "Advanced",
    definition: "The height of a typeface's lowercase letters, measured from the baseline to the top of a lowercase 'x'. A high x-height makes a typeface feel larger and more readable at small sizes.",
    whyItMatters: "Two fonts at the same point size can feel very different in scale because of x-height differences. This matters enormously when choosing a typeface for dense UI text, where small differences in apparent size have a real effect on readability.",
    scenario: "A design team was selecting between two similar sans-serif typefaces at 14px for dense data tables. Both looked identical in the font picker. Rendering them at actual size on screen revealed that one had a noticeably larger x-height, making numbers and abbreviations significantly more readable. That one criterion determined the choice.",
    example: "\"This typeface has a low x-height. It's going to feel too small at 14px. Let's switch to something with a higher x-height for the body copy.\"",
    related: ["Baseline", "Ascenders", "Descenders", "Typeface"] },

  // ── DEVELOPMENT (5) ───────────────────────────────────────────────────────
  { term: "MVP", category: "Development", level: "Beginner",
    definition: "Minimum Viable Product. The simplest version of a product that can be shipped to real users to test a hypothesis. It contains only the core functionality needed to learn, not everything the team wishes it could have.",
    whyItMatters: "An MVP protects teams from building the wrong thing well. It shifts focus from perfection to learning. The question is not whether it is complete but whether it tells the team what they need to know.",
    scenario: "A team spent four months building a recommendation engine before launching. User data showed that 80% of users never used recommendations and left the product within two weeks because the core task flow had bugs. An MVP approach, shipping the core flow first and measuring engagement, would have revealed that the recommendation engine was the wrong first investment.",
    example: "\"We don't need the recommendation engine for the MVP. Let's launch with manual curation and see if users engage first.\"",
    related: ["PoC", "Prototype", "Agile", "Hypothesis"] },

  { term: "API", category: "Development", level: "Intermediate",
    definition: "Application Programming Interface. A defined contract that allows two software systems to communicate: one requests data or an action, the other responds. APIs are the plumbing connecting products to external services.",
    whyItMatters: "Designers need to understand APIs because they define what is possible at the product layer. If a feature requires data the API does not expose, it cannot be built as designed. Understanding the basics prevents late-stage surprises.",
    scenario: "A design team created detailed mockups for a feature that pulled live social media data into a user dashboard. When handed off to development, the team discovered the social media platform's API did not provide the specific data points the design required. The entire feature had to be rethought. Understanding the API's capabilities before designing would have saved three weeks.",
    example: "\"The map feature will use Google's Maps API. We don't need to build that ourselves, just design the integration points.\"",
    related: ["Development", "MVP", "Responsive web design", "Microservices"] },

  { term: "Responsive Web Design", category: "Development", level: "Beginner",
    definition: "An approach to web design where layouts adapt fluidly to the size of the device they are displayed on, from desktop monitors down to mobile phones, using flexible grids, images, and CSS breakpoints.",
    whyItMatters: "Most web traffic now comes from mobile devices. A product that only works well on desktop excludes the majority of its potential users. Responsive design is a baseline expectation, not a bonus feature.",
    scenario: "A product team designed and built a customer dashboard exclusively for desktop use. Analytics six months after launch showed 43% of users were accessing it on mobile. The experience on mobile was broken: tables overflowed the screen, modals could not be dismissed, and form inputs required horizontal scrolling. A responsive rebuild took eight weeks.",
    example: "\"The dashboard looks great on desktop, but on mobile the table is completely broken. We need to design a responsive version of that component.\"",
    related: ["Breakpoints", "Mobile-first", "Grid", "CSS"] },

  { term: "QA", category: "Development", level: "Beginner",
    definition: "Quality Assurance. The process of testing a product before release to find bugs, visual regressions, and functional errors. QA checks that what was built matches what was designed and specified.",
    whyItMatters: "QA is the last line of defence before users encounter problems. It is where the gap between design intent and development output gets caught. Designers should participate because they know better than anyone what correct looks like.",
    scenario: "A new component library was shipped without a formal QA pass. Within the first week, three issues were filed: button hover states were missing on Safari, the modal close button was missing its focus state, and a spacing token was pulling an incorrect value. All three would have been caught in thirty minutes of structured QA testing.",
    example: "\"Can you do a QA pass on the new components? I want to check spacing and states match the Figma specs before we push to production.\"",
    related: ["Deployment", "Bug", "Design specs", "PR pull request"] },

  { term: "Deployment", category: "Development", level: "Intermediate",
    definition: "The process of releasing a new version of a product or feature into a live environment so real users can access it, either to a staging environment for internal testing or to production for public release.",
    whyItMatters: "Understanding deployment helps designers communicate timelines accurately and know what done really means. A feature that is designed and built is not shipped until it is deployed, and deployment has its own requirements and schedule.",
    scenario: "A design team approved final sign-off on a feature on a Thursday afternoon, assuming it would be live by Friday. They were unaware that the deployment pipeline required a code review window, a staging validation pass, and a scheduled release window that only ran on Tuesday and Thursday mornings. The feature went live the following Tuesday. Understanding deployment timelines prevents last-minute expectation gaps.",
    example: "\"We're targeting a Friday deployment, so design sign-off needs to happen by Wednesday to give dev time to implement and QA.\"",
    related: ["QA", "MVP", "Agile", "DevOps"] },

  // ── TESTING (5) ───────────────────────────────────────────────────────────
  { term: "A/B Testing", category: "Testing", level: "Intermediate",
    definition: "An experiment where two versions of a design or copy, version A and version B, are shown to different user segments simultaneously. The version that performs better against a defined metric is adopted.",
    whyItMatters: "A/B testing removes opinion from design decisions. Instead of debating which option works better, you measure it. The test is only as good as the hypothesis behind it. Never test randomly.",
    scenario: "A team debated for three weeks whether the hero headline should lead with the product benefit or the user problem. One person had strong conviction about each option. They set up an A/B test with equal traffic splits and a two-week run time. The benefit-led headline outperformed by 22% on sign-up rate. The debate was settled by measurement, not seniority.",
    example: "\"We're A/B testing the hero headline. One is benefit-led, the other curiosity-led. Two weeks, then we check sign-up rates.\"",
    related: ["Split testing", "Conversion rate", "Hypothesis", "Data analytics"] },

  { term: "Conversion Rate", category: "Testing", level: "Intermediate",
    definition: "The percentage of users who complete a desired action (signing up, purchasing, clicking a CTA) out of the total number who had the opportunity to. Expressed as a percentage.",
    whyItMatters: "Conversion rate is one of the most direct measures of design effectiveness. If users land on a page but do not convert, something in the experience is creating friction. It turns design intuition into measurable business impact.",
    scenario: "A sign-up page had a conversion rate of 2.1%. An audit identified three friction points: eight required fields on the first screen, a password requiring special characters with no guidance, and no indication of what happened after sign-up. Addressing all three raised the conversion rate to 4.8% over four weeks.",
    example: "\"The sign-up page has a 2% conversion rate. Industry average is closer to 5%. Let's audit the form and see where people are dropping off.\"",
    related: ["A/B testing", "Bounce rate", "Funnel", "KPI"] },

  { term: "Heat Map", category: "Testing", level: "Intermediate",
    definition: "A visual representation of where users click, move their cursor, or scroll, displayed as a colour gradient from cool (low activity) to hot (high activity). Heat maps reveal what captures attention and what gets ignored.",
    whyItMatters: "Heat maps show the truth about how users interact, not how the team assumed they would. They frequently reveal that important content is being missed, or that users are clicking things that are not interactive.",
    scenario: "A product team assumed users were reading a key explainer section placed mid-page on a landing page. A heat map showed almost no activity in that area. The vast majority of clicks were concentrated in the top quarter of the page. Moving the explainer above the fold increased engagement with the section significantly.",
    example: "\"The heat map shows users clicking the product image expecting it to zoom but nothing happens. We need to add that interaction.\"",
    related: ["Session recording", "Eye tracking", "Scroll depth", "Data analytics"] },

  { term: "Bounce Rate", category: "Testing", level: "Beginner",
    definition: "The percentage of visitors who land on a page and leave without taking any further action: no clicks, no scrolling, no navigation to another page.",
    whyItMatters: "A high bounce rate on a key page signals a mismatch between what brought someone there and what they found. It could be a messaging problem, a load speed problem, or a design problem. It always needs investigating.",
    scenario: "A new advertising campaign drove significant traffic to a product landing page. The bounce rate for campaign traffic was 82%, compared to 34% for organic visitors. Investigation revealed the ad promised a free trial on sign-up, but the landing page made no mention of a free trial and asked for credit card details immediately. The messaging mismatch was causing the bounce, not the page design.",
    example: "\"The new campaign is driving traffic but our bounce rate jumped to 78%. Users are immediately leaving. Something's off with the landing page.\"",
    related: ["Conversion rate", "Engagement", "Heat map", "Acquisition"] },

  { term: "Scroll Depth", category: "Testing", level: "Intermediate",
    definition: "A metric that tracks how far down a page users scroll before leaving, usually expressed as percentages of total page height: 25%, 50%, 75%, 100%.",
    whyItMatters: "If most users never scroll past 30% of a page, everything below is invisible in practice. Scroll depth data forces honest conversations about content priority and often reveals that key CTAs are buried far below where anyone is actually looking.",
    scenario: "A pricing page had a comprehensive feature comparison table placed at the bottom. Analytics showed only 18% of visitors scrolled far enough to see it. This explained why support received frequent questions about feature differences that were clearly documented in the comparison. Moving the table higher and adding anchor links from the hero increased engagement with it to 64%.",
    example: "\"Scroll depth data shows 60% of users never reach the pricing section. We need to move that higher or bring key pricing info into the hero.\"",
    related: ["Heat map", "Bounce rate", "Engagement", "Conversion rate"] },

  // ── DESIGN SYSTEM (5) ─────────────────────────────────────────────────────
  { term: "Design Token", category: "Design System", level: "Intermediate",
    definition: "The smallest named decision in a design system. Tokens store values (colours, spacing, typography, shadows) as named variables that both designers and developers reference consistently.",
    whyItMatters: "Tokens create a single source of truth between design and code. When a brand colour changes, you update one token and every component that references it updates automatically, saving hours and preventing inconsistency.",
    scenario: "A design team updated their brand's primary colour from a warm blue to a cooler tone. Without design tokens, the change would have required updating hundreds of components in Figma and coordinating separately with developers. With tokens in place, one value was changed in the token file and the update propagated across the entire design system and codebase automatically.",
    example: "\"Check whether that button uses the right token. I think it might be pulling a hardcoded value instead of the semantic colour.\"",
    related: ["Design system", "Component library", "Style guide", "Brand"] },

  { term: "Component Library", category: "Design System", level: "Intermediate",
    definition: "A collection of reusable, pre-built UI components (buttons, inputs, cards, navigation) that can be assembled into interfaces. Component libraries exist in both design tools like Figma and in code.",
    whyItMatters: "A shared component library speeds up both design and development. Instead of rebuilding a dropdown in every screen, teams pull from a shared inventory. Consistency is built in, not bolted on.",
    scenario: "A growing product team had four designers working across different areas of a product. Without a shared component library, each designer had built their own version of a dropdown, a modal, and a card. When the product was reviewed as a whole, three different dropdown styles and four card layouts existed across the same product. Building a shared library took three weeks and prevented the problem from compounding.",
    example: "\"Don't design a custom card for that. Use the one from our component library. We need to stay consistent and reduce the dev effort.\"",
    related: ["Design system", "Design token", "Pattern library", "Style guide"] },

  { term: "Style Guide", category: "Design System", level: "Beginner",
    definition: "A document that defines the visual and verbal standards for a product or brand, covering typography rules, colour usage, spacing principles, icon guidelines, and tone of voice.",
    whyItMatters: "A style guide is what keeps a product looking like one coherent thing over time, across multiple designers and contributors. Without one, every new person makes slightly different choices and the product slowly fragments.",
    scenario: "A company brought on two contract designers to help with a product sprint. Without a style guide, each contractor made slightly different spacing, colour, and typography choices that matched neither the existing product nor each other. Two weeks of work required significant revision. The incident prompted the team to document their style guide before the next engagement.",
    example: "\"Before onboarding the new contractor, make sure they've read the style guide. The last person used their own font sizes throughout.\"",
    related: ["Design system", "Component library", "Brand book", "Design token"] },

  { term: "Design Pattern", category: "Design System", level: "Intermediate",
    definition: "A reusable solution to a commonly recurring design problem, such as how to handle empty states, error messages, onboarding flows, or search interactions. Patterns document not just the component but the context for when to use it.",
    whyItMatters: "Patterns encode decisions teams have already made and tested. They prevent every designer from solving the same problem independently and inconsistently. A pattern library is institutional design memory.",
    scenario: "A product had five different ways to handle empty states depending on which designer had built the screen. Some showed an illustration, some a message, some nothing at all. A documented empty state pattern established a consistent approach: an icon, a brief human message, and a relevant action. Rolling it out across the product took three days.",
    example: "\"How are we handling empty states when a user has no saved items? Let's check the pattern library before designing something new.\"",
    related: ["Component library", "Style guide", "Design system", "Design token"] },

  { term: "Pattern Library", category: "Design System", level: "Intermediate",
    definition: "A curated collection of documented design patterns, recurring solutions to common UI problems, with guidance on when and how each should be used. Distinct from a component library, which focuses on building blocks alone.",
    whyItMatters: "A pattern library captures design wisdom. It is the difference between a team that reinvents the wheel on every project and one that builds on accumulated, tested knowledge. Essential for onboarding new contributors.",
    scenario: "A new designer joined a product team and spent their first two weeks asking colleagues how to handle onboarding, error states, and notifications, all of which had been solved before but were undocumented. A pattern library would have contained exactly the answers they needed. After the experience, the team spent four days documenting their ten most common patterns.",
    example: "\"The pattern library has a documented approach for progressive disclosure. Let's follow that rather than designing a one-off solution.\"",
    related: ["Design pattern", "Component library", "Style guide", "Design system"] },

  // ── BUSINESS (5) ──────────────────────────────────────────────────────────
  { term: "Stakeholder", category: "Business", level: "Beginner",
    definition: "Anyone with an interest in or influence over a project's outcome. Stakeholders can be internal (executives, legal, product) or external (clients, partners, regulators). Managing their expectations is a core professional skill.",
    whyItMatters: "Designs do not ship in a vacuum. A strong solution that does not account for stakeholder concerns will get blocked, revised, or killed. Understanding who the stakeholders are and what they care about is as important as understanding users.",
    scenario: "A design team spent three weeks building a redesign of the account settings screen. When they presented to leadership, the legal team raised a compliance concern that had been flagged internally six months earlier. If the legal stakeholder had been included in the brief, the constraint would have been known on day one. Part of the work had to be redone.",
    example: "\"Before we present the new checkout design, let's align with the legal stakeholder. They had concerns about the T&C placement last time.\"",
    related: ["Design playback", "KPI", "Voice of customer", "Presentation"] },

  { term: "KPI", category: "Business", level: "Beginner",
    definition: "Key Performance Indicator. A measurable value that tracks progress toward a specific business objective: sign-ups, revenue, retention, NPS. KPIs translate strategy into numbers teams can monitor and act on.",
    whyItMatters: "Design exists in service of business outcomes. Understanding the KPIs your product is measured against helps you prioritise the right problems and communicate the value of design in language leadership understands.",
    scenario: "A team was tasked with redesigning the onboarding flow with no specific success metric attached. The redesign shipped and the team considered it complete. Six months later, leadership asked whether the new onboarding had improved retention. Without a defined KPI and baseline, there was no way to answer the question. The work could not be demonstrated as valuable.",
    example: "\"Our KPI this quarter is reducing support ticket volume by 20%. Every design decision on the onboarding flow should be evaluated against that goal.\"",
    related: ["NPS", "Conversion rate", "Retention", "Data analytics"] },

  { term: "NPS", category: "Business", level: "Intermediate",
    definition: "Net Promoter Score. A measure of customer loyalty based on one question: how likely are you to recommend this product to a friend? Scores range from -100 to +100.",
    whyItMatters: "NPS is one of the most common ways businesses measure satisfaction at scale. A falling NPS signals experience problems before they show up in revenue, making it a valuable early-warning metric for design teams.",
    scenario: "A product's NPS dropped from +42 to +28 in the quarter following a major interface update. The score alone indicated dissatisfaction but gave no direction. Reading the verbatim responses attached to low scores revealed that a specific navigation change was consistently cited. The team had assumed the change was an improvement. The NPS verbatims pointed directly at the problem.",
    example: "\"Our NPS dropped 12 points after the last release. Let's look at the verbatim feedback alongside the score to understand what changed.\"",
    related: ["CSAT", "KPI", "Voice of customer", "Retention"] },

  { term: "Voice of Customer", category: "Business", level: "Intermediate",
    definition: "A research process that captures customers' expectations and frustrations in their own words, combining surveys, interviews, support tickets, reviews, and social listening into a picture of what customers actually think.",
    whyItMatters: "VoC stops businesses from making decisions based on internal assumptions. It grounds product conversations in real customer language, which is also more persuasive when making the case for design changes to leadership.",
    scenario: "A product team was debating whether to invest in a mobile app or improve the mobile web experience. Rather than deciding internally, they reviewed six months of support tickets, app store reviews, and survey verbatims. The phrase 'hard to use on my phone' appeared in 34% of all feedback. The decision became a response to documented customer language, not an internal opinion.",
    example: "\"The VoC report shows 'confusing' is the most common word customers use about our onboarding. That's our design priority for Q2.\"",
    related: ["NPS", "CSAT", "User research", "Stakeholder"] },

  { term: "B2B vs B2C", category: "Business", level: "Beginner",
    definition: "B2B (Business-to-Business) means a product sold to other companies. B2C (Business-to-Consumer) means sold directly to individual end users. The distinction shapes everything from pricing models to design priorities.",
    whyItMatters: "B2B and B2C products have fundamentally different user contexts. B2B users often tolerate complexity in exchange for capability. B2C users expect simplicity and delight. Knowing which you are designing for changes almost every design decision.",
    scenario: "A designer who had spent their career on consumer apps joined a B2B software company. They applied the same principles: simple onboarding, minimal steps, quick wins. The product's actual users, procurement managers using it for hours daily, found the simplified interface too limited. They needed speed, density, and keyboard shortcuts. Understanding the B2B context changed every design assumption.",
    example: "\"This is a B2B tool. Our users are professionals using it for six hours a day. Efficiency matters more than onboarding polish here.\"",
    related: ["Stakeholder", "KPI", "Persona", "User research"] },

  // ── BRAND (5) ─────────────────────────────────────────────────────────────
  { term: "Tone of Voice", category: "Brand", level: "Beginner",
    definition: "The personality and character expressed through the words a brand chooses. Tone of voice is not what you say but how you say it. It should be consistent across every touchpoint, from a homepage headline to an error message.",
    whyItMatters: "Inconsistent tone creates brand confusion. When marketing sounds confident and warm but error messages sound robotic and cold, users feel a jarring disconnect. Tone of voice is part of the experience, not a separate concern.",
    scenario: "A fintech product had warm, conversational marketing copy and formal, technical error messages. User research showed that the moment something went wrong, users described the product as cold and unhelpful, despite rating the marketing experience positively. The disconnect was eroding trust at exactly the moments when users needed reassurance most.",
    example: "\"That error message sounds like it was written by a lawyer. Can you rewrite it in our tone: direct, human, and a little reassuring?\"",
    related: ["Microcopy", "Brand identity", "Conversational tone", "Copy"] },

  { term: "Brand Identity", category: "Brand", level: "Beginner",
    definition: "The collection of visual and verbal elements that express what a brand is: logo, colour palette, typography, imagery style, tone of voice, and the values behind them all. It is how a brand presents itself consistently.",
    whyItMatters: "Brand identity is what makes a product instantly recognisable before users read a word. A strong, consistent identity builds trust and loyalty. An inconsistent one creates confusion and undermines credibility.",
    scenario: "A product went through rapid growth and added three new product lines over eighteen months, each designed by a different team without referencing a shared identity system. By the time a brand audit was conducted, the three product areas used different typefaces, different icon styles, and different colour treatments. Users crossing between areas reported feeling like they were using products from different companies.",
    example: "\"The new feature looks technically great but it doesn't feel like us. The illustration style and typeface are both off-brand. Align it with the identity guidelines.\"",
    related: ["Tone of voice", "Brand book", "Style guide", "Design system"] },

  { term: "Brand Book", category: "Brand", level: "Intermediate",
    definition: "A comprehensive document that defines and governs a brand's identity, including logo usage rules, colour specifications, typography guidelines, imagery principles, and tone of voice. The definitive reference for anyone creating branded materials.",
    whyItMatters: "A brand book creates consistency at scale. When multiple agencies, contractors, and internal teams create brand materials, the brand book ensures they all produce something that looks like it belongs to the same family.",
    scenario: "An agency was commissioned to produce a campaign for a consumer brand. Without access to the brand book, the agency used the logo at incorrect proportions, combined brand colours in ways that violated the guidelines, and selected a typeface that clashed with the brand's established typography. The entire campaign required revision before approval. The brand book had existed for three years but had never been shared at project kickoff.",
    example: "\"Before the agency starts on campaign assets, send them the brand book. Especially the logo clear space rules and the colour don'ts.\"",
    related: ["Brand identity", "Style guide", "Tone of voice", "Design system"] },

  { term: "Social Proof", category: "Brand", level: "Beginner",
    definition: "Evidence that other people have trusted, used, or endorsed a product: testimonials, reviews, user counts, case studies, logos of well-known clients. Social proof reduces the perceived risk of a decision.",
    whyItMatters: "People look to each other to validate decisions. Social proof is one of the most reliably persuasive elements in a product or marketing context. Placing the right proof at the right moment, just as doubt peaks, significantly lifts conversion.",
    scenario: "A SaaS landing page had strong copy and a clear value proposition but low conversion. Adding three specific customer testimonials, an active user count, and the logos of five well-known clients just above the pricing section increased conversions by 27% without changing the copy or layout. The social proof addressed the doubt that peaked at the decision moment.",
    example: "\"Add the client logos and review count just above the pricing section. That's where users hesitate most and social proof at that moment will help.\"",
    related: ["Conversion rate", "Trust", "CTA", "Testimonial"] },

  { term: "Design Debt", category: "Brand", level: "Intermediate",
    definition: "The accumulation of inconsistencies, shortcuts, and outdated patterns in a product's design that slow future work and degrade the user experience over time. The design equivalent of technical debt.",
    whyItMatters: "Design debt is invisible until it becomes painful. Small compromises (a one-off colour, a custom component, an inconsistent pattern) compound into a fragmented product that is expensive to update and frustrating to use.",
    scenario: "A product team had shipped rapidly for two years with minimal design system adherence. When a new designer joined and mapped the product's visual inconsistencies, they found 23 different button styles, 11 shades of grey, and no consistent spacing scale. Addressing the backlog took the equivalent of one full designer-sprint per month for six months. The cost of fixing the debt far exceeded what preventing it would have required.",
    example: "\"We've got significant design debt in the settings screens: three different button styles, two form layouts, none matching the system. We need a debt sprint.\"",
    related: ["Design system", "Component library", "Style guide", "Design token"] },

  // ── IDEATION (5) ──────────────────────────────────────────────────────────
  { term: "Wireframe", category: "Ideation", level: "Beginner",
    definition: "A low-fidelity visual representation of a screen or page layout, showing structure, content hierarchy, and functionality without visual design applied. Wireframes communicate what goes where, not what it will look like.",
    whyItMatters: "Wireframes are the fastest way to test structure before investing in visual design. They keep feedback focused on layout and flow rather than colour and type, preventing the mistake of debating aesthetics before solving the structural problem.",
    scenario: "A team began building visual mockups of a new feature before the information architecture had been agreed. Three weeks into high-fidelity work, a stakeholder review revealed the structure did not match how users expected to navigate the product. The entire visual layer had to be rebuilt on a different structure. A day of wireframing before visual design would have surfaced the problem weeks earlier.",
    example: "\"Let's wireframe the onboarding flow and get alignment on the steps before we go anywhere near visual design.\"",
    related: ["Low-fidelity", "Prototype", "Information architecture", "Mockup"] },

  { term: "Information Architecture", category: "Ideation", level: "Intermediate",
    definition: "The structural design of how content and functionality are organised, labelled, and navigated within a product. Good IA makes things findable and the mental model of the product clear.",
    whyItMatters: "Poor IA is often the root cause of a product feeling confusing. Users cannot find what they need because the structure does not match how they think. IA problems cannot be fixed with UI polish. They need structural solutions.",
    scenario: "A company reorganised its help centre content by department, because that was how the internal team was structured. Users searching for help navigated by what they were trying to do, not by which department owned the answer. A card sorting study with twenty users revealed that a task-based structure found answers three times faster than the department-based one that had been in place for two years.",
    example: "\"Users keep looking for Account settings under Help. That's an IA problem. Our labels don't match their mental model.\"",
    related: ["Navigation", "Card sorting", "Mental model", "User flow"] },

  { term: "Prototype", category: "Ideation", level: "Beginner",
    definition: "A simulation of a product or feature at any fidelity level, used to test an idea, explore interactions, or communicate a design to stakeholders before it is built. Prototypes can be paper sketches, clickable Figma flows, or coded.",
    whyItMatters: "Prototypes make ideas testable. The act of building one forces designers to solve problems they might otherwise gloss over. You cannot prototype a flow without knowing how each step connects.",
    scenario: "A team was preparing to invest in developing a complex multi-step form. Before writing a line of code, a designer built a clickable Figma prototype in two days. Testing the prototype with five users revealed that the assumed step order was confusing, two steps could be combined, and the final confirmation screen raised copy concerns. All issues were fixed in the prototype before a single development hour was spent.",
    example: "\"Before we hand off to dev, let's build a prototype of the checkout so we can run a quick usability test and catch any gaps.\"",
    related: ["Wireframe", "Mockup", "Usability test", "High-fidelity"] },

  { term: "Low-Fidelity", category: "Ideation", level: "Beginner",
    definition: "An early-stage design representation that prioritises speed and exploration over visual polish: rough sketches, simple wireframes, basic clickable prototypes. Low-fi work is deliberately incomplete to invite feedback and iteration.",
    whyItMatters: "Low-fidelity signals to stakeholders that the work is in progress and open to change. Presenting high-fidelity too early invites nitpicking over details before fundamentals are settled. Start rough on purpose.",
    scenario: "A designer presented high-fidelity mockups of a new feature concept to stakeholders. The feedback was almost entirely about colour choices, font sizes, and the illustration style used. The structural decisions that actually mattered at that stage were barely discussed. At the next review, rough wireframes were presented instead. The feedback was entirely about structure, flow, and functionality.",
    example: "\"I've put together some low-fi concepts. I want alignment on the structure before I invest time in visual design.\"",
    related: ["Wireframe", "Mid-fidelity", "High-fidelity", "Prototype"] },

  { term: "High-Fidelity", category: "Ideation", level: "Beginner",
    definition: "A design that closely resembles the final product, with real content, accurate typography, colour, spacing, and interactive states applied. High-fidelity work is used for stakeholder presentations, developer handoff, and usability testing.",
    whyItMatters: "High-fidelity reduces ambiguity for developers and gives stakeholders a realistic sense of the final experience. But the risk is investing visual polish in something that has not been validated structurally. Low-fi should always come first.",
    scenario: "A team spent two weeks in low-fidelity exploration and reached alignment on the structure. Moving to high fidelity with real content revealed that one screen was significantly longer than anticipated when real copy replaced placeholder text, and that a key icon was ambiguous at its intended size. Both issues were caught and fixed before developer handoff.",
    example: "\"Now that the structure is signed off, I'll take the wireframes to high-fidelity this week, ready for developer handoff by Friday.\"",
    related: ["Wireframe", "Low-fidelity", "Prototype", "Mockup"] },

  // ── DISCOVERY (5) ─────────────────────────────────────────────────────────
  { term: "Design Brief", category: "Discovery", level: "Beginner",
    definition: "A document outlining the scope, goals, audience, constraints, and success criteria for a design project. It aligns everyone on what is being solved before any work begins.",
    whyItMatters: "A design brief prevents the most expensive mistake in product work: building the right thing for the wrong problem. It gives the team a shared frame of reference and something to check decisions against throughout the project.",
    scenario: "A team jumped straight from a stakeholder conversation into Figma, each person carrying a slightly different interpretation of the goal. Three weeks in, the PM and designer disagreed fundamentally about whether the project was a redesign or a new feature. A design brief written at the start would have made that conversation happen on day one, not week three.",
    example: "\"Before we start designing, can you write a brief? I want us all solving the same problem before anyone opens Figma.\"",
    related: ["Product requirement", "Discovery", "Hypothesis", "Stakeholder"] },

  { term: "Discovery", category: "Discovery", level: "Beginner",
    definition: "The initial phase of a project focused on understanding the problem space through research, stakeholder interviews, competitive analysis, and data review, before any solutions are explored.",
    whyItMatters: "Skipping discovery is the number one reason products solve the wrong problem beautifully. The more clearly a team understands the problem, the less time they waste building things nobody needs.",
    scenario: "A product team was asked to redesign a feature with low adoption. Without discovery, they would have started with a new interface. The discovery phase revealed users had never understood the feature existed, because it was buried under an ambiguous label in the navigation. The solution was a copy change, not a redesign.",
    example: "\"We're still in discovery. We haven't started designing yet. We're interviewing users and mapping the current experience first.\"",
    related: ["Design brief", "User research", "Hypothesis", "Assumption mapping"] },

  { term: "Hypothesis", category: "Discovery", level: "Intermediate",
    definition: "A testable statement about what a team believes to be true, framed so it can be validated or disproved: 'We believe that doing X will result in Y for Z reason.' Hypotheses turn intuition into structured experiments.",
    whyItMatters: "A hypothesis forces the team to be specific about what they are testing and what success looks like. Without one, teams ship features and never measure whether they worked, because they never defined what working would look like.",
    scenario: "A team believed a shorter onboarding flow would increase completion rates. By framing that belief as a hypothesis and defining a specific success metric upfront, they ran a focused experiment and found the shorter flow performed better only for mobile users. That nuance would have been lost without the structure a hypothesis provided.",
    example: "\"Our hypothesis is that simplifying the sign-up form to three fields will increase completion rates by 20%. Let's design the test.\"",
    related: ["A/B testing", "MVP", "Assumption", "Discovery"] },

  { term: "Product Requirement", category: "Discovery", level: "Intermediate",
    definition: "A specific, measurable statement defining what a product or feature must do: what functionality it delivers, what constraints it operates within, and what success looks like. Requirements provide the guardrails for design and development.",
    whyItMatters: "Ambiguous requirements produce misaligned outputs. Clear requirements protect teams from scope creep and ensure designers, developers, and stakeholders share a common definition of done.",
    scenario: "A designer built a mobile checkout flow that was elegant and easy to use. At review, the PM pointed out that a compliance requirement specified all payment options had to appear on a single screen. The designer had not been given this constraint. Two days of rework followed. A well-documented requirement at the start would have changed the entire structure of the design from day one.",
    example: "\"The requirement is that users can complete checkout in under three steps on mobile. Design to that constraint rather than assuming desktop behaviour carries over.\"",
    related: ["Design brief", "Discovery", "Hypothesis", "Design deliverable"] },

  { term: "Assumption Mapping", category: "Discovery", level: "Intermediate",
    definition: "A workshop technique that surfaces all assumptions embedded in a product idea and maps them by how critical they are and how much evidence supports them. It covers assumptions about user needs, business viability, and technical feasibility.",
    whyItMatters: "Every product decision rests on assumptions. Assumption mapping makes the riskiest ones visible so the team can test them early, before building on a foundation that might not be solid.",
    scenario: "A team planned a premium membership feature, assuming users would pay for exclusive content. An assumption mapping session revealed that two core beliefs had no supporting evidence: that users would pay, and that they wanted more content rather than better access to what already existed. Both were tested with a lightweight experiment before any design work began.",
    example: "\"Before we commit to this feature, let's run an assumption mapping session. I think we're taking for granted that users actually want this option.\"",
    related: ["Hypothesis", "Discovery", "User research", "Design brief"] },

  // ── ALIGNMENT (5) ─────────────────────────────────────────────────────────
  { term: "Grid", category: "Alignment", level: "Beginner",
    definition: "An invisible structure of columns, rows, and gutters that organises content on a screen. Grids create consistency, alignment, and rhythm across layouts, making designs feel ordered rather than arbitrary.",
    whyItMatters: "Grids are the scaffolding behind professional-looking layouts. Without one, elements get placed by eye and slight misalignments accumulate into something that feels off, even if the viewer cannot articulate exactly why.",
    scenario: "Two designers working on the same product were building features independently without a shared grid. When the screens were placed side by side in a stakeholder review, cards sat at different widths, spacing values varied, and the product felt inconsistent. Establishing a 12-column grid as the shared baseline resolved all of it before the next sprint.",
    example: "\"Everything needs to align to the 12-column grid. The card widths you've used don't snap to a column. It'll look inconsistent across breakpoints.\"",
    related: ["Gutters", "Margins", "8-point grid system", "Breakpoints"] },

  { term: "8-Point Grid System", category: "Alignment", level: "Intermediate",
    definition: "A spacing system where all dimensions, including padding, margins, component heights, and gaps, are multiples of 8 pixels. The result is a mathematically consistent visual rhythm that works cleanly across standard screen resolutions.",
    whyItMatters: "The 8-point grid removes guesswork from spacing decisions. Designers and developers reference the same values, which reduces implementation drift and speeds up both design and handoff.",
    scenario: "A developer implementing a new card component noticed the design file used 14px of padding. There was no design token for 14px in the spacing system, so they used 16px instead. The visual difference was minor, but across dozens of components the inconsistency accumulated. Enforcing the 8-point grid in the design file would have ensured 16px was specified from the start.",
    example: "\"The padding on that card should be 16px, not 14px. We're on the 8-point grid. Keep everything in multiples of 8.\"",
    related: ["Grid", "Spacing", "Design token", "Gutters"] },

  { term: "Breakpoints", category: "Alignment", level: "Intermediate",
    definition: "Specific screen widths at which a layout changes its structure to adapt to different device sizes. Common breakpoints are defined for mobile, tablet, and desktop, and are implemented in CSS using media queries.",
    whyItMatters: "Breakpoints are where responsive design decisions become concrete. Designing without them means assuming everyone uses the same screen, and no one does. Every layout needs to be considered at multiple breakpoints before handoff.",
    scenario: "A designer handed off a three-column feature grid without specifying breakpoint behaviour. The developer defaulted to wrapping the columns at the browser's natural break point, which created an awkward partial layout on tablet. Defining the tablet breakpoint explicitly as two columns in the spec would have prevented it entirely.",
    example: "\"The three-column grid works on desktop, but at the tablet breakpoint we drop to two columns, and on mobile it goes single-column.\"",
    related: ["Responsive web design", "Grid", "Mobile-first", "CSS"] },

  { term: "Visual Hierarchy", category: "Alignment", level: "Beginner",
    definition: "The arrangement of elements to guide the viewer's eye in a deliberate order, from most to least important. Achieved through size, weight, colour, contrast, spacing, and position.",
    whyItMatters: "Without visual hierarchy, everything competes equally for attention and nothing stands out. Good hierarchy makes the right information land first. Users understand the page before they consciously read it.",
    scenario: "A product page had five pieces of information at the same font size and weight: the product name, the price, a promotional tag, a category label, and a description heading. Users in testing spent longer than expected finding the price and often missed the promotional offer entirely. Establishing a clear typographic scale resolved both issues without any change to the content.",
    example: "\"The page title and product name are the same weight. There's no hierarchy. The title needs to be significantly larger so users immediately know where they are.\"",
    related: ["Typographic hierarchy", "Cognitive load", "Grid", "White space"] },

  { term: "Golden Ratio", category: "Alignment", level: "Advanced",
    definition: "A mathematical proportion of approximately 1:1.618, found throughout nature and classical art. In design, it is used to create layouts, set type scales, and determine proportional relationships that feel naturally harmonious.",
    whyItMatters: "The golden ratio is not magic, but it is a reliable starting point for proportion decisions that feel balanced without being rigid. It is most useful in logo design, layout composition, and type scaling.",
    scenario: "A logo designer was struggling to find the right proportion between the icon mark and the wordmark. By applying the golden ratio to set their width relationship, the two elements immediately felt balanced. The client, who had rejected three previous versions without being able to explain why, approved the golden ratio version in the first round.",
    example: "\"The logo's proportions were derived from the golden ratio, which is why it feels so balanced even though it's asymmetric.\"",
    related: ["Rule of thirds", "Grid", "Visual hierarchy", "Alignment"] },

  // ── POSITIONS (5) ─────────────────────────────────────────────────────────
  { term: "UX Designer", category: "Positions", level: "Beginner",
    definition: "A designer focused on the overall experience of using a product: research, flows, information architecture, wireframing, testing, and iteration. UX designers prioritise how something works over how it looks.",
    whyItMatters: "The UX designer's role is to be the user's advocate in the room. They translate user needs into design decisions and validate those decisions through research rather than assumption.",
    scenario: "A product team was about to ship a redesigned onboarding flow that had tested well internally. The UX designer insisted on one round of external usability testing with five participants before launch. Three of the five got stuck at the same point. The issue was fixed in two days. Without that advocacy, it would have shipped and been discovered through support tickets.",
    example: "\"The UX designer is running user interviews this week. Once we have the insights, we'll move into design exploration.\"",
    related: ["UI designer", "Product manager", "UX researcher", "Product owner"] },

  { term: "UI Designer", category: "Positions", level: "Beginner",
    definition: "A designer focused on the visual and interactive layer of a product: the look, feel, and responsiveness of every element a user touches. UI designers work with typography, colour, spacing, components, and states.",
    whyItMatters: "UI design is where user experience becomes tangible. Great UX strategy is undermined by poor UI execution. Unclear affordances, poor contrast, and visual inconsistency all erode trust. The UI designer ensures the product looks and behaves exactly as intended.",
    scenario: "A team had strong UX flows validated through research. When the feature launched, user feedback was unexpectedly negative. Reviews mentioned it felt cheap and hard to use. The UX was sound but the UI had inconsistent spacing, low contrast on key actions, and hover states that had never been designed. The visual execution had undermined the experience entirely.",
    example: "\"The UX flows are approved. The UI designer is now applying the visual layer and building out the component states.\"",
    related: ["UX designer", "Design system", "Component library", "Front-end development"] },

  { term: "Product Manager", category: "Positions", level: "Beginner",
    definition: "The person responsible for defining what a product is, who it is for, and why it exists. The product manager owns the roadmap, prioritises features, and coordinates between business, design, and engineering.",
    whyItMatters: "The PM is the designer's most important collaborator. They define the problem space and business constraints; the designer defines the solution. When the relationship works well, product and design are in constant dialogue.",
    scenario: "A designer spent a week building out a complex filtering system for a dashboard, only to discover in sprint review that the PM had already descoped filtering for the quarter due to a technical dependency. The information existed but had never been shared. Regular check-ins between PM and designer would have redirected the work within the first day.",
    example: "\"The PM has confirmed the three user stories for this sprint. Let's make sure our designs cover all the edge cases before handoff to dev.\"",
    related: ["Product owner", "Delivery lead", "Stakeholder", "Agile"] },

  { term: "Product Owner", category: "Positions", level: "Intermediate",
    definition: "In Agile teams, the product owner is responsible for the product backlog: defining, ordering, and accepting work. They represent customer and business needs within the sprint team, making day-to-day prioritisation decisions.",
    whyItMatters: "The product owner decides what gets built next and whether output meets the definition of done. Understanding their role helps designers navigate prioritisation conversations and get work approved efficiently.",
    scenario: "A designer submitted a ticket to add improved empty states to the product. In backlog refinement, the product owner deprioritised it as cosmetic. The designer reframed the ticket with data from usability testing showing users interpreted blank screens as errors and raised a support ticket on average. The product owner reprioritised it for the next sprint.",
    example: "\"The product owner needs to accept the story before it closes. Can you demo the new flow and get sign-off today?\"",
    related: ["Product manager", "Agile", "Backlog", "Delivery lead"] },

  { term: "UX Researcher", category: "Positions", level: "Intermediate",
    definition: "A specialist in generating insight about user behaviours, needs, and mental models through rigorous qualitative and quantitative research methods. UX researchers plan studies, conduct sessions, synthesise findings, and communicate implications.",
    whyItMatters: "UX researchers are the engine of evidence-based design. They protect teams from designing based on assumption and provide the data that makes design decisions defensible to stakeholders.",
    scenario: "A product team was debating whether to add a new dashboard view for a small segment of power users. The debate ran for weeks with no resolution. The UX researcher ran a two-day study with six users and found the existing view was not the problem: the real friction was in how data was exported. The entire debate had been focused on the wrong thing.",
    example: "\"Let's loop in the UX researcher before we finalise the brief. They ran a study on this problem space last quarter and the insights are still relevant.\"",
    related: ["UX designer", "User interview", "Usability test", "Qualitative"] },

  // ── COPY (5) ──────────────────────────────────────────────────────────────
  { term: "Microcopy", category: "Copy", level: "Beginner",
    definition: "The small but critical pieces of text within a product interface: button labels, error messages, form field hints, empty states, and tooltips. Every word the user reads while using the product counts as microcopy.",
    whyItMatters: "Microcopy does enormous work in a small footprint. A well-written error message reduces support tickets. A reassuring CTA lifts conversion. Poor microcopy creates confusion at exactly the moments when clarity matters most.",
    scenario: "A SaaS product had a password requirements error that simply read 'Invalid password'. Support tickets about password setup were consistently in the top five enquiries each week. Rewriting the message to 'Password must be at least eight characters and include one number' reduced those tickets by 60% in the first month. Nothing else in the product changed.",
    example: "\"The error message just says 'Invalid input'. That tells the user nothing. Rewrite it to explain what's wrong and how to fix it.\"",
    related: ["Tone of voice", "CTA", "Copy", "Hierarchy"] },

  { term: "Body Copy", category: "Copy", level: "Beginner",
    definition: "The main blocks of explanatory or descriptive text in a design: paragraphs that inform, explain, or elaborate. Body copy requires careful attention to line length, line height, and font choice for comfortable reading.",
    whyItMatters: "Body copy is where users actually read, if they decide to. The design job is to make reading as effortless as possible. Line length and spacing choices for body text are as important as any headline decision.",
    scenario: "A landing page redesign improved the headline, layout, and visual design but kept the original body copy running at full-page width on desktop. In user testing, participants read the hero and then skipped straight to the CTA. The body copy, which contained the product's most persuasive content, was being ignored. Constraining line length to 65 characters increased time-on-page and CTA clicks.",
    example: "\"The body copy line length is too wide at full desktop width. Aim for 60 to 75 characters per line or it becomes hard to track from line to line.\"",
    related: ["Copy", "Microcopy", "Line height", "Typeface"] },

  { term: "Writing a CTA", category: "Copy", level: "Beginner",
    definition: "The practice of crafting the label or prompt that directs a user to take a specific next step: 'Get started', 'Book a demo', 'Download now'. A well-written CTA is the most important piece of copy on most commercial screens.",
    whyItMatters: "CTA wording has a measurable impact on conversion. 'Submit' performs worse than 'Get my free report'. Specificity, benefit-framing, and low-commitment language all affect whether users click. It is one of the highest-leverage copy decisions available.",
    scenario: "A sign-up page had used the button label 'Submit' for two years. A copywriter proposed 'Start my free trial' and the team ran an A/B test. The revised label outperformed the original by 27% in sign-ups over four weeks. The product, pricing, and page layout were identical. The only change was four words.",
    example: "\"Change the CTA from 'Submit' to 'Start my free trial'. Make it specific and low-stakes. A/B test that against 'Try it free'.\"",
    related: ["Microcopy", "Conversion rate", "Hierarchy", "Copy"] },

  { term: "Copy", category: "Copy", level: "Beginner",
    definition: "Any written content created for a product or marketing purpose: headlines, body text, button labels, emails, and tooltips. Copy is written with a specific persuasive or functional purpose in mind.",
    whyItMatters: "Copy and design are inseparable. A layout without real copy is just a wireframe. You do not know if it works until the words are in place. Designers who understand copy make better layouts; writers who understand design make better copy.",
    scenario: "A designer presented a clean, approved mockup to engineering. Development began using lorem ipsum as placeholder content. When real copy arrived two weeks later, the headline was three lines long rather than one, the card descriptions broke the card height constraints, and one screen needed a complete layout rethink. Designing with real or representative copy from the start would have surfaced all of this before any code was written.",
    example: "\"Review the copy in the mockups before we present. Some placeholders are still lorem ipsum and it's throwing off the hierarchy.\"",
    related: ["Microcopy", "Tone of voice", "Hierarchy", "CTA"] },

  { term: "Copy Hierarchy", category: "Copy", level: "Beginner",
    definition: "The organisation of copy from most to least important, using size, weight, colour, and spacing to signal the order in which content should be read. A clear hierarchy moves the reader from headline through subheading to body.",
    whyItMatters: "Copy without hierarchy is a wall of text. Visual and verbal hierarchy work together to create a reading path, so that even a three-second glance delivers the most important message.",
    scenario: "A feature announcement page had a strong headline but body copy, subheadings, and supporting detail were all set in the same weight and size. In user testing, participants read the headline and could not identify what to read next. Three of five could not summarise the feature's main benefit after reading the full page. Applying a clear typographic scale to the copy resolved both problems without changing a single word.",
    example: "\"The page has a strong headline but the subheading and body are too similar in weight. Users aren't getting a clear reading order.\"",
    related: ["Visual hierarchy", "Typography", "Font weight", "CTA"] },

  // ── ACCESSIBILITY (5) ─────────────────────────────────────────────────────
  { term: "WCAG", category: "Accessibility", level: "Intermediate",
    definition: "Web Content Accessibility Guidelines. The internationally recognised standard for making digital content accessible to people with disabilities, organised into compliance levels A (minimum), AA (standard), and AAA (enhanced).",
    whyItMatters: "WCAG compliance is both a legal requirement in many countries and a design quality bar that benefits everyone. Meeting AA standards means the product works for people with visual, motor, auditory, and cognitive impairments, and is typically easier to use for everyone else too.",
    scenario: "A product team preparing for launch in the European market discovered their design used mid-grey text on a white background throughout. The contrast ratio was 3.2:1. WCAG AA requires 4.5:1 for normal text. Fixing it required revisiting colour decisions across the entire component library, a two-week unplanned effort that could have been avoided by checking contrast ratios at the design stage.",
    example: "\"Our colour contrast fails WCAG AA on the secondary button. We need to darken the text before launch.\"",
    related: ["Accessibility", "Contrast", "Screen reader", "Usability"] },

  { term: "Accessibility", category: "Accessibility", level: "Beginner",
    definition: "The practice of designing products that are usable by people of all abilities, including those with visual, auditory, motor, or cognitive impairments. Accessibility is not a feature or an edge case. It is a baseline quality standard.",
    whyItMatters: "Approximately one in six people globally live with some form of disability. Designing accessibly does not just serve those users. It produces clearer layouts, better contrast, and more intuitive interactions for everyone.",
    scenario: "A team added captions to all product tutorial videos to meet an accessibility requirement. When they later reviewed analytics, they found 68% of users were watching the videos with captions on even though most had no identified hearing impairment. The captions were improving comprehension and retention for the entire user base.",
    example: "\"We need an accessibility review before this goes live. Keyboard navigation, screen reader compatibility, and colour contrast as a minimum.\"",
    related: ["WCAG", "Contrast", "Usability", "Inclusive design"] },

  { term: "Usability", category: "Accessibility", level: "Beginner",
    definition: "The degree to which a product can be used by specific users to achieve specific goals effectively, efficiently, and with satisfaction in a specified context of use.",
    whyItMatters: "A product can be technically functional and still be unusable. Usability is the gap between what designers intend and what users experience. Closing that gap is the fundamental work of UX design.",
    scenario: "A team shipped a data export feature that worked correctly from an engineering perspective. Users could extract their data in three steps. In the first month, 40% of support requests were about this feature. Users were completing the flow but not understanding what the file format options meant or which to choose. The feature was functional. It was not usable.",
    example: "\"The feature works, but the usability is poor. Users keep making the same mistake at the same point. We need to redesign that interaction.\"",
    related: ["Accessibility", "Usability test", "Cognitive load", "WCAG"] },

  { term: "Thumb Reachability", category: "Accessibility", level: "Intermediate",
    definition: "The consideration of which areas of a mobile screen are comfortably reachable by a user's thumb when holding the device one-handed. The bottom-centre zone is easiest to reach; the top corners are hardest.",
    whyItMatters: "Most smartphone use happens one-handed. Placing primary actions in the top corners forces users into awkward stretches that interrupt flow and increase the chance of accidental taps. Designing for thumb reachability makes a product physically easier to use.",
    scenario: "A redesigned mobile app moved the primary navigation from a bottom tab bar to a hamburger menu in the top-left corner. Post-launch data showed a 22% drop in navigation usage and a sharp increase in users leaving from screens they had previously explored. The content had not changed. The primary control was now physically difficult to reach with one thumb.",
    example: "\"The primary CTA is in the top-right corner on mobile. That's outside the thumb reachability zone. Move it to the bottom of the screen.\"",
    related: ["Mobile-first", "Accessibility", "Responsive web design", "Usability"] },

  { term: "Scalability", category: "Accessibility", level: "Intermediate",
    definition: "In design, the ability of a system, component, or layout to accommodate growth without breaking or requiring a rebuild. Scalable design anticipates change: more content, more users, more features, more edge cases.",
    whyItMatters: "A design that works for five menu items may fall apart at fifteen. Thinking about scalability early saves painful retrofits later. The best design systems are flexible enough to expand without losing coherence.",
    scenario: "A product launched with a horizontal navigation bar holding five items. Eighteen months later, the product had expanded to eleven sections. The navigation broke visually, items began overflowing, and mobile layout collapsed entirely. A more flexible navigation pattern would have cost the same to design initially but saved weeks of rework.",
    example: "\"The navigation works with six products, but it's not scalable. When we launch four more it'll break. We need a more flexible navigation pattern.\"",
    related: ["Design system", "Component library", "Responsive web design", "Information architecture"] },

  // ── METHODOLOGIES (5) ─────────────────────────────────────────────────────
  { term: "Design Thinking", category: "Methodologies", level: "Beginner",
    definition: "A human-centred approach to problem-solving that moves through five stages: Empathise, Define, Ideate, Prototype, and Test. It reframes problems around human needs before jumping to solutions.",
    whyItMatters: "Design thinking is valuable not just for designers but for any team solving complex, ambiguous problems. It slows the rush to solution and ensures the team is solving the right problem for the right people.",
    scenario: "A retail bank's product team was tasked with improving the app's loan application feature. Following design thinking, they began with empathy research rather than jumping to interface improvements. Interviews revealed users were not struggling with the interface. They were abandoning because they feared rejection and did not understand how decisions were made. The resulting solution was a transparency feature explaining the decision process, not a redesign.",
    example: "\"Before we jump into features, let's run a design thinking workshop. I want to properly empathise with the user before we start ideating.\"",
    related: ["Double Diamond", "HCD", "Agile", "Discovery"] },

  { term: "Agile", category: "Methodologies", level: "Beginner",
    definition: "An iterative approach to product development that breaks work into short cycles called sprints, typically two weeks. Agile teams ship working software frequently, gather feedback, and adjust based on what they learn.",
    whyItMatters: "Agile changes how design works. Instead of delivering a complete specification upfront, designers work in step with development, which means being comfortable with 'good enough to test' rather than waiting for perfection.",
    scenario: "A designer new to Agile spent the first sprint producing a fully detailed, polished design for every screen in a new feature. Development could only build one screen that sprint. By the second sprint, requirements had shifted and two screens of delivered design were already out of date. The team agreed to design one sprint ahead of development rather than months ahead, keeping design relevant and responsive.",
    example: "\"We run two-week sprints. Design needs to be one sprint ahead of dev at all times so they're never blocked waiting for assets.\"",
    related: ["Sprint", "Backlog", "MVP", "Design thinking"] },

  { term: "Double Diamond", category: "Methodologies", level: "Intermediate",
    definition: "A design process model from the Design Council with four phases: Discover (explore the problem), Define (frame the right problem), Develop (explore solutions), and Deliver (ship the right solution). The model describes two cycles of diverging and converging.",
    whyItMatters: "The Double Diamond makes the design process legible to non-designers. It validates the time spent in problem definition before jumping to solutions and shows that good design involves two rounds of opening up and narrowing down.",
    scenario: "A product team presented the Double Diamond to a stakeholder who had been pushing for screens after only one week of discovery. Walking through the model visually showed that rushing from the first diamond to the second meant skipping problem definition entirely. The stakeholder agreed to allow another two weeks in the Define phase. The feature that shipped was fundamentally different from what would have been built had they started designing in week one.",
    example: "\"We're still in the first diamond, the discover phase. It's too early to be designing screens. We need to define the problem first.\"",
    related: ["Design thinking", "Discovery", "Divergent thinking", "Convergent thinking"] },

  { term: "Lean UX", category: "Methodologies", level: "Intermediate",
    definition: "An approach to UX design that prioritises validated learning over documentation. Lean UX teams build the minimum artefact needed to test an assumption, then get feedback fast and iterate, rather than producing comprehensive deliverables upfront.",
    whyItMatters: "Lean UX challenges the idea that designers need to document every decision before building. In fast-moving environments, heavy documentation is often obsolete before it is read. The goal is learning, not paperwork.",
    scenario: "A team following a traditional process spent three weeks writing a detailed UX specification for a new search feature before any code was written. Halfway through, the engineering lead pointed out that a key assumption about user search behaviour had never been tested. Three days of Lean UX prototype testing would have surfaced that before any documentation was written.",
    example: "\"In this team we practice Lean UX. Get a rough prototype in front of users within two days. We'll learn more from that than from a week of documentation.\"",
    related: ["Agile", "MVP", "Design thinking", "Prototype"] },

  { term: "Waterfall", category: "Methodologies", level: "Beginner",
    definition: "A sequential project methodology where each phase, including research, design, development, testing, and launch, is completed fully before the next begins. Waterfall is structured and predictable but inflexible to change mid-project.",
    whyItMatters: "Understanding waterfall helps designers navigate organisations still using it and articulate why iterative approaches often produce better outcomes. It remains appropriate in regulated industries and fixed-scope contracts where change is genuinely not viable.",
    scenario: "A government agency commissioned a public-facing product on a waterfall contract with fully signed-off designs required before development began. Three months into development, a policy change required modifications to two core screens. Under waterfall, this triggered a formal change request, a contract amendment, and a six-week timeline extension. The rigidity that provides structure in stable conditions became a serious liability when the environment shifted.",
    example: "\"We're on a waterfall contract. All designs must be fully signed off before development starts. No iterations after handoff.\"",
    related: ["Agile", "Design thinking", "MVP", "Lean UX"] },

  // ── PROTOTYPING (5) ───────────────────────────────────────────────────────
  { term: "Interaction", category: "Prototyping", level: "Beginner",
    definition: "Any moment of exchange between a user and a product: a tap, a hover, a swipe, a keyboard shortcut. Interactions are the building blocks of user experience and must be designed as deliberately as visual elements.",
    whyItMatters: "A screen that looks good in a static mockup may feel wrong in use if its interactions have not been thought through. Every interaction carries an expectation. Meeting or breaking that expectation shapes the entire feel of the product.",
    scenario: "A team approved a checkout design based on static screens. The flow looked clean and logical. When the prototype was built and tested, the transition between entering payment details and the confirmation step felt abrupt and alarming. Users paused, unsure whether their payment had processed. The issue was never visible in the static design. It only emerged when the interaction was experienced in sequence.",
    example: "\"The transition between these two screens feels abrupt. Let's prototype the interaction so we can feel whether a slide or a fade works better.\"",
    related: ["Micro-interaction", "Prototype", "Animation", "Hover state"] },

  { term: "Micro-interaction", category: "Prototyping", level: "Intermediate",
    definition: "A small, contained interaction designed to accomplish a single task: a like button animation, a loading indicator, or a subtle shake when a password is wrong. Micro-interactions provide feedback and add personality to an interface.",
    whyItMatters: "Micro-interactions are the difference between a product that feels alive and one that feels static. They communicate system status, confirm actions, and reward engagement. When done well, they are invisible. Users just feel the product is polished.",
    scenario: "A team launched a file-saving feature with no visible confirmation. Users reported uncertainty about whether their work had saved, and some were duplicating documents manually as a precaution. Adding a brief animated checkmark to the save button, visible for 1.5 seconds after each save, eliminated the behaviour entirely. The functional change was minimal. The psychological effect was significant.",
    example: "\"Add a micro-interaction to the save button. A brief checkmark animation so users know their work was saved without a full notification.\"",
    related: ["Interaction", "Animation", "Prototype", "Hover state"] },

  { term: "Design Specs", category: "Prototyping", level: "Intermediate",
    definition: "The detailed documentation that accompanies a design handoff: exact measurements, spacing, colours, typography, interaction states, and component behaviour. Specs bridge the gap between design intent and built output.",
    whyItMatters: "Without specs, developers make their best guess. Small guesses compound into large discrepancies from the designed experience. Good specs reduce back-and-forth between design and dev and produce a final product that matches the design.",
    scenario: "A designer handed off a new modal component with the default state fully documented in Figma. The developer built it accurately. In QA, the reviewer discovered the hover state, the focused state, and the disabled state had never been designed or specified. Three additional days of design and development work followed. All of it could have been avoided if the spec had covered every interactive state from the start.",
    example: "\"The specs need to include the hover and disabled states. Don't just hand off the default state and expect dev to figure the rest out.\"",
    related: ["QA", "Prototype", "Component library", "Developer handoff"] },

  { term: "Animation", category: "Prototyping", level: "Intermediate",
    definition: "The use of motion to transition between states, provide feedback, guide attention, or add personality to an interface. In UI, animation includes page transitions, loading states, hover effects, and celebratory moments.",
    whyItMatters: "Animation used well makes an interface feel responsive and alive. Used poorly, whether too fast, too slow, or too frequent, it becomes distracting or makes the product feel slower than it is. Animation should serve communication, not decoration.",
    scenario: "A product team added animations to every screen transition in a new onboarding flow. Beta testers found it polished initially but described the product as 'slow' in post-session feedback. The animations averaged 400ms, which felt elegant in isolation but added over three seconds of perceived wait time across the full eight-step flow. Reducing all transitions to 180ms and removing two animations entirely resolved the feedback.",
    example: "\"The modal appears instantly with no transition. It feels jarring. Can you add a 200ms ease-in to make it feel more natural?\"",
    related: ["Micro-interaction", "Interaction", "Easing", "Prototype"] },

  { term: "Hover State", category: "Prototyping", level: "Beginner",
    definition: "The visual change that occurs when a user moves their cursor over an interactive element. Hover states confirm that an element is clickable and provide feedback before the user commits to an action.",
    whyItMatters: "Hover states are one of the simplest affordances in web design, but they are frequently missed. Without them, users cannot tell what is interactive. Every clickable element should have a defined hover state before handoff.",
    scenario: "A redesigned product page replaced all text links with an icon-and-text combination. The links had no hover state designed. In QA, a tester noted that hovering over any of them produced no feedback, and keyboard navigation produced no visible focus indicator. Eight navigation elements were affected and all required design and development time to fix before launch.",
    example: "\"Has the hover state been designed for the navigation links? Dev will need that spec before they can build it correctly.\"",
    related: ["Interaction", "Focused state", "Affordance", "Design specs"] },

  // ─── MISSING RELATED CARDS ──────────────────────────────────────────────────

  { term: "Acquisition", category: "Testing", level: "Beginner",
    definition: "The process by which new users discover and first arrive at a product, through organic search, paid ads, referrals, or word of mouth. Acquisition is the very top of the funnel.",
    whyItMatters: "Understanding where users come from shapes everything below it. A mismatch between the promise in an ad and the reality of the landing page is one of the most common causes of high bounce rates and poor conversion.",
    scenario: "A team ran paid search ads that promised 'instant setup in under two minutes'. Users arrived and found a twelve-field registration form. Bounce rates were 78%. Fixing the landing page to reflect the actual setup experience reduced bounce rates to 41% with no change to ad spend.",
    example: "\"Most of our acquisition is organic search. The landing page copy needs to match the exact language people are searching with, otherwise we lose them immediately.\"",
    related: ["Funnel", "Bounce Rate", "Conversion Rate", "Engagement"] },

  { term: "Alignment", category: "Alignment", level: "Beginner",
    definition: "The positioning of elements along a shared axis, whether left, right, centre, or top, so that they feel intentionally arranged rather than scattered. One of the most foundational principles of visual design.",
    whyItMatters: "Misaligned elements create visual noise even when users cannot articulate why a layout feels off. Consistent alignment is what separates a designed layout from an assembled one. Grids exist to make alignment systematic.",
    scenario: "A designer placed a row of icons with accompanying labels, but the icons were vertically centred on the cap height while the labels sat on the baseline. In isolation, no element looked wrong. Placed together, the row felt unstable. Aligning everything to the text baseline took two minutes and made the row feel immediately resolved.",
    example: "\"The icon and the label next to it aren't vertically aligned. It's a small thing but it makes the row feel unpolished. Everything on this line should share the same baseline.\"",
    related: ["Grid", "Visual Hierarchy", "Spacing", "8-Point Grid System"] },

  { term: "Analogous", category: "Colours", level: "Intermediate",
    definition: "Colours that sit adjacent to each other on the colour wheel, such as blue, teal, and green. Analogous colour schemes feel harmonious and natural because the hues share underlying tones.",
    whyItMatters: "Analogous palettes are cohesive without being boring. They create a sense of unity that works well for backgrounds, illustration systems, and brand identities where a calm, related feel is the goal.",
    scenario: "An illustration system for a wellness app used colours pulled from across the wheel, resulting in a palette that felt energetic and varied but inconsistent across screens. Switching to an analogous range of soft greens and teals gave the system visual coherence. Every screen now felt like it belonged to the same product.",
    example: "\"The illustration palette uses analogous warm tones, burnt orange into amber into yellow. It feels cohesive without any single colour overpowering the others.\"",
    related: ["Complementary Colours", "Colour Theory", "Colour Palette", "Greyscale"] },

  { term: "Ascenders", category: "Typography", level: "Advanced",
    definition: "The strokes of lowercase letters that extend above the x-height, found on letters like 'b', 'd', 'h', 'k', and 'l'. Ascenders give words their recognisable silhouette and support fast reading.",
    whyItMatters: "Ascenders contribute to how words are recognised as shapes rather than sequences of letters. Line height needs to account for ascenders to prevent them clashing with descenders from the line above.",
    scenario: "A designer set body copy at a line height of 1.2 for a compact data table. In testing, users said the text felt dense and hard to read. Increasing the line height to 1.5 gave ascenders and descenders room to breathe, and reading speed in the table improved measurably in a follow-up test.",
    example: "\"The tight leading is causing the ascenders to sit right under the descenders of the previous line. Increase the line height so they have room to breathe.\"",
    related: ["Descenders", "X-height", "Baseline", "Typeface"] },

  { term: "Assumption", category: "Discovery", level: "Beginner",
    definition: "An unvalidated belief held by the team about users, the market, or the product, treated as true without evidence. Every product decision rests on assumptions whether teams acknowledge them or not.",
    whyItMatters: "Unexamined assumptions are the root cause of most product failures. Making assumptions explicit, writing them down and asking what would have to be true for this to work, is the first step to testing them.",
    scenario: "A team built a notification system assuming users would want daily digest emails. After launch, unsubscribe rates hit 60% in the first week. A quick user survey revealed most users preferred in-product alerts only. The assumption had never been validated because it had never been named as an assumption.",
    example: "\"We're assuming users check this dashboard daily, but has anyone validated that? Let's name it as an assumption and find a way to test it before we design around it.\"",
    related: ["Hypothesis", "Assumption Mapping", "Discovery", "User Research"] },

  { term: "Backlog", category: "Methodologies", level: "Beginner",
    definition: "An ordered list of all the work a team plans to do, including features, bug fixes, research, and design tasks, prioritised by the product owner and refined continuously. The backlog is the team's shared queue.",
    whyItMatters: "The backlog is where design work competes for priority against everything else. Designers who understand how to write clear, well-reasoned tickets and advocate for their priority get more of the right work built.",
    scenario: "A designer noticed that three empty state screens had been marked as out-of-scope in the last sprint. They added them to the backlog with a note linking to usability test footage showing users getting confused at those states. In the next refinement session, the product owner prioritised all three because the rationale was clear and the evidence was visible.",
    example: "\"Add empty state designs to the backlog before the sprint closes. They got cut last time and they block the feature feeling complete when it ships.\"",
    related: ["Sprint", "Agile", "Product Manager", "Product Owner"] },

  { term: "Baseline", category: "Typography", level: "Intermediate",
    definition: "The invisible horizontal line that most letters sit on. Descenders dip below it, but the body of letters like 'x', 'o', and 'n' rest exactly on the baseline. Baseline grids align type consistently across a layout.",
    whyItMatters: "When elements across columns or components share a common baseline, the layout feels considered and settled. When they do not, even by a few pixels, the layout feels unstable in a way that is hard to name.",
    scenario: "A product dashboard had data labels and accompanying icons in each row. The icons were centred on the cap height while the labels sat on the baseline, creating a subtle but persistent vertical tension across every row. Aligning all elements to the text baseline resolved the tension immediately and required no visual rework beyond repositioning.",
    example: "\"The icon and the label next to it aren't baseline-aligned. The icon is centred on the cap height instead. Align them to the text baseline and it'll snap into place.\"",
    related: ["Ascenders", "Descenders", "X-height", "Line Height"] },

  { term: "Brand", category: "Brand", level: "Beginner",
    definition: "The total impression a company or product makes on its audience, built from visual identity, tone of voice, values, and every experience a user has. Brand is what people feel, not just what they see.",
    whyItMatters: "A brand is not a logo. It is a reputation, built one interaction at a time. Every design decision either reinforces or undermines it. Teams that treat brand as a visual afterthought end up with products that look polished but feel hollow.",
    scenario: "A company released a new feature that had been built by a separate team. The copy was formal, the button styles did not match the rest of the product, and the empty state used a generic stock illustration. Users noticed. In app store reviews, three separate users described it as feeling like 'a different product'. The feature worked. It did not feel like the brand.",
    example: "\"The feature works technically, but it doesn't feel like us. The copy is formal, the colours are off-brand, and the interaction style doesn't match the rest of the product. This needs a brand pass before it ships.\"",
    related: ["Brand Identity", "Tone of Voice", "Design System", "Style Guide"] },

  { term: "Bug", category: "Development", level: "Beginner",
    definition: "An unintended error in a built product where the output does not behave as expected or does not match the design specification. Bugs are caught during QA, user testing, or production use.",
    whyItMatters: "Knowing how to identify and document a bug clearly is part of the designer's role in delivery. A good bug report includes expected behaviour, actual behaviour, steps to reproduce, and a screenshot, giving developers everything they need to fix it.",
    scenario: "A designer reviewing a new component in staging noticed the hover state was not appearing on Safari. They logged a bug with the exact browser version, a screen recording showing expected versus actual behaviour, and a reference to the design spec. The developer fixed it within an hour. Without the clear documentation, it would have been a three-email thread before they could reproduce the issue.",
    example: "\"The card hover state isn't rendering on Safari. Log it as a bug with a screen recording and flag it as blocking before we ship.\"",
    related: ["QA", "Design Specs", "Deployment", "Developer Handoff"] },

  { term: "CSAT", category: "Business", level: "Intermediate",
    definition: "Customer Satisfaction Score. A survey metric, typically on a 1 to 5 or 1 to 10 scale, that measures satisfaction with a specific interaction, moment, or transaction. Usually collected immediately after the experience.",
    whyItMatters: "CSAT pinpoints moments of friction or delight in a way that broad satisfaction metrics like NPS cannot. Low CSAT on a specific flow is a direct signal that the design of that moment needs attention.",
    scenario: "A product team added a CSAT survey to the end of their onboarding flow. Completion rates were 85% but CSAT averaged 2.8 out of 5. Users were finishing but not feeling good about the experience. The gap between completion and satisfaction pointed directly to a design problem that the completion metric alone had hidden for months.",
    example: "\"Our CSAT score after the onboarding flow is 2.8 out of 5. Users are completing it but not feeling good about it. That's a design problem, not just a content one.\"",
    related: ["NPS", "Voice Of Customer", "KPI", "Retention"] },

  { term: "CSS", category: "Development", level: "Beginner",
    definition: "Cascading Style Sheets, the language that controls the visual presentation of HTML: layout, colour, spacing, typography, animation, and responsiveness. Every visual decision a designer makes ultimately becomes CSS.",
    whyItMatters: "Designers who understand CSS basics write more accurate specs, have more credible conversations with developers, and avoid designing things that are unnecessarily expensive to build. Knowing what is trivial versus what is complex in CSS is a career asset.",
    scenario: "A designer specced a card with a gradient border for a new feature. The developer spent four hours implementing it using a workaround because CSS gradient borders require a non-obvious technique. A brief conversation with the developer before writing the spec would have surfaced a simpler approach that achieved the same visual effect in fifteen minutes.",
    example: "\"That gradient border effect is possible in CSS, but it's not straightforward. Check with the developer before speccing it. There may be a simpler way to achieve the same feel.\"",
    related: ["Responsive Web Design", "Breakpoints", "Design Specs", "Developer Handoff"] },

  { term: "CTA", category: "Copy", level: "Beginner",
    definition: "Call to Action. The word, phrase, or button that prompts a user to take a specific next step: 'Get started', 'Sign up free', 'Add to cart'. The CTA is where design intent meets user decision.",
    whyItMatters: "The wording, size, position, and contrast of a CTA are among the highest-leverage design decisions on any page. Vague CTAs such as 'Submit' or 'Click here' consistently underperform specific, benefit-led ones. Every page should have one clear primary CTA.",
    scenario: "A homepage had three CTAs in the hero: 'Learn more', 'See features', and 'Sign up'. Click rates were spread almost equally across all three, and sign-ups were at the lowest point in six months. Removing the first two and making 'Start for free' the sole primary CTA increased sign-ups by 31% in the following three weeks.",
    example: "\"The CTA says 'Learn more'. That's the weakest possible option. Rewrite it to name what the user gets: 'See how it works' or 'Start your free trial'.\"",
    related: ["Microcopy", "Conversion Rate", "Primary Button", "Visual Hierarchy"] },

  { term: "Card sorting", category: "Research", level: "Intermediate",
    definition: "A research method where participants physically or digitally sort topics, features, or content into groups that make sense to them. Used to understand mental models and inform information architecture.",
    whyItMatters: "Card sorting replaces designer assumptions with user logic. The navigation structure that feels obvious to a team that built the product is often completely foreign to users who encounter it fresh.",
    scenario: "A product team redesigned their navigation based on their internal taxonomy. After launch, support tickets about 'not being able to find things' doubled. A card sort run with twenty users revealed the team's category names had no relationship to how users mentally organised the same content. The navigation was rebuilt using user-generated groupings and the confusion disappeared.",
    example: "\"Before we restructure the menu, run a card sort with twelve users. Let them group the pages themselves. We'll design the IA from their patterns, not ours.\"",
    related: ["Information Architecture", "Mental Model", "Navigation", "Affinity Map"] },

  { term: "Checkbox", category: "UI Elements", level: "Beginner",
    definition: "A form control that lets users select one or more items from a set independently. Ticking one does not affect others. Checkboxes indicate binary yes/no states or multi-select options.",
    whyItMatters: "Checkboxes and radio buttons are the most commonly confused UI pattern. The rule is clear: when multiple answers are possible, use checkboxes. When only one answer is allowed, use radio buttons. Getting this wrong creates real usability problems.",
    scenario: "A filter panel used radio buttons for dietary preferences, allowing users to select only one option at a time. Users who wanted both 'Gluten-free' and 'Vegan' had to choose one and lost the other. Support tickets requesting multi-select filters were common for six months before the controls were switched to checkboxes and the issue resolved entirely.",
    example: "\"Those filter options aren't mutually exclusive. The user can apply multiple at once. Switch from radio buttons to checkboxes so the interaction matches what's actually allowed.\"",
    related: ["Radio Button", "Toggle", "Focused State", "Feedback"] },

  { term: "Cognitive walkthrough", category: "Design Methodologies", level: "Advanced",
    definition: "A usability inspection method where evaluators work through a design step by step, asking at each moment whether a new user would know what to do and whether the interface confirms they did it correctly.",
    whyItMatters: "Cognitive walkthroughs catch first-use problems that designers, who know the system intimately, are blind to. By explicitly voicing each step of a user's reasoning, they surface gaps in affordance, labelling, and feedback.",
    scenario: "A team ran a cognitive walkthrough on a new settings flow before usability testing. At step four, every evaluator paused: the 'Save' button was visually identical to the 'Cancel' button and neither was labelled clearly. This was missed in every design review because everyone in the room already knew which was which. The walkthrough forced the team to reason through it as a first-time user.",
    example: "\"Walk through the checkout flow as if you've never seen the product before. At every step, ask: what would I click, and how would I know it worked? Those uncertainty points are what we need to design for.\"",
    related: ["Heuristic Evaluation", "Mental Model", "Usability Test", "Affordance"] },

  { term: "Complementary", category: "Colours", level: "Intermediate",
    definition: "Colours that sit directly opposite each other on the colour wheel. Complementary pairs such as blue and orange, red and green, or yellow and purple create maximum contrast and strong visual energy when used together.",
    whyItMatters: "Complementary pairings are attention-grabbing by nature, making them ideal for CTAs and highlights. The key is restraint: one colour should dominate as the palette base while the other appears sparingly as an accent.",
    scenario: "A product redesign introduced a teal and coral complementary pairing throughout the interface, applying both colours equally across backgrounds, buttons, and illustrations. The result felt visually unstable and exhausting. Establishing teal as the dominant base and coral as an accent used only on primary CTAs immediately resolved the tension and made every call to action unmissable.",
    example: "\"The orange CTA on the navy background is working precisely because it's a complementary pair. The contrast is what makes it impossible to miss.\"",
    related: ["Colour Theory", "Colour Palette", "Analogous", "Contrast"] },

  { term: "Convergent thinking", category: "Methodologies", level: "Intermediate",
    definition: "The mode of thinking where a set of ideas or options is evaluated, filtered, and narrowed toward the best single solution. Convergent thinking follows divergent thinking in any well-run design process.",
    whyItMatters: "Generating ideas is only half the job. The ability to critically evaluate options, apply constraints, and commit decisively to a direction is what turns creative exploration into shipped product.",
    scenario: "A design sprint generated fourteen concepts for a new onboarding flow. Without a structured convergence exercise, the team spent an afternoon in circular discussion, each person defending their own ideas. Introducing a decision matrix based on user research findings and technical feasibility reduced the field to three options in forty minutes. The team committed to one before the end of the day.",
    example: "\"We've generated eighteen concepts. Now we converge. Each option gets evaluated against our design principles and user research, and we'll pick one direction to develop fully.\"",
    related: ["Divergent Thinking", "Design Thinking", "Double Diamond", "Lean UX"] },

  { term: "Conversational tone", category: "Brand", level: "Beginner",
    definition: "A writing style that reads the way a knowledgeable, helpful person would speak: plain language, short sentences, second person (you), and contractions where appropriate. The opposite of corporate or technical formality.",
    whyItMatters: "Digital products live or die on their microcopy, onboarding flows, and error messages. Conversational tone transforms those functional moments into experiences that feel warm and human rather than transactional.",
    scenario: "A financial services product rewrote its error messages and empty states in a conversational tone as part of a content audit. The most-logged error before the rewrite read: 'Transaction authorisation failed due to insufficient account liquidity.' After: 'There wasn't enough money in your account for this payment.' Support calls about that specific message dropped by 44% in the first month.",
    example: "\"The empty state copy says 'No results were returned for the selected parameters.' Rewrite it conversationally: 'Nothing matched those filters. Try broadening your search.'\"",
    related: ["Tone Of Voice", "Microcopy", "Brand Identity", "Copy"] },

  { term: "Data analytics", category: "Testing", level: "Intermediate",
    definition: "The collection and analysis of quantitative data about how users interact with a product: page views, click rates, session durations, funnels, and retention curves. Analytics answers 'what is happening' at scale.",
    whyItMatters: "Analytics surface patterns across thousands of sessions that no amount of user interviews could reveal. But they cannot explain why. That is qualitative research's role. Used together, they give teams a full picture.",
    scenario: "A team noticed from analytics that 70% of users were dropping off at the third step of onboarding. The data was clear about where the problem was but offered no explanation. Five usability sessions revealed users were confused by a required field that asked for a 'company identifier', a term that meant nothing to them. The analytics found the problem; the qualitative sessions explained it.",
    example: "\"Analytics show a 70% drop-off on screen three of onboarding. We know the what. Now we need usability sessions to understand the why before we redesign it.\"",
    related: ["Conversion Rate", "Bounce Rate", "Heat Map", "KPI"] },

  { term: "Delivery lead", category: "Positions", level: "Intermediate",
    definition: "A role responsible for coordinating the delivery of a product or project: managing timelines, removing blockers, and ensuring design, engineering, and QA work together toward a shared release goal.",
    whyItMatters: "The delivery lead is the team's logistical backbone. For designers, a strong one means dependencies are tracked, blockers are escalated early, and the design work lands in the right hands at the right time.",
    scenario: "A designer was working on two features simultaneously, not realising that one was on the critical path for a launch in three days. The delivery lead caught the conflict during a daily standup and immediately reprioritised the designer's time. Without that visibility over dependencies, the launch would have been delayed waiting for a spec that was sitting in a design file.",
    example: "\"Let the delivery lead know the component specs won't be ready until Thursday. They need to know now so they can adjust the sprint plan before dev is blocked.\"",
    related: ["Product Manager", "Product Owner", "Agile", "Sprint"] },

  { term: "Descenders", category: "Typography", level: "Advanced",
    definition: "The strokes of lowercase letters that extend below the baseline, found on 'g', 'j', 'p', 'q', and 'y'. Descenders determine how much vertical space is needed between lines of text.",
    whyItMatters: "When line height is set too tight, descenders from one line visually collide with ascenders from the line below, making text exhausting to read. Generous leading that accounts for descenders is a basic requirement of readable typography.",
    scenario: "A mobile app used a line height of 1.15 for its settings labels to make them fit within a tight list component. In testing, users took noticeably longer to parse the list than an equivalent one with 1.5 line height. The descenders on every row were crowding the ascenders of the row below, and users were unconsciously slowing down to separate the lines.",
    example: "\"Increase the line height. The descenders on the 'y' and 'g' are clipping into the ascenders of the line beneath. It's making the body copy feel cramped.\"",
    related: ["Ascenders", "Baseline", "X-height", "Line Height"] },

  { term: "Design deliverable", category: "Discovery", level: "Beginner",
    definition: "A specific, tangible output produced by a designer for a defined purpose: a wireframe deck, a prototype link, a component spec, or a research report. Deliverables are the artefacts that move a project forward.",
    whyItMatters: "Being clear upfront about what deliverable is needed and why prevents both over-investing in polish that is not needed yet and under-investing when specificity matters. The right deliverable depends entirely on the audience and the decision it needs to support.",
    scenario: "A designer spent two days producing a high-fidelity prototype for a stakeholder review that was meant only to align on flow direction. The stakeholder spent the entire session commenting on colour choices, typography, and illustration style. A low-fidelity wireframe would have focused the conversation on the only thing that actually mattered at that stage.",
    example: "\"What's the actual deliverable for this review? If it's just for internal alignment, a mid-fi wireframe is enough. If engineering is starting next week, we need annotated specs.\"",
    related: ["Design Brief", "Wireframe", "Prototype", "Design Specs"] },

  { term: "Design playback", category: "Business", level: "Intermediate",
    definition: "A structured presentation where a designer walks stakeholders through the thinking behind a design: the problem, the research, the decisions made, and the rationale for each one. Less a show-and-tell, more a narrative.",
    whyItMatters: "The ability to present design with clarity and conviction is as important as the design itself. A playback done well builds stakeholder trust, prevents misinterpretation, and makes it far easier to get alignment and move forward.",
    scenario: "A designer shared a Figma link with stakeholders and asked for feedback asynchronously. The comments ranged from 'why is this blue?' to 'is this the final version?' Nobody understood the problem the design was solving or the decisions that had been made. A thirty-minute playback the following week, walking through problem, research, and rationale, resolved every open question in a single session.",
    example: "\"Don't just share the Figma link and ask for feedback. Schedule a 30-minute playback. Walk the team through the problem, what you learned, and what you decided. That context changes everything.\"",
    related: ["Stakeholder", "Presentation", "Design Brief", "Product Requirement"] },

  { term: "Design principles", category: "Design Methodologies", level: "Intermediate",
    definition: "A short set of guiding statements that define how design decisions should be made for a specific product or team, such as 'clarity before cleverness' or 'design for real content, not ideal content'.",
    whyItMatters: "Design principles give teams a shared decision-making vocabulary. When two valid design options are debated, principles break the tie, but only if they are specific enough to actually distinguish between options. Generic principles like 'be human' or 'be clear' do not do that job.",
    scenario: "A team debated for an hour whether a new dashboard should default to a compact view or an expanded view. Neither side could resolve it based on preference alone. Their design principle 'progressive, not prescriptive' settled it immediately: default to compact and let users expand. The principle made the right answer obvious in a way that forty-five minutes of discussion had not.",
    example: "\"Before we debate this for another hour, let's check our principles. We said 'progressive, not prescriptive'. Which of these two options gives the user more control at each step?\"",
    related: ["Heuristic Evaluation", "Cognitive Walkthrough", "Mental Model", "Affordance"] },

  { term: "Design system", category: "Design System", level: "Intermediate",
    definition: "A complete, living set of standards, guidelines, components, and tools that enables teams to design and build consistently at scale. A design system includes the component library, design tokens, style guide, and documented patterns, all kept in sync.",
    whyItMatters: "As products and teams grow, consistency becomes impossible to maintain through willpower alone. A design system encodes past decisions so every new screen does not start from scratch. It starts from a shared foundation that reflects what the team has already decided.",
    scenario: "A product team of four grew to twelve designers across three squads within a year. Without a design system, each squad began making independent component decisions. Six months later, there were four versions of the button component, three different card heights, and two conflicting spacing scales. Rebuilding on a shared system took three months of work that would have been unnecessary had the system been established earlier.",
    example: "\"Before we onboard three new designers, we need the design system properly documented. Right now institutional knowledge lives in people's heads. It needs to live in the system.\"",
    related: ["Component Library", "Design Token", "Style Guide", "Pattern Library"] },

  { term: "DevOps", category: "Development", level: "Advanced",
    definition: "A set of practices that combines software development and IT operations, automating testing, deployment pipelines, and infrastructure management to deliver software more frequently and reliably.",
    whyItMatters: "Understanding DevOps helps designers appreciate the relationship between a design change and its journey to production. When something is blocked by a pipeline failure or needs to go through a release window, DevOps is usually why.",
    scenario: "A designer submitted a one-line copy fix to a landing page on a Tuesday and expected it to be live within the hour. It was not live until Thursday. The change had to pass through an automated test suite, await a daily build, and go through a scheduled deployment window. Understanding this pipeline helps designers plan realistic timelines for urgent fixes.",
    example: "\"The fix is ready but it won't ship until Thursday's release window. The DevOps pipeline requires all changes to go through a scheduled deployment, not ad hoc pushes.\"",
    related: ["Deployment", "QA", "MVP", "PR Pull Request"] },

  { term: "Developer handoff", category: "Prototyping", level: "Intermediate",
    definition: "The process of transferring a completed design to engineers for implementation, typically including annotated mockups, interaction notes, component specs, asset exports, and a design file link with all states documented.",
    whyItMatters: "The quality of a handoff directly determines how closely the built product matches the design intent. Incomplete handoffs force developers to make interpretive calls, reasonable guesses that inevitably diverge from what the designer had in mind.",
    scenario: "A designer handed off a new profile page design with only the default state documented. The developer built it accurately. In QA, the reviewer found that the empty state, the error state, the loading state, and the edit state were all missing or inconsistent. Each required a design decision, a developer fix, and a review cycle. All of it could have been resolved in the original handoff.",
    example: "\"Before marking this ready for development, check: are all states specced, hover, focused, error, disabled? Are spacing values using tokens? Is there a note about the animation timing? If any of those are missing, it's not ready.\"",
    related: ["Design Specs", "Prototype", "QA", "Component Library"] },

  { term: "Development", category: "Development", level: "Beginner",
    definition: "The practice of writing code to build software, translating design specifications and product requirements into a functioning product. Development spans front-end (what users see), back-end (servers and data), and everything in between.",
    whyItMatters: "Designers who understand how development works make better decisions. Knowing roughly what is easy versus what is costly to build, and when to ask, leads to designs that are both considered and actually buildable within real constraints.",
    scenario: "A designer specced a product card with a complex stacked shadow, a gradient overlay, and a custom hover animation that involved three simultaneous property changes. Individually, none was unreasonable. Together, they required significantly more development time than expected and introduced performance issues on low-end devices. A brief conversation at the concept stage would have led to a simpler solution with the same visual impact.",
    example: "\"That interaction is elegant in the prototype, but let's check with development before we commit. It may need custom animation work that isn't in scope for this sprint.\"",
    related: ["MVP", "API", "QA", "Design Specs"] },

  { term: "Divergent thinking", category: "Methodologies", level: "Intermediate",
    definition: "A mode of creative exploration where the goal is to generate as many different possibilities as possible without filtering, critiquing, or evaluating. The first phase of any good design process before narrowing begins.",
    whyItMatters: "Most teams jump to solutions before the problem space is properly explored. Divergent thinking creates the conditions for better ideas by deliberately postponing judgment. Volume and variety first; quality emerges from selection.",
    scenario: "A team was designing a way for users to save items across a product. They jumped to a bookmarking icon after five minutes because it was the obvious solution. A facilitated divergent session produced fourteen alternative approaches: wishlists, collections, share-to-self, pinning, notes. The final design, a combined save-and-annotate pattern, came from that session and tested significantly better than the initial bookmark idea.",
    example: "\"This is a diverge session. Every idea goes on the board, no critiques yet. We want at least fifteen different approaches before we start evaluating any of them.\"",
    related: ["Convergent Thinking", "Design Thinking", "Double Diamond", "Affinity Map"] },

  { term: "Dropdown", category: "UI Elements", level: "Beginner",
    definition: "A UI control that reveals a list of selectable options when triggered by click, tap, or keyboard. The list appears layered over the surrounding content and closes when a selection is made or the user clicks elsewhere.",
    whyItMatters: "Dropdowns conserve space by hiding choices until needed, but at a usability cost: users cannot compare all options simultaneously. For six or fewer choices, visible options such as radio buttons or segmented controls almost always test better.",
    scenario: "A pricing page used a dropdown to select between three plan tiers. Conversion testing showed users were far less likely to upgrade compared to a design that displayed all three plans side by side. The dropdown required users to open it, read one option, close it, and open it again to compare. Switching to a visible three-column plan selector increased upgrade conversions by 22%.",
    example: "\"We're using a dropdown for the pricing tier selector, but there are only three options. Switch to a visible toggle group. Users shouldn't have to click to discover what their choices are.\"",
    related: ["Radio Button", "Accordion", "Navigation", "Progressive Disclosure"] },

  { term: "Easing", category: "Prototyping", level: "Intermediate",
    definition: "The curve that describes how the speed of an animation changes over time. Ease-in starts slow and accelerates; ease-out starts fast and decelerates; ease-in-out does both. Linear means constant speed throughout.",
    whyItMatters: "Nothing in the physical world moves at a constant speed. Linear animations feel robotic precisely because they violate that expectation. Easing is the difference between a UI that feels alive and one that feels mechanical.",
    scenario: "A sidebar navigation drawer had been built with a linear slide-in animation. In user testing, two participants described it as feeling 'cheap'. The animation was technically correct but psychologically wrong. Switching to ease-out, so the drawer decelerated into its open position, made the interaction feel significantly more natural without changing the duration or the visual design.",
    example: "\"The drawer is sliding in with linear timing. It feels stiff. Switch to ease-out so it decelerates into its resting position. That single curve change will make it feel significantly more natural.\"",
    related: ["Animation", "Micro-interaction", "Interaction", "Prototype"] },

  { term: "Empathy map", category: "Research", level: "Beginner",
    definition: "A visualisation tool that captures what a specific user says, thinks, does, and feels in a given context. It makes implicit user experience visible and shareable across a team.",
    whyItMatters: "Empathy maps surface the gap between what users say and what they actually mean: their public statements versus their private frustrations. That gap is exactly where the most important design opportunities hide.",
    scenario: "After a round of user interviews, a team shared their notes and immediately disagreed about what users were actually experiencing. Creating an empathy map together, grouping quotes under says, thinks, does, and feels, revealed that users were consistently saying the product was 'fine' while describing behaviours (like using screenshots as workarounds) that indicated it was anything but. The map made the tension visible and undeniable.",
    example: "\"From the interviews, users say they find it 'fine', but in the same breath they describe workarounds that suggest it's far from fine. An empathy map will help us see that tension clearly.\"",
    related: ["Persona", "User Interview", "Affinity Map", "Customer Journey Map"] },

  { term: "Engagement", category: "Testing", level: "Beginner",
    definition: "A measure of how actively users interact with a product: sessions per week, time spent, features used, content consumed, return visits. Engagement indicates whether users are finding real value.",
    whyItMatters: "High acquisition with low engagement means the product is attracting users but not holding them. That is a design and product-market fit problem. Engagement metrics help pinpoint which parts of a product are earning sustained use and which are being abandoned.",
    scenario: "A product had strong monthly active user numbers that masked a problem: most users opened the app once, never returned, and were counted as active within the thirty-day window. Tracking weekly engagement instead revealed that only 12% of users were returning more than once per week. That metric reframed the entire product roadmap around retention rather than acquisition.",
    example: "\"Traffic numbers look great but engagement is flat. Users are arriving and leaving without doing anything meaningful. Let's look at what happens between landing and the first meaningful action.\"",
    related: ["Retention", "Bounce Rate", "Conversion Rate", "Data Analytics"] },

  { term: "Eye tracking", category: "Testing", level: "Advanced",
    definition: "A research method that records where users look on a screen in real time, using hardware eye trackers or webcam-based software. Results are typically shown as heat maps of gaze density or as sequential gaze plots.",
    whyItMatters: "Eye tracking reveals the truth about visual attention: where users actually look, not where they say they look or where designers assumed they would. It is especially useful for testing visual hierarchy, banner blindness, and navigation patterns.",
    scenario: "A team was confident their redesigned homepage hero communicated the product's value clearly. Eye tracking showed users were fixing almost entirely on the background photograph and spending almost no time on the headline or CTA. The CTA click rate matched this: it was among the lowest on the site. The image was drawing attention away from the message it was meant to support.",
    example: "\"Eye tracking showed users scanning in an F-pattern. The key CTA in the right column was receiving almost zero fixation time. We need to rethink its placement entirely.\"",
    related: ["Heat Map", "Session Recording", "Visual Hierarchy", "Usability Test"] },

  { term: "Feedback", category: "UI Elements", level: "Beginner",
    definition: "The system's visible response to a user action: a loading spinner, a success message, an error alert, or a subtle animation. Feedback confirms that the action was received and communicates what happened next.",
    whyItMatters: "Without feedback, users do not know if their action worked. Did the button register? Is the file uploading? Did the form submit? Uncertainty causes users to repeat actions, creating errors, or to assume failure and leave. Every action deserves a response.",
    scenario: "A data submission form had no loading state on the submit button. Users who clicked it on a slow connection clicked it again when nothing appeared to happen, submitting duplicates. Adding a spinner on click and disabling the button until the response returned eliminated duplicate submissions entirely and reduced confusion in usability testing.",
    example: "\"The save button has no loading state. Users click it and nothing visibly changes, so they click it again. Add a spinner on click and a confirmation on success.\"",
    related: ["Micro-interaction", "Hover State", "Focused State", "Microcopy"] },

  { term: "Flat design", category: "Colours", level: "Beginner",
    definition: "A visual style that strips away dimensional effects: no gradients, shadows, bevels, or textures. Flat design creates hierarchy purely through colour, typography, and layout, without simulating physical depth.",
    whyItMatters: "Flat design is clean and performs well, but removing visual depth removes natural affordance cues. When everything is flat, users struggle to distinguish interactive elements from static ones, which is why thoughtful use of colour and typography becomes even more critical.",
    scenario: "A team redesigned a settings page to a minimal, fully flat aesthetic. The visual improvement was real. Usability testing revealed a problem: users were hovering over non-interactive labels expecting them to respond, and missing interactive controls that had no visual differentiation from static text. Restoring a subtle colour signal to interactive elements, without shadows or borders, resolved the confusion while preserving the aesthetic.",
    example: "\"The flat redesign looks clean, but usability testing showed users couldn't reliably identify which elements were clickable. We need to reintroduce affordance signals without abandoning the flat aesthetic.\"",
    related: ["Affordance", "Visual Hierarchy", "Colour Palette", "White Space"] },

  { term: "Focused state", category: "UI Elements", level: "Intermediate",
    definition: "The visual style applied to an interactive element, such as an input, button, or link, when it receives keyboard focus. Typically a visible ring, outline, or glow that moves as the user tabs through a page.",
    whyItMatters: "Focus states are a non-negotiable accessibility requirement. Keyboard-only users, screen reader users, and anyone navigating without a mouse rely entirely on visible focus to know where they are. Removing focus styles to clean up the UI makes the product inaccessible.",
    scenario: "A designer added the CSS rule 'outline: none' globally to remove the default browser focus ring, which was visually inconsistent with the product aesthetic. A subsequent accessibility audit flagged this as a critical failure. Keyboard navigation was untestable because there was no visual indicator of where focus sat at any point. The fix required designing custom focus styles for every interactive component.",
    example: "\"The focus styles have been removed globally with 'outline: none'. That's an accessibility failure. Restore them and style them to match the product aesthetic instead of just deleting them.\"",
    related: ["Accessibility", "WCAG", "Hover State", "Screen Reader"] },

  { term: "Font weight", category: "Typography", level: "Beginner",
    definition: "The thickness of a typeface's strokes, ranging from ultra-thin through regular, medium, semibold, bold, and black. Most modern typeface families include several weights, each with a different visual presence.",
    whyItMatters: "Weight is one of the cleanest hierarchy tools in typography. It creates distinction without introducing a second typeface. Using two or three weights from a single family is usually more coherent than mixing typefaces.",
    scenario: "A product's marketing pages used five different typefaces across headings, subheadings, body, captions, and labels, each chosen by a different designer at a different time. The result felt visually chaotic. Switching to a single typeface in three weights, light for captions, regular for body, and bold for headings, made the entire page feel unified without losing any of the hierarchy.",
    example: "\"The page uses four different typefaces to create hierarchy. Simplify it. One typeface in three weights, light, regular, bold, will be more elegant and easier to maintain.\"",
    related: ["Typeface", "Typographic Hierarchy", "Line Height", "Visual Hierarchy"] },

  { term: "Front-end development", category: "Positions", level: "Intermediate",
    definition: "The practice of building the visible, interactive layer of a digital product using HTML, CSS, and JavaScript, translating design specifications into the interfaces users actually interact with.",
    whyItMatters: "Understanding what front-end developers do and how they work helps designers write better specs, have more credible technical conversations, and anticipate what will need extra coordination or careful planning.",
    scenario: "A designer specced a complex input component with conditional validation, real-time character counting, and an animated error state that required reading from three different data sources simultaneously. What looked like one component in Figma was, from a front-end perspective, four separate pieces of functionality with non-trivial state management. A quick conversation before the spec was written would have simplified the design without compromising the user experience.",
    example: "\"That interaction is elegant in Figma but will require significant custom JavaScript. Talk to a front-end developer before it goes into the spec. They may suggest a simpler pattern that achieves the same goal.\"",
    related: ["CSS", "Design Specs", "Developer Handoff", "Responsive Web Design"] },

  { term: "Funnel", category: "Testing", level: "Intermediate",
    definition: "A sequential model showing how users progress through a defined set of steps toward a goal, from awareness to conversion. Users drop off at each step, creating the widening-to-narrowing shape of a funnel.",
    whyItMatters: "Funnel analysis reveals exactly where users abandon a flow, which tells designers where the design work will have the most measurable impact. Improving a leaky middle step is often worth far more than optimising the final step.",
    scenario: "A team spent a sprint optimising the confirmation and success screens at the end of a purchase flow, assuming that was where users were disengaging. Funnel analysis showed the drop-off was not at the end. It was between the cart and the first checkout screen, where 68% of users were leaving. The confirmation screen optimisation had zero effect. Focusing on the actual leaky step reduced overall abandonment significantly.",
    example: "\"The purchase funnel is losing two-thirds of users between the cart and the first checkout screen. That's where the design attention needs to go, not on the confirmation page.\"",
    related: ["Conversion Rate", "Bounce Rate", "A/B Testing", "Acquisition"] },

  { term: "Greyscale", category: "Colours", level: "Beginner",
    definition: "A palette restricted to shades of grey from pure white to pure black with no colour information. In design, greyscale is used for wireframing, accessibility contrast testing, and creating neutral backgrounds and UI surfaces.",
    whyItMatters: "Designing in greyscale first forces hierarchy to emerge from layout and typography rather than colour. A design that is clear and readable in greyscale will be even stronger with colour applied. One that relies on colour to make sense has a structural problem.",
    scenario: "A designer applied colour to a dashboard early in the process to make it feel polished for a stakeholder review. The review focused entirely on colour preferences. When a greyscale version was shown two weeks later, the structural weaknesses became obvious: the primary action was no more prominent than the secondary ones, and the data labels were visually identical to the section headings. The colour had masked a hierarchy problem that greyscale immediately exposed.",
    example: "\"Before we finalise the colour choices, let's see the page in greyscale. I want to confirm the hierarchy is working structurally. Colour should reinforce it, not create it.\"",
    related: ["Contrast", "Colour Palette", "Visual Hierarchy", "Wireframe"] },

  { term: "Gutters", category: "Alignment", level: "Beginner",
    definition: "The fixed-width gaps between columns in a layout grid. Gutters separate content columns from each other and are a foundational element of any responsive grid system.",
    whyItMatters: "Gutters are what stop a multi-column layout from feeling cramped. They create the breathing room that makes content readable and scannable. Consistent gutters across breakpoints are what make a grid feel intentional rather than improvised.",
    scenario: "A card grid was built with the card content extending into the gutter space on both sides. At desktop widths, the cards appeared to be touching. The developer had respected the column structure but the card component itself had no internal padding, causing its content to fill the full column width and bleed into the gap. Correcting this to keep content inside column boundaries resolved the crowded feel immediately.",
    example: "\"The column content is butting right up against the gutter edge. The defined gutter is 24px but the component doesn't respect it. The content needs to stay inside the column, not bleed into the gap.\"",
    related: ["Grid", "Margins", "Spacing", "Breakpoints"] },

  { term: "HCD", category: "Methodologies", level: "Intermediate",
    definition: "Human-Centred Design. A problem-solving philosophy and practice that keeps the needs, behaviours, and experiences of real people at the centre of every design decision, from initial research through to final release.",
    whyItMatters: "HCD is the foundational philosophy of UX design. It challenges the assumption that designers know what users need and replaces it with a disciplined cycle of observation, empathy, prototyping, and testing. Products built this way tend to be both more usable and more successful.",
    scenario: "A medical device company redesigned a diagnostic tool's interface following HCD principles for the first time. Rather than having engineers define the workflow, they observed clinicians using the existing device in real environments. They discovered that most use happened one-handed, in low-light conditions, and under time pressure. None of those constraints had been considered in the previous four versions.",
    example: "\"Before we start sketching solutions, we need to understand the problem from the user's perspective, not ours. That's what HCD asks us to do: empathise before we ideate.\"",
    related: ["Design Thinking", "Double Diamond", "Lean UX", "Affinity Map"] },

  { term: "Hierarchy", category: "UI Elements", level: "Beginner",
    definition: "The visual organisation of interface elements to communicate relative importance, guiding users' eyes from what matters most to what matters least, using size, weight, colour, contrast, and position.",
    whyItMatters: "Without hierarchy, every element competes equally for attention. Good hierarchy is invisible. Users move through a page in the intended sequence without being conscious of being guided. Poor hierarchy leaves users overwhelmed and unsure where to start.",
    scenario: "A settings page had twelve options displayed at equal visual weight. Users in testing consistently reported difficulty finding specific settings and frequently scanned the entire list before locating what they needed. Grouping related settings, adding a slightly larger section heading, and visually reducing rarely-used options reduced average task completion time by 40%.",
    example: "\"The page has three buttons in the same size and style. There's no hierarchy. Pick one primary action, make it visually dominant, and reduce the others so the right path is obvious at a glance.\"",
    related: ["Visual Hierarchy", "CTA", "Typographic Hierarchy", "Cognitive Load"] },

  { term: "Icon", category: "UI Elements", level: "Beginner",
    definition: "A small graphic element that represents an action, concept, or object in an interface. Icons can function alongside labels to reinforce meaning, or alone when the meaning is universally understood.",
    whyItMatters: "Icons without labels are only as clear as the user's ability to interpret them, which is almost always lower than designers assume. Icon-only navigation consistently performs worse in usability testing than labelled equivalents. When in doubt, label it.",
    scenario: "A productivity app used icon-only navigation with five custom icons. Internal testing by the team, all of whom knew the product well, confirmed 100% recognition. External usability testing with five new users revealed that two icons were misidentified by every participant and a third was identified correctly by only one. Labels were added and task completion time dropped significantly.",
    example: "\"The settings icon makes sense, but the third and fourth icons in the toolbar are ambiguous without labels. Testing confirmed users couldn't identify them reliably. Add labels or tooltips.\"",
    related: ["Tooltip", "Affordance", "Navigation", "Signifier"] },

  { term: "Inclusive design", category: "Accessibility", level: "Intermediate",
    definition: "A design philosophy that considers the full spectrum of human diversity, including ability, age, language, and situation, from the start of the process, not as an afterthought. Inclusive design produces solutions that work better for everyone.",
    whyItMatters: "Designing for the margins improves the centre. Captions designed for deaf users help anyone in a noisy environment. Large tap targets designed for motor impairments help anyone using a phone one-handed. Inclusion is not a cost. It is a quality standard.",
    scenario: "A video platform designed for a general audience decided to add audio descriptions and enhanced captions for users with disabilities. In post-launch research, they found that language learners, users in open-plan offices, and people watching in a second language were using the captions at unexpectedly high rates. A feature designed for a specific need had improved the experience for a much broader group.",
    example: "\"If we design this assuming the user has two free hands and perfect vision, we're excluding a significant proportion of people. Let's start from the edge case and expand. The mainstream will be better for it.\"",
    related: ["Accessibility", "WCAG", "Usability", "Cognitive Load"] },

  { term: "Insights", category: "Research", level: "Beginner",
    definition: "Interpreted conclusions drawn from research data that go beyond observation to reveal meaning, connecting what users do to why they do it and what it implies for design.",
    whyItMatters: "Raw research data is not insight. An insight is the moment a pattern in the data becomes a clear implication for action. 'Users abandon the form at step three' is an observation. 'Users abandon because they do not trust us enough yet to share payment details' is an insight.",
    scenario: "A research team presented twelve pages of interview findings to a product team. The meeting ran for two hours and nothing was decided. The following week, the researcher returned with four insights distilled from those pages, each framed as an implication for design. The team reached alignment on priorities in forty-five minutes. The same data, presented as insights rather than observations, produced a completely different outcome.",
    example: "\"The insight from the research isn't just that users are confused. It's that they're confused because the page violates their mental model of how this kind of product usually works. That tells us exactly what to redesign.\"",
    related: ["Affinity Map", "User Research", "Pain Point", "Persona"] },

  { term: "Layout", category: "Colours", level: "Beginner",
    definition: "The arrangement of visual elements on a page or screen: where content, images, navigation, and white space sit relative to each other. Layout is the structural skeleton all other design decisions rest on.",
    whyItMatters: "Layout determines reading order and visual priority before a single word is read. A sound layout makes a complex page feel navigable. A weak layout makes even simple content feel overwhelming.",
    scenario: "A content-heavy help article was tested with users who were asked to find a specific piece of information. On the original layout, where everything was the same width and weight, users averaged 48 seconds. The redesigned layout, which used a two-column structure with an anchored table of contents, reduced that to 12 seconds. The content was identical in both versions.",
    example: "\"The content is good but the layout is undermining it. Everything is the same width, same weight, same spacing. We need structure: establish a hierarchy, use columns, and let things breathe.\"",
    related: ["Grid", "Visual Hierarchy", "White Space", "Responsive Web Design"] },

  { term: "Margins", category: "Alignment", level: "Beginner",
    definition: "The space between the edge of a layout and the content within it. Margins create the breathing room that frames content and prevents it from running edge to edge.",
    whyItMatters: "Margins are one of the first signals of design quality. Too tight and the content feels cramped and unpolished; too wide and the content feels lost. On mobile, 16 to 20px is a widely used baseline; 24px feels generous.",
    scenario: "A mobile app shipped with content that extended to within 4px of the screen edge on both sides. Users in a post-launch review described the app as looking 'unfinished' without being able to name why. A redesign audit identified the missing margins immediately. Adding 16px of horizontal padding on each side was a one-line change that made the entire product feel more considered.",
    example: "\"On the mobile view, the content runs right to the edge of the screen. There are no margins. Add at least 16px on each side before anything else.\"",
    related: ["Grid", "Gutters", "White Space", "Spacing"] },

  { term: "Microservices", category: "Development", level: "Advanced",
    definition: "An architectural style where an application is built as a collection of small, independently deployable services, each responsible for a specific capability. Contrast with a monolithic architecture where everything is one system.",
    whyItMatters: "Understanding microservices helps designers appreciate why some features are faster to ship than others, why certain changes have unexpected side effects, and why a simple-seeming feature can require coordination across multiple teams.",
    scenario: "A designer added a personalised recommendation panel to a product page, assuming it would be straightforward to build. The recommendation logic was a separate microservice with its own deployment schedule, rate limits, and failure modes. The feature required loading states, error states, and empty states that the designer had not specced. Understanding the architecture earlier would have changed the design brief entirely.",
    example: "\"The search and the recommendation panel are separate microservices. If either is slow or unavailable, the design needs a graceful fallback. Make sure every state is covered in the spec.\"",
    related: ["API", "MVP", "DevOps", "Development"] },

  { term: "Mid-fidelity", category: "Ideation", level: "Beginner",
    definition: "A design representation between rough sketches and polished, production-ready mockups, structured enough to communicate layout and flow clearly, but without final colour, typography, or visual polish.",
    whyItMatters: "Mid-fidelity is the sweet spot for stakeholder reviews and flow validation. It communicates structure without inviting premature feedback on visual details. It says the thinking is here, so let's validate the logic before investing in the polish.",
    scenario: "A designer brought high-fidelity screens to a stakeholder review in week one of the project. The meeting ran for ninety minutes, almost entirely on colour choices and font preferences. The flow, which had a fundamental structural problem that would require a significant rework, was never discussed. At the next project, the same designer brought mid-fidelity wireframes. The structural problem was identified in the first ten minutes.",
    example: "\"I'm presenting at mid-fidelity today. I want alignment on the flow and structure. We'll get to visual design once we've confirmed we're solving the right problem.\"",
    related: ["Low-Fidelity", "High-Fidelity", "Wireframe", "Prototype"] },

  { term: "Miller's Law", category: "Design Methodologies", level: "Intermediate",
    definition: "A cognitive psychology principle from George Miller's 1956 research showing that the average person can hold roughly seven items, plus or minus two, in working memory at once. In design, this informs how many options or steps to present at once.",
    whyItMatters: "Miller's Law gives designers a cognitive basis for constraining complexity. Navigation menus, settings pages, and onboarding flows that push beyond seven simultaneous choices increase cognitive load and abandonment.",
    scenario: "A product's main navigation had grown to eleven top-level items across two years of feature additions. User testing showed people were regularly using the search function to find sections they could not locate in the navigation. Grouping related items and hiding secondary sections reduced the visible navigation to seven items. Search usage for navigation-related terms dropped by half within a month.",
    example: "\"The navigation has eleven top-level items. That's beyond what users can comfortably hold in working memory. Consolidate, group, or hide secondary items to bring it under seven.\"",
    related: ["Chunking", "Cognitive Load", "Progressive Disclosure", "Information Architecture"] },

  { term: "Mobile-first", category: "Development", level: "Intermediate",
    definition: "A design strategy that begins with the smallest viewport and progressively enhances for larger screens, rather than designing for desktop and trying to squeeze it down. Forces prioritisation of what truly matters.",
    whyItMatters: "Mobile-first is one of the best design constraints available. Limited screen space forces hard decisions about what is essential. Designs that start mobile-first tend to be leaner, more focused, and ultimately better on every screen size.",
    scenario: "A team designed a complex data dashboard starting from a desktop layout with twelve data panels. When asked to create a mobile version, they could not fit the content without hiding most of it. Starting from mobile in a follow-up project forced a prioritisation conversation about which three data points actually drove decisions. The mobile-first version was cleaner, and when expanded to desktop, was significantly better than the original.",
    example: "\"Start with the mobile layout. If we can't fit it on mobile, it probably shouldn't be on the page at all. What survives the small screen constraint is what actually matters.\"",
    related: ["Responsive Web Design", "Breakpoints", "Thumb Reachability", "CSS"] },

  { term: "Mockup", category: "Ideation", level: "Beginner",
    definition: "A static, high-fidelity visual representation of a design, showing the intended final look with real or realistic content, accurate typography, colour, and spacing, but without interactive functionality.",
    whyItMatters: "Mockups are where structure becomes visual specification. They communicate design intent with enough precision for stakeholder approval and developer handoff, and because they are static, they are faster to produce than interactive prototypes.",
    scenario: "A team signed off on wireframes that showed a clean three-column product grid. When the first high-fidelity mockup was produced with real product names, images, and descriptions, it became clear that product names were frequently two lines long, breaking the card layout at multiple breakpoints. The wireframe had never shown this because it used short placeholder text. The mockup caught the issue before a single line of code was written.",
    example: "\"The wireframes have been signed off. I'm now producing high-fidelity mockups of each screen for the developer handoff. These will be the reference for what gets built.\"",
    related: ["Wireframe", "Prototype", "High-Fidelity", "Design Specs"] },

  { term: "Navigation", category: "UI Elements", level: "Beginner",
    definition: "The system of controls, including menus, tabs, breadcrumbs, links, and icons, that allows users to move between areas of a product and understand where they are within it at any given moment.",
    whyItMatters: "Navigation is arguably the most consequential design in any product. If users cannot find what they need, the quality of the content behind it is irrelevant. Navigation must be designed around how users think about the product, not how the team built it.",
    scenario: "A product's navigation used internal product team names as labels: 'Insights Hub', 'Growth Suite', and 'Ops Centre'. These names meant something to the people who built the features. They meant nothing to users. Card sorting with twenty participants revealed consistent, different groupings. Renaming based on user vocabulary reduced navigation-related support contacts by 35%.",
    example: "\"The navigation uses the internal product taxonomy. Terms that mean something to the engineering team but nothing to users. Rename everything based on what users are actually trying to accomplish.\"",
    related: ["Information Architecture", "Mental Model", "User Flow", "Dropdown"] },

  { term: "Overlay", category: "UI Elements", level: "Beginner",
    definition: "A semi-transparent or opaque layer that appears behind a modal, drawer, or dialog, visually suppressing the content below to focus user attention on the foreground element.",
    whyItMatters: "An overlay communicates that the user's context has changed and this needs to be addressed first. Without it, modals feel visually ambiguous, floating over content rather than in front of it. Overlay opacity signals how much to mentally dismiss the background: high opacity means ignore it, low means it is still present.",
    scenario: "A notification modal was appearing without an overlay on a data-heavy dashboard. Users were frequently clicking behind the modal to dismiss it, accidentally triggering dashboard actions rather than closing the notification. Adding a 50% opacity overlay stopped accidental background interactions entirely and made it immediately clear the modal required attention before anything else.",
    example: "\"The modal overlay is too light. At 20% opacity the background is still visually competing. Push it to 60% so the modal clearly owns the screen.\"",
    related: ["Modal", "Focused State", "Visual Hierarchy", "Progressive Disclosure"] },

  { term: "PR pull request", category: "Development", level: "Intermediate",
    definition: "A code contribution workflow where a developer proposes changes to a shared codebase for peer review before those changes are merged. PRs allow designers to visually review implemented work before it ships.",
    whyItMatters: "Reviewing PRs before merge is one of the highest-value interventions a designer can make in the delivery process. Catching a spacing error, a missing state, or a wrong colour at PR review takes seconds. Catching it after shipping takes a sprint.",
    scenario: "A designer was tagged on a PR for a new pricing card component. They reviewed it in staging and found the hover state was using the wrong brand colour, the card padding was 4px short of the spec, and the 'Most popular' badge was missing entirely. All three were fixed before merge. None of them would have been caught in code review by the engineering team.",
    example: "\"The developer tagged you in the PR for the new card component. Review it in staging and compare against the Figma spec before you approve. Check all states, not just the default.\"",
    related: ["QA", "Design Specs", "Deployment", "Developer Handoff"] },

  { term: "Pain point", category: "Research", level: "Beginner",
    definition: "A specific frustration, obstacle, or unmet need that users encounter when trying to accomplish a task. Pain points are discovered through research and are the foundational raw material of user-centred design.",
    whyItMatters: "Pain points ground design in real problems rather than imagined ones. Knowing precisely where and why users struggle gives teams the evidence to prioritise and justify design decisions, and resist the temptation to add features rather than fix what is broken.",
    scenario: "A team assumed users found the reporting feature complex because it had too many options. Eight interviews revealed the actual pain point: users could not tell which fields were required versus optional without submitting the form and getting errors. The complexity was a secondary concern. Fixing the field labelling reduced support enquiries about reporting by 55% before any other changes were made.",
    example: "\"The clearest pain point from research: users can't distinguish required from optional fields until they submit and get errors. That's the first thing we fix.\"",
    related: ["User Interview", "Insights", "Usability Test", "Empathy Map"] },

  { term: "PoC", category: "Development", level: "Intermediate",
    definition: "Proof of Concept. A minimal, focused experiment built to answer one question: is this technically feasible? A PoC is not meant to be maintained or shipped. It is meant to derisk a decision.",
    whyItMatters: "A PoC answers whether this can be built at all, before the team spends weeks designing something that might turn out to be technically impossible, impractically expensive, or critically limited by platform constraints.",
    scenario: "A product team wanted to build real-time collaborative editing. Designs were prepared, a sprint was planned, and the feature was announced to users. An engineer then pointed out that the existing infrastructure could not support the required WebSocket connections at scale. A PoC run before the design work began would have revealed this in two days, not after three weeks of preparation.",
    example: "\"Before we design the whole real-time collaboration feature, build a PoC to test the WebSocket infrastructure. We need to know if the tech can support it at our scale before we design around it.\"",
    related: ["MVP", "Prototype", "Hypothesis", "Development"] },

  { term: "Pop-up", category: "UI Elements", level: "Beginner",
    definition: "A content layer that appears above the current page, triggered by user action, a timer, or a behavioural condition. Less disruptive than a modal, pop-ups often do not block interaction with the content behind them.",
    whyItMatters: "Pop-ups are among the most frequently misused patterns in product design. Shown too early or for the wrong reason, they feel intrusive and damage trust. When timed well and triggered by genuine signals of intent, they can add real value without disrupting flow.",
    scenario: "An e-commerce site triggered a newsletter sign-up pop-up three seconds after page load, before users had seen any product. Dismiss rates were 94%. Moving the trigger to appear after a user had viewed three products and spent more than sixty seconds on the page dropped dismiss rates to 61% and increased sign-up conversion by over 200%. The intervention was identical; the timing changed everything.",
    example: "\"Don't trigger the sign-up prompt on page load. Wait until the user has completed a meaningful action. Show it too early and you're interrupting before you've earned the ask.\"",
    related: ["Modal", "Tooltip", "Overlay", "Progressive Disclosure"] },

  { term: "Presentation", category: "Business", level: "Beginner",
    definition: "The structured communication of design work to an audience, typically stakeholders, leadership, or clients, combining narrative, rationale, and visuals to convey both what was designed and why.",
    whyItMatters: "A strong presentation is what gets good work approved and built. Designers who can explain their decisions clearly, connecting design choices to user needs and business goals, consistently get more of their work through.",
    scenario: "Two designers presented the same set of screens to the same stakeholder group on consecutive days. The first shared a Figma link, opened it to the final designs, and asked for feedback. Feedback was confused and unfocused. The second spent the first five minutes establishing the problem and what research had revealed, then presented the designs as a direct response to those findings. Every piece of feedback in the second session was relevant and actionable.",
    example: "\"Don't just share a Figma file and ask for feedback. Design the presentation. Start with the problem, walk through what you learned, and then show what you designed and why. That structure changes everything.\"",
    related: ["Design Playback", "Stakeholder", "Design Brief", "Design Deliverable"] },

  { term: "Primary button", category: "UI Elements", level: "Beginner",
    definition: "The most visually prominent button on a screen, typically solid-filled and high-contrast, that represents the single most important action available. Any given screen should have at most one primary button.",
    whyItMatters: "When multiple actions share the same visual weight, users hesitate. They have to consciously evaluate which action to take. A single, visually dominant primary button removes that friction and makes the right next step obvious.",
    scenario: "A checkout screen had four buttons at the same size and fill weight: 'Save for later', 'Continue shopping', 'Apply promo code', and 'Proceed to checkout'. Users in testing consistently paused at this screen and some abandoned entirely. Reducing 'Proceed to checkout' to the sole primary button and styling the others as text links reduced hesitation time and improved checkout completion significantly.",
    example: "\"There are four filled buttons on this screen. They all read as primary. Pick one, make it dominant, and reduce the others to secondary or tertiary styles. The user needs one clear path forward.\"",
    related: ["CTA", "Hierarchy", "Affordance", "Focused State"] },

  { term: "Progressive disclosure", category: "UI Elements", level: "Intermediate",
    definition: "A design pattern where information and controls are revealed progressively, only when the user needs them, rather than presented all at once. Accordions, step-by-step forms, and 'show more' patterns are all examples.",
    whyItMatters: "Progressive disclosure is one of the most effective tools for managing complexity without hiding capability. It gives users a manageable starting point while keeping advanced options accessible for those who need them.",
    scenario: "A data export modal showed all fourteen export options, configuration fields, and scheduling settings on a single screen. Usage data showed 92% of exports used the default settings. Applying progressive disclosure to hide advanced options behind a 'More options' link reduced the default view to four fields. Completion rates improved and the number of exports misconfigured by users dropped significantly.",
    example: "\"Move the advanced export options behind a 'More options' toggle. 90% of users never need them, and showing them upfront is making the primary flow feel complicated.\"",
    related: ["Cognitive Load", "Accordion", "Miller's Law", "Navigation"] },

  { term: "Proximity", category: "Design Methodologies", level: "Beginner",
    definition: "A Gestalt principle stating that objects placed near each other are perceived as related. Proximity creates implicit groupings in a layout without requiring borders, lines, or explicit labels.",
    whyItMatters: "Proximity is one of the most powerful layout tools available, and the most underused. Adjusting space between elements is often all that is needed to communicate grouping. Adding boxes and lines where spacing would do the same job creates visual clutter.",
    scenario: "A form had labels and their corresponding input fields spaced evenly at 16px above and below every element. In usability testing, users paused to identify which label belonged to which field. Reducing the gap between each label and its own input to 4px, while increasing the gap between separate field groups to 24px, made the groupings immediately clear without adding borders, backgrounds, or visual containers.",
    example: "\"The label for that input is equidistant from its own field and the field above. There's no proximity grouping. Tighten the label-to-field gap so they read as a pair, not as separate items.\"",
    related: ["Visual Hierarchy", "White Space", "Cognitive Load", "Chunking"] },

  { term: "Qualitative", category: "Research", level: "Beginner",
    definition: "Research that captures non-numerical data: words, observations, behaviours, and stories. Qualitative methods include interviews, usability tests, contextual inquiry, and diary studies. They answer the why behind user behaviour.",
    whyItMatters: "Quantitative data tells you what is happening across many users. Qualitative research tells you why it is happening for specific ones. The why is where design solutions live, and you can only reach it by talking to and observing real people.",
    scenario: "Analytics showed a sharp drop-off at the third step of a sign-up flow for six consecutive weeks. A/B testing different variations of that screen produced no consistent improvement. Five qualitative sessions later, the reason became clear: users did not trust the product enough yet to share their phone number, which was required at that step. No amount of quantitative testing would have surfaced that without asking people directly.",
    example: "\"The drop-off data tells us users are leaving at step three, but it can't tell us why. We need qualitative sessions. Six or eight users talking through their experience will give us more actionable insight than any amount of analytics.\"",
    related: ["User Interview", "Usability Test", "Insights", "Affinity Map"] },

  { term: "Radio button", category: "UI Elements", level: "Beginner",
    definition: "A form control that allows users to select exactly one option from a set. Selecting any radio button in a group automatically deselects the others. They are mutually exclusive by design.",
    whyItMatters: "Radio buttons make a mutually exclusive choice explicit and visible. They are generally preferable to dropdowns when there are five or fewer options, because users can compare all options simultaneously before committing.",
    scenario: "A subscription sign-up page used a dropdown to choose between three billing frequencies: monthly, quarterly, and annual. Conversion to annual plans was consistently low. Switching to visible radio buttons showing all three options with their relative savings displayed allowed users to compare at a glance. Annual plan selection increased by 18% with no change to pricing or copy.",
    example: "\"The pricing plan selector is a dropdown with three options. Switch to radio buttons. Users should be able to see all three plans at once and compare them before choosing.\"",
    related: ["Checkbox", "Toggle", "Dropdown", "Focused State"] },

  { term: "Readability", category: "Typography", level: "Beginner",
    definition: "The ease with which continuous text can be read and understood, determined by typeface, size, line height, line length, letter spacing, and contrast working together. Distinct from legibility, which is about recognising individual characters.",
    whyItMatters: "Even beautiful typography fails if users have to work to read it. Readability is the baseline requirement for any body text. One of the most commonly overlooked factors is line length: optimal is 60 to 75 characters. Too wide or too narrow and reading slows down significantly.",
    scenario: "A blog redesign improved typography choices and increased font size but left the body column running at full desktop width. In user testing, participants regularly lost their place when scanning back from the end of a line to the start of the next. Capping the content column at 680px, which produced roughly 68 characters per line, made reading noticeably smoother without any other changes.",
    example: "\"The body text is readable at this size on desktop, but the line length is too wide. It's wrapping at 110 characters. Cap it at 70 characters per line for comfortable reading.\"",
    related: ["Line Height", "Typeface", "Sans Serif", "Contrast"] },

  { term: "Retention", category: "Business", level: "Intermediate",
    definition: "A measure of how many users return to a product over a given period, typically expressed as 7-day, 30-day, or 90-day retention rates. Retention is one of the clearest signals of whether a product is delivering ongoing value.",
    whyItMatters: "Retention is a leading indicator of product health. High acquisition with low retention means the product is not valuable enough to bring users back. It is consistently more cost-effective to retain existing users than to acquire new ones, which makes improving retention one of the highest-ROI design problems.",
    scenario: "A team had been focused on acquisition for two quarters and saw healthy growth in new user numbers. A retention analysis revealed that 30-day retention had dropped from 38% to 22% during the same period. Most new users were being acquired through a campaign that attracted people with low intent, inflating acquisition while the core product experience remained unchanged. Fixing retention was more impactful than any acquisition investment.",
    example: "\"30-day retention has dropped four points since the last release. That's a significant signal. Let's look at what changed and what users are saying in the feedback channels.\"",
    related: ["Engagement", "NPS", "Conversion Rate", "KPI"] },

  { term: "Rule of thirds", category: "Alignment", level: "Intermediate",
    definition: "A composition principle that divides any frame into a 3x3 grid and suggests placing key subjects or focal points along the lines or at their four intersections. Borrowed from photography and painting.",
    whyItMatters: "Centred compositions often feel static. The rule of thirds creates visual tension, movement, and interest, making layouts feel more dynamic and natural. It is a useful starting heuristic for hero images, illustrations, and any layout where visual rhythm matters.",
    scenario: "A redesigned product landing page placed the hero image centrally on a symmetric layout. Internal feedback was positive but the design felt flat compared to competitors. Shifting the primary visual subject to the left third intersection, with supporting text occupying the right third, created visual tension and a natural reading path. The new version was described as more dynamic in user feedback sessions.",
    example: "\"The product shot is centred in the hero. It feels flat. Move the subject to the left third intersection and the design immediately feels more energetic and composed.\"",
    related: ["Golden Ratio", "Visual Hierarchy", "Layout", "Alignment"] },

  { term: "Sans serif", category: "Typography", level: "Beginner",
    definition: "A category of typefaces without the small decorative strokes (serifs) at the ends of letterforms. Inter, Helvetica, Futura, and DM Sans are common examples. Defined by clean, unadorned geometry.",
    whyItMatters: "Sans serifs dominate digital interfaces because they render clearly at small sizes on screen. Their clean geometry works across resolutions and device types, which is why the majority of product UI defaults to a sans serif for body and interface text.",
    scenario: "A brand guidelines document specified a classic serif for all body copy, including digital interfaces. In development, the body text was rendered at 13px across dense data tables. At that size, the serif's decorative strokes became visually noisy and readability dropped significantly. Switching the interface text to a sans serif while keeping the serif for display headings resolved the readability issue without breaking the brand aesthetic.",
    example: "\"Use the sans serif for all UI text. It reads cleanly at 14px and below. The display heading can be a serif to add personality at the sizes where serifs actually enhance character.\"",
    related: ["Serif", "Typeface", "Font Weight", "Readability"] },

  { term: "Screen reader", category: "Accessibility", level: "Intermediate",
    definition: "A software tool that converts digital content into spoken audio or braille output, enabling users who are blind or have low vision to navigate and interact with digital interfaces through non-visual means.",
    whyItMatters: "Designing for screen reader compatibility requires thinking carefully about semantic HTML, element labels, reading order, and ARIA attributes. These considerations improve the structural quality of a product for all users, not just those who need a screen reader.",
    scenario: "A product had a toolbar with six icon-only action buttons. An accessibility audit using VoiceOver revealed that a screen reader navigating the toolbar announced each button as 'button' with no further information. A user could not determine what any of the buttons did without clicking them. Adding descriptive aria-label attributes to each button resolved the issue and had no visible impact on the interface.",
    example: "\"Those icon buttons have no accessible labels. A screen reader user hears 'button, button, button' with no context. Add descriptive aria-label attributes to every icon-only interactive element.\"",
    related: ["Accessibility", "WCAG", "Focused State", "Inclusive Design"] },

  { term: "Session recording", category: "Testing", level: "Intermediate",
    definition: "A research tool that captures video-like replays of real user sessions, recording mouse movements, clicks, scrolls, and form interactions as they actually happened. Tools like Hotjar and FullStory are common examples.",
    whyItMatters: "Session recordings transform abstract drop-off data into a concrete visual story. Watching a real user encounter a confusing element, try to work around it, and ultimately leave is more persuasive evidence for a redesign than any metric alone.",
    scenario: "A team was surprised by a high bounce rate on a settings page that appeared to be well-designed. Session recordings showed a consistent pattern: users were clicking a section heading expecting it to expand, receiving no response, and leaving. The heading looked interactive because it shared visual styling with the expandable sections below it. The recordings made the problem undeniable in a way that the metric alone could not.",
    example: "\"Pull up the session recordings for users who didn't complete the onboarding flow. I want to see exactly what they did before they left. The data shows a drop-off but not the story behind it.\"",
    related: ["Heat Map", "Eye Tracking", "Usability Test", "Bounce Rate"] },

  { term: "Signifier", category: "Design Methodologies", level: "Intermediate",
    definition: "A perceivable cue that communicates how something should be used: a label, an icon, a colour, or an underline. Where affordances describe what an object can do, signifiers communicate that capability explicitly.",
    whyItMatters: "Modern flat interfaces often lack natural affordances. Signifiers bridge that gap. A button shadow, a chevron icon, or a dashed border tells users what to do when the form of the element does not make it obvious. When signifiers are missing, users have to guess.",
    scenario: "A product had a swipeable card component that allowed users to reveal contextual actions. In usability testing, zero participants discovered the gesture without prompting. The card looked like a static element and nothing suggested it could be interacted with beyond tapping. Adding a subtle edge-peeking animation on first load and a partial visual indicator on subsequent views increased unprompted gesture discovery to 80%.",
    example: "\"The swipe gesture exists but there's no signifier. Users in testing didn't discover it. Add a subtle animation or visible indicator so users know swiping is possible.\"",
    related: ["Affordance", "Mental Model", "Cognitive Load", "Hover State"] },

  { term: "Spacing", category: "Alignment", level: "Beginner",
    definition: "The intentional distance between and around design elements, encompassing padding within components, margins around them, and gaps between them. Spacing is one of the primary signals of visual hierarchy and grouping.",
    whyItMatters: "Spacing communicates relationships. Elements that are close together feel related; elements further apart feel independent. A consistent spacing system, like an 8-point grid, makes those relationships predictable and the overall layout feel coherent.",
    scenario: "A redesigned page looked clean in the mockup but felt inconsistent when built. The spacing between sections was 32px in some places, 40px in others, and 56px in one section where the designer had increased it manually to 'feel right'. Developers had matched the Figma values exactly. Standardising all section gaps to 48px from the spacing scale made the inconsistency invisible and reduced future design decisions to a single reference.",
    example: "\"The spacing between sections is inconsistent. Some have 32px, some have 48px, one has 56px. Pick a value from the spacing scale and apply it consistently. The randomness is making the page feel unresolved.\"",
    related: ["8-Point Grid System", "Grid", "Visual Hierarchy", "Design Token"] },

  { term: "Split testing", category: "Testing", level: "Intermediate",
    definition: "An experiment that divides users into groups and shows each a different version of a design or piece of copy, measuring which performs better against a defined metric. Synonymous with A/B testing.",
    whyItMatters: "Split testing is how design debates get settled with data rather than opinion. It removes the highest-paid-person's-opinion effect from decisions that can be measured, and the results are often surprising.",
    scenario: "A team debated for six weeks whether the hero headline should emphasise ease of use or speed of results. Both camps had strong opinions backed by anecdote. A split test run over three weeks with equal traffic resolved it clearly: the speed-focused headline outperformed by 22% in click-through and 14% in sign-up. The debate would have continued indefinitely without the data.",
    example: "\"We've been debating the headline wording for weeks. Set up a split test. Run both versions with equal traffic for two weeks, and let user behaviour give us the answer.\"",
    related: ["A/B Testing", "Conversion Rate", "Hypothesis", "Data Analytics"] },

  { term: "Sprint", category: "Methodologies", level: "Beginner",
    definition: "A fixed, short development cycle, typically one or two weeks, in which a team commits to completing a defined set of work. Sprints are the core unit of Agile development, providing rhythm, accountability, and regular review points.",
    whyItMatters: "Understanding sprint cycles is essential for designers working in Agile teams. Design work needs to be one sprint ahead of development, ready to hand off when engineers start, otherwise the team is blocked and design quality suffers under time pressure.",
    scenario: "A designer delivered designs on the same day development was due to start on a feature. The developer needed to begin immediately and made interpretation calls on spacing, state behaviour, and an error scenario that had not been specced. The built version diverged from the intended design in four places. All could have been avoided if the design had been completed and reviewed in the previous sprint.",
    example: "\"Design needs to stay a sprint ahead of development. If the engineering team starts the sprint without a completed, specced design, someone is going to have to make decisions that should have been made by design.\"",
    related: ["Agile", "Backlog", "Product Owner", "MVP"] },

  { term: "Task flow", category: "Research", level: "Intermediate",
    definition: "A detailed diagram mapping every step a user takes to complete a specific task, including branching paths, decision points, error states, and recovery routes. More granular than a user flow.",
    whyItMatters: "Task flows surface complexity that wireframes tend to hide. Mapping every step in a task, including the edge cases, before designing prevents the team from discovering missing states at development handoff, when changes are far more costly.",
    scenario: "A designer wireframed a password reset flow based on the happy path: enter email, receive link, click link, set new password. In development, the team discovered they had never designed for a dozen branching scenarios: expired link, already used link, unrecognised email, success state, and rate limiting. A task flow mapped at the start would have identified every branch before a single wireframe was drawn.",
    example: "\"Map the complete task flow for the password reset before we wireframe it. Include every error state and every email timing scenario. There are more branches than it first appears.\"",
    related: ["User Flow", "Customer Journey Map", "Wireframe", "Prototype"] },

  { term: "Testimonial", category: "Brand", level: "Beginner",
    definition: "A direct statement from a real customer describing their positive experience with a product or service. Testimonials are one of the most reliable forms of social proof for reducing purchase anxiety.",
    whyItMatters: "Testimonials work because they transfer trust from a real person to a prospective user. The most persuasive ones are specific, naming a concrete outcome or a real before/after rather than offering vague praise. 'We saved twelve hours a week' outperforms 'It's amazing!'.",
    scenario: "A B2B product's pricing page had three testimonials, all of which read as variations of 'Great product, highly recommend'. Replacing them with three outcome-specific quotes, each naming a measurable result and a company type, increased the page's conversion rate by 19%. The change took one afternoon of customer outreach and one hour of design time.",
    example: "\"The current testimonials are too generic. Anyone could have said them about any product. Source specific, outcome-led quotes that demonstrate real results. That's what builds credibility at the decision point.\"",
    related: ["Social Proof", "Trust", "Brand Identity", "Conversion Rate"] },

  { term: "Trust", category: "Brand", level: "Beginner",
    definition: "The degree to which users feel safe, confident, and comfortable engaging with a product, whether sharing personal data, making purchases, or committing to ongoing use. Trust is earned through consistency, transparency, and quality.",
    whyItMatters: "Trust is the prerequisite for conversion. No amount of CTA optimisation or landing page copy will overcome a design that feels untrustworthy. Every small inconsistency, a misaligned element, an off-brand colour, a suspicious-looking form, erodes it.",
    scenario: "A checkout page for a new e-commerce product had a 68% abandonment rate despite competitive pricing and strong product reviews. A review identified three specific issues: no visible security indicators, a total price that appeared only after payment details were entered, and a form design that looked visually generic compared to the rest of the site. Fixing all three, without changing price, copy, or product, reduced abandonment to 41%.",
    example: "\"The checkout page doesn't feel trustworthy. There's no security badge, the form looks generic, and the total only appears after payment details are entered. Any one of those alone would be a concern. All three together are a conversion killer.\"",
    related: ["Social Proof", "Brand Identity", "Testimonial", "Conversion Rate"] },

  { term: "Typography", category: "Copy", level: "Beginner",
    definition: "The craft of arranging type to make language readable, legible, and visually effective, encompassing typeface choice, sizing, weight, spacing, line height, and how all these decisions work in combination.",
    whyItMatters: "Typography is one of the most impactful and most neglected aspects of digital design. Well-considered type communicates personality, aids comprehension, and signals craft. Most users will not consciously notice great typography. They will just find the product easier and more pleasant to use.",
    scenario: "A product redesign updated the visual direction significantly but carried over the original typography untouched. The new visual elements looked polished but the typography created hierarchy through four different typefaces and six inconsistent size steps. Users in testing described the redesign as feeling 'almost there' without being able to name why. A typographic audit and reset, standardising to one typeface in three weights and a clear scale, resolved the disconnect.",
    example: "\"The typography is technically functional but it's not doing any design work. The scale is flat, the weights aren't creating hierarchy, and the line length is too wide for comfortable reading. It needs a full typographic pass.\"",
    related: ["Typeface", "Line Height", "Font Weight", "Visual Hierarchy"] },

  { term: "User flow", category: "Ideation", level: "Beginner",
    definition: "A diagram that maps the complete path a user takes through a product to accomplish a specific goal, from their entry point to their destination, including every screen and decision point along the way.",
    whyItMatters: "User flows reveal the full scope and complexity of a journey before any individual screens are designed. They prevent designers from solving single screens without understanding how they connect, which is how you end up with beautiful screens that do not work as a product.",
    scenario: "A designer built individual screens for a new onboarding flow without mapping the user flow first. In stakeholder review, it became clear that users who arrived via a referral link needed a different entry point than direct sign-ups, and that users who skipped the email verification step would enter the product in an incomplete state that none of the designed screens accounted for. Mapping the flow upfront would have surfaced both issues before any screens were built.",
    example: "\"Before we wireframe anything, map the full user flow for registration through to first use. I want to see every step, including email verification, before we design a single screen.\"",
    related: ["Task Flow", "Wireframe", "Prototype", "Information Architecture"] },

  { term: "User research", category: "Research", level: "Beginner",
    definition: "The systematic study of users, their contexts, behaviours, goals, frustrations, and mental models, through direct engagement via interviews, observation, and testing. The evidential foundation of user-centred design.",
    whyItMatters: "User research is the discipline that separates design from decoration. Teams that conduct regular user research, even lightweight studies, consistently make better product decisions, waste less time building wrong things, and create products people actually use.",
    scenario: "A team was about to ship a significant navigation restructure based on internal alignment and analytics data. A senior designer requested three days for a lightweight research phase: six user interviews and a card sort. The interviews revealed that two of the proposed new category names were consistently misunderstood, and the card sort showed users grouped content differently to the team's proposed structure. Both were fixed before launch.",
    example: "\"We're making a significant change to the navigation. We need user research before we commit to a direction. Even three days of interviews and a card sort would dramatically reduce our risk.\"",
    related: ["User Interview", "Usability Test", "Qualitative", "Affinity Map"] },

  // ── MARKETING (10) ────────────────────────────────────────────────────────
  { term: "Marketing Funnel", category: "Marketing", level: "Beginner",
    definition: "A model describing the stages a potential customer moves through, from first discovering a brand to making a purchase and beyond. Typically: Awareness, Interest, Consideration, Intent, Purchase, and Loyalty.",
    whyItMatters: "The funnel locates where in the customer journey your product needs to work harder. High awareness with low conversion is a middle-funnel problem; strong conversion with poor retention is a bottom-funnel one. You cannot fix what you cannot locate.",
    scenario: "A team was investing heavily in awareness campaigns, driving high traffic and brand recognition. Conversion to paid plans was not improving. Funnel analysis revealed the drop-off was happening specifically at the free-to-paid upgrade step, not at acquisition. The awareness investment was not the constraint. Improving the upgrade experience and pricing page lifted conversion without any change to marketing spend.",
    example: "\"We have strong top-of-funnel traffic but our consideration-to-purchase drop-off is too high. The issue isn't acquisition. It's the evaluation experience.\"",
    related: ["Conversion Rate", "Acquisition", "Retention", "Bounce Rate"] },

  { term: "SEO", category: "Marketing", level: "Beginner",
    definition: "Search Engine Optimisation. The practice of improving a website's content, structure, and authority so it ranks higher in search engine results pages, driving organic (unpaid) traffic from people actively searching for what you offer.",
    whyItMatters: "Organic search is one of the highest-intent acquisition channels. But SEO is a long game. Teams that invest consistently build a compounding advantage. Treating it as an afterthought hands that advantage to competitors.",
    scenario: "A company published fifty blog articles over two years without any SEO strategy. None ranked for relevant search terms and organic traffic from blog content was negligible. A content audit and SEO overhaul of the ten most relevant existing articles, with keyword targeting and internal linking, began producing organic traffic within six weeks. The content existed. It simply had not been written for how people searched.",
    example: "\"The blog content is good, but it hasn't been written for SEO. No keyword targeting, no internal links. It's getting zero organic traffic. Let's fix the strategy before writing more.\"",
    related: ["Organic Reach", "Content Marketing", "Acquisition", "Conversion Rate"] },

  { term: "Customer Acquisition Cost", category: "Marketing", level: "Intermediate",
    definition: "Also called CAC, the total cost of acquiring a single new customer, calculated by dividing total sales and marketing spend by the number of new customers gained in the same period.",
    whyItMatters: "CAC is one of the most important economic metrics in any business. A low CAC is only sustainable if the product retains customers, otherwise the team is paying to acquire people who immediately leave. CAC must always be evaluated alongside Lifetime Value.",
    scenario: "A startup celebrated halving its CAC through more efficient paid campaigns. A quarterly review then showed that the cheaper-to-acquire users were churning at three times the rate of the original cohort. The lower CAC had been achieved by targeting a less-qualified audience. The unit economics looked better until LTV was factored in, at which point they were significantly worse.",
    example: "\"Our CAC has doubled since last quarter. Paid channels are getting more expensive. We need to improve organic and referral acquisition or the unit economics stop working.\"",
    related: ["Lifetime Value", "Retention", "Acquisition", "KPI"] },

  { term: "Lifetime Value", category: "Marketing", level: "Intermediate",
    definition: "Also called LTV or CLV, the total revenue a business can expect to earn from a single customer across their entire relationship. Typically compared against CAC to assess whether the business model is viable.",
    whyItMatters: "LTV tells you how much you can afford to spend acquiring a customer. If LTV is low and CAC is high, margin is dangerously thin. Improving LTV through better retention, upsells, or product stickiness is often more impactful than cutting acquisition costs.",
    scenario: "Two customer segments were generating the same monthly revenue for a SaaS company. Segment A had a CAC of £40 and an LTV of £200. Segment B had a CAC of £200 and an LTV of £800. On a monthly revenue view, they looked equivalent. On an LTV:CAC view, Segment B was four times more valuable per pound spent. The company shifted acquisition budget toward Segment B and grew revenue without increasing spend.",
    example: "\"Our LTV:CAC ratio is 2:1. That's too low for the risk we're taking. Best-in-class SaaS runs at 3:1 or above. We need to improve retention or reduce what we're spending to acquire.\"",
    related: ["Customer Acquisition Cost", "Retention", "NPS", "KPI"] },

  { term: "Segmentation", category: "Marketing", level: "Intermediate",
    definition: "The practice of dividing a target market or user base into distinct groups based on shared characteristics: demographics, behaviour, needs, geography, or psychographics. Each segment is then addressed with tailored messaging or product decisions.",
    whyItMatters: "A message that speaks to everyone speaks to no one. Segmentation lets teams prioritise who they are serving and what those people actually need. It is the antidote to generic decisions that try to please all users equally.",
    scenario: "A B2B product had one onboarding flow that attempted to serve enterprise buyers, individual freelancers, and small team leads simultaneously. Completion rates were mediocre across all three groups. Segmenting the flow into two distinct paths, one for individual users and one for team accounts, and addressing each with relevant language and relevant first-use actions, increased completion across both segments within a month.",
    example: "\"We've been treating all users the same in onboarding, but power users and casual users have completely different goals. We need to segment the flow and speak to each group separately.\"",
    related: ["Persona", "Voice of Customer", "Marketing Funnel", "B2B vs B2C"] },

  { term: "Content Marketing", category: "Marketing", level: "Beginner",
    definition: "A strategy of creating and distributing valuable, relevant content, including articles, videos, guides, and podcasts, to attract and retain a clearly defined audience, with the goal of driving profitable action over time rather than through direct advertising.",
    whyItMatters: "Content marketing builds trust and authority before a purchase decision is made. Unlike paid ads, good content compounds. A well-optimised article from two years ago can still drive qualified leads today. It is a long-term asset, not a recurring expense.",
    scenario: "A design tools company invested in a library of practical design process guides over eighteen months. Initially, the content generated little traffic. By month twelve, several articles ranked in the top three search results for terms their target audience was actively searching. Those articles became their largest single source of new trial sign-ups, at zero ongoing cost per visit.",
    example: "\"Our paid ads are expensive and stop the moment we stop paying. Let's invest in content marketing. Educational articles that rank in search and build authority over time.\"",
    related: ["SEO", "Organic Reach", "Brand Identity", "Marketing Funnel"] },

  { term: "Paid Media", category: "Marketing", level: "Beginner",
    definition: "Advertising that requires direct payment to reach an audience, including search ads, social ads, display advertising, and sponsored content. Results are immediate but stop the moment spending stops.",
    whyItMatters: "Paid media is the fastest way to reach a specific audience at scale. But it is a rented channel. Costs typically rise over time and results stop immediately when spend stops. Most sustainable growth strategies combine paid with owned and organic channels.",
    scenario: "A product launch was entirely funded through paid social and search ads. Growth was strong in the first three months. In month four, the platform's algorithm changed and cost per click increased by 60% overnight. Without any owned audience or organic presence to fall back on, the team faced either significantly increasing spend or accepting a steep drop in new user acquisition. The dependency had been a single point of failure.",
    example: "\"Paid media is driving 80% of our acquisition. That's a single point of failure. If CPCs rise or the platform changes its algorithm, we lose overnight. We need to invest in owned channels in parallel.\"",
    related: ["Organic Reach", "Customer Acquisition Cost", "Marketing Funnel", "Conversion Rate"] },

  { term: "Organic Reach", category: "Marketing", level: "Beginner",
    definition: "The audience reached through unpaid channels: search engine rankings, social media without paid boosting, word of mouth, direct traffic, and referrals. Organic reach is earned over time rather than bought.",
    whyItMatters: "Organic reach is the most cost-efficient acquisition channel when it works, but it takes time and consistency to build. Businesses that invest in SEO, content, and community early create a compounding advantage that competitors struggle to replicate quickly.",
    scenario: "Two competing SaaS products launched in the same quarter. One invested 80% of its marketing budget in paid acquisition from day one. The other split investment between paid and content. Eighteen months later, the content-invested product had 60% of its traffic arriving organically at no ongoing cost. The paid-only product had consistent traffic but rising CPCs eating into its margins. The gap between the two widened further each month.",
    example: "\"60% of our traffic is organic. Our strongest channel, and it cost us nothing this month. Protect it by keeping the site fast and the content current.\"",
    related: ["SEO", "Content Marketing", "Paid Media", "Acquisition"] },

  { term: "Brand Positioning", category: "Marketing", level: "Intermediate",
    definition: "How a brand is perceived in the minds of its target audience relative to competitors. Positioning defines the unique space a brand occupies, its promise, its differentiation, and the reason someone would choose it over an alternative.",
    whyItMatters: "Positioning is the strategic foundation everything else is built on. Without a clear position, marketing messages conflict, product decisions lack direction, and users cannot articulate why they would choose you. A strong position makes every downstream decision easier.",
    scenario: "A project management tool had positioned itself as 'for everyone' in an attempt to capture the broadest possible market. Research showed that no segment felt the product was built for them. Repositioning around a specific use case for creative agency teams, with messaging and onboarding tailored to that context, increased sign-up conversion and dramatically reduced early churn. A narrower position had produced better outcomes.",
    example: "\"We're positioned as 'affordable' when our product is actually premium. That mismatch brings in price-sensitive customers who churn immediately. We need to reposition, and that means changing the messaging, the price point, or both.\"",
    related: ["Brand Identity", "Tone of Voice", "Persona", "B2B vs B2C"] },

  { term: "Go-to-Market Strategy", category: "Marketing", level: "Intermediate",
    definition: "A plan for launching a product or feature to market, covering target audience, value proposition, pricing model, distribution channels, and marketing approach. A GTM strategy answers: who are we selling to, how will they find us, and why will they buy?",
    whyItMatters: "A great product with a poor GTM strategy will underperform a good product with a sharp one. The launch moment is when positioning, messaging, and channel decisions all converge, and mistakes made here are expensive and slow to recover from.",
    scenario: "A team spent eight months building a well-designed product and launched without a GTM strategy, assuming they could figure it out after release. There was no clarity on target segment, no messaging framework, and no channel plan. The product received modest press coverage and then stalled. A strategic review three months later identified the target customer, the right channels, and the core message. That work done before launch would have changed the trajectory significantly.",
    example: "\"Before we set a launch date, we need a GTM strategy. Who's the primary audience? What's the positioning? Which channels will we use and in what order? Those decisions need to be made before the product ships.\"",
    related: ["Brand Positioning", "Segmentation", "Marketing Funnel", "KPI"] },

  // ── PRODUCT STRATEGY (10) ─────────────────────────────────────────────────
  { term: "Product-Market Fit", category: "Product Strategy", level: "Beginner",
    definition: "The point at which a product satisfies a strong market demand. A product has achieved product-market fit when users are not just signing up but actively using, returning to, and recommending the product without heavy prompting.",
    whyItMatters: "Without product-market fit, every pound spent on growth is wasted. Marketing can bring people in, but if the product does not solve a real problem well enough, they will leave. Finding fit before scaling is the single most important sequencing decision a product team can make.",
    scenario: "A startup spent eighteen months building features and running paid campaigns. Growth was flat. A new PM stripped the product back to one core workflow and ran twenty user interviews to understand what people actually needed. Within three months of rebuilding around that insight, organic sign-ups overtook paid for the first time. The product had not changed dramatically in size. It had changed in focus.",
    example: "\"We're not ready to scale yet. Retention is flat and NPS is mediocre. We need to find product-market fit before we spend more on acquisition.\"",
    related: ["MVP", "North Star Metric", "Retention", "Jobs To Be Done"] },

  { term: "OKRs", category: "Product Strategy", level: "Beginner",
    definition: "Objectives and Key Results. A goal-setting framework where an Objective states what you want to achieve in qualitative terms, and Key Results are the measurable outcomes that indicate whether you achieved it. Typically set quarterly.",
    whyItMatters: "OKRs create alignment across teams by making goals explicit and measurable. Without them, teams often work hard on things that do not move the needle because no one agreed on what the needle was. The framework forces clarity about what success actually looks like.",
    scenario: "A product team set a quarterly objective: 'Make onboarding feel effortless for new users.' The key results were: reduce time-to-first-value from 12 minutes to under 5, increase day-7 retention from 30% to 45%, and reduce support tickets related to onboarding by 50%. Every feature decision that quarter was evaluated against those three numbers. Work that did not contribute was deprioritised. The team hit two of the three key results and carried the third into the next quarter with a revised approach.",
    example: "\"Our Q2 objective is to reduce churn. The key results are: improve 30-day retention to 60%, launch an automated re-engagement flow, and reduce time-to-resolution on support tickets by 30%.\"",
    related: ["KPI", "North Star Metric", "Roadmap", "Stakeholder"] },

  { term: "North Star Metric", category: "Product Strategy", level: "Intermediate",
    definition: "The single metric that best captures the core value a product delivers to its users. It serves as the guiding measure for the entire organisation, aligning teams around one shared indicator of meaningful growth rather than a dashboard of competing numbers.",
    whyItMatters: "When every team optimises for a different metric, the product pulls in multiple directions. A North Star Metric creates a shared definition of progress. It does not replace other metrics, but it gives every team a common reference point when priorities conflict.",
    scenario: "A project management tool tracked sign-ups, active users, and revenue as separate success metrics. Marketing optimised for sign-ups, product optimised for active users, and sales optimised for revenue. The three teams regularly made decisions that undermined each other. Leadership introduced 'weekly active projects' as the North Star Metric, reasoning that teams who actively used the tool to manage real projects were the ones who retained and paid. All three teams began aligning their work around that single number, and cross-functional conflict dropped significantly.",
    example: "\"Sign-ups are up but our North Star Metric, weekly active projects, is flat. We're acquiring users who aren't finding value. The onboarding experience needs work before we invest more in acquisition.\"",
    related: ["KPI", "OKRs", "Product-Market Fit", "Activation Rate"] },

  { term: "Prioritisation Framework", category: "Product Strategy", level: "Intermediate",
    definition: "A structured method for deciding what to build next, based on explicit criteria rather than opinion or recency. Common frameworks include RICE (Reach, Impact, Confidence, Effort), MoSCoW (Must, Should, Could, Won't), and Impact/Effort matrices.",
    whyItMatters: "Every product team has more ideas than capacity. Without a shared framework, the loudest voice or most recent request wins. Prioritisation frameworks make trade-offs visible and debatable, which leads to better decisions and less frustration across the team.",
    scenario: "A product team had a backlog of forty feature requests and no way to compare them. The PM introduced RICE scoring. Several features that stakeholders had been pushing hard for scored poorly on reach, meaning they affected very few users. Two smaller improvements that had been overlooked scored highest. Shipping those two changes moved the retention metric more in one sprint than the previous quarter of ad-hoc feature work.",
    example: "\"I've scored the backlog using RICE. The top three items are not what we expected. The integration feature we've been debating has high impact but very low reach. Let's discuss whether it still belongs in this quarter.\"",
    related: ["Roadmap", "OKRs", "Stakeholder", "Feature Creep"] },

  { term: "Roadmap", category: "Product Strategy", level: "Beginner",
    definition: "A visual plan that communicates what a team intends to build, in what order, and roughly when. A good roadmap communicates priorities and direction rather than committing to exact delivery dates.",
    whyItMatters: "A roadmap aligns stakeholders, engineers, designers, and leadership around a shared plan. Without one, teams work reactively, jumping between requests without a clear sense of where the product is heading. The roadmap is not a promise. It is a communication tool.",
    scenario: "A team operated without a roadmap for six months, responding to stakeholder requests as they came in. Engineers frequently started work that was deprioritised mid-sprint. Designers produced explorations that never shipped. The PM introduced a quarterly roadmap with three clear themes, each tied to an OKR. Stakeholders could see where their request fit or why it did not. Mid-sprint pivots dropped significantly because the plan had already been debated and agreed upon.",
    example: "\"The roadmap for Q3 has three themes: onboarding improvements, billing flexibility, and mobile parity. If a request doesn't fit one of those themes, it goes to the parking lot for Q4 review.\"",
    related: ["OKRs", "Prioritisation Framework", "Sprint", "Stakeholder"] },

  { term: "Feature Creep", category: "Product Strategy", level: "Beginner",
    definition: "The gradual, uncontrolled expansion of a product's scope beyond its original goals. It happens when new features, edge cases, or 'nice-to-haves' are added without evaluating their impact on timelines, complexity, and the core experience.",
    whyItMatters: "Feature creep is how simple products become bloated ones. Each addition seems small in isolation, but the cumulative effect is a product that takes longer to build, is harder to maintain, and confuses the users it was originally designed to serve.",
    scenario: "A team was building a simple invoicing tool. During development, stakeholders requested expense tracking, multi-currency support, and a client portal. Each request was approved individually because each seemed reasonable. The launch date slipped by four months. When the product finally shipped, user testing revealed that the core invoicing flow, the original purpose, was buried under features most users did not need. The team spent the next quarter simplifying what they had over-built.",
    example: "\"We need to stop adding scope. The original brief was a three-month build and we're now at six with no ship date. That's feature creep, and it's putting the whole release at risk.\"",
    related: ["MVP", "Prioritisation Framework", "Product Requirement", "Roadmap"] },

  { term: "Jobs To Be Done", category: "Product Strategy", level: "Intermediate",
    definition: "A framework that views products through the lens of the 'job' a customer is trying to accomplish. Rather than asking who the user is, JTBD asks what progress they are trying to make in a specific circumstance, and what they would 'hire' a product to do.",
    whyItMatters: "Demographics and personas describe who people are. JTBD describes what they are trying to achieve. Two people with identical demographics might hire the same product for completely different jobs. Understanding the job reveals opportunities that user profiles alone cannot.",
    scenario: "A food delivery app assumed its users were motivated by convenience and speed. JTBD interviews revealed a significant segment was hiring the app for a different job entirely: deciding what to eat. These users browsed for twenty minutes before ordering because the job was inspiration, not speed. The team redesigned the browse experience for discovery rather than efficiency, and average order value increased because users were exposed to more options during the exploration phase.",
    example: "\"We keep optimising for speed, but the JTBD research shows that half our users are hiring the product to help them decide, not just to execute a decision they've already made. That changes what we prioritise.\"",
    related: ["Persona", "Product-Market Fit", "User Interview", "Pain point"] },

  { term: "Opportunity Cost", category: "Product Strategy", level: "Intermediate",
    definition: "The value of the best alternative you give up when you choose one option over another. In product development, every feature built is a feature not built, and every sprint spent on one initiative is a sprint not spent on something else.",
    whyItMatters: "Teams often evaluate ideas in isolation: 'Is this worth doing?' The better question is: 'Is this the most valuable thing we could be doing right now?' Opportunity cost forces that comparison and prevents teams from building good things at the expense of great ones.",
    scenario: "A team spent a full quarter building a detailed reporting dashboard that a handful of enterprise clients had requested. During that quarter, onboarding improvements that would have affected every new user were delayed. The dashboard launched to moderate adoption from the requesting clients. Meanwhile, activation rates continued to decline because the onboarding problems remained unsolved. The dashboard was valuable, but the opportunity cost of not fixing onboarding was far higher.",
    example: "\"The reporting feature is useful, but what's the opportunity cost? If we build it this quarter, we delay the onboarding fix that affects every new user. I don't think the trade-off is worth it.\"",
    related: ["Prioritisation Framework", "Roadmap", "Cost-Benefit Analysis", "Stakeholder"] },

  { term: "Product-Led Growth", category: "Product Strategy", level: "Advanced",
    definition: "A business strategy where the product itself is the primary driver of customer acquisition, activation, retention, and expansion. Rather than relying on sales teams or marketing campaigns to generate growth, the product experience does the work through self-serve onboarding, viral loops, and in-product upgrade prompts.",
    whyItMatters: "Product-led growth shifts the growth engine from people-dependent to product-dependent. It scales more efficiently because every product improvement compounds across the entire user base. But it demands that the product experience be exceptionally good, because the product must sell itself.",
    scenario: "A collaboration tool offered a free tier that let individuals use the product fully. When a user invited a colleague, that colleague experienced the product first-hand with zero sales involvement. Teams that reached five or more members were prompted to upgrade for admin controls and analytics. The conversion from free to paid was driven entirely by the product experience. The company scaled to millions of users with a sales team one-tenth the size of its competitors.",
    example: "\"Our PLG motion depends on the free tier being genuinely useful. If we gate too many features behind the paywall, users never experience enough value to upgrade. The free experience is our sales team.\"",
    related: ["Freemium", "Activation", "Growth Loop", "Network Effect"] },

  { term: "Competitive Analysis", category: "Product Strategy", level: "Beginner",
    definition: "A systematic evaluation of competitor products, including their features, positioning, strengths, weaknesses, pricing, and user experience. The goal is to understand the landscape you are operating in and identify opportunities to differentiate.",
    whyItMatters: "Building a product without understanding the competitive landscape is like navigating without a map. Competitive analysis reveals gaps in the market, helps avoid building what already exists, and sharpens positioning by clarifying what makes your product different.",
    scenario: "A team was planning a new project management tool and assumed their key differentiator was simplicity. A competitive analysis of twelve existing tools revealed that three already positioned themselves as 'the simple alternative' and had significant market share. The team pivoted their positioning to focus on a specific use case, creative agency workflows, that none of the competitors served well. The narrower focus gave them a defensible position that 'simple' alone would not have provided.",
    example: "\"Before we commit to the feature set, let's run a competitive analysis. I want to know what's already out there, where the gaps are, and where we can genuinely differentiate rather than just match.\"",
    related: ["Brand Positioning", "Product-Market Fit", "Go-to-Market Strategy", "Stakeholder"] },

  // ── DATA & METRICS (10) ───────────────────────────────────────────────────
  { term: "Cohort Analysis", category: "Data & Metrics", level: "Intermediate",
    definition: "A method of analysing user behaviour by grouping users into cohorts based on a shared characteristic, most commonly the time period in which they signed up. Each cohort is then tracked over time to reveal patterns in retention, engagement, or revenue.",
    whyItMatters: "Aggregate metrics hide important truths. Overall retention might look stable while individual cohorts are getting worse, masked by a growing user base. Cohort analysis reveals whether the product is genuinely improving for new users or simply growing fast enough to hide its problems.",
    scenario: "A SaaS product showed steady month-over-month growth in active users. Leadership assumed retention was healthy. A cohort analysis revealed that each monthly cohort was retaining worse than the previous one. The growing top-line number was masking accelerating churn. Without the cohort view, the team would not have detected the problem until growth slowed and the churn became visible in the aggregate numbers.",
    example: "\"The January cohort retained at 40% after 30 days but the March cohort is at 28%. Something changed. Let's look at what shipped between those two months and whether the onboarding flow was affected.\"",
    related: ["Retention", "Churn Rate", "DAU / MAU", "Activation Rate"] },

  { term: "Attribution", category: "Data & Metrics", level: "Intermediate",
    definition: "The process of identifying which marketing channels, touchpoints, or actions contributed to a user's conversion. Attribution models range from simple (first-touch or last-touch) to complex (multi-touch, data-driven) depending on how credit is distributed across the journey.",
    whyItMatters: "Without attribution, teams cannot tell which channels are actually driving results and which are taking credit for conversions that would have happened anyway. Misattribution leads to over-investing in channels that look good on paper but contribute little real value.",
    scenario: "A company attributed all conversions to the last channel a user touched before signing up, which was usually a branded Google search. This made paid search look like the most effective channel. When the team switched to a multi-touch model, they discovered that most converting users had first encountered the brand through a blog article weeks earlier. The blog was generating demand. Paid search was simply capturing it. Budget was reallocated accordingly.",
    example: "\"Last-touch attribution is telling us paid search drives 70% of conversions, but that's misleading. Most of those users found us through content first. We need a multi-touch model to see the real picture.\"",
    related: ["Marketing Funnel", "Customer Acquisition Cost", "Data-Informed Design", "Conversion Rate"] },

  { term: "Churn Rate", category: "Data & Metrics", level: "Beginner",
    definition: "The percentage of users or customers who stop using a product within a given time period. Typically measured monthly or annually. A 5% monthly churn rate means that for every 100 customers at the start of the month, 5 will have left by the end.",
    whyItMatters: "Churn is the silent killer of growth. A product can acquire thousands of new users each month and still shrink if churn outpaces acquisition. Reducing churn by even a small percentage often has a larger impact on long-term growth than increasing acquisition by the same amount.",
    scenario: "A subscription product was acquiring 500 new users per month and celebrating growth. A closer look at the numbers showed monthly churn was 8%, meaning they were losing more existing users than they were gaining new ones. The active user base was actually declining despite healthy acquisition. The team shifted focus from acquisition campaigns to understanding why users were leaving, and discovered that most churned within the first two weeks due to a confusing setup process.",
    example: "\"Our monthly churn is 8%. That means we need to acquire more than we lose just to stay flat. Until we fix the churn problem, spending more on acquisition is pouring water into a leaking bucket.\"",
    related: ["Retention", "Cohort Analysis", "Activation Rate", "Lifetime Value"] },

  { term: "DAU / MAU", category: "Data & Metrics", level: "Beginner",
    definition: "Daily Active Users and Monthly Active Users. DAU measures how many unique users engage with the product on a given day. MAU measures the same over a month. The ratio of DAU to MAU, called stickiness, indicates how often monthly users return on a daily basis.",
    whyItMatters: "A high MAU with a low DAU means people sign up and visit occasionally but the product is not part of their daily routine. The DAU/MAU ratio reveals whether users are forming a habit around the product, which is one of the strongest predictors of long-term retention.",
    scenario: "A productivity app had 100,000 monthly active users, which looked impressive in board presentations. But the DAU/MAU ratio was 8%, meaning on any given day, only 8,000 of those users actually opened the app. The product was not sticky. Users checked in once or twice a month but had not formed a daily habit. A competing product with half the MAU had a 35% DAU/MAU ratio, meaning its smaller user base was far more engaged and far less likely to churn.",
    example: "\"Our MAU looks healthy but the DAU/MAU ratio is under 10%. That tells me we have a stickiness problem. Users aren't coming back daily, which means we're vulnerable to churn the moment something else gets their attention.\"",
    related: ["Stickiness", "Retention", "Engagement", "North Star Metric"] },

  { term: "Activation Rate", category: "Data & Metrics", level: "Intermediate",
    definition: "The percentage of new users who complete a key action that signals they have experienced the product's core value. The specific action varies by product: sending a first message, creating a first project, completing a first purchase. It marks the transition from sign-up to engaged user.",
    whyItMatters: "Sign-ups mean nothing if users never reach the moment where the product clicks for them. Activation rate measures how well the product converts new arrivals into users who understand and experience its value. Improving activation is often the highest-leverage growth investment a team can make.",
    scenario: "A design tool defined activation as 'created and shared a first design.' Only 22% of new sign-ups reached that point. Investigation revealed that the blank canvas was intimidating for new users who did not know where to start. Adding starter templates and a guided first-run experience increased activation to 41% within two months. The same number of people were signing up. Nearly twice as many were becoming real users.",
    example: "\"Activation is at 22%. That means nearly 80% of new sign-ups never experience what makes this product valuable. We need to fix the first-run experience before we spend more on acquisition.\"",
    related: ["Onboarding", "Time to Value", "Churn Rate", "Pirate Metrics (AARRR)"] },

  { term: "Vanity Metric", category: "Data & Metrics", level: "Beginner",
    definition: "A metric that looks impressive on the surface but does not meaningfully indicate whether the business or product is healthy. Total sign-ups, page views, and app downloads are common vanity metrics because they can grow while the product is actually struggling.",
    whyItMatters: "Vanity metrics feel good in presentations but mislead decision-making. A team celebrating ten thousand downloads while only three hundred users are active is optimising for the wrong thing. The antidote is actionable metrics that connect directly to user behaviour and business outcomes.",
    scenario: "A mobile app team reported a milestone of one million downloads to leadership. Celebrations followed. A deeper analysis revealed that only 6% of those downloads resulted in an account being created, and only 1.2% were active after thirty days. The download number was meaningless as a health indicator. The team had been optimising app store presence and install ads while ignoring the post-install experience entirely.",
    example: "\"Downloads are a vanity metric. One million people installed the app but only twelve thousand are still using it. We need to stop reporting downloads and start reporting 30-day active users.\"",
    related: ["KPI", "North Star Metric", "DAU / MAU", "Leading vs Lagging Indicator"] },

  { term: "Quantitative vs Qualitative", category: "Data & Metrics", level: "Beginner",
    definition: "Two complementary approaches to understanding users. Quantitative data is numerical and measurable: click rates, conversion percentages, time on page. Qualitative data is descriptive and contextual: interview quotes, usability test observations, open-ended survey responses. Both are needed for a complete picture.",
    whyItMatters: "Quantitative data tells you what is happening. Qualitative data tells you why. A drop in conversion rate is a quantitative signal. User interviews revealing that people are confused by the pricing page is the qualitative insight that tells you where to act. Teams that rely on only one type make incomplete decisions.",
    scenario: "Analytics showed a 30% drop-off at step three of a checkout flow. The team debated multiple hypotheses about why. Five usability tests revealed the answer in an afternoon: users were confused by the shipping cost appearing for the first time at that step and felt misled. The quantitative data located the problem. The qualitative research explained it. Neither alone would have been sufficient.",
    example: "\"The data shows a 30% drop-off at step three but it doesn't tell us why. Let's run five usability tests this week. We need the qualitative context before we start redesigning.\"",
    related: ["Qualitative", "Data analytics", "User Interview", "Insights"] },

  { term: "Leading vs Lagging Indicator", category: "Data & Metrics", level: "Intermediate",
    definition: "A leading indicator is a metric that predicts future outcomes: trial activations, feature adoption rates, or NPS scores. A lagging indicator measures outcomes that have already occurred: revenue, churn, or quarterly growth. Leading indicators are actionable. Lagging indicators are confirmatory.",
    whyItMatters: "Teams that only track lagging indicators are always reacting to problems after they have already materialised. Leading indicators give teams the ability to intervene before the damage appears in revenue or retention numbers. The best dashboards track both.",
    scenario: "A SaaS company tracked monthly revenue as its primary metric. Revenue looked healthy until a sudden 15% drop in Q3. By then, the underlying cause, a decline in trial-to-paid conversion that began two months earlier, had already compounded. If the team had been monitoring trial conversion as a leading indicator, they would have detected the problem weeks before it hit revenue and had time to respond.",
    example: "\"Revenue is a lagging indicator. By the time it drops, the problem started weeks ago. We need to track trial activation and feature adoption as leading indicators so we can act before revenue is affected.\"",
    related: ["KPI", "North Star Metric", "Churn Rate", "Cohort Analysis"] },

  { term: "Benchmarking", category: "Data & Metrics", level: "Beginner",
    definition: "The practice of comparing a product's performance metrics against industry standards, competitors, or the product's own historical data. Benchmarks provide context that raw numbers alone cannot, turning 'is this good?' into a question that can be answered.",
    whyItMatters: "A 3% conversion rate means nothing without context. If the industry average is 1.5%, you are performing well. If it is 6%, you have a serious problem. Benchmarking transforms abstract numbers into actionable intelligence by providing the reference point needed to evaluate performance.",
    scenario: "A team was satisfied with their 2% trial-to-paid conversion rate until a competitive benchmarking exercise revealed that similar products in their category averaged 5-7%. What they had assumed was acceptable performance was actually a significant underperformance. The benchmark reframed the conversion rate from 'fine' to 'urgent priority' and redirected the team's focus to the trial experience.",
    example: "\"Our onboarding completion rate is 45%. Is that good? We need benchmarks. If similar products are at 60-70%, we have a clear gap to close. If the industry norm is 35%, we're ahead and should focus elsewhere.\"",
    related: ["KPI", "Competitive Analysis", "Conversion Rate", "Cohort Analysis"] },

  { term: "Data-Informed Design", category: "Data & Metrics", level: "Intermediate",
    definition: "An approach where data is used to guide design decisions without dictating them. Data provides evidence and reduces guesswork, but the designer still applies judgement, context, and empathy to interpret what the data means and what to do about it.",
    whyItMatters: "Data-driven design sounds rigorous but can lead to purely incremental optimisation that lacks vision. Data-informed design preserves the designer's role as a decision-maker who uses data as one input among several, including user research, intuition, and strategic context. The distinction matters because data alone cannot tell you what to build next.",
    scenario: "A data-driven approach to a homepage redesign would have simply A/B tested button colours and headline variations. The data-informed approach started with the same analytics but also incorporated user interviews and a review of the product strategy. The team discovered that the biggest opportunity was not optimising the existing layout but restructuring the page around a different value proposition entirely, something the data alone would never have suggested.",
    example: "\"The data shows users aren't scrolling past the fold, but that doesn't mean we just need a better hero section. Let's combine the analytics with what we heard in interviews before deciding on the direction.\"",
    related: ["A/B Testing", "Quantitative vs Qualitative", "User Interview", "Insights"] },

  // ── GROWTH (10) ───────────────────────────────────────────────────────────
  { term: "Growth Loop", category: "Growth", level: "Intermediate",
    definition: "A self-reinforcing cycle where the output of one step becomes the input of the next, creating compounding growth. Unlike a funnel, which is linear and leaks at every stage, a loop feeds back into itself. Example: a user creates content, that content attracts new visitors via search, some of those visitors sign up and create their own content.",
    whyItMatters: "Funnels require constant refilling at the top. Loops compound over time, meaning each cycle produces more output than the last. Products built around growth loops scale more efficiently because the product itself generates the inputs for future growth rather than depending on external marketing spend.",
    scenario: "A knowledge-sharing platform noticed that its most engaged users were publishing answers to common industry questions. Those answers ranked in Google search results and drove organic traffic. A percentage of that traffic signed up and eventually published their own answers, which attracted more traffic. The team invested in making it easier to publish and optimise content for search, accelerating the loop. Growth became self-sustaining without increasing the marketing budget.",
    example: "\"Our growth loop is: users create templates, templates rank in search, new users find us through search and create their own templates. Every improvement to the template creation experience accelerates the entire loop.\"",
    related: ["Flywheel", "Network Effect", "Organic Reach", "Product-Led Growth"] },

  { term: "Activation", category: "Growth", level: "Beginner",
    definition: "The moment a new user first experiences the core value of a product. Activation is not the same as sign-up. It is the specific action or milestone that indicates a user has understood and benefited from what the product offers.",
    whyItMatters: "The gap between sign-up and activation is where most users are lost. If people sign up but never reach the moment of value, they leave before they understand what the product can do for them. Closing that gap is often the single highest-leverage improvement a product team can make.",
    scenario: "A task management tool defined activation as 'created a project with at least three tasks and invited one team member.' Analytics showed that users who hit that milestone within their first session retained at 60% after 30 days. Users who did not retained at 12%. The first-run experience was redesigned to guide users toward that exact milestone. Activation rate doubled, and 30-day retention improved proportionally.",
    example: "\"Only 25% of new sign-ups are reaching activation. That means three-quarters of the people we're acquiring never experience what makes this product valuable. Fix that before spending more on ads.\"",
    related: ["Activation Rate", "Onboarding", "Time to Value", "Pirate Metrics (AARRR)"] },

  { term: "Onboarding", category: "Growth", level: "Beginner",
    definition: "The process of guiding a new user from their first interaction with a product to the point where they can use it effectively and independently. Good onboarding is not a product tour. It is the deliberate design of the path from sign-up to activation.",
    whyItMatters: "First impressions are disproportionately influential. A user who is confused or overwhelmed in their first session is unlikely to return. Onboarding is the product's one chance to prove its value before the user moves on to something else.",
    scenario: "A project management tool had a comprehensive onboarding tour that walked users through every feature. Completion rates for the tour were high but activation rates were low. The team discovered that users were passively clicking through the tour without actually doing anything. They replaced the tour with an interactive checklist that required users to complete real actions: create a project, add a task, invite a colleague. Activation increased by 35% because users were doing, not just watching.",
    example: "\"The onboarding tour has a 90% completion rate but activation is still low. That tells me people are clicking 'next' without engaging. We need to replace the tour with guided actions that lead to real value.\"",
    related: ["Activation", "Time to Value", "Activation Rate", "Progressive disclosure"] },

  { term: "Retention Curve", category: "Growth", level: "Intermediate",
    definition: "A graph that shows what percentage of a user cohort returns to the product over time, typically plotted as days or weeks since sign-up on the x-axis and percentage of the cohort still active on the y-axis. A healthy retention curve flattens into a plateau. An unhealthy one declines toward zero.",
    whyItMatters: "The shape of the retention curve tells you whether the product has lasting value. A curve that flattens means a core group of users finds the product indispensable. A curve that never flattens means everyone eventually leaves, and no amount of acquisition can overcome that.",
    scenario: "Two competing products had similar sign-up rates. Product A's retention curve declined steeply and never flattened, reaching near zero by week twelve. Product B's curve dropped initially but flattened at 25% by week six and held steady. Product B had a smaller user base in the short term but a growing base of retained users that compounded over time. Within a year, Product B had significantly more active users despite lower acquisition numbers.",
    example: "\"The retention curve is still declining at week eight with no sign of flattening. That means we haven't found the core value that makes people stay. Until this curve flattens, growth is not sustainable.\"",
    related: ["Cohort Analysis", "Churn Rate", "Retention", "DAU / MAU"] },

  { term: "Virality / K-Factor", category: "Growth", level: "Advanced",
    definition: "A measure of how many new users each existing user brings in. The K-factor is calculated as the average number of invitations sent per user multiplied by the conversion rate of those invitations. A K-factor above 1 means each user generates more than one new user, creating exponential growth.",
    whyItMatters: "Viral growth is the most efficient form of acquisition because users do the work of distribution. But true virality is rare. Most products have a K-factor well below 1 and supplement it with other channels. Understanding K-factor helps teams identify whether investing in referral mechanics is worthwhile or whether growth needs to come from elsewhere.",
    scenario: "A design collaboration tool noticed that users were naturally sharing project links with external stakeholders for feedback. Each shared link exposed a new person to the product. The team made the sharing experience seamless and added a sign-up prompt for recipients. The K-factor rose from 0.3 to 0.7. While still below 1, the viral contribution to acquisition reduced the company's dependence on paid channels by nearly half.",
    example: "\"Our K-factor is 0.4, which means every ten users bring in four new ones organically. If we can get it to 0.7, we can cut paid acquisition spend significantly. Let's invest in making the sharing and invite flow frictionless.\"",
    related: ["Growth Loop", "Network Effect", "Organic Reach", "Product-Led Growth"] },

  { term: "Pirate Metrics (AARRR)", category: "Growth", level: "Intermediate",
    definition: "A framework created by Dave McClure that breaks the user lifecycle into five measurable stages: Acquisition (how users find you), Activation (first value experience), Retention (do they come back), Revenue (do they pay), and Referral (do they tell others). The acronym sounds like a pirate, hence the name.",
    whyItMatters: "AARRR gives teams a shared language for diagnosing where growth is breaking down. A product with strong acquisition but weak activation has a different problem than one with strong activation but weak retention. The framework prevents teams from treating 'growth' as a single undifferentiated problem.",
    scenario: "A product team was investing heavily in acquisition through paid ads, content, and partnerships. Growth was disappointing. Mapping their metrics to the AARRR framework revealed that acquisition was actually strong but activation was the bottleneck: 70% of new users never completed setup. The team had been trying to pour more water into a funnel with a massive hole in the middle. Shifting investment from acquisition to activation produced better growth at lower cost.",
    example: "\"Let's map our metrics to the AARRR framework. I suspect we're over-investing in acquisition when the real bottleneck is activation. If 70% of new users never activate, getting more of them isn't the answer.\"",
    related: ["Activation", "Retention", "Marketing Funnel", "Churn Rate"] },

  { term: "Time to Value", category: "Growth", level: "Beginner",
    definition: "The amount of time it takes for a new user to experience the core benefit of a product after signing up. A short time to value means users quickly understand why the product is worth their attention. A long time to value means they must invest effort before seeing any return.",
    whyItMatters: "Users are impatient and have alternatives. Every minute between sign-up and the first moment of value is a minute where they might leave. Reducing time to value is one of the most reliable ways to improve activation, retention, and overall product perception.",
    scenario: "A data visualisation tool required users to connect a data source, configure fields, and build a query before seeing their first chart. Average time to first value was over twenty minutes. The team added a sample dataset that was pre-loaded on sign-up, allowing users to build a chart within sixty seconds. Time to value dropped from twenty minutes to under two. Trial-to-paid conversion improved by 28% because users understood the product's value before they invested effort in configuring their own data.",
    example: "\"Time to value is twenty minutes. That's way too long. New users need to see a result in under two minutes or they'll assume this product isn't for them. Let's add sample data so they can experience the magic immediately.\"",
    related: ["Activation", "Onboarding", "Activation Rate", "Product-Market Fit"] },

  { term: "Stickiness", category: "Growth", level: "Intermediate",
    definition: "A measure of how frequently users return to a product, typically expressed as the DAU/MAU ratio. A stickiness ratio of 50% means that half of all monthly users visit the product on any given day. Higher stickiness indicates stronger habit formation.",
    whyItMatters: "A product can have many registered users but low stickiness, meaning people are not forming a regular habit around it. Stickiness predicts long-term retention: products that become part of a user's daily or weekly routine are far harder to churn from than those visited occasionally.",
    scenario: "A note-taking app had 200,000 MAU but a DAU/MAU ratio of only 5%. Users signed up, used the app a few times, and then forgot about it. A competitor with 80,000 MAU had a 40% DAU/MAU ratio. Its users were in the app almost every day. Despite having a smaller user base, the competitor was retaining at a much higher rate and growing more sustainably because its users had formed a daily habit.",
    example: "\"Our MAU is growing but stickiness is at 5%. That tells me people try the product and don't come back regularly. We need to figure out what would make this a daily-use tool, not a once-a-month one.\"",
    related: ["DAU / MAU", "Retention", "Retention Curve", "Engagement"] },

  { term: "Network Effect", category: "Growth", level: "Advanced",
    definition: "A dynamic where a product becomes more valuable to each user as more people use it. Direct network effects occur when users benefit from other users being on the same platform (messaging apps, social networks). Indirect network effects occur when more users attract complementary participants (more riders attract more drivers on a ride-sharing platform).",
    whyItMatters: "Network effects create defensibility that features alone cannot. A competitor can copy your features but they cannot copy your network. Products with strong network effects become increasingly difficult to displace as they grow, creating a natural moat that compounds over time.",
    scenario: "A professional networking platform reached a critical mass where most people in a specific industry had a profile. At that point, not being on the platform became a professional disadvantage. New users joined not because of features but because everyone they needed to connect with was already there. A competitor launched with a better interface and more features but could not overcome the network effect. Users tried it, found it empty, and returned to where their connections were.",
    example: "\"We need to reach critical mass in at least one industry vertical before expanding. The product is useful with ten connections but indispensable with a hundred. That's the network effect we need to trigger.\"",
    related: ["Product-Led Growth", "Virality / K-Factor", "Growth Loop", "Flywheel"] },

  { term: "Flywheel", category: "Growth", level: "Intermediate",
    definition: "A business model where each component of the system reinforces the others, creating momentum that accelerates over time. Originally popularised by Amazon: lower prices attract more customers, more customers attract more sellers, more sellers increase selection, which drives lower prices. Each turn of the wheel makes the next turn easier.",
    whyItMatters: "A flywheel mindset shifts thinking from linear cause-and-effect to systems thinking. Instead of asking 'what is our growth strategy?' it asks 'what system can we build where every improvement makes everything else better?' Products designed around flywheels compound their advantages in ways that linear strategies cannot.",
    scenario: "A marketplace for freelance designers invested in three things simultaneously: attracting high-quality designers, making the hiring process fast and transparent, and publishing the work produced through the platform as a portfolio showcase. Better designers attracted more clients. More clients attracted more designers. Published work brought organic traffic that fed both sides. Each investment reinforced the others. After eighteen months, the marketplace was growing with minimal marketing spend because the flywheel was self-sustaining.",
    example: "\"Think of it as a flywheel, not a funnel. Better content attracts more users. More users create more content. More content improves SEO. Better SEO brings more users. Every improvement we make to one part accelerates the whole system.\"",
    related: ["Growth Loop", "Network Effect", "Product-Led Growth", "Organic Reach"] },

  // ── FINANCE & PRICING (10) ────────────────────────────────────────────────
  { term: "Revenue Model", category: "Finance & Pricing", level: "Beginner",
    definition: "The strategy a business uses to generate income from its product or service. Common models include subscription (recurring payments), transactional (pay-per-use), freemium (free tier with paid upgrades), advertising (monetising attention), and marketplace (taking a percentage of transactions between buyers and sellers).",
    whyItMatters: "The revenue model shapes everything: what gets built, who the product serves, and how success is measured. A subscription model incentivises retention. An advertising model incentivises engagement and time-on-site. The model is not just a pricing decision. It determines the product's fundamental incentive structure.",
    scenario: "A productivity tool launched with a one-time purchase model. Sales were strong at launch but declined quickly because there was no recurring revenue and no incentive to keep improving the product for existing users. The team transitioned to a subscription model, which initially reduced revenue but created a predictable income stream and aligned the business incentive with ongoing product quality. Within a year, subscription revenue exceeded the peak of the one-time model.",
    example: "\"We need to decide the revenue model before we design the product. A subscription model means we need to build for retention. A transaction model means we need to build for repeat usage. They lead to fundamentally different products.\"",
    related: ["Freemium", "ARR / MRR", "Unit Economics", "SaaS"] },

  { term: "SaaS", category: "Finance & Pricing", level: "Beginner",
    definition: "Software as a Service. A model where software is hosted centrally and accessed by users over the internet via subscription, rather than being installed locally and purchased once. Users pay monthly or annually for continued access, and the provider handles hosting, maintenance, and updates.",
    whyItMatters: "SaaS transformed the software industry by replacing large upfront purchases with smaller recurring payments. For users, it lowered the barrier to trying new tools. For businesses, it created predictable recurring revenue but also raised the bar: if the product stops being valuable, users can cancel at any time.",
    scenario: "A company sold desktop software for a one-time fee of £500. Revenue was unpredictable and heavily dependent on new customer acquisition. Transitioning to a SaaS model at £30 per month initially felt like a price cut. But within eighteen months, the average customer had paid more than the old one-time fee, and the revenue stream was predictable enough to plan hiring and investment around. The SaaS model also forced the team to keep improving the product continuously, because users could leave at any time.",
    example: "\"As a SaaS product, our revenue depends entirely on users staying subscribed. That means every month, the product has to justify its price. Retention is not a nice-to-have. It is the business model.\"",
    related: ["Revenue Model", "ARR / MRR", "Churn Rate", "Freemium"] },

  { term: "ARR / MRR", category: "Finance & Pricing", level: "Intermediate",
    definition: "Annual Recurring Revenue and Monthly Recurring Revenue. MRR is the total predictable revenue a subscription business earns each month from active subscribers. ARR is MRR multiplied by twelve. Both metrics exclude one-time payments, services revenue, and variable fees.",
    whyItMatters: "ARR and MRR are the heartbeat metrics of any subscription business. They indicate whether the business is growing, flat, or shrinking in a way that total revenue alone cannot. A business can have high total revenue from one-time deals while its recurring base is declining. ARR and MRR expose the underlying health.",
    scenario: "A SaaS company reported strong quarterly revenue that included a large enterprise deal paid upfront. Leadership was optimistic. But MRR analysis showed that recurring revenue had actually declined for three consecutive months because small and mid-size customer churn was accelerating. The enterprise deal masked the problem. Without MRR as a separate metric, the churn trend would not have been visible until the next quarter when no large deal was there to offset it.",
    example: "\"Our MRR grew 4% this month but most of that came from one enterprise upgrade. Excluding that, core MRR was flat. We need to look at what's happening in the mid-market segment.\"",
    related: ["SaaS", "Revenue Model", "Churn Rate", "Lifetime Value"] },

  { term: "Unit Economics", category: "Finance & Pricing", level: "Intermediate",
    definition: "The revenue and costs associated with a single unit of a business, most commonly a single customer. Unit economics typically compares Customer Acquisition Cost (CAC) against Lifetime Value (LTV) to determine whether the business model is fundamentally profitable on a per-customer basis.",
    whyItMatters: "A business can grow rapidly while losing money on every customer. Unit economics reveals whether the model is viable at scale. If it costs more to acquire a customer than that customer will ever pay, growth simply accelerates losses. Fixing unit economics is not optional. It is existential.",
    scenario: "A food delivery startup was growing at 30% month over month and celebrating. A unit economics analysis showed that after accounting for delivery costs, driver incentives, and customer acquisition spend, the company lost £8 on every order. Leadership had assumed that scale would fix the economics. The analysis showed the opposite: higher volume increased losses proportionally. The team had to restructure pricing and reduce driver incentives before the economics became viable.",
    example: "\"Growth looks great on the surface but our unit economics are negative. We're losing £8 per customer. Scaling a business that loses money per unit just means losing money faster. We need to fix the fundamentals first.\"",
    related: ["Customer Acquisition Cost", "Lifetime Value", "Revenue Model", "Burn Rate"] },

  { term: "Freemium", category: "Finance & Pricing", level: "Beginner",
    definition: "A pricing model where the basic version of a product is free and revenue is generated by charging for premium features, increased usage, or advanced capabilities. The free tier serves as both a user acquisition tool and a demonstration of the product's value.",
    whyItMatters: "Freemium lowers the barrier to adoption to zero, which is powerful for growth. But it also means the free experience must be good enough to demonstrate value while the paid tier must be compelling enough to justify upgrading. Getting that balance wrong, too generous or too restrictive, undermines the entire model.",
    scenario: "A file-sharing product offered a generous free tier with 50GB of storage. Conversion to paid was below 1% because most users never needed more than the free allowance. The team reduced free storage to 5GB and added collaboration features exclusively to the paid tier. Free users now experienced the core product but hit a natural limit when working with others. Conversion to paid increased to 4.5% because the upgrade trigger was tied to a real need rather than an arbitrary storage cap.",
    example: "\"Our free tier is too generous. Users have no reason to upgrade because they get everything they need for free. We need to find the right constraint, something that naturally triggers when the product becomes essential to their workflow.\"",
    related: ["Product-Led Growth", "Revenue Model", "Pricing Tier", "Activation"] },

  { term: "Pricing Tier", category: "Finance & Pricing", level: "Beginner",
    definition: "A level within a pricing structure that offers a specific combination of features, usage limits, and support at a set price. Most SaaS products offer two to four tiers (e.g., Free, Pro, Team, Enterprise) designed to serve different customer segments with different needs and willingness to pay.",
    whyItMatters: "Tiers allow a single product to serve multiple customer segments without building separate products. A freelancer and an enterprise team have different needs and different budgets. Well-designed tiers capture value from both without forcing either to pay for features they do not need.",
    scenario: "A design tool had two pricing tiers: free and £25/month. Conversion was low because the jump from free to £25 felt steep for individual users, while teams found the £25 tier lacking in admin features. Adding a middle tier at £12/month for individuals and raising the team tier to £40/month with admin controls increased overall revenue. Individual users had a stepping stone and teams had a tier that addressed their actual needs.",
    example: "\"The gap between free and Pro is too large. We're losing individual users who want more than free but can't justify £25. A personal tier at £12 would capture that segment without cannibalising the team plan.\"",
    related: ["Freemium", "Revenue Model", "Segmentation", "SaaS"] },

  { term: "ROI", category: "Finance & Pricing", level: "Beginner",
    definition: "Return on Investment. A measure of the profit or value gained relative to the cost of an investment, expressed as a percentage. Calculated as (gain from investment minus cost of investment) divided by cost of investment. An ROI of 200% means the return was twice the cost.",
    whyItMatters: "ROI is the universal language of business justification. Whether proposing a design system, a new feature, or a tool purchase, being able to articulate the expected return makes the case tangible. Teams that speak in ROI terms get budget approval more easily because they are framing their work in terms stakeholders care about.",
    scenario: "A design team wanted to invest three months in building a component library. Leadership was reluctant to approve the time investment. The team calculated that designers were spending an average of six hours per week recreating components that already existed in various files. Across five designers over a year, that was over 1,500 hours. The component library would take approximately 500 hours to build. The ROI calculation made the business case undeniable, and the project was approved.",
    example: "\"The component library will take 500 hours to build but will save 1,500 hours per year across the design team. That's a 200% ROI in year one alone, and it compounds every year after that.\"",
    related: ["Cost-Benefit Analysis", "KPI", "Stakeholder", "Unit Economics"] },

  { term: "Burn Rate", category: "Finance & Pricing", level: "Intermediate",
    definition: "The rate at which a company spends its cash reserves, typically measured monthly. Gross burn rate is total monthly spending. Net burn rate is spending minus revenue. A company with £2 million in the bank and a net burn rate of £200,000 per month has ten months of runway.",
    whyItMatters: "Burn rate determines how much time a company has to achieve its goals before it runs out of money. For startups, it sets the urgency of every decision. For product teams, understanding burn rate provides context for why leadership might prioritise revenue features over user experience improvements.",
    scenario: "A startup had eighteen months of runway and was investing heavily in product development with no revenue. At month ten, leadership announced a pivot toward monetisation features, frustrating the product team who felt the core experience was not yet ready. Understanding the burn rate made the decision logical: with eight months of runway remaining and fundraising uncertain, generating revenue was no longer optional. The product team adjusted their roadmap to balance monetisation with continued UX improvements.",
    example: "\"Our net burn is £180,000 per month and we have twelve months of runway. That means every feature decision needs to be evaluated against whether it helps us reach profitability or the next funding round before the money runs out.\"",
    related: ["ARR / MRR", "Unit Economics", "Revenue Model", "ROI"] },

  { term: "Cost-Benefit Analysis", category: "Finance & Pricing", level: "Beginner",
    definition: "A systematic process of comparing the total expected costs of a decision against the total expected benefits, to determine whether the benefits outweigh the costs. In product development, this applies to feature investments, tool purchases, hiring decisions, and technical debt remediation.",
    whyItMatters: "Not every good idea is worth doing right now. A cost-benefit analysis forces teams to quantify trade-offs rather than relying on intuition. It also provides a framework for communicating decisions to stakeholders in terms they can evaluate objectively.",
    scenario: "A team proposed migrating from a legacy codebase to a modern framework. The engineering lead estimated four months of work. A cost-benefit analysis revealed that the current codebase was costing the team approximately three developer-days per week in maintenance and workarounds. Over a year, that was 150 developer-days. The migration would cost roughly 80 developer-days. The analysis showed the migration would pay for itself within seven months and free up capacity permanently after that.",
    example: "\"Before we commit to the migration, let's do a cost-benefit analysis. How much time are we losing to the current system each month, and how long before the migration pays for itself? I want the numbers, not just the feeling that it's the right thing to do.\"",
    related: ["ROI", "Opportunity Cost", "Stakeholder", "Prioritisation Framework"] },

  { term: "Paywall", category: "Finance & Pricing", level: "Beginner",
    definition: "A barrier within a product that requires payment before the user can access specific content or features. Paywalls can be hard (no access without payment), metered (limited free access before payment is required), or soft (content is available but payment is encouraged).",
    whyItMatters: "Paywall placement is a critical design and business decision. Too early, and users never experience enough value to justify paying. Too late, and users get everything they need for free. The paywall must sit at the moment where the user has experienced enough value to understand what they are paying for.",
    scenario: "A news publication implemented a hard paywall on all articles. Traffic dropped 60% and subscriptions grew only modestly. Switching to a metered paywall that allowed five free articles per month restored traffic while still converting engaged readers. Users who read five articles had demonstrated enough interest that the subscription prompt felt reasonable rather than obstructive. Conversion to paid subscriptions exceeded the hard paywall approach.",
    example: "\"The paywall is hitting users before they've experienced any value. Nobody pays for something they haven't tried. Let's move the paywall to after the third completed action so users understand what they're upgrading for.\"",
    related: ["Freemium", "Pricing Tier", "Activation", "Revenue Model"] },

  // ── COLLABORATION & WAYS OF WORKING (10) ──────────────────────────────────
  { term: "Cross-Functional Team", category: "Collaboration", level: "Beginner",
    definition: "A team composed of people from different disciplines, typically including design, engineering, product management, and sometimes research, data, or marketing, working together toward a shared goal rather than handing work between separate department silos.",
    whyItMatters: "Siloed teams create handoff points where context is lost, decisions are delayed, and accountability becomes unclear. Cross-functional teams reduce those handoffs by having all the expertise needed to deliver a feature sitting together and making decisions in real time.",
    scenario: "A company organised by department had a feature request cycle that took an average of six weeks: product wrote a brief, sent it to design, design produced mockups, sent them to engineering, engineering asked clarifying questions that went back through the chain. Reorganising into cross-functional squads reduced the same cycle to two weeks because designer, engineer, and PM sat together, made decisions in the same meeting, and resolved ambiguity immediately.",
    example: "\"We need to staff this initiative as a cross-functional team: one PM, two engineers, one designer, and a data analyst. If we run it through separate departments, we'll lose three weeks to handoffs alone.\"",
    related: ["Sprint", "Stand-up", "Retrospective", "RACI Matrix"] },

  { term: "Stand-up", category: "Collaboration", level: "Beginner",
    definition: "A short daily meeting, typically fifteen minutes or less, where each team member briefly shares what they worked on yesterday, what they are working on today, and whether anything is blocking their progress. Named for the practice of standing to keep the meeting short.",
    whyItMatters: "Stand-ups create a daily rhythm of visibility and accountability. They surface blockers early, prevent work from diverging silently, and give the team a shared understanding of progress without requiring lengthy status reports or constant Slack updates.",
    scenario: "A team of six had stopped running stand-ups, relying instead on Slack updates. Over three weeks, two engineers unknowingly worked on overlapping solutions to the same problem, and a designer's work was blocked by a dependency that no one was aware of. Reinstating a fifteen-minute daily stand-up eliminated these coordination failures within the first week. The time cost was minimal. The information gained was significant.",
    example: "\"Let's keep stand-up to fifteen minutes. Yesterday, today, blockers. If something needs a deeper discussion, take it offline with the relevant people after.\"",
    related: ["Sprint", "Cross-Functional Team", "Retrospective", "Agile"] },

  { term: "Retrospective", category: "Collaboration", level: "Beginner",
    definition: "A recurring team meeting, typically held at the end of a sprint or project phase, where the team reflects on what went well, what did not go well, and what they want to change going forward. The goal is continuous improvement through honest reflection.",
    whyItMatters: "Teams that do not reflect do not improve. They repeat the same mistakes and rely on individual memory rather than collective learning. A well-run retrospective turns experience into action items and gives every team member a voice in shaping how the team works.",
    scenario: "A team shipped a feature two weeks late and was tempted to move straight to the next project. The PM insisted on a retrospective. The session revealed that the delay was not caused by scope or technical complexity but by a single approval bottleneck: one stakeholder was required to sign off on every design decision but was only available for thirty minutes a week. The team agreed to establish a delegate approval process. The next project shipped on time.",
    example: "\"In the retro, the biggest theme was approval bottlenecks. Three different people flagged it. Let's create an action item to address the sign-off process before next sprint.\"",
    related: ["Sprint", "Stand-up", "Cross-Functional Team", "Definition of Done"] },

  { term: "RACI Matrix", category: "Collaboration", level: "Intermediate",
    definition: "A responsibility assignment chart that clarifies who is Responsible (does the work), Accountable (owns the outcome), Consulted (provides input before the decision), and Informed (told about the outcome after) for each task or decision. Used to eliminate ambiguity in cross-functional work.",
    whyItMatters: "When everyone thinks someone else is handling it, nothing gets done. When everyone thinks they need to approve it, everything stalls. A RACI matrix makes invisible assumptions visible and prevents the most common coordination failures: gaps in ownership and bottlenecks in approval.",
    scenario: "A product launch was delayed because three different people believed they were responsible for the go/no-go decision, and none of them had made it. A post-mortem revealed that roles had never been formally defined for the launch process. The team created a RACI matrix for future launches. The next release had one accountable owner, two consulted stakeholders, and clear timelines for each decision point. It shipped on schedule.",
    example: "\"Before we kick off this project, let's build a RACI matrix. I want to know exactly who owns the final decision on scope, who needs to be consulted on design, and who just needs to be kept informed. No ambiguity.\"",
    related: ["Cross-Functional Team", "Stakeholder", "Decision Log", "Definition of Done"] },

  { term: "Design Critique", category: "Collaboration", level: "Beginner",
    definition: "A structured feedback session where designers present their work and colleagues offer constructive analysis focused on how well the design solves the stated problem. Unlike casual feedback, a critique follows rules: the presenter states the problem and constraints, reviewers focus on the work rather than personal preferences, and feedback is specific and actionable.",
    whyItMatters: "Unstructured feedback often devolves into subjective opinions that confuse rather than clarify. A well-run critique improves the work, develops the team's design thinking, and builds a culture where feedback is expected and valued rather than feared.",
    scenario: "A design team had a habit of sharing work in Slack and receiving scattered, contradictory feedback. One person liked the colours, another disliked them, and no one addressed whether the design actually solved the user problem. The team introduced weekly thirty-minute critiques with a simple format: the designer states the problem, shows the work, and asks one specific question. Feedback quality improved immediately because reviewers had context and focus.",
    example: "\"In critique today, I'm showing the updated checkout flow. The problem I'm solving is reducing drop-off at the payment step. I'd like feedback specifically on whether the form layout reduces cognitive load. I'm not looking for colour or typography feedback at this stage.\"",
    related: ["Design playback", "Design principles", "Cross-Functional Team", "Presentation"] },

  { term: "Workshop", category: "Collaboration", level: "Beginner",
    definition: "A facilitated, time-boxed collaborative session where a group works together to solve a specific problem or generate ideas. Unlike a meeting, a workshop has structured activities, a clear output, and active participation from everyone in the room.",
    whyItMatters: "Meetings discuss. Workshops produce. A well-facilitated workshop can compress days of back-and-forth into a single focused session, align diverse perspectives, and generate concrete outputs that the team can act on immediately.",
    scenario: "A team had been debating the information architecture of a new product for three weeks over Slack and meetings, with no resolution. A facilitator ran a two-hour workshop using card sorting and dot voting. By the end of the session, the team had a shared IA structure that everyone had contributed to and agreed upon. Three weeks of circular discussion was resolved in two hours because the workshop replaced opinion with structured activity.",
    example: "\"We've been going back and forth on this for two weeks. Let's run a workshop on Thursday. Two hours, everyone in the room, structured activities, and we walk out with a decision. No more Slack threads.\"",
    related: ["Design Critique", "Cross-Functional Team", "Divergent thinking", "Convergent thinking"] },

  { term: "Async Communication", category: "Collaboration", level: "Beginner",
    definition: "Communication that does not require all participants to be available at the same time. Includes written messages, recorded videos, shared documents, and comment threads. The sender communicates when convenient, and the receiver responds when they are ready.",
    whyItMatters: "Synchronous communication (meetings, calls) is expensive. It requires everyone to stop what they are doing and be present simultaneously. Async communication respects time zones, focus time, and different working styles. Teams that default to async and reserve synchronous time for decisions and alignment work more efficiently.",
    scenario: "A distributed team across three time zones was scheduling daily meetings at inconvenient hours for at least one group. Switching to async stand-ups via a shared thread, with synchronous meetings reserved for weekly planning only, eliminated the timezone friction. Team members updated at the start of their own day. Questions were answered within hours rather than waiting for the next meeting. Overall, more information was shared and less time was spent in meetings.",
    example: "\"This doesn't need a meeting. Write it up in a Notion doc, tag the people who need to weigh in, and give them 48 hours to respond. Save synchronous time for decisions that need real-time discussion.\"",
    related: ["Stand-up", "Cross-Functional Team", "Workshop", "Decision Log"] },

  { term: "Definition of Done", category: "Collaboration", level: "Intermediate",
    definition: "A shared, explicit set of criteria that a piece of work must meet before it can be considered complete. A Definition of Done typically includes requirements like: code reviewed, tests passing, design reviewed, documentation updated, and product owner approval given.",
    whyItMatters: "Without a shared definition of done, 'done' becomes subjective. One person's 'done' means code committed. Another's means tested and deployed. The gap between these interpretations creates confusion, rework, and quality issues. Making the criteria explicit removes ambiguity.",
    scenario: "A team repeatedly marked stories as complete in their project tracker, only for QA to find issues and send them back. What engineers considered 'done' did not include QA review. The team defined a shared checklist: code reviewed, unit tests passing, QA tested on staging, design sign-off, and merged to main. Rework dropped by half in the first sprint because nothing was marked complete until it genuinely was.",
    example: "\"This story isn't done yet. It's code-complete but it hasn't been QA'd on staging or reviewed by design. Let's not move it to done until it meets all the criteria on the checklist.\"",
    related: ["Sprint", "QA", "Developer handoff", "Retrospective"] },

  { term: "Ceremonies", category: "Collaboration", level: "Intermediate",
    definition: "The recurring structured events in an Agile team's workflow. Core ceremonies include sprint planning (deciding what to build), daily stand-ups (syncing progress), sprint review or demo (showing what was built), and retrospective (reflecting on how it went). Each ceremony serves a specific purpose in the team's rhythm.",
    whyItMatters: "Ceremonies create the cadence that keeps a team aligned and moving. Without them, communication becomes ad-hoc, planning becomes reactive, and reflection does not happen. The ceremonies themselves are simple. Their value comes from consistency and discipline in running them well.",
    scenario: "A team dropped all ceremonies except stand-up in an effort to 'move faster.' Within a month, sprint planning was happening informally and inconsistently, work was being started without clear scope, and there was no forum for reflecting on what was going wrong. Reinstating planning, review, and retro ceremonies added four hours per fortnight but eliminated the coordination failures that had been costing significantly more than four hours in rework and miscommunication.",
    example: "\"We're not going to skip the retro just because we're behind. The retro is how we figure out why we keep falling behind. Cutting it is cutting the feedback loop.\"",
    related: ["Sprint", "Stand-up", "Retrospective", "Agile"] },

  { term: "Decision Log", category: "Collaboration", level: "Intermediate",
    definition: "A shared record of key decisions made during a project, including the context, the options considered, the decision taken, and who was involved. It provides an authoritative reference that anyone can consult to understand why a particular direction was chosen.",
    whyItMatters: "Teams forget why decisions were made, especially as people rotate in and out of projects. Without a decision log, the same debates resurface repeatedly, and new team members have no way to understand the reasoning behind existing choices. A log prevents revisiting settled decisions and gives newcomers context.",
    scenario: "A team debated and resolved a navigation structure decision in a meeting six months earlier. When a new designer joined, they questioned the structure and proposed the exact alternative the team had already considered and rejected. Without a decision log, the team spent two meetings re-debating the same trade-offs. After implementing a decision log, the next similar situation was resolved in five minutes: the new team member read the log entry, understood the reasoning, and moved on.",
    example: "\"I've added the navigation decision to the decision log with the trade-offs we discussed and why we chose this approach. If anyone questions it later, the rationale is documented.\"",
    related: ["RACI Matrix", "Stakeholder", "Retrospective", "Workshop"] },

  // ── CONTENT & UX WRITING (10) ─────────────────────────────────────────────
  { term: "Content Strategy", category: "Content & UX Writing", level: "Beginner",
    definition: "The planning, creation, delivery, and governance of content across a product or organisation. Content strategy defines what content exists, why it exists, who it is for, and how it will be maintained over time. It covers everything from in-product copy to help documentation to marketing pages.",
    whyItMatters: "Content without strategy becomes inconsistent, redundant, and eventually misleading. When multiple teams create content independently without shared guidelines, users encounter contradictory messaging, outdated information, and a fragmented experience. Strategy brings coherence.",
    scenario: "A SaaS product had help articles written by support, onboarding copy written by product, marketing pages written by marketing, and error messages written by engineering. Each team used different terminology for the same features. Users regularly reported confusion because the help article described a feature differently than the product itself. A content strategist audited all content, established a shared terminology guide, and created a review process. Within three months, support tickets related to terminology confusion dropped by 40%.",
    example: "\"We have four teams writing content independently and none of them are using the same terms for the same features. We need a content strategy, starting with a shared vocabulary and a review process.\"",
    related: ["UX Writing", "Voice & Tone Guidelines", "Content Audit", "Content Governance"] },

  { term: "UX Writing", category: "Content & UX Writing", level: "Beginner",
    definition: "The practice of writing the text that appears within a product's interface: button labels, form instructions, error messages, onboarding prompts, empty states, and confirmation dialogs. UX writing guides users through actions and helps them understand what is happening at every step.",
    whyItMatters: "Every word in a product is a design decision. A confusing button label causes hesitation. A vague error message causes frustration. A well-written empty state turns a dead end into an invitation to act. UX writing is invisible when done well and painfully obvious when done poorly.",
    scenario: "A form had an error message that read 'Invalid input.' Users did not know what was wrong or how to fix it. A UX writer rewrote it to 'Please enter a valid email address (e.g., name@example.com).' Support tickets for that form dropped by 60%. The functionality was identical. The only change was the words.",
    example: "\"The error message just says 'Something went wrong.' That's not UX writing, that's a placeholder someone forgot to replace. Tell the user what happened and what they can do about it.\"",
    related: ["Microcopy", "Error Message Design", "Plain Language", "Content Strategy"] },

  { term: "Information Scent", category: "Content & UX Writing", level: "Intermediate",
    definition: "The cues in a user interface that help users predict whether following a link, button, or navigation path will lead them to the information they are looking for. Strong information scent means labels and descriptions accurately signal what lies ahead. Weak scent means users are guessing.",
    whyItMatters: "Users navigate by predicting. They scan labels and decide whether clicking will get them closer to their goal. If the scent is weak, users either leave entirely or click randomly, which feels frustrating and inefficient. Strong information scent makes navigation feel intuitive without requiring explanation.",
    scenario: "An e-commerce site had a category called 'Solutions' in its main navigation. Analytics showed that almost no one clicked it. User testing revealed that people had no idea what 'Solutions' meant in this context. Renaming it to 'Products by Industry' increased click-through by 200%. The content behind the link was identical. The label was the only change. It gave users a clear prediction of what they would find.",
    example: "\"The navigation label 'Resources' is too vague. Users don't know if it means help docs, case studies, or downloads. We need stronger information scent. Let's split it into specific labels that tell people exactly what they'll find.\"",
    related: ["Navigation", "Readability", "Copy Hierarchy", "Progressive disclosure"] },

  { term: "Voice & Tone Guidelines", category: "Content & UX Writing", level: "Intermediate",
    definition: "A documented set of rules that define how a brand communicates. Voice is the consistent personality behind all communication: friendly, authoritative, playful, or professional. Tone is how that voice adapts to different situations: celebratory when a user succeeds, empathetic when they encounter an error, direct when action is needed.",
    whyItMatters: "Without guidelines, every writer makes their own assumptions about how the product should sound. The result is an inconsistent experience where the marketing site sounds playful, the onboarding sounds corporate, and error messages sound robotic. Guidelines create consistency that builds trust.",
    scenario: "A product's onboarding flow used casual, friendly language ('Let's get started!'). The billing page used formal, legalistic language ('Your subscription will be automatically renewed.'). The disconnect made users feel like they were interacting with two different companies. Voice and tone guidelines were created that defined the product's personality and provided examples for different contexts. The billing page was rewritten to match the product's voice while remaining clear and transparent.",
    example: "\"Our voice is confident and helpful, never condescending. In success states, the tone is warm and celebratory. In error states, it's calm and solution-focused. Here are examples for each.\"",
    related: ["Tone of Voice", "Content Strategy", "Brand Identity", "UX Writing"] },

  { term: "Content Audit", category: "Content & UX Writing", level: "Intermediate",
    definition: "A systematic inventory and evaluation of all content within a product or across a digital presence. A content audit catalogues what exists, assesses its quality and accuracy, identifies gaps and redundancies, and provides a foundation for content strategy decisions.",
    whyItMatters: "Content accumulates over time. Pages that were accurate two years ago may now be misleading. Help articles may reference features that no longer exist. A content audit reveals the true state of your content so you can fix, update, or remove what is no longer serving users.",
    scenario: "A product's help centre had 400 articles. A content audit revealed that 35% referenced outdated interface elements, 15% described features that had been removed, and 40 articles covered the same topic with slightly different information. Users searching for help were finding contradictory or irrelevant articles. The team archived 120 articles, updated 80, and consolidated duplicates. Help centre satisfaction scores improved within a month.",
    example: "\"We have 400 help articles and no one knows how many are still accurate. Let's run a content audit. I'd rather have 200 correct articles than 400 where a third are misleading.\"",
    related: ["Content Strategy", "Content Governance", "UX Writing", "Readability"] },

  { term: "Plain Language", category: "Content & UX Writing", level: "Beginner",
    definition: "Writing that users can understand the first time they read it, without needing to re-read or interpret. Plain language uses simple sentence structures, common words, active voice, and clear logic. It is not about dumbing things down. It is about removing unnecessary complexity.",
    whyItMatters: "Complex language does not make a product seem more professional. It makes it harder to use. Users scan rather than read. If they cannot understand a label, instruction, or message in a glance, the interface has failed them. Plain language respects the user's time and attention.",
    scenario: "A banking app displayed the message: 'Your transaction has been submitted for processing and will be reflected in your account balance upon completion of the settlement cycle.' Users frequently contacted support asking when their money would arrive. The message was rewritten to: 'Your payment is being processed. It will appear in your balance within 2 business days.' Support enquiries about payment timing dropped by 45%.",
    example: "\"'Upon completion of the settlement cycle' is not plain language. Write 'within 2 business days.' Our users are busy. They need clarity, not formality.\"",
    related: ["UX Writing", "Readability", "Microcopy", "Accessibility"] },

  { term: "Error Message Design", category: "Content & UX Writing", level: "Beginner",
    definition: "The practice of crafting error messages that clearly communicate what went wrong, why it happened, and what the user can do to fix it. A well-designed error message is specific, human-readable, and action-oriented rather than technical, vague, or blaming.",
    whyItMatters: "Error messages are the moments where users are most frustrated and most likely to abandon. A message that says 'Error 422' offers nothing. A message that says 'That email address is already registered. Try signing in instead.' turns a frustration into a solution. Error messages are a design opportunity, not an afterthought.",
    scenario: "A sign-up form displayed 'Error: Invalid request' when a user tried to register with an email that was already in use. Users had no idea what was wrong and many abandoned the form. Rewriting the message to 'This email is already registered. Would you like to sign in or reset your password?' and linking to both options reduced sign-up abandonment at that step by 35%.",
    example: "\"'Error: Invalid request' tells the user nothing. Rewrite it: what went wrong, in plain English, and what they can do about it. Every error message should end with a path forward.\"",
    related: ["UX Writing", "Plain Language", "Feedback", "Microcopy"] },

  { term: "Localisation", category: "Content & UX Writing", level: "Intermediate",
    definition: "The process of adapting a product's content, interface, and experience for different languages, cultures, and regions. Localisation goes beyond translation to include date formats, currency, cultural references, reading direction, and context-appropriate imagery and examples.",
    whyItMatters: "A product that is merely translated often feels foreign and untrustworthy to local users. Localisation builds trust by respecting cultural context. It also prevents practical failures: a date shown as 01/02/2025 means January 2nd in the US and February 1st in the UK. Getting these details wrong creates confusion at best and errors at worst.",
    scenario: "A SaaS product expanded from the UK to Germany by translating the interface into German. Adoption was lower than expected. Research revealed multiple localisation failures: dates were in UK format, prices were in pounds, and several idioms in the marketing copy did not translate meaningfully. After proper localisation, including currency, date formats, legal requirements, and culturally appropriate copy, adoption in the German market increased significantly within two quarters.",
    example: "\"Translation isn't localisation. We've translated the interface but the dates are still in US format, prices are in dollars, and the example names are all English. If we want to succeed in this market, we need to localise properly.\"",
    related: ["Content Strategy", "Plain Language", "Accessibility", "UX Writing"] },

  { term: "Content Governance", category: "Content & UX Writing", level: "Advanced",
    definition: "The system of policies, roles, and workflows that determines who can create, edit, approve, and publish content within a product or organisation. Governance answers: who owns this content, who reviews it, how often is it updated, and what happens when it becomes outdated?",
    whyItMatters: "Without governance, content quality degrades over time. Articles go stale, pages contradict each other, and no one knows who is responsible for what. Governance is not bureaucracy. It is the minimum structure needed to keep content accurate, consistent, and trustworthy at scale.",
    scenario: "A product's knowledge base had grown to 500 articles over three years with no governance model. No one owned the content. When features changed, articles were not updated. New articles were published without review, sometimes contradicting existing ones. The team implemented a simple governance model: each content area had an owner, all new articles required one review, and a quarterly audit flagged stale content. Within six months, content quality scores in user surveys improved from 3.2 to 4.1 out of 5.",
    example: "\"We need a governance model for the help centre. Right now, anyone can publish anything and no one is responsible for keeping it current. That's how we end up with 500 articles where a third are outdated.\"",
    related: ["Content Strategy", "Content Audit", "Style Guide", "Voice & Tone Guidelines"] },

  { term: "Truncation", category: "Content & UX Writing", level: "Beginner",
    definition: "The practice of cutting off text when it exceeds the available space in a user interface, typically indicated by an ellipsis (…). Truncation decisions affect readability, comprehension, and the information a user can access at a glance.",
    whyItMatters: "Poorly handled truncation hides critical information. A list of search results where every title is truncated after three words is useless. A notification that says 'Your order has been…' tells the user nothing. Good truncation preserves the most meaningful part of the text and provides a way to access the full content.",
    scenario: "A dashboard displayed project names in a sidebar with a fixed width. Long project names were truncated after fifteen characters, which often cut off the most distinguishing part of the name. 'Marketing Campaign — Q2 Launch' and 'Marketing Campaign — Q3 Rebrand' both displayed as 'Marketing Campa…' Users could not tell them apart without clicking. The team increased the sidebar width and added a tooltip on hover showing the full name. A small change that eliminated daily frustration.",
    example: "\"These card titles are being truncated at twenty characters, which cuts off the meaningful part. Either increase the space, use a smaller font, or at minimum add a tooltip so users can see the full title on hover.\"",
    related: ["Readability", "Copy Hierarchy", "Layout", "Responsive Web Design"] },

  // ── CUSTOMER EXPERIENCE (10) ──────────────────────────────────────────────
  { term: "Customer Experience", category: "Customer Experience", level: "Beginner",
    definition: "The total perception a customer has of a brand based on every interaction across every channel and touchpoint, from first discovering the brand through to ongoing support and renewal. CX encompasses UX but extends beyond the digital product to include sales, support, billing, packaging, and any other moment of contact.",
    whyItMatters: "A beautifully designed product can still deliver a poor customer experience if the support is slow, the billing is confusing, or the onboarding email contradicts the product interface. CX recognises that users do not separate 'the app' from 'the company.' It is all one experience.",
    scenario: "A SaaS product had excellent usability scores and high in-product NPS. But overall customer satisfaction was declining. A CX audit revealed that the billing experience was frustrating (no way to download invoices), support response times had doubled, and the renewal process required calling a sales representative. The product itself was not the problem. The surrounding experience was undermining the goodwill the product had built.",
    example: "\"Our product NPS is 65 but our overall customer satisfaction is 38. That gap tells me the problem isn't the product. It's the experience around it: billing, support, renewals. We need to think about CX holistically, not just UX.\"",
    related: ["Touchpoint", "Service Design", "Customer Lifecycle", "NPS"] },

  { term: "Touchpoint", category: "Customer Experience", level: "Beginner",
    definition: "Any moment where a customer interacts with or is exposed to a brand. Touchpoints include advertisements, the website, the product itself, customer support conversations, emails, invoices, social media, packaging, and any other point of contact. Each touchpoint shapes the customer's overall perception.",
    whyItMatters: "Customers do not experience a brand as a collection of departments. They experience it as a series of touchpoints, and every one either builds or erodes trust. A single bad touchpoint, a confusing invoice, an unhelpful support interaction, can undo the goodwill created by dozens of positive ones.",
    scenario: "A team mapped every touchpoint in their customer journey and discovered thirty-seven distinct interactions between a user's first visit and their third month as a paying customer. Three touchpoints, the trial expiry email, the first invoice, and the 'your plan has changed' notification, had never been reviewed by anyone on the product or design team. All three were templated system messages with no brand voice and unclear calls to action. Redesigning just those three touchpoints reduced early churn by 12%.",
    example: "\"We've optimised the product experience but we haven't touched the transactional emails, the invoicing flow, or the renewal process. Those are touchpoints too, and right now they feel like they were designed by a different company.\"",
    related: ["Customer Experience", "Customer Journey Map", "Customer Lifecycle", "Service Blueprint"] },

  { term: "Omnichannel", category: "Customer Experience", level: "Intermediate",
    definition: "An approach where a customer receives a seamless, consistent experience across all channels and devices. In an omnichannel experience, a conversation started in live chat can continue via email, information provided on the website matches what support tells you, and progress made on mobile carries over to desktop.",
    whyItMatters: "Customers move between channels constantly: browsing on mobile, purchasing on desktop, getting support via email, checking status in the app. If each channel operates independently, the customer has to start over every time they switch. Omnichannel eliminates those seams.",
    scenario: "A customer contacted support via live chat about a billing issue and was told to email the billing team. They emailed, and the billing team asked them to explain the issue from scratch. The customer then called, and the phone agent had no record of either previous interaction. Three channels, zero continuity. After implementing an omnichannel support system where all interactions were logged in a shared customer record, agents had full context regardless of channel. Resolution times improved and customer frustration dropped measurably.",
    example: "\"A customer shouldn't have to repeat themselves just because they switched from chat to email. We need an omnichannel approach where every agent sees the full history regardless of which channel the customer used.\"",
    related: ["Touchpoint", "Customer Experience", "Service Design", "Customer Lifecycle"] },

  { term: "Service Design", category: "Customer Experience", level: "Intermediate",
    definition: "The practice of designing the entire end-to-end service experience, not just the screen-level interface. Service design considers the frontstage (what the customer sees) and the backstage (the people, processes, and systems that make the experience possible), and designs both together.",
    whyItMatters: "A beautiful interface means nothing if the service behind it is broken. Service design recognises that the user's experience is shaped by everything from the API response time to the support agent's script to the way billing processes refunds. Designing only the interface is designing half the experience.",
    scenario: "A healthcare booking app had a well-designed interface for scheduling appointments. But patients frequently arrived to find their appointment was not in the clinic's system because the booking API occasionally failed silently. The interface showed a confirmation. The backstage system had not actually completed the booking. A service design review mapped the full journey from booking to arrival and identified three backstage failure points that the UI design team had never seen. Fixing the integration issues resolved the problem.",
    example: "\"The app works perfectly on screen, but the service is broken backstage. Bookings aren't syncing with the clinic system. We need to design the service end-to-end, not just the interface.\"",
    related: ["Service Blueprint", "Customer Experience", "Touchpoint", "Experience Map"] },

  { term: "Service Blueprint", category: "Customer Experience", level: "Advanced",
    definition: "A diagram that maps the complete service experience across multiple layers: customer actions (what the user does), frontstage interactions (what the user sees), backstage processes (what happens behind the scenes), and support systems (the technology and infrastructure that enables it all). Layers are separated by lines of visibility and interaction.",
    whyItMatters: "A service blueprint makes the invisible visible. Most teams only see the frontstage. The backstage, where most service failures originate, remains hidden until something breaks. Blueprints connect the customer experience to the operational reality, revealing where breakdowns are happening and why.",
    scenario: "A food delivery service had high customer satisfaction with the ordering interface but frequent complaints about delivery timing. A service blueprint revealed that the bottleneck was not the delivery drivers but the kitchen notification system: orders were batched and sent to restaurants every ten minutes instead of immediately. The delay was invisible to the product team because it was a backstage system that no interface designer had ever reviewed. Fixing the notification timing reduced average delivery time by eight minutes.",
    example: "\"Let's build a service blueprint for the returns process. I want to see every step the customer takes, every system involved backstage, and where the handoffs happen. The problem is somewhere in the backstage process and we need to make it visible.\"",
    related: ["Service Design", "Customer Journey Map", "Customer Experience", "Touchpoint"] },

  { term: "Customer Effort Score", category: "Customer Experience", level: "Intermediate",
    definition: "A metric that measures how easy it was for a customer to accomplish a specific task, such as resolving a support issue, completing a purchase, or finding information. Typically measured on a 1–7 scale from 'very difficult' to 'very easy' immediately after the interaction.",
    whyItMatters: "Research consistently shows that reducing effort is more predictive of loyalty than increasing delight. Customers do not need to be wowed. They need things to be easy. A low Customer Effort Score is a leading indicator of churn, because customers who had to work hard to get something done are less likely to return.",
    scenario: "A company's NPS was healthy, but churn was higher than expected. Adding a Customer Effort Score survey after key interactions revealed that the cancellation process scored 2.1 out of 7 (very difficult) and the plan change process scored 2.8. Users were happy with the product but furious about the billing experience. Simplifying the plan change to a self-serve flow and reducing cancellation to two clicks improved CES scores and reduced churn-related complaints by half.",
    example: "\"NPS measures whether people would recommend us. CES measures whether we're making their life easy. Right now, our CES after a support interaction is 3.2 out of 7. That's too much effort and it's driving churn.\"",
    related: ["NPS", "Customer Experience", "Touchpoint", "Usability"] },

  { term: "Moment of Truth", category: "Customer Experience", level: "Intermediate",
    definition: "A critical interaction point where a customer forms or revises their opinion about a brand. Originally coined by Jan Carlzon of SAS Airlines, the concept identifies specific moments that disproportionately influence customer perception, loyalty, and advocacy. These moments can be positive (exceeding expectations) or negative (breaking trust).",
    whyItMatters: "Not all interactions are equal. Some moments carry outsized influence on how a customer feels about the entire experience. Identifying and investing in these moments, especially the ones where things can go wrong, has a greater impact than incremental improvements spread evenly across the journey.",
    scenario: "A subscription service discovered through customer interviews that two moments disproportionately shaped customer perception: the first successful use of the product (positive moment of truth) and the first time something went wrong and they needed support (negative moment of truth). The team invested heavily in the first-run experience and built a dedicated fast-response support flow for new customers in their first thirty days. Both NPS and retention improved, with the improvements concentrated in the first-month cohort.",
    example: "\"The moment of truth for our product is the first time a user shares a report with their team and gets a response. That's when they realise the product is valuable. We need to make that moment happen as quickly and smoothly as possible.\"",
    related: ["Customer Experience", "Touchpoint", "Customer Lifecycle", "Time to Value"] },

  { term: "Customer Lifecycle", category: "Customer Experience", level: "Beginner",
    definition: "The stages a customer moves through in their relationship with a brand, from initial awareness through to advocacy. Common stages include: Awareness (they learn you exist), Consideration (they evaluate you), Purchase (they buy), Retention (they stay), and Advocacy (they recommend you to others).",
    whyItMatters: "Different stages require different strategies. A customer in the awareness stage needs education. A customer in the retention stage needs value reinforcement. Treating all customers the same, regardless of lifecycle stage, leads to irrelevant messaging and missed opportunities to strengthen the relationship at each phase.",
    scenario: "A product team sent the same monthly newsletter to all users regardless of lifecycle stage. New users received feature announcements for advanced features they had not yet explored. Long-time power users received beginner tips they had outgrown. Segmenting email communication by lifecycle stage, onboarding tips for new users, feature deep-dives for active users, and re-engagement offers for lapsed users, improved email engagement rates across all segments and reduced unsubscribes.",
    example: "\"We're sending the same onboarding emails to a user who signed up yesterday and one who's been with us for two years. We need to map our communication to the customer lifecycle. Different stages need different messages.\"",
    related: ["Marketing Funnel", "Customer Experience", "Segmentation", "Retention"] },

  { term: "Feedback Loop", category: "Customer Experience", level: "Beginner",
    definition: "A system for collecting user feedback, analysing it, acting on it, and communicating back to users what was changed. A complete feedback loop closes the circle: users give input, the team responds, and users see that their input mattered.",
    whyItMatters: "Collecting feedback without acting on it is worse than not collecting it at all, because it sets an expectation that is then broken. A closed feedback loop builds trust and improves the product simultaneously. Users who see their feedback reflected in the product become advocates.",
    scenario: "A product team added an in-app feedback widget and received hundreds of submissions per month. For six months, feedback went into a spreadsheet that no one reviewed regularly. Users who submitted feedback never heard back and stopped submitting. The team implemented a process: feedback was triaged weekly, the top themes were added to the product backlog, and a monthly changelog explicitly credited user feedback for shipped improvements. Feedback submissions tripled and the quality of submissions improved because users saw that it mattered.",
    example: "\"We're collecting feedback but we're not closing the loop. Users don't know if anyone reads their submissions. Let's add a 'You asked, we built' section to the changelog so people can see their feedback in action.\"",
    related: ["NPS", "Voice of Customer", "Customer Experience", "Retention"] },

  { term: "Experience Map", category: "Customer Experience", level: "Intermediate",
    definition: "A visual representation of the entire experience a person has when trying to accomplish a goal, regardless of whether they interact with your specific product or brand. Unlike a customer journey map, which is specific to one company's touchpoints, an experience map captures the full picture including competitors, offline activities, and workarounds.",
    whyItMatters: "An experience map reveals opportunities that a product-focused journey map cannot. It shows what users do before they find you, what alternatives they use, and where the overall experience breaks down. This broader view uncovers product opportunities in the gaps between existing solutions.",
    scenario: "A team building a meal planning app created a customer journey map of their own product and found no major usability issues. An experience map of the entire 'planning weekly meals' experience revealed that users spent significant time browsing recipes on multiple sites, checking what they already had in their kitchen, and reconciling grocery lists across different stores. The biggest pain point was not in the meal planning tool itself but in the transition between planning and shopping. The team built a grocery list integration that addressed the gap no competitor had solved.",
    example: "\"The journey map shows our product works fine. But the experience map shows the real pain is in the handoff between planning meals and buying groceries. That's where we should focus next, even though it's outside our current product scope.\"",
    related: ["Customer Journey Map", "Service Design", "Customer Experience", "Pain point"] },
];

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  // ── Product Design ────────────────────────────────────────────────────────
  { id: "research",             name: "Research",             domain: "Product Design", count: 46, color: "#E8F4F8", accent: "#0EA5E9", icon: "🔍", description: "User interviews, affinity maps, personas, journey maps" },
  { id: "design-methodologies", name: "Design Methodologies", domain: "Product Design", count: 20, color: "#F0FDF4", accent: "#22C55E", icon: "⚙️", description: "Cognitive load, Fitts' Law, mental models, affordance" },
  { id: "element",              name: "UI Elements",          domain: "Product Design", count: 42, color: "#FFF7ED", accent: "#F97316", icon: "🧩", description: "Buttons, menus, modals, tooltips, navigation patterns" },
  { id: "colours",              name: "Colours",              domain: "Product Design", count: 28, color: "#FDF4FF", accent: "#A855F7", icon: "🎨", description: "Colour theory, palettes, contrast, CMYK, RGB" },
  { id: "typography",           name: "Typography",           domain: "Product Design", count: 21, color: "#FFF1F2", accent: "#F43F5E", icon: "Aa", description: "Serifs, x-height, baseline, line height, typefaces" },
  { id: "design-system",        name: "Design System",        domain: "Product Design", count: 9,  color: "#F8FAFC", accent: "#64748B", icon: "📐", description: "Tokens, components, style guides, pattern libraries" },
  { id: "ideation",             name: "Ideation",             domain: "Product Design", count: 13, color: "#ECFDF5", accent: "#10B981", icon: "💡", description: "Wireframes, low-fi, high-fi, information architecture" },
  { id: "discovery",            name: "Discovery",            domain: "Product Design", count: 6,  color: "#EFF6FF", accent: "#3B82F6", icon: "🧭", description: "Design briefs, requirements, assumptions, hypotheses" },
  { id: "alignment",            name: "Alignment",            domain: "Product Design", count: 12, color: "#FEF9C3", accent: "#CA8A04", icon: "⊞",  description: "Grids, golden ratio, gutters, 8-point grid, breakpoints" },
  { id: "copy",                 name: "Copy",                 domain: "Product Design", count: 5,  color: "#F0FDF4", accent: "#16A34A", icon: "✍️", description: "Microcopy, CTAs, body copy, hierarchy" },
  { id: "accessibility",        name: "Accessibility",        domain: "Product Design", count: 5,  color: "#EEF2FF", accent: "#6366F1", icon: "♿", description: "WCAG, usability, thumb reachability, scalability" },
  { id: "prototyping",          name: "Prototyping",          domain: "Product Design", count: 3,  color: "#F0F9FF", accent: "#0284C7", icon: "🖱️", description: "Interactions, micro-interactions, design specs" },
  // ── Engineering ───────────────────────────────────────────────────────────
  { id: "development",          name: "Development",          domain: "Engineering",    count: 26, color: "#F0F9FF", accent: "#06B6D4", icon: "💻", description: "MVP, APIs, QA, deployment, responsive design" },
  { id: "methodologies",        name: "Methodologies",        domain: "Engineering",    count: 7,  color: "#FFF7ED", accent: "#EA580C", icon: "🔄", description: "Design thinking, Agile, Lean, Waterfall, Double Diamond" },
  // ── Business ──────────────────────────────────────────────────────────────
  { id: "business",             name: "Business",             domain: "Business",       count: 18, color: "#FFF5F5", accent: "#EF4444", icon: "📈", description: "Stakeholders, KPIs, NPS, B2B, voice of customer" },
  { id: "testing",              name: "Testing",              domain: "Business",       count: 15, color: "#FFFBEB", accent: "#EAB308", icon: "📊", description: "A/B testing, heatmaps, conversion rate, analytics" },
  { id: "positions",            name: "Positions",            domain: "Business",       count: 9,  color: "#FDF2F8", accent: "#EC4899", icon: "👤", description: "PM, UX designer, UI designer, researcher, dev roles" },
  // ── Marketing ─────────────────────────────────────────────────────────────
  { id: "brand",                name: "Brand",                domain: "Marketing",      count: 14, color: "#F5F3FF", accent: "#8B5CF6", icon: "✦",  description: "Tone of voice, brand identity, design debt, social proof" },
  { id: "marketing",            name: "Marketing",            domain: "Marketing",      count: 10, color: "#FFFBEB", accent: "#F59E0B", icon: "📣", description: "Funnels, CAC, LTV, SEO, content strategy, segmentation" },
  { id: "content-ux-writing",   name: "Content & UX Writing",  domain: "Marketing",      count: 10, color: "#FEF3C7", accent: "#D97706", icon: "✏️", description: "UX writing, plain language, content strategy, localisation" },
  // ── Strategy ─────────────────────────────────────────────────────────────
  { id: "product-strategy",     name: "Product Strategy",      domain: "Strategy",       count: 10, color: "#EFF6FF", accent: "#2563EB", icon: "🎯", description: "Product-market fit, OKRs, roadmaps, prioritisation, JTBD" },
  { id: "data-metrics",         name: "Data & Metrics",        domain: "Strategy",       count: 10, color: "#F0FDFA", accent: "#0D9488", icon: "📉", description: "Cohort analysis, attribution, churn, activation, benchmarking" },
  { id: "growth",               name: "Growth",                domain: "Strategy",       count: 10, color: "#ECFDF5", accent: "#059669", icon: "🌱", description: "Growth loops, activation, onboarding, retention, virality" },
  // ── Operations ───────────────────────────────────────────────────────────
  { id: "finance-pricing",      name: "Finance & Pricing",     domain: "Operations",     count: 10, color: "#FFF1F2", accent: "#E11D48", icon: "💰", description: "Revenue models, SaaS, ARR, unit economics, pricing tiers" },
  { id: "collaboration",        name: "Collaboration",         domain: "Operations",     count: 10, color: "#F5F3FF", accent: "#7C3AED", icon: "🤝", description: "Stand-ups, retros, RACI, workshops, async communication" },
  // ── Customer Experience ──────────────────────────────────────────────────
  { id: "customer-experience",  name: "Customer Experience",   domain: "Customer Experience", count: 10, color: "#FDF2F8", accent: "#DB2777", icon: "💎", description: "Touchpoints, service design, CES, omnichannel, CX strategy" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.name, c]));

const DOMAINS = [
  { id: "All",                 name: "All" },
  { id: "Product Design",     name: "Product Design" },
  { id: "Engineering",        name: "Engineering" },
  { id: "Business",           name: "Business" },
  { id: "Marketing",          name: "Marketing" },
  { id: "Strategy",           name: "Strategy" },
  { id: "Operations",         name: "Operations" },
  { id: "Customer Experience", name: "Customer Experience" },
];

const LEVEL_COLORS = {
  Beginner:     { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0" },
  Intermediate: { bg: "#FFF7ED", text: "#EA580C", border: "#FED7AA" },
  Advanced:     { bg: "#FDF4FF", text: "#9333EA", border: "#E9D5FF" },
};

const STATS = [
  { value: "100+", label: "Written terms" },
  { value: "19",   label: "Categories" },
  { value: "4",    label: "Domains" },
];

const FEATURED_TERMS = ["Cognitive Load","Affinity Map","Design Token","Tone of Voice","MVP","Heuristic Evaluation"];
const FEATURED_WORDS = ALL_WORDS.filter(w => FEATURED_TERMS.includes(w.term));

// ─── BADGE ───────────────────────────────────────────────────────────────────

function Badge({ level }) {
  const c = LEVEL_COLORS[level] || LEVEL_COLORS.Beginner;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", padding:"3px 11px", borderRadius:999, fontSize:11, fontWeight:600, letterSpacing:"0.04em", backgroundColor:c.bg, color:c.text, border:`1px solid ${c.border}` }}>
      {level}
    </span>
  );
}

// ─── SEARCH ──────────────────────────────────────────────────────────────────

function SearchBar({ value, onChange }) {
  return (
    <div style={{ position:"relative", width:"100%", maxWidth:520 }}>
      <svg style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", opacity:0.35, pointerEvents:"none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder="Search any term — MVP, affinity map, design token…"
        style={{ width:"100%", padding:"14px 16px 14px 44px", fontSize:15, fontFamily:"inherit", border:"1.5px solid #E2E8F0", borderRadius:12, outline:"none", background:"#FAFAFA", color:"#1A1A2E", transition:"border-color 0.15s, box-shadow 0.15s", boxSizing:"border-box" }}
        onFocus={e=>{ e.target.style.borderColor="#1A1A2E"; e.target.style.background="#fff"; e.target.style.boxShadow="0 0 0 4px rgba(26,26,46,0.06)"; }}
        onBlur={e=>{  e.target.style.borderColor="#E2E8F0"; e.target.style.background="#FAFAFA"; e.target.style.boxShadow="none"; }}
      />
    </div>
  );
}

// ─── TICKER ──────────────────────────────────────────────────────────────────

function Ticker() {
  const words = ["Affinity map","Design token","Cognitive load","MVP","WCAG","Persona","Pain point","Heuristics","A/B testing","Design sprint","User flow","Prototype","KPI","NPS","Design debt","Affordance","Gestalt","Breakpoints","Tone of voice","Component library"];
  return (
    <div style={{ overflow:"hidden", borderTop:"1px solid #E2E8F0", borderBottom:"1px solid #E2E8F0", padding:"12px 0", background:"#FAFAFA" }}>
      <div style={{ display:"flex", gap:40, whiteSpace:"nowrap", animation:"ticker 32s linear infinite" }}>
        {[...words,...words].map((w,i)=>(
          <span key={i} style={{ fontSize:13, color:"#94A3B8", fontWeight:400 }}>
            {w} <span style={{ color:"#CBD5E1", margin:"0 8px" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── GRID CARD ───────────────────────────────────────────────────────────────

function GridCard({ word, onOpen }) {
  const [hov, setHov] = useState(false);
  const cat = CAT_MAP[word.category] || { accent:"#1A1A2E", color:"#F8FAFC" };
  return (
    <div onClick={onOpen} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:"#fff", border:`1.5px solid ${hov?cat.accent:"#E2E8F0"}`, borderRadius:16, padding:28, cursor:"pointer", transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)", transform:hov?"translateY(-3px)":"none", boxShadow:hov?`0 12px 32px rgba(0,0,0,0.09)`:"0 1px 4px rgba(0,0,0,0.04)", display:"flex", flexDirection:"column", justifyContent:"space-between", height:210 }}>
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:cat.accent }}>{word.category}</span>
          <Badge level={word.level}/>
        </div>
        <div style={{ fontSize:26, fontWeight:700, color:"#1A1A2E", letterSpacing:"-0.03em", lineHeight:1.15, fontFamily:"'DM Serif Display', Georgia, serif" }}>{word.term}</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ display:"flex", alignItems:"center", gap:6, color:"#94A3B8", fontSize:12 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          Tap to learn
        </span>
        <div style={{ width:32, height:32, borderRadius:8, background:hov?cat.accent:"#F1F5F9", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={hov?"#fff":"#94A3B8"} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </div>
  );
}

// ─── CATEGORY CARD ───────────────────────────────────────────────────────────

function CategoryCard({ cat, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:hov?"#fff":"#FAFAFA", border:`1.5px solid ${hov?cat.accent:"#E2E8F0"}`, borderRadius:14, padding:"20px 22px", cursor:"pointer", transition:"all 0.18s cubic-bezier(0.4,0,0.2,1)", transform:hov?"translateY(-2px)":"none", boxShadow:hov?"0 8px 24px rgba(0,0,0,0.08)":"none" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <span style={{ fontSize:22, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", background:cat.color, borderRadius:10 }}>{cat.icon}</span>
        <span style={{ fontSize:12, fontWeight:600, color:hov?cat.accent:"#94A3B8", background:hov?cat.color:"transparent", padding:"3px 9px", borderRadius:99, transition:"all 0.18s" }}>{cat.count} terms</span>
      </div>
      <div style={{ fontWeight:600, fontSize:14, color:"#1A1A2E", marginBottom:4, letterSpacing:"-0.01em" }}>{cat.name}</div>
      <div style={{ fontSize:12, color:"#64748B", lineHeight:1.5 }}>{cat.description}</div>
    </div>
  );
}

// ─── CHEVRON BTN ─────────────────────────────────────────────────────────────

function ChevronBtn({ direction, disabled, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ position:"fixed", [direction==="left"?"left":"right"]:20, top:"50%", transform:`translateY(-50%) scale(${hov&&!disabled?1.08:1})`, width:52, height:52, borderRadius:"50%", background:disabled?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.97)", border:"none", cursor:disabled?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:disabled?"none":"0 4px 24px rgba(0,0,0,0.22)", transition:"all 0.15s", opacity:disabled?0.3:1, zIndex:1010 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={disabled?"#94A3B8":"#1A1A2E"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {direction==="left"?<path d="M15 18l-6-6 6-6"/>:<path d="M9 18l6-6-6-6"/>}
      </svg>
    </button>
  );
}

// ─── RELATED CHIP ────────────────────────────────────────────────────────────

function RelatedChip({ label, linked, color, accent, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "6px 14px", borderRadius: 8,
        background: hov && linked ? accent : color,
        color: hov && linked ? "#fff" : accent,
        fontSize: 13, fontWeight: 600,
        border: `1px solid ${accent}${linked ? "40" : "20"}`,
        cursor: linked ? "pointer" : "default",
        transition: "all 0.15s",
        opacity: linked ? 1 : 0.55,
      }}
    >
      {label}
      {linked && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke={hov ? "#fff" : accent} strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      )}
    </span>
  );
}

// ─── FLASHCARD MODAL ─────────────────────────────────────────────────────────

function FlashcardModal({ words, activeIndex, onClose, onPrev, onNext, onOpenRelated }) {
  const word = words[activeIndex];
  const cat = CAT_MAP[word.category] || { accent:"#1A1A2E", color:"#F8FAFC", icon:"📖" };
  const total = words.length;
  const isMobile = useWindowSize() < 768;
  const [scenarioOpen, setScenarioOpen] = useState(false);
  const [conversationOpen, setConversationOpen] = useState(false);

  useEffect(()=>{ setScenarioOpen(false); setConversationOpen(false); }, [activeIndex]);

  useEffect(()=>{
    const h = e => { if(e.key==="Escape") onClose(); if(e.key==="ArrowLeft") onPrev(); if(e.key==="ArrowRight") onNext(); };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  },[onClose,onPrev,onNext]);

  useEffect(()=>{ document.body.style.overflow="hidden"; return ()=>{ document.body.style.overflow=""; }; },[]);

  // Touch swipe for mobile
  const touchStartX = useRef(null);
  const handleTouchStart = e => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = e => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { if (dx < 0) onNext(); else onPrev(); }
    touchStartX.current = null;
  };

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(10,15,30,0.72)", backdropFilter:"blur(8px)", animation:"overlayIn 0.2s ease forwards" }}/>
      {!isMobile && <ChevronBtn direction="left"  disabled={activeIndex===0}         onClick={onPrev}/>}
      {!isMobile && <ChevronBtn direction="right" disabled={activeIndex===total-1}   onClick={onNext}/>}
      <div style={{ position:"fixed", zIndex:1005, background:"#fff",
        ...(isMobile ? {
          left:0, right:0, bottom:0, top:"auto",
          borderRadius:"20px 20px 0 0",
          maxHeight:"92vh",
          transform:"none",
          width:"100%",
          animation:"sheetUp 0.32s cubic-bezier(0.32,0.72,0,1)",
        } : {
          top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          width:"min(680px, calc(100vw - 144px))",
          height:"80vh",
          borderRadius:24,
          animation:"cardIn 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        }),display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,0.35)" }}
        onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {isMobile && <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 4px" }}><div style={{ width:36, height:4, borderRadius:99, background:"#E2E8F0" }}/></div>}
        {/* Header */}
        <div style={{ padding:isMobile?"16px 20px 16px":"24px 28px 20px", borderBottom:"1px solid #F1F5F9", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:3, background:"#F1F5F9", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:99, background:cat.accent, width:`${((activeIndex+1)/total)*100}%`, transition:"width 0.3s ease" }}/>
            </div>
            <span style={{ fontSize:12, fontWeight:600, color:"#94A3B8", whiteSpace:"nowrap" }}>{activeIndex+1} / {total}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:18, width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", background:cat.color, borderRadius:8 }}>{cat.icon}</span>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.07em", textTransform:"uppercase", color:cat.accent }}>{word.category}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Badge level={word.level}/>
              <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:"#F8FAFC", border:"1px solid #E2E8F0", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
          <h2 style={{ fontSize:"clamp(26px, 4vw, 38px)", fontWeight:700, letterSpacing:"-0.04em", lineHeight:1.1, color:"#1A1A2E", fontFamily:"'DM Serif Display', Georgia, serif", margin:0 }}>{word.term}</h2>
        </div>
        {/* Scrollable body */}
        <div style={{ flex:1, overflowY:"auto", padding:isMobile?"20px 20px 24px":"28px 28px 24px" }}>
          <section style={{ marginBottom:26 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#94A3B8", marginBottom:10 }}>What it means</p>
            <p style={{ fontSize:17, color:"#1A1A2E", lineHeight:1.72, margin:0 }}>{word.definition}</p>
          </section>
          <div style={{ height:1, background:"#F1F5F9", marginBottom:26 }}/>
          <section style={{ marginBottom:26 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#94A3B8", marginBottom:10 }}>Why it matters</p>
            <p style={{ fontSize:15, color:"#475569", lineHeight:1.72, margin:0 }}>{word.whyItMatters}</p>
          </section>
          <div style={{ height:1, background:"#F1F5F9", marginBottom:16 }}/>
          <section style={{ marginBottom:16 }}>
            <button onClick={()=>setScenarioOpen(o=>!o)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", background:"none", border:"none", padding:"10px 0", cursor:"pointer" }}>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#94A3B8" }}>Example</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition:"transform 0.2s", transform:scenarioOpen?"rotate(180deg)":"rotate(0deg)", flexShrink:0 }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            <div style={{ overflow:"hidden", maxHeight:scenarioOpen?"600px":"0", transition:"max-height 0.3s cubic-bezier(0.4,0,0.2,1)", opacity:scenarioOpen?1:0, transition:"max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease" }}>
              <p style={{ fontSize:15, color:"#475569", lineHeight:1.72, margin:"0 0 10px" }}>{word.scenario}</p>
            </div>
          </section>
          <div style={{ height:1, background:"#F1F5F9", marginBottom:16 }}/>
          <section style={{ marginBottom:26 }}>
            <button onClick={()=>setConversationOpen(o=>!o)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", background:"none", border:"none", padding:"10px 0", cursor:"pointer" }}>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#94A3B8" }}>In a real conversation</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition:"transform 0.2s", transform:conversationOpen?"rotate(180deg)":"rotate(0deg)", flexShrink:0 }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            <div style={{ overflow:"hidden", maxHeight:conversationOpen?"600px":"0", transition:"max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease", opacity:conversationOpen?1:0 }}>
              <div style={{ background:"#1A1A2E", borderRadius:14, padding:"20px 22px", borderLeft:`4px solid ${cat.accent}`, marginBottom:10 }}>
                <p style={{ fontSize:15, color:"#E2E8F0", lineHeight:1.65, margin:0, fontStyle:"italic" }}>{word.example}</p>
              </div>
            </div>
          </section>
          {word.related && (
            <section>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#94A3B8", marginBottom:12 }}>Related terms</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {word.related.map(r => {
                  const linked = ALL_WORDS.find(w => w.term.toLowerCase() === r.toLowerCase());
                  return (
                    <RelatedChip
                      key={r}
                      label={r}
                      linked={!!linked}
                      color={cat.color}
                      accent={cat.accent}
                      onClick={linked ? () => onOpenRelated(linked) : undefined}
                    />
                  );
                })}
              </div>
            </section>
          )}
        </div>
        {/* Footer */}
        <div style={{ padding:"14px 28px", borderTop:"1px solid #F1F5F9", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, background:"#FAFAFA" }}>
          <button onClick={onPrev} disabled={activeIndex===0} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"1.5px solid #E2E8F0", borderRadius:8, padding:"8px 16px", fontSize:13, fontWeight:600, color:activeIndex===0?"#CBD5E1":"#475569", cursor:activeIndex===0?"not-allowed":"pointer" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>Previous
          </button>
          <span style={{ fontSize:12, color:"#94A3B8", fontWeight:500 }}>{isMobile ? "swipe or tap buttons" : "← → to navigate"}</span>
          <button onClick={onNext} disabled={activeIndex===total-1} style={{ display:"flex", alignItems:"center", gap:6, background:activeIndex===total-1?"#F8FAFC":"#1A1A2E", border:"none", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:600, color:activeIndex===total-1?"#CBD5E1":"#fff", cursor:activeIndex===total-1?"not-allowed":"pointer" }}>
            Next<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </>
  );
}

// ─── CATEGORY DRAWER ─────────────────────────────────────────────────────────

function DrawerWordRow({ word, cat, onOpen }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onOpen} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 18px", borderRadius:12, border:`1.5px solid ${hov?cat.accent:"#F1F5F9"}`, background:hov?cat.color:"#FAFAFA", cursor:"pointer", transition:"all 0.15s", gap:12 }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:700, fontSize:15, color:"#1A1A2E", letterSpacing:"-0.01em", fontFamily:"'DM Serif Display', serif", marginBottom:4 }}>{word.term}</div>
        <p style={{ fontSize:13, color:"#64748B", margin:0, lineHeight:1.45, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{word.definition}</p>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        <Badge level={word.level}/>
        <div style={{ width:30, height:30, borderRadius:8, background:hov?cat.accent:"#F1F5F9", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={hov?"#fff":"#94A3B8"} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </div>
  );
}

function CategoryDrawer({ cat, onClose, onOpenCard }) {
  const words = ALL_WORDS.filter(w => w.category === cat.name);
  const isMobile = useWindowSize() < 768;

  useEffect(()=>{
    const h = e => { if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown",h);
    document.body.style.overflow="hidden";
    return ()=>{ window.removeEventListener("keydown",h); document.body.style.overflow=""; };
  },[onClose]);

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:900, background:"rgba(10,15,30,0.55)", backdropFilter:"blur(6px)", animation:"overlayIn 0.2s ease forwards" }}/>
      <div style={{ position:"fixed", background:"#fff", zIndex:910, display:"flex", flexDirection:"column",
        ...(isMobile ? {
          left:0, right:0, bottom:0, top:"auto",
          borderRadius:"20px 20px 0 0",
          maxHeight:"88vh",
          boxShadow:"0 -16px 60px rgba(0,0,0,0.18)",
          animation:"sheetUp 0.32s cubic-bezier(0.32,0.72,0,1)",
        } : {
          top:0, right:0, bottom:0,
          width:"min(560px, 92vw)",
          boxShadow:"-24px 0 80px rgba(0,0,0,0.18",
          animation:"drawerIn 0.3s cubic-bezier(0.32,0.72,0,1)",
        }),}}>
        {isMobile && <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 4px" }}><div style={{ width:36, height:4, borderRadius:99, background:"#E2E8F0" }}/></div>}
        <div style={{ padding:"28px 28px 24px", borderBottom:"1px solid #F1F5F9", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:24, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", background:cat.color, borderRadius:12 }}>{cat.icon}</span>
              <div>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:cat.accent, margin:0, marginBottom:2 }}>{words.length} terms</p>
                <h3 style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.03em", fontFamily:"'DM Serif Display', serif", color:"#1A1A2E", margin:0 }}>{cat.name}</h3>
              </div>
            </div>
            <button onClick={onClose} style={{ width:36, height:36, borderRadius:10, background:"#F8FAFC", border:"1px solid #E2E8F0", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <p style={{ fontSize:14, color:"#64748B", margin:0, lineHeight:1.55 }}>{cat.description}</p>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 28px 32px" }}>
          {words.length===0 ? (
            <div style={{ textAlign:"center", padding:"60px 0", color:"#94A3B8" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>📭</div>
              <p style={{ fontSize:15, fontWeight:500 }}>More terms coming soon</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {words.map((word,i)=>(
                <DrawerWordRow key={word.term} word={word} cat={cat} onOpen={()=>onOpenCard(words,i)}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

// ─── SITE NAV ─────────────────────────────────────────────────────────────────

function SiteNav() {
  const isMobile = useWindowSize() < 768;
  const [menuOpen, setMenuOpen] = useState(false);
  const NAV_LINKS = [['Categories','#categories'],['Flashcards','#flashcards'],['About','#about']];
  return (
    <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(12px)', borderBottom:'1px solid #F1F5F9', padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:28, height:28, background:'#1A1A2E', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ color:'#fff', fontSize:14, fontWeight:700, fontFamily:'serif' }}>W</span>
        </div>
        <span style={{ fontWeight:700, fontSize:15, letterSpacing:'-0.02em' }}>Workplace Vocab</span>
      </div>
      {isMobile ? (
        <>
          <button onClick={()=>setMenuOpen(o=>!o)} aria-label='Toggle menu' style={{ background:'none', border:'none', cursor:'pointer', padding:8, display:'flex', flexDirection:'column', gap:5, alignItems:'center', justifyContent:'center' }}>
            <span style={{ display:'block', width:22, height:2, background:'#1A1A2E', borderRadius:99, transition:'all 0.2s', transform:menuOpen?'rotate(45deg) translate(4px,4px)':'none' }}/>
            <span style={{ display:'block', width:22, height:2, background:'#1A1A2E', borderRadius:99, transition:'all 0.2s', opacity:menuOpen?0:1 }}/>
            <span style={{ display:'block', width:22, height:2, background:'#1A1A2E', borderRadius:99, transition:'all 0.2s', transform:menuOpen?'rotate(-45deg) translate(4px,-4px)':'none' }}/>
          </button>
          {menuOpen && (
            <div style={{ position:'fixed', top:60, left:0, right:0, background:'#fff', borderBottom:'1px solid #F1F5F9', padding:'12px 24px 20px', zIndex:99, display:'flex', flexDirection:'column', gap:4, boxShadow:'0 8px 32px rgba(0,0,0,0.08)' }}>
              {NAV_LINKS.map(([label,href])=>(
                <a key={label} href={href} onClick={()=>setMenuOpen(false)} style={{ padding:'12px 8px', fontSize:15, fontWeight:600, color:'#1A1A2E', textDecoration:'none', borderBottom:'1px solid #F8FAFC', display:'block' }}>{label}</a>
              ))}
              <button style={{ background:'#1A1A2E', color:'#fff', border:'none', borderRadius:8, padding:'12px 16px', fontSize:14, fontWeight:600, cursor:'pointer', marginTop:8 }}>Start learning</button>
            </div>
          )}
        </>
      ) : (
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          {NAV_LINKS.map(([item,href])=>(
            <a key={item} href={href} style={{ padding:'6px 12px', borderRadius:8, fontSize:14, fontWeight:500, color:'#64748B', textDecoration:'none', transition:'all 0.15s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#F8FAFC';e.currentTarget.style.color='#1A1A2E';}}
              onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='#64748B';}}
            >{item}</a>
          ))}
          <button style={{ background:'#1A1A2E', color:'#fff', border:'none', borderRadius:8, padding:'7px 16px', fontSize:14, fontWeight:600, cursor:'pointer', marginLeft:8 }}>Start learning</button>
        </div>
      )}
    </nav>
  );
}


export default function App() {
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeDomain, setActiveDomain] = useState("All");
  const [modalWords, setModalWords]     = useState(null);
  const [modalIndex, setModalIndex]     = useState(null);
  const [drawerCat, setDrawerCat]       = useState(null);

  const levels = ["All","Beginner","Intermediate","Advanced"];
  const filteredCats = CATEGORIES
    .filter(c => activeDomain === "All" || c.domain === activeDomain)
    .filter(c => !search.trim() ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()));

  const filteredFeatured = activeFilter==="All" ? FEATURED_WORDS : FEATURED_WORDS.filter(w=>w.level===activeFilter);

  const openModal    = useCallback((words,i)=>{ setModalWords(words); setModalIndex(i); },[]);
  const closeModal   = useCallback(()=>{ setModalWords(null); setModalIndex(null); },[]);
  const prevCard     = useCallback(()=>setModalIndex(i=>Math.max(0,i-1)),[]);
  const nextCard     = useCallback(()=>setModalIndex(i=>Math.min((modalWords?.length??1)-1,i+1)),[modalWords]);
  // Open a related term: find it in ALL_WORDS, navigate the modal to just that card
  const openRelated  = useCallback((relatedWord)=>{
    setModalWords([relatedWord]);
    setModalIndex(0);
  },[]);
  const openDrawer = useCallback(cat=>setDrawerCat(cat),[]);
  const closeDrawer= useCallback(()=>setDrawerCat(null),[]);

  return (
    <div style={{ fontFamily:"'DM Sans', -apple-system, sans-serif", background:"#fff", color:"#1A1A2E", minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing:border-box; margin:0; }
        @keyframes ticker    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        @keyframes sheetUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes cardIn    { from{opacity:0;transform:translate(-50%,-50%) scale(0.93)} to{opacity:1;transform:translate(-50%,-50%) scale(1)} }
        @keyframes drawerIn  { from{transform:translateX(100%)} to{transform:translateX(0)} }
        .fade-up { animation:fadeUp 0.5s ease forwards; opacity:0; }
        ::placeholder { color:#94A3B8; }
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#E2E8F0;border-radius:99px}
      `}</style>

      {/* NAV */}
      <SiteNav />

      {/* HERO */}
      <section id="hero" style={{ maxWidth:900, margin:"0 auto", padding:"clamp(40px,8vw,80px) 24px clamp(32px,6vw,64px)", textAlign:"center" }}>
        <div className="fade-up" style={{ animationDelay:"0ms" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:99, padding:"5px 14px", marginBottom:28, fontSize:12, fontWeight:600, color:"#16A34A", letterSpacing:"0.04em" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#22C55E", display:"inline-block" }}/>
            100+ terms across 4 domains — V2 live
          </div>
        </div>
        <h1 className="fade-up" style={{ animationDelay:"80ms", fontSize:"clamp(40px, 7vw, 72px)", fontWeight:700, letterSpacing:"-0.04em", lineHeight:1.05, fontFamily:"'DM Serif Display', Georgia, serif", color:"#1A1A2E", marginBottom:24 }}>
          The vocabulary that<br/><span style={{ fontStyle:"italic", color:"#64748B" }}>unlocks leadership.</span>
        </h1>
        <p className="fade-up" style={{ animationDelay:"160ms", fontSize:18, color:"#475569", lineHeight:1.65, maxWidth:540, margin:"0 auto 40px", fontWeight:400 }}>
          As you grow in your career, you learn the language of your field. This platform makes that process faster — one term at a time.
        </p>
        <div className="fade-up" style={{ animationDelay:"240ms", display:"flex", justifyContent:"center" }}>
          <SearchBar value={search} onChange={setSearch}/>
        </div>
        <div className="fade-up" style={{ animationDelay:"320ms", display:"flex", justifyContent:"center", gap:48, marginTop:48 }}>
          {STATS.map(stat=>(
            <div key={stat.label} style={{ textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:700, letterSpacing:"-0.03em", fontFamily:"'DM Serif Display', serif" }}>{stat.value}</div>
              <div style={{ fontSize:12, color:"#94A3B8", fontWeight:500, marginTop:2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <Ticker/>

      {/* CATEGORIES */}
      <section id="categories" style={{ maxWidth:1200, margin:"0 auto", padding:"clamp(40px,7vw,72px) 24px 0" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:24, flexWrap:"wrap", gap:16 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#94A3B8", marginBottom:8 }}>Browse by category</p>
            <h2 style={{ fontSize:30, fontWeight:700, letterSpacing:"-0.03em", fontFamily:"'DM Serif Display', serif" }}>
              {search ? `${filteredCats.length} categories found` : activeDomain !== "All" ? activeDomain : "Every area of practice"}
            </h2>
          </div>
          <div style={{ display:"flex", gap:6, background:"#F8FAFC", padding:4, borderRadius:10, border:"1px solid #E2E8F0", flexWrap:"wrap" }}>
            {DOMAINS.map(d=>(
              <button key={d.id} onClick={()=>setActiveDomain(d.id)}
                style={{ background:activeDomain===d.id?"#1A1A2E":"none", color:activeDomain===d.id?"#fff":"#64748B", border:"none", borderRadius:7, padding:"6px 14px", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap" }}>
                {d.name}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(min(220px, 100%), 1fr))", gap:14 }}>
          {filteredCats.map(cat=><CategoryCard key={cat.id} cat={cat} onClick={()=>openDrawer(cat)}/>)}
        </div>
        {search && filteredCats.length===0 && (
          <div style={{ textAlign:"center", padding:"60px 24px", color:"#94A3B8" }}>
            <div style={{ fontSize:32, marginBottom:12 }}>🔍</div>
            <p style={{ fontSize:16, fontWeight:500 }}>No categories match "{search}"</p>
          </div>
        )}
      </section>

      {/* FEATURED FLASHCARDS */}
      <section id="flashcards" style={{ maxWidth:1200, margin:"0 auto", padding:"clamp(40px,7vw,80px) 24px 0" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:16 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#94A3B8", marginBottom:8 }}>Featured terms</p>
            <h2 style={{ fontSize:30, fontWeight:700, letterSpacing:"-0.03em", fontFamily:"'DM Serif Display', serif" }}>Start with these</h2>
          </div>
          <div style={{ display:"flex", gap:6, background:"#F8FAFC", padding:4, borderRadius:10, border:"1px solid #E2E8F0" }}>
            {levels.map(level=>(
              <button key={level} onClick={()=>setActiveFilter(level)} style={{ background:activeFilter===level?"#1A1A2E":"none", color:activeFilter===level?"#fff":"#64748B", border:"none", borderRadius:7, padding:"6px 14px", fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.15s" }}>{level}</button>
            ))}
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap:16 }}>
          {filteredFeatured.map((word,i)=><GridCard key={word.term} word={word} onOpen={()=>openModal(filteredFeatured,i)}/>)}
        </div>
        <p style={{ textAlign:"center", marginTop:20, fontSize:13, color:"#94A3B8" }}>Tap any card to open — use ← → keys or the chevrons to navigate</p>
      </section>

      {/* CTA */}
      <section id="about" style={{ maxWidth:1200, margin:"72px auto 0", padding:"0 24px" }}>
        <div style={{ background:"#1A1A2E", borderRadius:20, padding:"clamp(32px,6vw,56px) clamp(24px,5vw,48px)", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between", gap:32, flexWrap:"wrap", gap:32 }}>
          <div>
            <h2 style={{ fontSize:32, fontWeight:700, letterSpacing:"-0.03em", fontFamily:"'DM Serif Display', serif", color:"#fff", marginBottom:12 }}>
              The words you learn today<br/><span style={{ fontStyle:"italic", color:"#94A3B8" }}>are the ideas you'll lead with tomorrow.</span>
            </h2>
            <p style={{ fontSize:15, color:"#64748B", maxWidth:460, lineHeight:1.6 }}>Built for designers, product managers, developers, and anyone who works in product — at any stage of their career.</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, minWidth:200 }}>
            <button style={{ background:"#fff", color:"#1A1A2E", border:"none", borderRadius:10, padding:"14px 28px", fontSize:15, fontWeight:700, cursor:"pointer" }}>Browse all categories →</button>
            <button style={{ background:"none", color:"#64748B", border:"1.5px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"13px 28px", fontSize:15, fontWeight:600, cursor:"pointer" }}>Try flashcard mode</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" style={{ maxWidth:1200, margin:"0 auto", padding:"48px 24px", borderTop:"1px solid #F1F5F9", marginTop:72, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:24, height:24, background:"#1A1A2E", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"#fff", fontSize:12, fontWeight:700, fontFamily:"serif" }}>W</span>
          </div>
          <span style={{ fontSize:14, fontWeight:600 }}>Workplace Vocab</span>
        </div>
        <p style={{ fontSize:13, color:"#94A3B8" }}>Built by <a href="https://www.madebymichael.com.au/uxuidesignportfolio" style={{ color:"#475569", fontWeight:600, textDecoration:"none" }}>Michael Papanikolaou</a> · delightfuldesign.com.au</p>
        <div style={{ display:"flex", gap:20 }}>
          {[["Categories","#categories"],["Flashcards","#flashcards"],["About","#about"],["Contact","#contact"]].map(([item,href])=>(
            <a key={item} href={href} style={{ fontSize:13, color:"#94A3B8", textDecoration:"none", fontWeight:500 }}>{item}</a>
          ))}
        </div>
      </footer>

      {/* DRAWER */}
      {drawerCat && (
        <CategoryDrawer cat={drawerCat} onClose={closeDrawer}
          onOpenCard={(words,i)=>{ closeDrawer(); setTimeout(()=>openModal(words,i),50); }}/>
      )}

      {/* MODAL */}
      {modalIndex!==null && modalWords && (
        <FlashcardModal words={modalWords} activeIndex={modalIndex} onClose={closeModal} onPrev={prevCard} onNext={nextCard} onOpenRelated={openRelated}/>
      )}
    </div>
  );
}
