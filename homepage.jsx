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
    definition: "A method for organising large amounts of qualitative data — sticky notes, observations, quotes — into themed clusters that reveal patterns and shared meaning across a research set.",
    whyItMatters: "Design decisions made without synthesis are just guesses. An affinity map is the bridge between collecting information and understanding it. It forces a team to agree on what they actually heard — not just what they felt they heard.",
    example: "\"Let's run an affinity mapping session before the next sprint so we can prioritise properly.\"",
    related: ["User interview", "Insights", "Persona", "Customer journey map"] },

  { term: "User Interview", category: "Research", level: "Beginner",
    definition: "A one-on-one conversation between a researcher and a participant, designed to understand that person's behaviours, motivations, and pain points in their own words — without leading them toward a predetermined answer.",
    whyItMatters: "Surveys tell you what people do. Interviews tell you why. The 'why' is where the design opportunities live — and you can only get there by listening without an agenda.",
    example: "\"We ran eight user interviews last week and heard the same frustration about onboarding in nearly every session. That's our signal.\"",
    related: ["Qualitative", "Persona", "Empathy map", "Pain point"] },

  { term: "Persona", category: "Research", level: "Beginner",
    definition: "A fictional but research-grounded character representing a key segment of your users. A persona captures goals, behaviours, frustrations, and context — not demographics alone — and gives the team a shared reference when making decisions.",
    whyItMatters: "Personas stop teams from designing for themselves. When a debate breaks out about a feature, a well-built persona gives a shared, neutral reference point: what would this person actually need here?",
    example: "\"Before we finalise the navigation, can we map each option against our three personas? I want to make sure we're not optimising for the edge case.\"",
    related: ["User research", "Empathy map", "User interview", "Customer journey map"] },

  { term: "Customer Journey Map", category: "Research", level: "Intermediate",
    definition: "A visual representation of the steps a user takes when interacting with a product or service — from first awareness through to completion. It captures emotions, touchpoints, and friction at each stage of the experience.",
    whyItMatters: "Products are rarely experienced in isolation. A journey map reveals the gaps between how a team imagines the experience and how a user actually lives it. It makes the invisible visible.",
    example: "\"The journey map showed us that users were already frustrated before they even reached our app — the confirmation email was confusing them.\"",
    related: ["User flow", "Persona", "Pain point", "Task flow"] },

  { term: "Usability Test", category: "Research", level: "Intermediate",
    definition: "A research method where real users attempt to complete tasks using a product while researchers observe what happens. The goal is to identify where people struggle — not to validate that the design is good.",
    whyItMatters: "You cannot see your own blind spots. Watching a real person get stuck on something you thought was obvious is humbling — and invaluable. Even five participants can surface the majority of critical issues.",
    example: "\"We ran a usability test on the checkout flow and three out of five participants couldn't find the promo code field. That's being fixed before launch.\"",
    related: ["Heuristic evaluation", "Pain point", "Qualitative", "Insights"] },

  // ── DESIGN METHODOLOGIES (5) ──────────────────────────────────────────────
  { term: "Cognitive Load", category: "Design Methodologies", level: "Intermediate",
    definition: "The total amount of mental effort required to process information on a screen. When a design asks too much of working memory at once, users slow down, make errors, or abandon the task entirely.",
    whyItMatters: "Managing cognitive load is one of the most impactful — and invisible — things a designer does. Every unnecessary element, ambiguous label, or cluttered layout adds weight to what a user has to hold in their head.",
    example: "\"This checkout flow has too many steps — we need to reduce the cognitive load before we ship it.\"",
    related: ["Mental model", "Chunking", "Visual hierarchy", "Affordance"] },

  { term: "Mental Model", category: "Design Methodologies", level: "Intermediate",
    definition: "The internal picture a user has of how something works, built from their past experiences with similar systems. Good design aligns with users' existing mental models rather than forcing them to learn a new one.",
    whyItMatters: "When a product matches a user's mental model, it feels intuitive. When it doesn't, it feels broken — even if it technically works. Understanding mental models is the difference between a product people adopt and one they abandon.",
    example: "\"The trash icon works because users already have a mental model of how a physical bin works. We shouldn't reinvent that metaphor.\"",
    related: ["Affordance", "Cognitive load", "Heuristic evaluation", "User research"] },

  { term: "Chunking", category: "Design Methodologies", level: "Beginner",
    definition: "Grouping related pieces of information together so the brain can process them as a single unit rather than many separate items. Named after George Miller's research into working memory limits.",
    whyItMatters: "Humans can hold roughly seven items in working memory at once. Chunking works with that limit rather than against it — making forms, navigation, and content feel manageable rather than overwhelming.",
    example: "\"Let's chunk the form into three logical sections — personal details, address, then payment. One thing at a time.\"",
    related: ["Cognitive load", "Visual hierarchy", "Miller's Law", "Proximity"] },

  { term: "Affordance", category: "Design Methodologies", level: "Intermediate",
    definition: "A property of an object — real or digital — that signals how it can be used. A button that looks pressable affords clicking. A handle affords pulling. Affordances make the correct action obvious without instruction.",
    whyItMatters: "When affordances are missing or misleading, users get stuck. When they're well designed, the interface teaches itself. The goal is to make the right action feel like the only natural thing to do.",
    example: "\"The flat design removed all the visual affordances from the buttons — users don't know what's clickable anymore.\"",
    related: ["Signifier", "Mental model", "Cognitive load", "Heuristic evaluation"] },

  { term: "Heuristic Evaluation", category: "Design Methodologies", level: "Advanced",
    definition: "A usability inspection method where experts evaluate an interface against a set of established usability principles — most commonly Jakob Nielsen's 10 heuristics — to identify violations without involving real users.",
    whyItMatters: "A heuristic evaluation catches a significant percentage of usability issues quickly and cheaply. It gives designers a principled vocabulary for raising concerns and is often the fastest way to pressure-test a design before user testing.",
    example: "\"Before we start user testing, let's do a heuristic evaluation internally to catch the obvious issues first.\"",
    related: ["Usability test", "Cognitive walkthrough", "Design principles", "User research"] },

  // ── UI ELEMENTS (5) ───────────────────────────────────────────────────────
  { term: "Call to Action", category: "UI Elements", level: "Beginner",
    definition: "A button, link, or prompt that directs a user toward a specific action — 'Sign up', 'Get started', 'Add to cart'. A CTA is the moment a design asks the user to do something meaningful.",
    whyItMatters: "A page without a clear CTA is a page without a purpose. The clarity, placement, and visual weight of a CTA directly affects conversion. If users don't know what to do next, they'll do nothing.",
    example: "\"The hero section has three competing CTAs. We need one primary action — everything else is noise.\"",
    related: ["Microcopy", "Hierarchy", "Primary button", "Conversion rate"] },

  { term: "Tooltip", category: "UI Elements", level: "Beginner",
    definition: "A small text label that appears when a user hovers or focuses on an element, providing additional context without cluttering the main interface. Tooltips surface secondary information on demand.",
    whyItMatters: "Tooltips are a safety net for ambiguous icons or actions. They reduce the need for inline labels while still giving users the context they need. The key is using them sparingly — if everything needs a tooltip, the interface has bigger problems.",
    example: "\"The icon-only toolbar needs tooltips on every item — not everyone will know what that icon means without a label.\"",
    related: ["Microcopy", "Affordance", "Icon", "Hover state"] },

  { term: "Toggle", category: "UI Elements", level: "Beginner",
    definition: "A switch-style control that allows users to turn a setting on or off. A toggle represents a binary state — active or inactive — and should provide immediate visual feedback when switched.",
    whyItMatters: "Toggles are powerful because they feel physical and immediate. But they cause confusion when the state isn't clear — is the label describing the current state or the action? Getting this right prevents costly support issues.",
    example: "\"Use a toggle for the notification settings — users expect to flip that on and off without hitting a save button.\"",
    related: ["Checkbox", "Radio button", "Focused state", "Feedback"] },

  { term: "Modal", category: "UI Elements", level: "Intermediate",
    definition: "A dialog that appears over the current page, blocking interaction with the content behind it until the user completes an action or dismisses it. Modals demand attention by design.",
    whyItMatters: "Modals are one of the most overused patterns in digital products. They're powerful for confirmation flows, but when used for non-critical content they feel like interruptions. Only use a modal if the action truly requires full attention.",
    example: "\"Don't use a modal for that — the user is mid-flow. Show the error inline instead and keep them in context.\"",
    related: ["Pop-up", "Overlay", "CTA", "Focused state"] },

  { term: "Accordion", category: "UI Elements", level: "Beginner",
    definition: "A vertically stacked list of items where each item can be expanded or collapsed to reveal or hide its content. Accordions progressively disclose information, keeping interfaces clean without removing content.",
    whyItMatters: "Accordions are ideal for FAQs, settings panels, and content-heavy pages where not everything needs to be visible at once. They respect users who want to scan and drill down rather than reading everything linearly.",
    example: "\"The product specs page is too long. Let's put the technical details in an accordion — most users won't need them, but they should still be findable.\"",
    related: ["Progressive disclosure", "Cognitive load", "Navigation", "Dropdown"] },

  // ── COLOURS (5) ───────────────────────────────────────────────────────────
  { term: "Colour Theory", category: "Colours", level: "Beginner",
    definition: "The body of practical guidance for mixing colours and understanding how they interact visually and psychologically. It covers the colour wheel, harmony relationships, and the emotional associations that colours carry.",
    whyItMatters: "Colour communicates meaning before anyone reads a word. Understanding colour theory means making intentional choices that guide attention, convey brand personality, and create accessible experiences.",
    example: "\"The red we're using for success states conflicts with our alert colour — it's a colour theory problem that's going to confuse users.\"",
    related: ["Colour palette", "Contrast", "Analogous", "Complementary"] },

  { term: "Contrast", category: "Colours", level: "Beginner",
    definition: "The difference in luminance between two colours — most critically between text and its background. Contrast is both a design tool for creating visual hierarchy and an accessibility requirement for readability.",
    whyItMatters: "Low contrast isn't just hard to read for people with visual impairments — it's hard to read for everyone in bright sunlight, on low-quality screens, or when tired. WCAG requires a minimum 4.5:1 ratio for normal text.",
    example: "\"That light grey text on white fails WCAG AA. We need to darken it before dev handoff.\"",
    related: ["WCAG", "Accessibility", "Colour palette", "Greyscale"] },

  { term: "Colour Palette", category: "Colours", level: "Beginner",
    definition: "A curated set of colours selected to work together consistently across a product or brand — typically including a primary brand colour, secondary colours, neutrals, and semantic colours for states like error, warning, and success.",
    whyItMatters: "A well-defined palette creates visual cohesion and makes colour decisions faster. Without one, teams make choices in isolation and the product ends up looking inconsistent and untrustworthy.",
    example: "\"We haven't defined our semantic colours yet — what should error states be? Let's add that to the palette before components are built.\"",
    related: ["Design token", "Style guide", "Brand identity", "Colour theory"] },

  { term: "White Space", category: "Colours", level: "Beginner",
    definition: "Also called negative space — the empty area between and around design elements. White space doesn't have to be white; it's simply the deliberate absence of content, used to create breathing room and focus.",
    whyItMatters: "Crowded layouts feel cheap and hard to navigate. White space creates hierarchy, guides the eye, and signals quality. The most premium brands use white space as a design element — not a gap to fill.",
    example: "\"The landing page feels cluttered. We don't need more content — we need more white space between sections to let each message land.\"",
    related: ["Visual hierarchy", "Layout", "Cognitive load", "Flat design"] },

  { term: "Complementary Colours", category: "Colours", level: "Intermediate",
    definition: "Colours that sit directly opposite each other on the colour wheel — such as blue and orange, or red and green. When placed together, complementary colours create high contrast and vibrant visual tension.",
    whyItMatters: "Complementary pairings are naturally eye-catching, making them useful for CTAs, highlights, or anything that needs to stand out. Used incorrectly they can vibrate uncomfortably — the key is using one as dominant and the other as accent.",
    example: "\"The orange CTA on the blue background works well — complementary colours, and the contrast draws the eye exactly where we want it.\"",
    related: ["Colour theory", "Colour palette", "Analogous", "Contrast"] },

  // ── TYPOGRAPHY (5) ────────────────────────────────────────────────────────
  { term: "Typeface", category: "Typography", level: "Beginner",
    definition: "A family of fonts sharing a consistent design — the same letterform structure, proportions, and personality. Helvetica and Georgia are typefaces. Bold and italic are weights within those typefaces.",
    whyItMatters: "Typeface choice communicates tone before a single word is read. A serif feels editorial and established; a geometric sans feels modern and clean. Choosing well sets the character of the entire product.",
    example: "\"We're using two typefaces — one for display headings, one for body. Any more than that and the page starts to feel unfocused.\"",
    related: ["Serif", "Sans serif", "Font weight", "Line height"] },

  { term: "Typographic Hierarchy", category: "Typography", level: "Beginner",
    definition: "The visual organisation of text to guide readers through content in order of importance — established through size, weight, colour, spacing, and position. It tells users where to look first, second, and third.",
    whyItMatters: "Without hierarchy, every element competes for equal attention and nothing stands out. Good typographic hierarchy makes scanning effortless — users should understand the structure of a page before reading a word.",
    example: "\"The page title and the section heading are the same size. We need to establish a clearer hierarchy so users know what's most important.\"",
    related: ["Visual hierarchy", "Font weight", "Typeface", "Cognitive load"] },

  { term: "Line Height", category: "Typography", level: "Beginner",
    definition: "The vertical space between lines of text, also called leading. Expressed as a multiplier of the font size — a line height of 1.5 on 16px text gives 24px of space between baselines.",
    whyItMatters: "Too little line height makes text feel cramped and hard to track across a line. Too much creates visual disconnection between lines. The sweet spot for body copy is typically 1.5–1.7.",
    example: "\"The body copy is hard to read — can you increase the line height to 1.6? It's a small change but it'll make a big difference to readability.\"",
    related: ["Typeface", "Baseline", "X-height", "Readability"] },

  { term: "Serif", category: "Typography", level: "Beginner",
    definition: "A typeface category characterised by small decorative strokes at the ends of letterforms. Times New Roman, Georgia, and Garamond are classic examples. Serifs carry associations of tradition, authority, and editorial quality.",
    whyItMatters: "Serif typefaces carry specific cultural signals — common in publishing, law, finance, and luxury. In digital products, serifs are increasingly used for display headings to add character without sacrificing the readability of a sans-serif body.",
    example: "\"The display heading in a serif looks editorial and premium — exactly the tone we want for this content section.\"",
    related: ["Sans serif", "Typeface", "Font weight", "Hierarchy"] },

  { term: "X-height", category: "Typography", level: "Advanced",
    definition: "The height of a typeface's lowercase letters — measured from the baseline to the top of a lowercase 'x'. A high x-height makes a typeface feel larger and more readable at small sizes.",
    whyItMatters: "Two fonts at the same point size can feel very different in scale because of x-height differences. This matters enormously when choosing a typeface for dense UI text where small differences in apparent size affect readability significantly.",
    example: "\"This typeface has a low x-height — it's going to feel too small at 14px. Let's switch to something with a higher x-height for the body copy.\"",
    related: ["Baseline", "Ascenders", "Descenders", "Typeface"] },

  // ── DEVELOPMENT (5) ───────────────────────────────────────────────────────
  { term: "MVP", category: "Development", level: "Beginner",
    definition: "Minimum Viable Product. The simplest version of a product that can be shipped to real users to test a hypothesis. It contains only the core functionality needed to learn — not everything the team wishes it could have.",
    whyItMatters: "An MVP protects teams from building the wrong thing well. It shifts focus from perfection to learning. The question isn't 'is it complete?' — it's 'does it tell us what we need to know?'",
    example: "\"We don't need the recommendation engine for the MVP — let's launch with manual curation and see if users engage first.\"",
    related: ["PoC", "Prototype", "Agile", "Hypothesis"] },

  { term: "API", category: "Development", level: "Intermediate",
    definition: "Application Programming Interface. A defined contract that allows two software systems to communicate — one requests data or an action, the other responds. APIs are the plumbing connecting products to services.",
    whyItMatters: "Designers need to understand APIs because they define what's possible at the product layer. If a feature requires data the API doesn't expose, it can't be built as designed. Knowing the basics prevents late-stage surprises.",
    example: "\"The map feature will use Google's Maps API — we don't need to build that ourselves, just design the integration points.\"",
    related: ["Development", "MVP", "Responsive web design", "Microservices"] },

  { term: "Responsive Web Design", category: "Development", level: "Beginner",
    definition: "An approach to web design where layouts adapt fluidly to the size of the device they're displayed on — from desktop monitors down to mobile phones — using flexible grids, images, and CSS breakpoints.",
    whyItMatters: "Most web traffic now comes from mobile devices. A product that only works on desktop excludes the majority of its potential users. Responsive design is a baseline expectation, not a bonus feature.",
    example: "\"The dashboard looks great on desktop, but on mobile the table is completely broken. We need to design a responsive version of that component.\"",
    related: ["Breakpoints", "Mobile-first", "Grid", "CSS"] },

  { term: "QA", category: "Development", level: "Beginner",
    definition: "Quality Assurance. The process of testing a product before release to find bugs, visual regressions, and functional errors. QA checks that what was built matches what was designed and specified.",
    whyItMatters: "QA is the last line of defence before users encounter problems. It's where the gap between design intent and development output gets caught. Designers should participate — you know better than anyone what 'correct' looks like.",
    example: "\"Can you do a QA pass on the new components? I want to check spacing and states match the Figma specs before we push to production.\"",
    related: ["Deployment", "Bug", "Design specs", "PR pull request"] },

  { term: "Deployment", category: "Development", level: "Intermediate",
    definition: "The process of releasing a new version of a product or feature into a live environment so real users can access it — either to a staging environment for internal testing, or to production for public release.",
    whyItMatters: "Understanding deployment helps designers communicate timelines accurately and know what 'done' really means. A feature that's designed and built isn't shipped until it's deployed — and deployment has its own risks and process.",
    example: "\"We're targeting a Friday deployment — so design sign-off needs to happen by Wednesday to give dev time to implement and QA.\"",
    related: ["QA", "MVP", "Agile", "DevOps"] },

  // ── TESTING (5) ───────────────────────────────────────────────────────────
  { term: "A/B Testing", category: "Testing", level: "Intermediate",
    definition: "An experiment where two versions of a design or copy — version A and version B — are shown to different user segments simultaneously. The version that performs better against a defined metric is adopted.",
    whyItMatters: "A/B testing removes opinion from design decisions. Instead of debating which button colour works better, you measure it. But the test is only as good as the hypothesis behind it — never test randomly.",
    example: "\"We're A/B testing the hero headline — one is benefit-led, the other curiosity-led. Two weeks, then we check sign-up rates.\"",
    related: ["Split testing", "Conversion rate", "Hypothesis", "Data analytics"] },

  { term: "Conversion Rate", category: "Testing", level: "Intermediate",
    definition: "The percentage of users who complete a desired action — signing up, purchasing, clicking a CTA — out of the total number who had the opportunity to. Expressed as a percentage.",
    whyItMatters: "Conversion rate is one of the most direct measures of design effectiveness. If users land on a page but don't convert, something in the experience is creating friction. It turns design intuition into measurable business impact.",
    example: "\"The sign-up page has a 2% conversion rate. Industry average is closer to 5%. Let's audit the form and see where people are dropping off.\"",
    related: ["A/B testing", "Bounce rate", "Funnel", "KPI"] },

  { term: "Heat Map", category: "Testing", level: "Intermediate",
    definition: "A visual representation of where users click, move their cursor, or scroll — displayed as a colour gradient from cool (low activity) to hot (high activity). Heat maps reveal what captures attention and what gets ignored.",
    whyItMatters: "Heat maps show you the truth about how users interact — not how you assumed they would. They frequently reveal that important content is being missed, or that users are clicking things that aren't interactive.",
    example: "\"The heat map shows users clicking the product image expecting it to zoom — but nothing happens. We need to add that interaction.\"",
    related: ["Session recording", "Eye tracking", "Scroll depth", "Data analytics"] },

  { term: "Bounce Rate", category: "Testing", level: "Beginner",
    definition: "The percentage of visitors who land on a page and leave without taking any further action — no clicks, no scrolling, no navigation to another page.",
    whyItMatters: "A high bounce rate on a key page signals a mismatch between what brought someone there and what they found. It could be a messaging, load speed, or design problem — it always needs investigating.",
    example: "\"The new campaign is driving traffic but our bounce rate jumped to 78%. Users are immediately leaving — something's off with the landing page.\"",
    related: ["Conversion rate", "Engagement", "Heat map", "Acquisition"] },

  { term: "Scroll Depth", category: "Testing", level: "Intermediate",
    definition: "A metric that tracks how far down a page users scroll before leaving — usually expressed as percentages of total page height: 25%, 50%, 75%, 100%.",
    whyItMatters: "If most users never scroll past 30% of a page, everything below is invisible in practice. Scroll depth data forces honest conversations about content priority — and often reveals that key CTAs are buried too far down.",
    example: "\"Scroll depth data shows 60% of users never reach the pricing section. We need to move that higher or bring key pricing info into the hero.\"",
    related: ["Heat map", "Bounce rate", "Engagement", "Conversion rate"] },

  // ── DESIGN SYSTEM (5) ─────────────────────────────────────────────────────
  { term: "Design Token", category: "Design System", level: "Intermediate",
    definition: "The smallest named decision in a design system. Tokens store values — colours, spacing, typography, shadows — as named variables that both designers and developers reference consistently.",
    whyItMatters: "Tokens create a single source of truth between design and code. When a brand colour changes, you update one token and every component that references it updates automatically — saving hours and preventing inconsistency.",
    example: "\"Check whether that button uses the right token — I think it might be pulling a hardcoded value instead of the semantic colour.\"",
    related: ["Design system", "Component library", "Style guide", "Brand"] },

  { term: "Component Library", category: "Design System", level: "Intermediate",
    definition: "A collection of reusable, pre-built UI components — buttons, inputs, cards, navigation — that can be assembled into interfaces. Component libraries exist in both design tools like Figma and in code.",
    whyItMatters: "A shared component library dramatically speeds up both design and development. Instead of rebuilding a dropdown in every screen, teams pull from a shared inventory. Consistency is built in, not bolted on.",
    example: "\"Don't design a custom card for that — use the one from our component library. We need to stay consistent and reduce the dev effort.\"",
    related: ["Design system", "Design token", "Pattern library", "Style guide"] },

  { term: "Style Guide", category: "Design System", level: "Beginner",
    definition: "A document that defines the visual and verbal standards for a product or brand — typography rules, colour usage, spacing principles, icon guidelines, and tone of voice.",
    whyItMatters: "A style guide is what keeps a product looking like one coherent thing over time, across multiple designers and contributors. Without one, every new person makes slightly different choices — and the product slowly fragments.",
    example: "\"Before onboarding the new contractor, make sure they've read the style guide. The last person used their own font sizes throughout.\"",
    related: ["Design system", "Component library", "Brand book", "Design token"] },

  { term: "Design Pattern", category: "Design System", level: "Intermediate",
    definition: "A reusable solution to a commonly recurring design problem — such as how to handle empty states, error messages, onboarding flows, or search interactions. Patterns document not just the component but the context for its use.",
    whyItMatters: "Patterns encode decisions teams have already made and tested. They prevent every designer from solving the same problem independently — and inconsistently. A pattern library is institutional design memory.",
    example: "\"How are we handling empty states when a user has no saved items? Let's check the pattern library before designing something new.\"",
    related: ["Component library", "Style guide", "Design system", "Design token"] },

  { term: "Pattern Library", category: "Design System", level: "Intermediate",
    definition: "A curated collection of documented design patterns — recurring solutions to common UI problems — with guidance on when and how each should be used. Distinct from a component library, which focuses on building blocks alone.",
    whyItMatters: "A pattern library captures design wisdom. It's the difference between a team that reinvents the wheel on every project and one that builds on accumulated, tested knowledge. Essential for onboarding new contributors.",
    example: "\"The pattern library has a documented approach for progressive disclosure — let's follow that rather than designing a one-off solution.\"",
    related: ["Design pattern", "Component library", "Style guide", "Design system"] },

  // ── BUSINESS (5) ──────────────────────────────────────────────────────────
  { term: "Stakeholder", category: "Business", level: "Beginner",
    definition: "Anyone with an interest in — or influence over — a project's outcome. Stakeholders can be internal (executives, legal, product) or external (clients, partners, regulators). Managing their expectations is a core professional skill.",
    whyItMatters: "Designs don't ship in a vacuum. A brilliant solution that doesn't account for stakeholder concerns will get blocked, revised, or killed. Understanding who the stakeholders are — and what they care about — is as important as understanding users.",
    example: "\"Before we present the new checkout design, let's align with the legal stakeholder — they had concerns about the T&C placement last time.\"",
    related: ["Design playback", "KPI", "Voice of customer", "Presentation"] },

  { term: "KPI", category: "Business", level: "Beginner",
    definition: "Key Performance Indicator. A measurable value that tracks progress toward a specific business objective — sign-ups, revenue, retention, NPS. KPIs translate strategy into numbers teams can monitor and act on.",
    whyItMatters: "Design exists in service of business outcomes. Understanding the KPIs your product is measured against helps you prioritise the right problems and communicate the value of design in language leadership understands.",
    example: "\"Our KPI this quarter is reducing support ticket volume by 20%. Every design decision on the onboarding flow should be evaluated against that goal.\"",
    related: ["NPS", "Conversion rate", "Retention", "Data analytics"] },

  { term: "NPS", category: "Business", level: "Intermediate",
    definition: "Net Promoter Score. A measure of customer loyalty based on one question: 'How likely are you to recommend this product to a friend?' Scores range from -100 to +100.",
    whyItMatters: "NPS is one of the most common ways businesses measure satisfaction at scale. A falling NPS signals experience problems before they show up in revenue — making it a valuable early-warning metric for design teams.",
    example: "\"Our NPS dropped 12 points after the last release. Let's look at the verbatim feedback alongside the score to understand what changed.\"",
    related: ["CSAT", "KPI", "Voice of customer", "Retention"] },

  { term: "Voice of Customer", category: "Business", level: "Intermediate",
    definition: "A research process that captures customers' expectations and frustrations in their own words — combining surveys, interviews, support tickets, reviews, and social listening into a picture of what customers actually think.",
    whyItMatters: "VoC stops businesses from making decisions based on internal assumptions. It grounds product conversations in real customer language — which is also more persuasive when making the case for design changes to leadership.",
    example: "\"The VoC report shows 'confusing' is the most common word customers use about our onboarding. That's our design priority for Q2.\"",
    related: ["NPS", "CSAT", "User research", "Stakeholder"] },

  { term: "B2B vs B2C", category: "Business", level: "Beginner",
    definition: "B2B (Business-to-Business) means a product sold to other companies. B2C (Business-to-Consumer) means sold directly to individual end users. The distinction shapes everything from pricing models to design priorities.",
    whyItMatters: "B2B and B2C products have fundamentally different user contexts. B2B users often tolerate complexity in exchange for capability. B2C users expect simplicity and delight. Knowing which you're designing for changes almost every decision.",
    example: "\"This is a B2B tool — our users are professionals using it for six hours a day. Efficiency matters more than onboarding polish here.\"",
    related: ["Stakeholder", "KPI", "Persona", "User research"] },

  // ── BRAND (5) ─────────────────────────────────────────────────────────────
  { term: "Tone of Voice", category: "Brand", level: "Beginner",
    definition: "The personality and character expressed through the words a brand chooses. Tone of voice isn't what you say — it's how you say it. It should be consistent across every touchpoint, from a homepage headline to an error message.",
    whyItMatters: "Inconsistent tone creates brand confusion. When your marketing sounds confident and warm but your error messages sound robotic and cold, users feel a jarring disconnect. Tone of voice is part of the experience.",
    example: "\"That error message sounds like it was written by a lawyer. Can you rewrite it in our tone — direct, human, and a little reassuring?\"",
    related: ["Microcopy", "Brand identity", "Conversational tone", "Copy"] },

  { term: "Brand Identity", category: "Brand", level: "Beginner",
    definition: "The collection of visual and verbal elements that express what a brand is — logo, colour palette, typography, imagery style, tone of voice, and the values behind them all. It's how a brand presents itself consistently.",
    whyItMatters: "Brand identity is what makes a product instantly recognisable before users read a word. A strong, consistent identity builds trust and loyalty; an inconsistent one creates confusion and undermines credibility.",
    example: "\"The new feature looks technically great, but it doesn't feel like us — the illustration style and typeface are both off-brand. Align it with the identity guidelines.\"",
    related: ["Tone of voice", "Brand book", "Style guide", "Design system"] },

  { term: "Brand Book", category: "Brand", level: "Intermediate",
    definition: "A comprehensive document that defines and governs a brand's identity — including logo usage rules, colour specifications, typography guidelines, imagery principles, and tone of voice. The definitive reference for anyone creating branded materials.",
    whyItMatters: "A brand book creates consistency at scale. When multiple agencies, contractors, and internal teams create brand materials, the brand book ensures they all produce something that looks like it belongs to the same family.",
    example: "\"Before the agency starts on campaign assets, send them the brand book — especially the logo clear space rules and the colour don'ts.\"",
    related: ["Brand identity", "Style guide", "Tone of voice", "Design system"] },

  { term: "Social Proof", category: "Brand", level: "Beginner",
    definition: "Evidence that other people have trusted, used, or endorsed a product — testimonials, reviews, user counts, case studies, logos of well-known clients. Social proof reduces the perceived risk of a decision.",
    whyItMatters: "Humans look to each other to validate decisions. Social proof is one of the most reliably persuasive elements in a product or marketing context. Placing the right proof at the right moment — just as doubt peaks — significantly lifts conversion.",
    example: "\"Add the client logos and review count just above the pricing section. That's where users hesitate most — social proof at that moment will help.\"",
    related: ["Conversion rate", "Trust", "CTA", "Testimonial"] },

  { term: "Design Debt", category: "Brand", level: "Intermediate",
    definition: "The accumulation of inconsistencies, shortcuts, and outdated patterns in a product's design that slow future work and degrade the user experience over time — the design equivalent of technical debt.",
    whyItMatters: "Design debt is invisible until it becomes painful. Small compromises — a one-off colour, a custom component, an inconsistent pattern — compound into a fragmented product that's expensive to update and frustrating to use.",
    example: "\"We've got significant design debt in the settings screens — three different button styles, two form layouts, none matching the system. We need a debt sprint.\"",
    related: ["Design system", "Component library", "Style guide", "Design token"] },

  // ── IDEATION (5) ──────────────────────────────────────────────────────────
  { term: "Wireframe", category: "Ideation", level: "Beginner",
    definition: "A low-fidelity visual representation of a screen or page layout — showing structure, content hierarchy, and functionality without visual design applied. Wireframes communicate what goes where, not what it will look like.",
    whyItMatters: "Wireframes are the fastest way to test structure before investing in visual design. They keep feedback focused on layout and flow rather than colour and type — preventing the mistake of debating aesthetics before solving the structural problem.",
    example: "\"Let's wireframe the onboarding flow and get alignment on the steps before we go anywhere near visual design.\"",
    related: ["Low-fidelity", "Prototype", "Information architecture", "Mockup"] },

  { term: "Information Architecture", category: "Ideation", level: "Intermediate",
    definition: "The structural design of shared information environments — how content and functionality are organised, labelled, and navigated. Good IA makes things findable and the mental model of the product clear.",
    whyItMatters: "Poor IA is often the root cause of 'the site is confusing' — users can't find what they need because the structure doesn't match how they think. IA problems can't be fixed with UI polish alone; they need structural solutions.",
    example: "\"Users keep looking for 'Account settings' under 'Help'. That's an IA problem — our labels don't match their mental model.\"",
    related: ["Navigation", "Card sorting", "Mental model", "User flow"] },

  { term: "Prototype", category: "Ideation", level: "Beginner",
    definition: "A simulation of a product or feature — at any fidelity level — used to test an idea, explore interactions, or communicate a design to stakeholders before it's built. Prototypes can be paper sketches, clickable Figma flows, or coded.",
    whyItMatters: "Prototypes make ideas testable. The act of building one also forces designers to solve problems they might otherwise gloss over — you can't prototype a flow without knowing how each step connects.",
    example: "\"Before we hand off to dev, let's build a prototype of the checkout so we can run a quick usability test and catch any gaps.\"",
    related: ["Wireframe", "Mockup", "Usability test", "High-fidelity"] },

  { term: "Low-Fidelity", category: "Ideation", level: "Beginner",
    definition: "An early-stage design representation that prioritises speed and exploration over visual polish — rough sketches, simple wireframes, basic clickable prototypes. Low-fi work is deliberately incomplete to invite feedback and iteration.",
    whyItMatters: "Low-fidelity signals to stakeholders that the work is in progress and open to change. Presenting high-fidelity too early invites nitpicking over details before fundamentals are settled. Start rough on purpose.",
    example: "\"I've put together some low-fi concepts — I want alignment on the structure before I invest time in visual design.\"",
    related: ["Wireframe", "Mid-fidelity", "High-fidelity", "Prototype"] },

  { term: "High-Fidelity", category: "Ideation", level: "Beginner",
    definition: "A design that closely resembles the final product — with real content, accurate typography, colour, spacing, and interactive states applied. High-fidelity work is used for stakeholder presentations, developer handoff, and usability testing.",
    whyItMatters: "High-fidelity reduces ambiguity for developers and gives stakeholders a realistic sense of the final experience. But the risk is investing visual polish in something that hasn't been validated structurally — low-fi should always come first.",
    example: "\"Now that the structure is signed off, I'll take the wireframes to high-fidelity this week — ready for developer handoff by Friday.\"",
    related: ["Wireframe", "Low-fidelity", "Prototype", "Mockup"] },

  // ── DISCOVERY (5) ─────────────────────────────────────────────────────────
  { term: "Design Brief", category: "Discovery", level: "Beginner",
    definition: "A document outlining the scope, goals, audience, constraints, and success criteria for a design project. It aligns everyone on what's being solved before any work begins.",
    whyItMatters: "A design brief prevents the most expensive mistake in product work: building the right thing for the wrong problem. It gives the team a shared frame of reference and something to check decisions against throughout the project.",
    example: "\"Before we start designing, can you write a brief? I want us all solving the same problem before anyone opens Figma.\"",
    related: ["Product requirement", "Discovery", "Hypothesis", "Stakeholder"] },

  { term: "Discovery", category: "Discovery", level: "Beginner",
    definition: "The initial phase of a project focused on understanding the problem space — through research, stakeholder interviews, competitive analysis, and data review — before any solutions are explored.",
    whyItMatters: "Skipping discovery is the number one reason products solve the wrong problem beautifully. The more clearly a team understands the problem, the less time they waste building things nobody needs.",
    example: "\"We're still in discovery — we haven't started designing yet. We're interviewing users and mapping the current experience first.\"",
    related: ["Design brief", "User research", "Hypothesis", "Assumption mapping"] },

  { term: "Hypothesis", category: "Discovery", level: "Intermediate",
    definition: "A testable statement about what you believe to be true, framed so it can be validated or disproved: 'We believe that doing X will result in Y for Z reason.' Hypotheses turn intuition into structured experiments.",
    whyItMatters: "A hypothesis forces the team to be specific about what they're testing and what success looks like — preventing the common trap of shipping a feature and never measuring whether it worked.",
    example: "\"Our hypothesis is that simplifying the sign-up form to three fields will increase completion rates by 20%. Let's design the test.\"",
    related: ["A/B testing", "MVP", "Assumption", "Discovery"] },

  { term: "Product Requirement", category: "Discovery", level: "Intermediate",
    definition: "A specific, measurable statement defining what a product or feature must do — what functionality it delivers, what constraints it operates within, and what success looks like. Requirements provide the guardrails for design and development.",
    whyItMatters: "Ambiguous requirements produce misaligned outputs. Clear requirements protect teams from scope creep and ensure designers, developers, and stakeholders share a common definition of 'done'.",
    example: "\"The requirement is that users can complete checkout in under three steps on mobile. Design to that constraint rather than assuming desktop behaviour carries over.\"",
    related: ["Design brief", "Discovery", "Hypothesis", "Design deliverable"] },

  { term: "Assumption Mapping", category: "Discovery", level: "Intermediate",
    definition: "A workshop technique that surfaces all assumptions embedded in a product idea — about user needs, business viability, and technical feasibility — and maps them by how critical they are and how much evidence supports them.",
    whyItMatters: "Every product decision rests on assumptions. Assumption mapping makes the riskiest ones visible so the team can test them early, before building on a foundation that might not be solid.",
    example: "\"Before we commit to this feature, let's run an assumption mapping session — I think we're taking for granted that users actually want this option.\"",
    related: ["Hypothesis", "Discovery", "User research", "Design brief"] },

  // ── ALIGNMENT (5) ─────────────────────────────────────────────────────────
  { term: "Grid", category: "Alignment", level: "Beginner",
    definition: "An invisible structure of columns, rows, and gutters that organises content on a screen. Grids create consistency, alignment, and rhythm across layouts — making designs feel ordered rather than arbitrary.",
    whyItMatters: "Grids are the scaffolding behind professional-looking layouts. Without one, elements get placed by eye and slight misalignments accumulate into something that feels off — even if the viewer can't articulate exactly why.",
    example: "\"Everything needs to align to the 12-column grid. The card widths you've used don't snap to a column — it'll look inconsistent across breakpoints.\"",
    related: ["Gutters", "Margins", "8-point grid system", "Breakpoints"] },

  { term: "8-Point Grid System", category: "Alignment", level: "Intermediate",
    definition: "A spacing system where all dimensions — padding, margins, component heights, gaps — are multiples of 8 pixels. The result is a mathematically consistent visual rhythm that works cleanly across standard screen resolutions.",
    whyItMatters: "The 8-point grid removes guesswork from spacing decisions. Designers and developers reference the same values, which reduces implementation drift and speeds up both design and handoff.",
    example: "\"The padding on that card should be 16px, not 14px — we're on the 8-point grid. Keep everything in multiples of 8.\"",
    related: ["Grid", "Spacing", "Design token", "Gutters"] },

  { term: "Breakpoints", category: "Alignment", level: "Intermediate",
    definition: "Specific screen widths at which a layout changes its structure to adapt to different device sizes. Common breakpoints are defined for mobile, tablet, and desktop — implemented in CSS using media queries.",
    whyItMatters: "Breakpoints are where responsive design decisions become concrete. Designing without them means assuming everyone uses the same screen — which no one does. Every layout needs to be considered at multiple breakpoints before handoff.",
    example: "\"The three-column grid works on desktop, but at the tablet breakpoint we drop to two columns, and on mobile it goes single-column.\"",
    related: ["Responsive web design", "Grid", "Mobile-first", "CSS"] },

  { term: "Visual Hierarchy", category: "Alignment", level: "Beginner",
    definition: "The arrangement of elements to guide the viewer's eye in a deliberate order — from most to least important. Achieved through size, weight, colour, contrast, spacing, and position.",
    whyItMatters: "Without visual hierarchy, everything competes equally for attention and nothing stands out. Good hierarchy makes the right information land first — users understand the page before they consciously read it.",
    example: "\"The page title and product name are the same weight — there's no hierarchy. The title needs to be significantly larger so users immediately know where they are.\"",
    related: ["Typographic hierarchy", "Cognitive load", "Grid", "White space"] },

  { term: "Golden Ratio", category: "Alignment", level: "Advanced",
    definition: "A mathematical proportion of approximately 1:1.618, found throughout nature and classical art. In design, it's used to create layouts, set type scales, and determine proportional relationships that feel naturally harmonious.",
    whyItMatters: "The golden ratio isn't magic, but it is a reliable starting point for proportion decisions that feel balanced without being rigid. Most useful in logo design, layout, and type scaling.",
    example: "\"The logo's proportions were derived from the golden ratio — which is why it feels so balanced even though it's asymmetric.\"",
    related: ["Rule of thirds", "Grid", "Visual hierarchy", "Alignment"] },

  // ── POSITIONS (5) ─────────────────────────────────────────────────────────
  { term: "UX Designer", category: "Positions", level: "Beginner",
    definition: "A designer focused on the overall experience of using a product — research, flows, information architecture, wireframing, testing, and iteration. UX designers prioritise how something works over how it looks.",
    whyItMatters: "The UX designer's role is to be the user's advocate in the room. They translate user needs into design decisions and validate those decisions through research rather than assumption.",
    example: "\"The UX designer is running user interviews this week — once we have the insights, we'll move into design exploration.\"",
    related: ["UI designer", "Product manager", "UX researcher", "Product owner"] },

  { term: "UI Designer", category: "Positions", level: "Beginner",
    definition: "A designer focused on the visual and interactive layer of a product — the look, feel, and responsiveness of every element a user touches. UI designers work with typography, colour, spacing, components, and states.",
    whyItMatters: "UI design is where user experience becomes tangible. Great UX strategy is undermined by poor UI execution — unclear affordances, poor contrast, visual inconsistency. The UI designer ensures the product looks and behaves exactly as intended.",
    example: "\"The UX flows are approved — the UI designer is now applying the visual layer and building out the component states.\"",
    related: ["UX designer", "Design system", "Component library", "Front-end development"] },

  { term: "Product Manager", category: "Positions", level: "Beginner",
    definition: "The person responsible for defining what a product is, who it's for, and why it exists. The product manager owns the roadmap, prioritises features, and coordinates between business, design, and engineering.",
    whyItMatters: "The PM is the designer's most important collaborator. They define the problem space and business constraints; the designer defines the solution. When the relationship works well, product and design are in constant dialogue.",
    example: "\"The PM has confirmed the three user stories for this sprint — let's make sure our designs cover all the edge cases before handoff to dev.\"",
    related: ["Product owner", "Delivery lead", "Stakeholder", "Agile"] },

  { term: "Product Owner", category: "Positions", level: "Intermediate",
    definition: "In Agile teams, the product owner is responsible for the product backlog — defining, ordering, and accepting work. They represent customer and business needs within the sprint team, making day-to-day prioritisation decisions.",
    whyItMatters: "The product owner decides what gets built next and whether output meets the definition of done. Understanding their role helps designers navigate prioritisation conversations and get work approved efficiently.",
    example: "\"The product owner needs to accept the story before it closes — can you demo the new flow and get sign-off today?\"",
    related: ["Product manager", "Agile", "Backlog", "Delivery lead"] },

  { term: "UX Researcher", category: "Positions", level: "Intermediate",
    definition: "A specialist in generating insight about user behaviours, needs, and mental models through rigorous qualitative and quantitative research methods. UX researchers plan studies, conduct sessions, synthesise findings, and communicate implications.",
    whyItMatters: "UX researchers are the engine of evidence-based design. They protect teams from designing based on assumption and provide the data that makes design decisions defensible to stakeholders.",
    example: "\"Let's loop in the UX researcher before we finalise the brief — they ran a study on this problem space last quarter and the insights are still relevant.\"",
    related: ["UX designer", "User interview", "Usability test", "Qualitative"] },

  // ── COPY (5) ──────────────────────────────────────────────────────────────
  { term: "Microcopy", category: "Copy", level: "Beginner",
    definition: "The small but critical pieces of text within a product interface — button labels, error messages, form field hints, empty states, tooltips. Every word the user reads while using the product counts as microcopy.",
    whyItMatters: "Microcopy does enormous work in a small footprint. A well-written error message reduces support tickets. A reassuring CTA lifts conversion. Poor microcopy creates confusion at exactly the moments when clarity matters most.",
    example: "\"The error message just says 'Invalid input' — that tells the user nothing. Rewrite it to explain what's wrong and how to fix it.\"",
    related: ["Tone of voice", "CTA", "Copy", "Hierarchy"] },

  { term: "Body Copy", category: "Copy", level: "Beginner",
    definition: "The main blocks of explanatory or descriptive text in a design — paragraphs that inform, explain, or elaborate. Body copy requires careful attention to line length, line height, and font choice for comfortable reading.",
    whyItMatters: "Body copy is where users actually read — if they decide to. The design job is to make reading as effortless as possible. Line length and spacing choices for body text are as important as any headline decision.",
    example: "\"The body copy line length is too wide at full desktop width — aim for 60–75 characters per line or it becomes hard to track from line to line.\"",
    related: ["Copy", "Microcopy", "Line height", "Typeface"] },

  { term: "Writing a CTA", category: "Copy", level: "Beginner",
    definition: "The written instruction or prompt that tells a user what to do next — 'Get started', 'Book a demo', 'Download now'. A CTA is the most important piece of copy on most commercial screens.",
    whyItMatters: "CTA wording has a measurable impact on conversion. 'Submit' performs worse than 'Get my free report'. Specificity, benefit-framing, and low-commitment language all affect whether users click. It's one of the highest-leverage copy decisions.",
    example: "\"Change the CTA from 'Submit' to 'Start my free trial' — make it specific and low-stakes. A/B test that against 'Try it free'.\"",
    related: ["Microcopy", "Conversion rate", "Hierarchy", "Copy"] },

  { term: "Copy", category: "Copy", level: "Beginner",
    definition: "Any written content created for a product or marketing purpose — headlines, body text, button labels, emails, tooltips. Copy is written with a specific persuasive or functional purpose in mind.",
    whyItMatters: "Copy and design are inseparable. A layout without real copy is just a wireframe — you don't know if it works until the words are in place. Designers who understand copy make better layouts; writers who understand design make better copy.",
    example: "\"Review the copy in the mockups before we present — some placeholders are still lorem ipsum and it's throwing off the hierarchy.\"",
    related: ["Microcopy", "Tone of voice", "Hierarchy", "CTA"] },

  { term: "Copy Hierarchy", category: "Copy", level: "Beginner",
    definition: "The organisation of copy from most to least important — headline, subheading, body, caption — using size, weight, colour, and spacing to signal the order in which content should be read.",
    whyItMatters: "Copy without hierarchy is a wall of text. Visual and verbal hierarchy work together to create a reading path — so that even a three-second glance delivers the most important message.",
    example: "\"The page has a strong headline but the subheading and body are too similar in weight — users aren't getting a clear reading order.\"",
    related: ["Visual hierarchy", "Typography", "Font weight", "CTA"] },

  // ── ACCESSIBILITY (5) ─────────────────────────────────────────────────────
  { term: "WCAG", category: "Accessibility", level: "Intermediate",
    definition: "Web Content Accessibility Guidelines. The internationally recognised standard for making digital content accessible to people with disabilities — organised into compliance levels A (minimum), AA (standard), and AAA (enhanced).",
    whyItMatters: "WCAG compliance is both a legal requirement in many countries and a design quality bar that benefits everyone. Meeting AA standards means your product works for people with visual, motor, auditory, and cognitive impairments — and better for everyone else too.",
    example: "\"Our colour contrast fails WCAG AA on the secondary button — we need to darken the text before launch.\"",
    related: ["Accessibility", "Contrast", "Screen reader", "Usability"] },

  { term: "Accessibility", category: "Accessibility", level: "Beginner",
    definition: "The practice of designing products usable by people of all abilities — including those with visual, auditory, motor, or cognitive impairments. Accessibility is not a feature or an edge case — it's a baseline quality standard.",
    whyItMatters: "Approximately 1 in 6 people globally live with some form of disability. Designing accessibly doesn't just serve those users — it produces clearer layouts, better contrast, and more intuitive interactions for everyone.",
    example: "\"We need an accessibility review before this goes live — keyboard navigation, screen reader compatibility, and colour contrast as a minimum.\"",
    related: ["WCAG", "Contrast", "Usability", "Inclusive design"] },

  { term: "Usability", category: "Accessibility", level: "Beginner",
    definition: "The degree to which a product can be used by specific users to achieve specific goals effectively, efficiently, and with satisfaction in a specified context of use.",
    whyItMatters: "A product can be technically functional and still be unusable. Usability is the gap between what designers intend and what users experience. Closing that gap is the fundamental work of UX design.",
    example: "\"The feature works, but the usability is poor — users keep making the same mistake at the same point. We need to redesign that interaction.\"",
    related: ["Accessibility", "Usability test", "Cognitive load", "WCAG"] },

  { term: "Thumb Reachability", category: "Accessibility", level: "Intermediate",
    definition: "The consideration of which areas of a mobile screen are comfortably reachable by a user's thumb when holding the device one-handed. The bottom-centre is easiest; the top corners are hardest.",
    whyItMatters: "Most smartphone use happens one-handed. Placing primary actions in the top corners — a pattern copied from desktop — forces users into awkward stretches that interrupt flow and increase error rates.",
    example: "\"The primary CTA is in the top-right corner on mobile — that's outside the thumb reachability zone. Move it to the bottom of the screen.\"",
    related: ["Mobile-first", "Accessibility", "Responsive web design", "Usability"] },

  { term: "Scalability", category: "Accessibility", level: "Intermediate",
    definition: "In design, the ability of a system, component, or layout to accommodate growth — more content, more users, more features — without breaking or requiring a rebuild. Scalable design anticipates change.",
    whyItMatters: "A design that works for five menu items may fall apart at fifteen. Thinking about scalability early saves painful retrofits later. The best design systems are flexible enough to expand without losing coherence.",
    example: "\"The navigation works with six products, but it's not scalable — when we launch four more it'll break. We need a more flexible navigation pattern.\"",
    related: ["Design system", "Component library", "Responsive web design", "Information architecture"] },

  // ── METHODOLOGIES (5) ─────────────────────────────────────────────────────
  { term: "Design Thinking", category: "Methodologies", level: "Beginner",
    definition: "A human-centred approach to problem-solving that moves through five stages: Empathise, Define, Ideate, Prototype, and Test. It reframes problems around human needs before jumping to solutions.",
    whyItMatters: "Design thinking is valuable not just for designers but for any team solving complex, ambiguous problems. It slows the rush to solution and ensures the team is solving the right problem for the right people.",
    example: "\"Before we jump into features, let's run a design thinking workshop — I want to properly empathise with the user before we start ideating.\"",
    related: ["Double Diamond", "HCD", "Agile", "Discovery"] },

  { term: "Agile", category: "Methodologies", level: "Beginner",
    definition: "An iterative approach to product development that breaks work into short cycles called sprints — typically two weeks. Agile teams ship working software frequently, gather feedback, and adjust based on what they learn.",
    whyItMatters: "Agile changes how design works. Instead of delivering a complete spec upfront, designers work in step with development — which means being comfortable with 'good enough to test' rather than waiting for perfection.",
    example: "\"We run two-week sprints — design needs to be one sprint ahead of dev at all times so they're never blocked waiting for assets.\"",
    related: ["Sprint", "Backlog", "MVP", "Design thinking"] },

  { term: "Double Diamond", category: "Methodologies", level: "Intermediate",
    definition: "A design process model from the Design Council with four phases: Discover (explore the problem), Define (frame the right problem), Develop (explore solutions), Deliver (ship the right solution). Two diverge-converge cycles.",
    whyItMatters: "The Double Diamond makes the design process legible to non-designers. It validates the time spent in problem definition before jumping to solutions — and shows that good design involves two rounds of opening up and narrowing down.",
    example: "\"We're still in the first diamond — the discover phase. It's too early to be designing screens. We need to define the problem first.\"",
    related: ["Design thinking", "Discovery", "Divergent thinking", "Convergent thinking"] },

  { term: "Lean UX", category: "Methodologies", level: "Intermediate",
    definition: "An approach to UX design that prioritises validated learning over documentation. Lean UX teams build the minimum artefact needed to test an assumption, get feedback fast, and iterate — rather than producing comprehensive deliverables upfront.",
    whyItMatters: "Lean UX challenges the idea that designers need to document every decision before building. In fast-moving environments, heavy documentation is often obsolete before it's read. The goal is learning, not paperwork.",
    example: "\"In this team we practice Lean UX — get a rough prototype in front of users within two days. We'll learn more from that than from a week of documentation.\"",
    related: ["Agile", "MVP", "Design thinking", "Prototype"] },

  { term: "Waterfall", category: "Methodologies", level: "Beginner",
    definition: "A sequential project methodology where each phase — research, design, development, testing, launch — is completed fully before the next begins. Waterfall is structured and predictable, but inflexible to change mid-project.",
    whyItMatters: "Understanding waterfall helps designers navigate organisations still using it and articulate why iterative approaches often produce better outcomes. It remains appropriate in regulated industries and fixed-scope contracts.",
    example: "\"We're on a waterfall contract — all designs must be fully signed off before development starts. No iterations after handoff.\"",
    related: ["Agile", "Design thinking", "MVP", "Lean UX"] },

  // ── PROTOTYPING (5) ───────────────────────────────────────────────────────
  { term: "Interaction", category: "Prototyping", level: "Beginner",
    definition: "Any moment of exchange between a user and a product — a tap, a hover, a swipe, a keyboard shortcut. Interactions are the building blocks of user experience and must be designed as deliberately as visual elements.",
    whyItMatters: "A screen that looks good in a static mockup may feel wrong in use if its interactions haven't been thought through. Every interaction carries an expectation — meeting or breaking it shapes the entire feel of the product.",
    example: "\"The transition between these two screens feels abrupt. Let's prototype the interaction so we can feel whether a slide or a fade works better.\"",
    related: ["Micro-interaction", "Prototype", "Animation", "Hover state"] },

  { term: "Micro-interaction", category: "Prototyping", level: "Intermediate",
    definition: "A small, contained interaction designed to accomplish a single task — a like button animation, a loading indicator, a subtle shake when a password is wrong. Micro-interactions provide feedback and add personality.",
    whyItMatters: "Micro-interactions are the difference between a product that feels alive and one that feels static. They communicate system status, confirm actions, and reward engagement. When done well, they're invisible — users just feel the product is polished.",
    example: "\"Add a micro-interaction to the save button — a brief checkmark animation so users know their work was saved without a full notification.\"",
    related: ["Interaction", "Animation", "Prototype", "Hover state"] },

  { term: "Design Specs", category: "Prototyping", level: "Intermediate",
    definition: "The detailed documentation that accompanies a design handoff — specifying exact measurements, spacing, colours, typography, interaction states, and component behaviour. Specs bridge the gap between design intent and built output.",
    whyItMatters: "Without specs, developers make their best guess — and small guesses compound into large discrepancies from the designed experience. Good specs reduce back-and-forth between design and dev and produce a final product that matches the design.",
    example: "\"The specs need to include the hover and disabled states — don't just hand off the default state and expect dev to figure the rest out.\"",
    related: ["QA", "Prototype", "Component library", "Developer handoff"] },

  { term: "Animation", category: "Prototyping", level: "Intermediate",
    definition: "The use of motion to transition between states, provide feedback, guide attention, or add personality to an interface. In UI, animation includes page transitions, loading states, hover effects, and celebratory moments.",
    whyItMatters: "Animation used well makes an interface feel responsive and alive. Used poorly — too fast, too slow, too frequent — it becomes distracting or makes the product feel slow. Animation should serve communication, not decoration.",
    example: "\"The modal appears instantly with no transition — it feels jarring. Can you add a 200ms ease-in to make it feel more natural?\"",
    related: ["Micro-interaction", "Interaction", "Easing", "Prototype"] },

  { term: "Hover State", category: "Prototyping", level: "Beginner",
    definition: "The visual change that occurs when a user moves their cursor over an interactive element. Hover states confirm that an element is clickable and provide feedback before the user commits to an action.",
    whyItMatters: "Hover states are one of the simplest affordances in web design — but frequently forgotten. Without them, users can't tell what's interactive. Every clickable element should have a defined hover state before handoff.",
    example: "\"Has the hover state been designed for the navigation links? Dev will need that spec before they can build it correctly.\"",
    related: ["Interaction", "Focused state", "Affordance", "Design specs"] },

  // ─── MISSING RELATED CARDS ──────────────────────────────────────────────────

  { term: "Acquisition", category: "Testing", level: "Beginner",
    definition: "The process by which new users discover and first arrive at a product — through organic search, paid ads, referrals, or word of mouth. Acquisition is the very top of the funnel.",
    whyItMatters: "Understanding where users come from shapes everything below it. A mismatch between the promise in an ad and the reality of the landing page is one of the most common causes of high bounce rates and poor conversion.",
    example: "\"Most of our acquisition is organic search — the landing page copy needs to match the exact language people are searching with, otherwise we lose them immediately.\"",
    related: ["Funnel", "Bounce Rate", "Conversion Rate", "Engagement"] },

  { term: "Alignment", category: "Alignment", level: "Beginner",
    definition: "The positioning of elements along a shared axis — left, right, centre, or top — so that they feel intentionally arranged rather than scattered. One of the most foundational principles of visual design.",
    whyItMatters: "Misaligned elements create visual noise even when users can't articulate why a layout feels off. Consistent alignment is what separates a designed layout from a assembled one. Grids exist to make alignment systematic.",
    example: "\"The icon and the label next to it aren't vertically aligned — it's a small thing but it makes the row feel unpolished. Everything on this line should share the same baseline.\"",
    related: ["Grid", "Visual Hierarchy", "Spacing", "8-Point Grid System"] },

  { term: "Analogous", category: "Colours", level: "Intermediate",
    definition: "Colours that sit adjacent to each other on the colour wheel — such as blue, teal, and green. Analogous colour schemes feel harmonious and natural because the hues share underlying tones.",
    whyItMatters: "Analogous palettes are cohesive without being boring. They create a sense of unity that works well for backgrounds, illustration systems, and brand identities where a calm, related feel is the goal.",
    example: "\"The illustration palette uses analogous warm tones — burnt orange into amber into yellow. It feels cohesive without any single colour overpowering the others.\"",
    related: ["Complementary Colours", "Colour Theory", "Colour Palette", "Greyscale"] },

  { term: "Ascenders", category: "Typography", level: "Advanced",
    definition: "The strokes of lowercase letters that extend above the x-height — found on letters like 'b', 'd', 'h', 'k', and 'l'. Ascenders give words their recognisable silhouette and support fast reading.",
    whyItMatters: "Ascenders contribute to how words are recognised as shapes rather than sequences of letters. Line height needs to account for ascenders to prevent them clashing with descenders from the line above.",
    example: "\"The tight leading is causing the ascenders to sit right under the descenders of the previous line — increase the line height so they have room to breathe.\"",
    related: ["Descenders", "X-height", "Baseline", "Typeface"] },

  { term: "Assumption", category: "Discovery", level: "Beginner",
    definition: "An unvalidated belief held by the team about users, the market, or the product — something treated as true without evidence. Every product decision rests on assumptions whether teams acknowledge them or not.",
    whyItMatters: "Unexamined assumptions are the root cause of most product failures. Making assumptions explicit — writing them down and asking 'what would have to be true for this to work?' — is the first step to testing them.",
    example: "\"We're assuming users check this dashboard daily, but has anyone validated that? Let's name it as an assumption and find a way to test it before we design around it.\"",
    related: ["Hypothesis", "Assumption Mapping", "Discovery", "User Research"] },

  { term: "Backlog", category: "Methodologies", level: "Beginner",
    definition: "An ordered list of all the work a team plans to do — features, bug fixes, research, design tasks — prioritised by the product owner and refined continuously. The backlog is the team's shared queue.",
    whyItMatters: "The backlog is where design work competes for priority against everything else. Designers who understand how to write clear, well-reasoned tickets — and advocate for their priority — get more of the right work built.",
    example: "\"Add empty state designs to the backlog before the sprint closes — they got cut last time and they block the feature feeling complete when it ships.\"",
    related: ["Sprint", "Agile", "Product Manager", "Product Owner"] },

  { term: "Baseline", category: "Typography", level: "Intermediate",
    definition: "The invisible horizontal line that most letters sit on. Descenders dip below it, but the body of letters like 'x', 'o', and 'n' rest exactly on the baseline. Baseline grids align type consistently across a layout.",
    whyItMatters: "When elements across columns or components share a common baseline, the layout feels considered and settled. When they don't — even by a few pixels — the layout feels unstable in a way that's hard to name.",
    example: "\"The icon and the label next to it aren't baseline-aligned — the icon is centred on the cap height instead. Align them to the text baseline and it'll snap into place.\"",
    related: ["Ascenders", "Descenders", "X-height", "Line Height"] },

  { term: "Brand", category: "Brand", level: "Beginner",
    definition: "The total impression a company or product makes on its audience — built from visual identity, tone of voice, values, and every experience a user has. Brand is what people feel, not just what they see.",
    whyItMatters: "A brand isn't a logo — it's a reputation, built one interaction at a time. Every design decision either reinforces or undermines it. Teams that treat brand as a visual afterthought end up with products that look polished but feel hollow.",
    example: "\"The feature works technically, but it doesn't feel like us — the copy is formal, the colours are off-brand, and the interaction style doesn't match the rest of the product. This needs a brand pass before it ships.\"",
    related: ["Brand Identity", "Tone of Voice", "Design System", "Style Guide"] },

  { term: "Bug", category: "Development", level: "Beginner",
    definition: "An unintended error in a built product — where the output doesn't behave as expected or doesn't match the design specification. Bugs are caught during QA, user testing, or production use.",
    whyItMatters: "Knowing how to identify and document a bug clearly is part of the designer's role in delivery. A good bug report includes expected behaviour, actual behaviour, steps to reproduce, and a screenshot — giving developers everything they need to fix it.",
    example: "\"The card hover state isn't rendering on Safari — log it as a bug with a screen recording and flag it as blocking before we ship.\"",
    related: ["QA", "Design Specs", "Deployment", "Developer Handoff"] },

  { term: "CSAT", category: "Business", level: "Intermediate",
    definition: "Customer Satisfaction Score. A survey metric — typically a 1–5 or 1–10 scale — that measures satisfaction with a specific interaction, moment, or transaction. Usually collected immediately after the experience.",
    whyItMatters: "CSAT pinpoints moments of friction or delight in a way that broad satisfaction metrics like NPS can't. Low CSAT on a specific flow is a direct signal that the design of that moment needs attention.",
    example: "\"Our CSAT score after the onboarding flow is 2.8 out of 5 — users are completing it but not feeling good about it. That's a design problem, not just a content one.\"",
    related: ["NPS", "Voice Of Customer", "KPI", "Retention"] },

  { term: "CSS", category: "Development", level: "Beginner",
    definition: "Cascading Style Sheets — the language that controls the visual presentation of HTML: layout, colour, spacing, typography, animation, and responsiveness. Every visual decision a designer makes ultimately becomes CSS.",
    whyItMatters: "Designers who understand CSS basics write more accurate specs, have more credible conversations with developers, and avoid designing things that are unnecessarily expensive to build. Knowing what's trivial versus what's complex in CSS is a career asset.",
    example: "\"That gradient border effect is possible in CSS, but it's not straightforward — check with the developer before speccing it. There may be a simpler way to achieve the same feel.\"",
    related: ["Responsive Web Design", "Breakpoints", "Design Specs", "Developer Handoff"] },

  { term: "CTA", category: "Copy", level: "Beginner",
    definition: "Call to Action. The word, phrase, or button that prompts a user to take a specific next step — 'Get started', 'Sign up free', 'Add to cart'. The CTA is where design intent meets user decision.",
    whyItMatters: "The wording, size, position, and contrast of a CTA are among the highest-leverage design decisions on any page. Vague CTAs ('Submit', 'Click here') consistently underperform specific, benefit-led ones. Every page should have one clear primary CTA.",
    example: "\"The CTA says 'Learn more' — that's the weakest possible option. Rewrite it to name what the user gets: 'See how it works' or 'Start your free trial'.\"",
    related: ["Microcopy", "Conversion Rate", "Primary Button", "Visual Hierarchy"] },

  { term: "Card sorting", category: "Research", level: "Intermediate",
    definition: "A research method where participants physically or digitally sort topics, features, or content into groups that make sense to them — used to understand mental models and inform information architecture.",
    whyItMatters: "Card sorting replaces designer assumptions with user logic. The navigation structure that feels obvious to a team that built the product is often completely foreign to users who encounter it fresh.",
    example: "\"Before we restructure the menu, run a card sort with twelve users — let them group the pages themselves. We'll design the IA from their patterns, not ours.\"",
    related: ["Information Architecture", "Mental Model", "Navigation", "Affinity Map"] },

  { term: "Checkbox", category: "UI Elements", level: "Beginner",
    definition: "A form control that lets users select one or more items from a set independently — ticking one doesn't affect others. Checkboxes indicate binary yes/no states or multi-select options.",
    whyItMatters: "Checkboxes and radio buttons are the most commonly confused UI pattern. The rule is simple: multiple answers possible — use checkboxes. Only one answer allowed — use radio buttons. Getting this wrong creates real usability problems.",
    example: "\"Those filter options aren't mutually exclusive — the user can apply multiple at once. Switch from radio buttons to checkboxes so the interaction matches what's actually allowed.\"",
    related: ["Radio Button", "Toggle", "Focused State", "Feedback"] },

  { term: "Cognitive walkthrough", category: "Design Methodologies", level: "Advanced",
    definition: "A usability inspection method where evaluators work through a design step by step, asking at each moment: would a new user know what to do here, and does the interface confirm they did it correctly?",
    whyItMatters: "Cognitive walkthroughs catch first-use problems that designers — who know the system intimately — are blind to. By explicitly voicing each step of a user's reasoning, they surface gaps in affordance, labelling, and feedback.",
    example: "\"Walk through the checkout flow as if you've never seen the product before. At every step, ask: what would I click, and how would I know it worked? Those uncertainty points are what we need to design for.\"",
    related: ["Heuristic Evaluation", "Mental Model", "Usability Test", "Affordance"] },

  { term: "Complementary", category: "Colours", level: "Intermediate",
    definition: "Colours that sit directly opposite each other on the colour wheel. Complementary pairs — blue and orange, red and green, yellow and purple — create maximum contrast and strong visual energy when used together.",
    whyItMatters: "Complementary pairings are attention-grabbing by nature, making them ideal for CTAs and highlights. The key is restraint: one colour should dominate as the palette base while the other appears sparingly as an accent.",
    example: "\"The orange CTA on the navy background is working precisely because it's a complementary pair — the contrast is what makes it impossible to miss.\"",
    related: ["Colour Theory", "Colour Palette", "Analogous", "Contrast"] },

  { term: "Convergent thinking", category: "Methodologies", level: "Intermediate",
    definition: "The mode of thinking where a set of ideas or options is evaluated, filtered, and narrowed toward the best single solution. Convergent thinking follows divergent thinking in any well-run design process.",
    whyItMatters: "Generating ideas is only half the job. The ability to critically evaluate options, apply constraints, and commit decisively to a direction is what turns creative exploration into shipped product.",
    example: "\"We've generated eighteen concepts — now we converge. Each option gets evaluated against our design principles and user research, and we'll pick one direction to develop fully.\"",
    related: ["Divergent Thinking", "Design Thinking", "Double Diamond", "Lean UX"] },

  { term: "Conversational tone", category: "Brand", level: "Beginner",
    definition: "A writing style that reads the way a knowledgeable, helpful person would speak — plain language, short sentences, second person ('you'), contractions where appropriate. The opposite of corporate or technical formality.",
    whyItMatters: "Digital products live or die on their microcopy, onboarding flows, and error messages. Conversational tone transforms those functional moments into experiences that feel warm and human rather than transactional.",
    example: "\"The empty state copy says 'No results were returned for the selected parameters.' Rewrite it conversationally: 'Nothing matched those filters — try broadening your search.'\"",
    related: ["Tone Of Voice", "Microcopy", "Brand Identity", "Copy"] },

  { term: "Data analytics", category: "Testing", level: "Intermediate",
    definition: "The collection and analysis of quantitative data about how users interact with a product — page views, click rates, session durations, funnels, retention curves. Analytics answers 'what is happening' at scale.",
    whyItMatters: "Analytics surface patterns across thousands of sessions that no amount of user interviews could reveal. But they can't explain why — that's qualitative research's role. Used together, they give teams a full picture.",
    example: "\"Analytics show a 70% drop-off on screen three of onboarding. We know the what — now we need usability sessions to understand the why before we redesign it.\"",
    related: ["Conversion Rate", "Bounce Rate", "Heat Map", "KPI"] },

  { term: "Delivery lead", category: "Positions", level: "Intermediate",
    definition: "A role responsible for coordinating the delivery of a product or project — managing timelines, removing blockers, and ensuring design, engineering, and QA work together toward a shared release goal.",
    whyItMatters: "The delivery lead is the team's logistical backbone. For designers, a strong one means dependencies are tracked, blockers are escalated early, and the design work lands in the right hands at the right time.",
    example: "\"Let the delivery lead know the component specs won't be ready until Thursday — they need to know now so they can adjust the sprint plan before dev is blocked.\"",
    related: ["Product Manager", "Product Owner", "Agile", "Sprint"] },

  { term: "Descenders", category: "Typography", level: "Advanced",
    definition: "The strokes of lowercase letters that extend below the baseline — found on 'g', 'j', 'p', 'q', and 'y'. Descenders determine how much vertical space is needed between lines of text.",
    whyItMatters: "When line height is set too tight, descenders from one line visually collide with ascenders from the line below, making text exhausting to read. Generous leading that accounts for descenders is a basic requirement of readable typography.",
    example: "\"Increase the line height — the descenders on the 'y' and 'g' are clipping into the ascenders of the line beneath. It's making the body copy feel cramped.\"",
    related: ["Ascenders", "Baseline", "X-height", "Line Height"] },

  { term: "Design deliverable", category: "Discovery", level: "Beginner",
    definition: "A specific, tangible output produced by a designer for a defined purpose — a wireframe deck, a prototype link, a component spec, a research report. Deliverables are the artefacts that move a project forward.",
    whyItMatters: "Being clear upfront about what deliverable is needed — and why — prevents both over-investing in polish that isn't needed yet and under-investing when specificity matters. The right deliverable depends entirely on the audience and the decision it needs to support.",
    example: "\"What's the actual deliverable for this review? If it's just for internal alignment, a mid-fi wireframe is enough. If engineering is starting next week, we need annotated specs.\"",
    related: ["Design Brief", "Wireframe", "Prototype", "Design Specs"] },

  { term: "Design playback", category: "Business", level: "Intermediate",
    definition: "A structured presentation where a designer walks stakeholders through the thinking behind a design — the problem, the research, the decisions made, and the rationale for each one. Less a show-and-tell, more a narrative.",
    whyItMatters: "The ability to present design with clarity and conviction is as important as the design itself. A playback done well builds stakeholder trust, prevents misinterpretation, and makes it far easier to get alignment and move forward.",
    example: "\"Don't just share the Figma link and ask for feedback — schedule a 30-minute playback. Walk the team through the problem, what you learned, and what you decided. That context changes everything.\"",
    related: ["Stakeholder", "Presentation", "Design Brief", "Product Requirement"] },

  { term: "Design principles", category: "Design Methodologies", level: "Intermediate",
    definition: "A short set of guiding statements that define how design decisions should be made for a specific product or team — values like 'clarity before cleverness' or 'design for real content, not ideal content'.",
    whyItMatters: "Design principles give teams a shared decision-making vocabulary. When two valid design options are debated, principles break the tie — but only if they're specific enough to actually distinguish between options. Generic principles ('be human', 'be clear') don't do that job.",
    example: "\"Before we debate this for another hour, let's check our principles. We said 'progressive, not prescriptive' — which of these two options gives the user more control at each step?\"",
    related: ["Heuristic Evaluation", "Cognitive Walkthrough", "Mental Model", "Affordance"] },

  { term: "Design system", category: "Design System", level: "Intermediate",
    definition: "A complete, living set of standards, guidelines, components, and tools that enables teams to design and build consistently at scale. A design system includes the component library, design tokens, style guide, and documented patterns — all kept in sync.",
    whyItMatters: "As products and teams grow, consistency becomes impossible to maintain through willpower alone. A design system encodes past decisions so every new screen doesn't start from scratch — it starts from a shared foundation that reflects what the team has already decided.",
    example: "\"Before we onboard three new designers, we need the design system properly documented. Right now institutional knowledge lives in people's heads — it needs to live in the system.\"",
    related: ["Component Library", "Design Token", "Style Guide", "Pattern Library"] },

  { term: "DevOps", category: "Development", level: "Advanced",
    definition: "A set of practices that combines software development and IT operations — automating testing, deployment pipelines, and infrastructure management to deliver software more frequently and reliably.",
    whyItMatters: "Understanding DevOps helps designers appreciate the relationship between a design change and its journey to production. When something's blocked by a pipeline failure or needs to go through a release window, DevOps is usually why.",
    example: "\"The fix is ready but it won't ship until Thursday's release window — the DevOps pipeline requires all changes to go through a scheduled deployment, not ad hoc pushes.\"",
    related: ["Deployment", "QA", "MVP", "PR Pull Request"] },

  { term: "Developer handoff", category: "Prototyping", level: "Intermediate",
    definition: "The process of transferring a completed design to engineers for implementation — typically including annotated mockups, interaction notes, component specs, asset exports, and a design file link with all states documented.",
    whyItMatters: "The quality of a handoff directly determines how closely the built product matches the design intent. Incomplete handoffs force developers to make interpretive calls — reasonable guesses that inevitably diverge from what the designer had in mind.",
    example: "\"Before marking this ready for development, check: are all states specced (hover, focused, error, disabled)? Are spacing values using tokens? Is there a note about the animation timing? If any of those are missing, it's not ready.\"",
    related: ["Design Specs", "Prototype", "QA", "Component Library"] },

  { term: "Development", category: "Development", level: "Beginner",
    definition: "The practice of writing code to build software — translating design specifications and product requirements into a functioning product. Development spans front-end (what users see), back-end (servers and data), and everything in between.",
    whyItMatters: "Designers who understand how development works make better decisions. Knowing roughly what's easy versus what's costly to build — and when to ask — leads to designs that are both beautiful and actually buildable within real constraints.",
    example: "\"That interaction is elegant in the prototype, but let's check with development before we commit — it may need custom animation work that isn't in scope for this sprint.\"",
    related: ["MVP", "API", "QA", "Design Specs"] },

  { term: "Divergent thinking", category: "Methodologies", level: "Intermediate",
    definition: "A mode of creative exploration where the goal is to generate as many different possibilities as possible — without filtering, critiquing, or evaluating. The first phase of any good design process before narrowing begins.",
    whyItMatters: "Most teams jump to solutions before the problem space is properly explored. Divergent thinking creates the conditions for better ideas by deliberately postponing judgment. Volume and variety first; quality emerges from selection.",
    example: "\"This is a diverge session — every idea goes on the board, no critiques yet. We want at least fifteen different approaches before we start evaluating any of them.\"",
    related: ["Convergent Thinking", "Design Thinking", "Double Diamond", "Affinity Map"] },

  { term: "Dropdown", category: "UI Elements", level: "Beginner",
    definition: "A UI control that reveals a list of selectable options when triggered — by click, tap, or keyboard. The list appears layered over the surrounding content and closes when a selection is made or the user clicks elsewhere.",
    whyItMatters: "Dropdowns conserve space by hiding choices until needed — but at a usability cost: users can't compare all options simultaneously. For six or fewer choices, visible options (radio buttons, segmented controls) almost always test better.",
    example: "\"We're using a dropdown for the pricing tier selector, but there are only three options. Switch to a visible toggle group — users shouldn't have to click to discover what their choices are.\"",
    related: ["Radio Button", "Accordion", "Navigation", "Progressive Disclosure"] },

  { term: "Easing", category: "Prototyping", level: "Intermediate",
    definition: "The curve that describes how the speed of an animation changes over time. Ease-in starts slow and accelerates; ease-out starts fast and decelerates; ease-in-out does both. Linear means constant speed throughout.",
    whyItMatters: "Nothing in the physical world moves at a constant speed. Linear animations feel robotic precisely because they violate that expectation. Easing is the difference between a UI that feels alive and one that feels mechanical.",
    example: "\"The drawer is sliding in with linear timing — it feels stiff. Switch to ease-out so it decelerates into its resting position. That single curve change will make it feel significantly more natural.\"",
    related: ["Animation", "Micro-interaction", "Interaction", "Prototype"] },

  { term: "Empathy map", category: "Research", level: "Beginner",
    definition: "A visualisation tool that captures what a specific user says, thinks, does, and feels in a given context. It makes implicit user experience visible and shareable across a team.",
    whyItMatters: "Empathy maps surface the gap between what users say and what they actually mean — their public statements versus their private frustrations. That gap is exactly where the most important design opportunities hide.",
    example: "\"From the interviews, users say they find it 'fine' — but in the same breath they describe workarounds that suggest it's far from fine. An empathy map will help us see that tension clearly.\"",
    related: ["Persona", "User Interview", "Affinity Map", "Customer Journey Map"] },

  { term: "Engagement", category: "Testing", level: "Beginner",
    definition: "A measure of how actively users interact with a product — sessions per week, time spent, features used, content consumed, return visits. Engagement indicates whether users are finding real value.",
    whyItMatters: "High acquisition with low engagement means the product is attracting users but not holding them. That's a design and product-market fit problem. Engagement metrics help pinpoint which parts of a product are earning sustained use and which are being abandoned.",
    example: "\"Traffic numbers look great but engagement is flat — users are arriving and leaving without doing anything meaningful. Let's look at what happens between landing and the first meaningful action.\"",
    related: ["Retention", "Bounce Rate", "Conversion Rate", "Data Analytics"] },

  { term: "Eye tracking", category: "Testing", level: "Advanced",
    definition: "A research method that records where users look on a screen in real time — using hardware eye trackers or webcam-based software. Results are typically shown as heat maps of gaze density or as sequential gaze plots.",
    whyItMatters: "Eye tracking reveals the truth about visual attention — where users actually look, not where they say they look or where designers assumed they would. It's especially useful for testing visual hierarchy, banner blindness, and navigation patterns.",
    example: "\"Eye tracking showed users scanning in an F-pattern — the key CTA in the right column was receiving almost zero fixation time. We need to rethink its placement entirely.\"",
    related: ["Heat Map", "Session Recording", "Visual Hierarchy", "Usability Test"] },

  { term: "Feedback", category: "UI Elements", level: "Beginner",
    definition: "The system's visible response to a user action — a loading spinner, a success message, an error alert, a subtle animation. Feedback confirms that the action was received and communicates what happened next.",
    whyItMatters: "Without feedback, users don't know if their action worked. Did the button register? Is the file uploading? Did the form submit? Uncertainty causes users to repeat actions, creating errors, or to assume failure and leave. Every action deserves a response.",
    example: "\"The save button has no loading state — users click it and nothing visibly changes, so they click it again. Add a spinner on click and a confirmation on success.\"",
    related: ["Micro-interaction", "Hover State", "Focused State", "Microcopy"] },

  { term: "Flat design", category: "Colours", level: "Beginner",
    definition: "A visual style that strips away dimensional effects — no gradients, shadows, bevels, or textures. Flat design creates hierarchy purely through colour, typography, and layout, without simulating physical depth.",
    whyItMatters: "Flat design is clean and performs well, but removing visual depth removes natural affordance cues. When everything is flat, users struggle to distinguish interactive elements from static ones — which is why thoughtful use of colour and typography becomes even more critical.",
    example: "\"The flat redesign looks clean, but usability testing showed users couldn't reliably identify which elements were clickable. We need to reintroduce affordance signals without abandoning the flat aesthetic.\"",
    related: ["Affordance", "Visual Hierarchy", "Colour Palette", "White Space"] },

  { term: "Focused state", category: "UI Elements", level: "Intermediate",
    definition: "The visual style applied to an interactive element — input, button, link — when it receives keyboard focus. Typically a visible ring, outline, or glow that moves as the user tabs through a page.",
    whyItMatters: "Focus states are a non-negotiable accessibility requirement. Keyboard-only users, screen reader users, and anyone navigating without a mouse rely entirely on visible focus to know where they are. Removing focus styles to 'clean up' the UI makes the product inaccessible.",
    example: "\"The focus styles have been removed globally with 'outline: none' — that's an accessibility failure. Restore them and style them to match the product aesthetic instead of just deleting them.\"",
    related: ["Accessibility", "WCAG", "Hover State", "Screen Reader"] },

  { term: "Font weight", category: "Typography", level: "Beginner",
    definition: "The thickness of a typeface's strokes, ranging from ultra-thin through regular, medium, semibold, bold, and black. Most modern typeface families include several weights, each with a different visual presence.",
    whyItMatters: "Weight is one of the cleanest hierarchy tools in typography — it creates distinction without introducing a second typeface. Using two or three weights from a single family is usually more coherent than mixing typefaces.",
    example: "\"The page uses four different typefaces to create hierarchy. Simplify it — one typeface in three weights (light, regular, bold) will be more elegant and easier to maintain.\"",
    related: ["Typeface", "Typographic Hierarchy", "Line Height", "Visual Hierarchy"] },

  { term: "Front-end development", category: "Positions", level: "Intermediate",
    definition: "The practice of building the visible, interactive layer of a digital product using HTML, CSS, and JavaScript — translating design specifications into the interfaces users actually interact with.",
    whyItMatters: "Understanding what front-end developers do and how they work helps designers write better specs, have more credible technical conversations, and anticipate what will need extra coordination or careful planning.",
    example: "\"That interaction is elegant in Figma but will require significant custom JavaScript. Talk to a front-end developer before it goes into the spec — they may suggest a simpler pattern that achieves the same goal.\"",
    related: ["CSS", "Design Specs", "Developer Handoff", "Responsive Web Design"] },

  { term: "Funnel", category: "Testing", level: "Intermediate",
    definition: "A sequential model showing how users progress through a defined set of steps toward a goal — from awareness to conversion. Users drop off at each step, creating the widening-to-narrowing shape of a funnel.",
    whyItMatters: "Funnel analysis reveals exactly where users abandon a flow — which tells designers where the design work will have the most measurable impact. Improving a leaky middle step is often worth far more than optimising the final step.",
    example: "\"The purchase funnel is losing two-thirds of users between the cart and the first checkout screen. That's where the design attention needs to go — not on the confirmation page.\"",
    related: ["Conversion Rate", "Bounce Rate", "A/B Testing", "Acquisition"] },

  { term: "Greyscale", category: "Colours", level: "Beginner",
    definition: "A palette restricted to shades of grey from pure white to pure black — no colour information. In design, greyscale is used for wireframing, accessibility contrast testing, and creating neutral backgrounds and UI surfaces.",
    whyItMatters: "Designing in greyscale first forces hierarchy to emerge from layout and typography rather than colour. A design that's clear and readable in greyscale will be even stronger with colour applied. One that relies on colour to make sense has a structural problem.",
    example: "\"Before we finalise the colour choices, let's see the page in greyscale. I want to confirm the hierarchy is working structurally — colour should reinforce it, not create it.\"",
    related: ["Contrast", "Colour Palette", "Visual Hierarchy", "Wireframe"] },

  { term: "Gutters", category: "Alignment", level: "Beginner",
    definition: "The fixed-width gaps between columns in a layout grid. Gutters separate content columns from each other and are a foundational element of any responsive grid system.",
    whyItMatters: "Gutters are what stop a multi-column layout from feeling cramped. They create the breathing room that makes content readable and scannable. Consistent gutters across breakpoints are what make a grid feel intentional rather than improvised.",
    example: "\"The column content is butting right up against the gutter edge — the defined gutter is 24px but the component doesn't respect it. The content needs to stay inside the column, not bleed into the gap.\"",
    related: ["Grid", "Margins", "Spacing", "Breakpoints"] },

  { term: "HCD", category: "Methodologies", level: "Intermediate",
    definition: "Human-Centred Design. A problem-solving philosophy and practice that keeps the needs, behaviours, and experiences of real people at the centre of every design decision — from initial research through to final release.",
    whyItMatters: "HCD is the foundational philosophy of UX design. It challenges the assumption that designers know what users need and replaces it with a disciplined cycle of observation, empathy, prototyping, and testing. Products built this way tend to be both more usable and more successful.",
    example: "\"Before we start sketching solutions, we need to understand the problem from the user's perspective — not ours. That's what HCD asks us to do: empathise before we ideate.\"",
    related: ["Design Thinking", "Double Diamond", "Lean UX", "Affinity Map"] },

  { term: "Hierarchy", category: "UI Elements", level: "Beginner",
    definition: "The visual organisation of interface elements to communicate relative importance — guiding users' eyes from what matters most to what matters least, using size, weight, colour, contrast, and position.",
    whyItMatters: "Without hierarchy, every element competes equally for attention. Good hierarchy is invisible — users move through a page in the intended sequence without being conscious of being guided. Poor hierarchy leaves users overwhelmed and unsure where to start.",
    example: "\"The page has three buttons in the same size and style — there's no hierarchy. Pick one primary action, make it visually dominant, and reduce the others so the right path is obvious at a glance.\"",
    related: ["Visual Hierarchy", "CTA", "Typographic Hierarchy", "Cognitive Load"] },

  { term: "Icon", category: "UI Elements", level: "Beginner",
    definition: "A small graphic element that represents an action, concept, or object in an interface. Icons can function alongside labels (reinforcing meaning) or alone (replacing labels when meaning is universally understood).",
    whyItMatters: "Icons without labels are only as clear as the user's ability to interpret them — which is almost always lower than designers assume. Icon-only navigation consistently performs worse in usability testing than labelled equivalents. When in doubt, label it.",
    example: "\"The settings icon makes sense, but the third and fourth icons in the toolbar are ambiguous without labels. Testing confirmed users couldn't identify them reliably — add labels or tooltips.\"",
    related: ["Tooltip", "Affordance", "Navigation", "Signifier"] },

  { term: "Inclusive design", category: "Accessibility", level: "Intermediate",
    definition: "A design philosophy that considers the full spectrum of human diversity — ability, age, language, situation — from the start of the process, not as an afterthought. Inclusive design produces solutions that work better for everyone.",
    whyItMatters: "Designing for the margins improves the centre. Captions designed for deaf users help anyone in a noisy environment. Large tap targets designed for motor impairments help anyone using a phone one-handed. Inclusion isn't a cost — it's a quality standard.",
    example: "\"If we design this assuming the user has two free hands and perfect vision, we're excluding a significant proportion of people. Let's start from the edge case and expand — the mainstream will be better for it.\"",
    related: ["Accessibility", "WCAG", "Usability", "Cognitive Load"] },

  { term: "Insights", category: "Research", level: "Beginner",
    definition: "Interpreted conclusions drawn from research data that go beyond observation to reveal meaning — connecting what users do to why they do it and what it implies for design.",
    whyItMatters: "Raw research data is not insight. An insight is the moment a pattern in the data becomes a clear implication for action. 'Users abandon the form at step three' is an observation. 'Users abandon because they don't trust us enough yet to share payment details' is an insight.",
    example: "\"The insight from the research isn't just that users are confused — it's that they're confused because the page violates their mental model of how this kind of product usually works. That tells us exactly what to redesign.\"",
    related: ["Affinity Map", "User Research", "Pain Point", "Persona"] },

  { term: "Layout", category: "Colours", level: "Beginner",
    definition: "The arrangement of visual elements on a page or screen — where content, images, navigation, and white space sit relative to each other. Layout is the structural skeleton all other design decisions rest on.",
    whyItMatters: "Layout determines reading order and visual priority before a single word is read. A sound layout makes a complex page feel navigable. A weak layout makes even simple content feel overwhelming.",
    example: "\"The content is good but the layout is undermining it — everything is the same width, same weight, same spacing. We need structure: establish a hierarchy, use columns, and let things breathe.\"",
    related: ["Grid", "Visual Hierarchy", "White Space", "Responsive Web Design"] },

  { term: "Margins", category: "Alignment", level: "Beginner",
    definition: "The space between the edge of a layout and the content within it. Margins create the breathing room that frames content and prevents it from running edge to edge.",
    whyItMatters: "Margins are one of the first signals of design quality. Too tight and the content feels cramped and unpolished; too wide and the content feels lost. On mobile, 16–20px is a widely-used baseline; 24px feels generous.",
    example: "\"On the mobile view, the content runs right to the edge of the screen — there are no margins. Add at least 16px on each side before anything else.\"",
    related: ["Grid", "Gutters", "White Space", "Spacing"] },

  { term: "Microservices", category: "Development", level: "Advanced",
    definition: "An architectural style where an application is built as a collection of small, independently deployable services — each responsible for a specific capability. Contrast with a monolithic architecture where everything is one system.",
    whyItMatters: "Understanding microservices helps designers appreciate why some features are faster to ship than others, why certain changes have unexpected side effects, and why a simple-seeming feature can require coordination across multiple teams.",
    example: "\"The search and the recommendation panel are separate microservices — if either is slow or unavailable, the design needs a graceful fallback. Make sure every state is covered in the spec.\"",
    related: ["API", "MVP", "DevOps", "Development"] },

  { term: "Mid-fidelity", category: "Ideation", level: "Beginner",
    definition: "A design representation between rough sketches and polished, production-ready mockups — structured enough to communicate layout and flow clearly, but without final colour, typography, or visual polish.",
    whyItMatters: "Mid-fidelity is the sweet spot for stakeholder reviews and flow validation. It communicates structure without inviting premature feedback on visual details. It says 'the thinking is here — let's validate the logic before we invest in the polish'.",
    example: "\"I'm presenting at mid-fidelity today — I want alignment on the flow and structure. We'll get to visual design once we've confirmed we're solving the right problem.\"",
    related: ["Low-Fidelity", "High-Fidelity", "Wireframe", "Prototype"] },

  { term: "Miller's Law", category: "Design Methodologies", level: "Intermediate",
    definition: "A cognitive psychology principle from George Miller's 1956 research showing that the average person can hold roughly seven items (plus or minus two) in working memory at once. In design, this informs how many options or steps to present at once.",
    whyItMatters: "Miller's Law gives designers a cognitive basis for constraining complexity. Navigation menus, settings pages, and onboarding flows that push beyond seven simultaneous choices increase cognitive load — and abandonment.",
    example: "\"The navigation has eleven top-level items — that's beyond what users can comfortably hold in working memory. Consolidate, group, or hide secondary items to bring it under seven.\"",
    related: ["Chunking", "Cognitive Load", "Progressive Disclosure", "Information Architecture"] },

  { term: "Mobile-first", category: "Development", level: "Intermediate",
    definition: "A design strategy that begins with the smallest viewport and progressively enhances for larger screens — rather than designing for desktop and trying to squeeze it down. Forces prioritisation of what truly matters.",
    whyItMatters: "Mobile-first is one of the best design constraints available. Limited screen space forces hard decisions about what's essential. Designs that start mobile-first tend to be leaner, more focused, and ultimately better on every screen size.",
    example: "\"Start with the mobile layout — if we can't fit it on mobile, it probably shouldn't be on the page at all. What survives the small screen constraint is what actually matters.\"",
    related: ["Responsive Web Design", "Breakpoints", "Thumb Reachability", "CSS"] },

  { term: "Mockup", category: "Ideation", level: "Beginner",
    definition: "A static, high-fidelity visual representation of a design — showing the intended final look with real or realistic content, accurate typography, colour, and spacing, but without interactive functionality.",
    whyItMatters: "Mockups are where structure becomes visual specification. They communicate design intent with enough precision for stakeholder approval and developer handoff — but because they're static, they're faster to produce than interactive prototypes.",
    example: "\"The wireframes have been signed off — I'm now producing high-fidelity mockups of each screen for the developer handoff. These will be the reference for what gets built.\"",
    related: ["Wireframe", "Prototype", "High-Fidelity", "Design Specs"] },

  { term: "Navigation", category: "UI Elements", level: "Beginner",
    definition: "The system of controls — menus, tabs, breadcrumbs, links, icons — that allows users to move between areas of a product and understand where they are within it at any given moment.",
    whyItMatters: "Navigation is arguably the most consequential design in any product. If users can't find what they need, the quality of the content behind it is irrelevant. Navigation must be designed around how users think about the product — not how the team built it.",
    example: "\"The navigation uses the internal product taxonomy — terms that mean something to the engineering team but nothing to users. Rename everything based on what users are actually trying to accomplish.\"",
    related: ["Information Architecture", "Mental Model", "User Flow", "Dropdown"] },

  { term: "Overlay", category: "UI Elements", level: "Beginner",
    definition: "A semi-transparent or opaque layer that appears behind a modal, drawer, or dialog — visually suppressing the content below to focus user attention on the foreground element.",
    whyItMatters: "An overlay communicates 'your context has changed — deal with this first'. Without it, modals feel visually ambiguous, floating over content rather than in front of it. Overlay opacity signals how much to mentally dismiss the background: high opacity means ignore it, low means it's still present.",
    example: "\"The modal overlay is too light — at 20% opacity the background is still visually competing. Push it to 60% so the modal clearly owns the screen.\"",
    related: ["Modal", "Focused State", "Visual Hierarchy", "Progressive Disclosure"] },

  { term: "PR pull request", category: "Development", level: "Intermediate",
    definition: "A code contribution workflow where a developer proposes changes to a shared codebase for peer review before those changes are merged. PRs allow designers to visually review implemented work before it ships.",
    whyItMatters: "Reviewing PRs before merge is one of the highest-value interventions a designer can make in the delivery process. Catching a spacing error, a missing state, or a wrong colour at PR review takes seconds — catching it after shipping takes a sprint.",
    example: "\"The developer tagged you in the PR for the new card component — review it in staging and compare against the Figma spec before you approve. Check all states, not just the default.\"",
    related: ["QA", "Design Specs", "Deployment", "Developer Handoff"] },

  { term: "Pain point", category: "Research", level: "Beginner",
    definition: "A specific frustration, obstacle, or unmet need that users encounter when trying to accomplish a task. Pain points are discovered through research and are the foundational raw material of user-centred design.",
    whyItMatters: "Pain points ground design in real problems rather than imagined ones. Knowing precisely where and why users struggle gives teams the evidence to prioritise and justify design decisions — and resist the temptation to add features rather than fix what's broken.",
    example: "\"The clearest pain point from research: users can't distinguish required from optional fields until they submit and get errors. That's the first thing we fix.\"",
    related: ["User Interview", "Insights", "Usability Test", "Empathy Map"] },

  { term: "PoC", category: "Development", level: "Intermediate",
    definition: "Proof of Concept. A minimal, focused experiment built to answer one question: is this technically feasible? A PoC isn't meant to be maintained or shipped — it's meant to derisk a decision.",
    whyItMatters: "A PoC answers 'can we build this at all?' before the team spends weeks designing something that might turn out to be technically impossible, impractically expensive, or critically limited by platform constraints.",
    example: "\"Before we design the whole real-time collaboration feature, build a PoC to test the WebSocket infrastructure. We need to know if the tech can support it at our scale before we design around it.\"",
    related: ["MVP", "Prototype", "Hypothesis", "Development"] },

  { term: "Pop-up", category: "UI Elements", level: "Beginner",
    definition: "A content layer that appears above the current page — triggered by user action, a timer, or a behavioural condition. Less disruptive than a modal, pop-ups often don't block interaction with the content behind them.",
    whyItMatters: "Pop-ups are among the most frequently misused patterns in product design. Shown too early or for the wrong reason, they feel intrusive and damage trust. When timed well and triggered by genuine signals of intent, they can add real value without disrupting flow.",
    example: "\"Don't trigger the sign-up prompt on page load — wait until the user has completed a meaningful action. Show it too early and you're interrupting before you've earned the ask.\"",
    related: ["Modal", "Tooltip", "Overlay", "Progressive Disclosure"] },

  { term: "Presentation", category: "Business", level: "Beginner",
    definition: "The structured communication of design work to an audience — typically stakeholders, leadership, or clients — combining narrative, rationale, and visuals to convey both what was designed and why.",
    whyItMatters: "A strong presentation is what gets good work approved and built. Designers who can explain their decisions clearly — who can connect design choices to user needs and business goals — consistently get more of their work through.",
    example: "\"Don't just share a Figma file and ask for feedback — design the presentation. Start with the problem, walk through what you learned, and then show what you designed and why. That structure changes everything.\"",
    related: ["Design Playback", "Stakeholder", "Design Brief", "Design Deliverable"] },

  { term: "Primary button", category: "UI Elements", level: "Beginner",
    definition: "The most visually prominent button on a screen — typically solid-filled and high-contrast — that represents the single most important action available. Any given screen should have at most one primary button.",
    whyItMatters: "When multiple actions share the same visual weight, users hesitate — they have to consciously evaluate which action to take. A single, visually dominant primary button removes that friction. It makes the right next step obvious.",
    example: "\"There are four filled buttons on this screen — they all read as primary. Pick one, make it dominant, and reduce the others to secondary or tertiary styles. The user needs one clear path forward.\"",
    related: ["CTA", "Hierarchy", "Affordance", "Focused State"] },

  { term: "Progressive disclosure", category: "UI Elements", level: "Intermediate",
    definition: "A design pattern where information and controls are revealed progressively — only when the user needs them — rather than presented all at once. Accordions, step-by-step forms, and 'show more' patterns are all examples.",
    whyItMatters: "Progressive disclosure is one of the most effective tools for managing complexity without hiding capability. It gives users a manageable starting point while keeping advanced options accessible for those who need them.",
    example: "\"Move the advanced export options behind a 'More options' toggle — 90% of users never need them, and showing them upfront is making the primary flow feel complicated.\"",
    related: ["Cognitive Load", "Accordion", "Miller's Law", "Navigation"] },

  { term: "Proximity", category: "Design Methodologies", level: "Beginner",
    definition: "A Gestalt principle stating that objects placed near each other are perceived as related. Proximity creates implicit groupings in a layout without requiring borders, lines, or explicit labels.",
    whyItMatters: "Proximity is one of the most powerful layout tools available — and the most underused. Adjusting space between elements is often all that's needed to communicate grouping. Adding boxes and lines where spacing would do the same job creates visual clutter.",
    example: "\"The label for that input is equidistant from its own field and the field above — there's no proximity grouping. Tighten the label-to-field gap so they read as a pair, not as separate items.\"",
    related: ["Visual Hierarchy", "White Space", "Cognitive Load", "Chunking"] },

  { term: "Qualitative", category: "Research", level: "Beginner",
    definition: "Research that captures non-numerical data — words, observations, behaviours, stories. Qualitative methods include interviews, usability tests, contextual inquiry, and diary studies. They answer the 'why' behind user behaviour.",
    whyItMatters: "Quantitative data tells you what is happening across many users. Qualitative research tells you why it's happening for specific ones. The why is where design solutions live — and you can only reach it by talking to and observing real people.",
    example: "\"The drop-off data tells us users are leaving at step three, but it can't tell us why. We need qualitative sessions — six or eight users talking through their experience will give us more actionable insight than any amount of analytics.\"",
    related: ["User Interview", "Usability Test", "Insights", "Affinity Map"] },

  { term: "Radio button", category: "UI Elements", level: "Beginner",
    definition: "A form control that allows users to select exactly one option from a set. Selecting any radio button in a group automatically deselects the others — they're mutually exclusive by design.",
    whyItMatters: "Radio buttons make a mutually exclusive choice explicit and visible. They're generally preferable to dropdowns when there are five or fewer options, because users can compare all options simultaneously before committing.",
    example: "\"The pricing plan selector is a dropdown with three options — switch to radio buttons. Users should be able to see all three plans at once and compare them before choosing.\"",
    related: ["Checkbox", "Toggle", "Dropdown", "Focused State"] },

  { term: "Readability", category: "Typography", level: "Beginner",
    definition: "The ease with which continuous text can be read and understood — determined by typeface, size, line height, line length, letter spacing, and contrast working together. Distinct from legibility, which is about recognising individual characters.",
    whyItMatters: "Even beautiful typography fails if users have to work to read it. Readability is the baseline requirement for any body text. One of the most commonly overlooked factors: optimal line length is 60–75 characters — too wide or too narrow and reading slows down significantly.",
    example: "\"The body text is readable at this size on desktop, but the line length is too wide — it's wrapping at 110 characters. Cap it at 70 characters per line for comfortable reading.\"",
    related: ["Line Height", "Typeface", "Sans Serif", "Contrast"] },

  { term: "Retention", category: "Business", level: "Intermediate",
    definition: "A measure of how many users return to a product over a given period — typically expressed as 7-day, 30-day, or 90-day retention rates. Retention is one of the clearest signals of whether a product is delivering ongoing value.",
    whyItMatters: "Retention is a leading indicator of product health. High acquisition with low retention means the product isn't valuable enough to bring users back. It's consistently more cost-effective to retain existing users than to acquire new ones — which makes improving retention one of the highest-ROI design problems.",
    example: "\"30-day retention has dropped four points since the last release. That's a significant signal — let's look at what changed and what users are saying in the feedback channels.\"",
    related: ["Engagement", "NPS", "Conversion Rate", "KPI"] },

  { term: "Rule of thirds", category: "Alignment", level: "Intermediate",
    definition: "A composition principle that divides any frame into a 3×3 grid and suggests placing key subjects or focal points along the lines or at their four intersections. Borrowed from photography and painting.",
    whyItMatters: "Centred compositions often feel static. The rule of thirds creates visual tension, movement, and interest — making layouts feel more dynamic and natural. It's a useful starting heuristic for hero images, illustrations, and any layout where visual rhythm matters.",
    example: "\"The product shot is centred in the hero — it feels flat. Move the subject to the left third intersection and the design immediately feels more energetic and composed.\"",
    related: ["Golden Ratio", "Visual Hierarchy", "Layout", "Alignment"] },

  { term: "Sans serif", category: "Typography", level: "Beginner",
    definition: "A category of typefaces without the small decorative strokes (serifs) at the ends of letterforms. Inter, Helvetica, Futura, and DM Sans are common examples. Defined by clean, unadorned geometry.",
    whyItMatters: "Sans serifs dominate digital interfaces because they render clearly at small sizes on screen. Their clean geometry works across resolutions and device types — which is why the majority of product UI defaults to a sans serif for body and interface text.",
    example: "\"Use the sans serif for all UI text — it reads cleanly at 14px and below. The display heading can be a serif to add personality at the sizes where serifs actually enhance character.\"",
    related: ["Serif", "Typeface", "Font Weight", "Readability"] },

  { term: "Screen reader", category: "Accessibility", level: "Intermediate",
    definition: "A software tool that converts digital content into spoken audio or braille output, enabling users who are blind or have low vision to navigate and interact with digital interfaces through non-visual means.",
    whyItMatters: "Designing for screen reader compatibility requires thinking carefully about semantic HTML, element labels, reading order, and ARIA attributes. These considerations improve the structural quality of a product for all users — not just those who need a screen reader.",
    example: "\"Those icon buttons have no accessible labels — a screen reader user hears 'button, button, button' with no context. Add descriptive aria-label attributes to every icon-only interactive element.\"",
    related: ["Accessibility", "WCAG", "Focused State", "Inclusive Design"] },

  { term: "Session recording", category: "Testing", level: "Intermediate",
    definition: "A research tool that captures video-like replays of real user sessions — recording mouse movements, clicks, scrolls, and form interactions as they actually happened. Tools like Hotjar and FullStory are common examples.",
    whyItMatters: "Session recordings transform abstract drop-off data into a concrete visual story. Watching a real user encounter a confusing element, try to work around it, and ultimately leave is more persuasive evidence for a redesign than any metric alone.",
    example: "\"Pull up the session recordings for users who didn't complete the onboarding flow — I want to see exactly what they did before they left. The data shows a drop-off but not the story behind it.\"",
    related: ["Heat Map", "Eye Tracking", "Usability Test", "Bounce Rate"] },

  { term: "Signifier", category: "Design Methodologies", level: "Intermediate",
    definition: "A perceivable cue that communicates how something should be used — a label, an icon, a colour, an underline. Where affordances describe what an object can do, signifiers communicate that capability explicitly.",
    whyItMatters: "Modern flat interfaces often lack natural affordances. Signifiers bridge that gap — a button shadow, a chevron icon, or a dashed border tells users what to do when the form of the element doesn't make it obvious. When signifiers are missing, users have to guess.",
    example: "\"The swipe gesture exists but there's no signifier — users in testing didn't discover it. Add a subtle animation or visible indicator so users know swiping is possible.\"",
    related: ["Affordance", "Mental Model", "Cognitive Load", "Hover State"] },

  { term: "Spacing", category: "Alignment", level: "Beginner",
    definition: "The intentional distance between and around design elements — encompassing padding within components, margins around them, and gaps between them. Spacing is one of the primary signals of visual hierarchy and grouping.",
    whyItMatters: "Spacing communicates relationships. Elements that are close together feel related; elements further apart feel independent. A consistent spacing system — like an 8-point grid — makes those relationships predictable and the overall layout feel coherent.",
    example: "\"The spacing between sections is inconsistent — some have 32px, some have 48px, one has 56px. Pick a value from the spacing scale and apply it consistently. The randomness is making the page feel unresolved.\"",
    related: ["8-Point Grid System", "Grid", "Visual Hierarchy", "Design Token"] },

  { term: "Split testing", category: "Testing", level: "Intermediate",
    definition: "An experiment that divides users into groups and shows each a different version of a design or piece of copy — measuring which performs better against a defined metric. Synonymous with A/B testing.",
    whyItMatters: "Split testing is how design debates get settled with data rather than opinion. It removes the highest-paid-person's-opinion effect from decisions that can be measured — and the results are often surprising.",
    example: "\"We've been debating the headline wording for weeks. Set up a split test — run both versions with equal traffic for two weeks, and let user behaviour give us the answer.\"",
    related: ["A/B Testing", "Conversion Rate", "Hypothesis", "Data Analytics"] },

  { term: "Sprint", category: "Methodologies", level: "Beginner",
    definition: "A fixed, short development cycle — typically one or two weeks — in which a team commits to completing a defined set of work. Sprints are the core unit of Agile development, providing rhythm, accountability, and regular review points.",
    whyItMatters: "Understanding sprint cycles is essential for designers working in Agile teams. Design work needs to be one sprint ahead of development — ready to hand off when engineers start — otherwise the team is blocked and design quality suffers under time pressure.",
    example: "\"Design needs to stay a sprint ahead of development — if the engineering team starts the sprint without a completed, specced design, someone is going to have to make decisions that should have been made by design.\"",
    related: ["Agile", "Backlog", "Product Owner", "MVP"] },

  { term: "Task flow", category: "Research", level: "Intermediate",
    definition: "A detailed diagram mapping every step a user takes to complete a specific task — including branching paths, decision points, error states, and recovery routes. More granular than a user flow.",
    whyItMatters: "Task flows surface complexity that wireframes tend to hide. Mapping every step in a task — including the edge cases — before designing prevents the team from discovering missing states at development handoff, when changes are far more costly.",
    example: "\"Map the complete task flow for the password reset before we wireframe it — include every error state and every email timing scenario. There are more branches than it first appears.\"",
    related: ["User Flow", "Customer Journey Map", "Wireframe", "Prototype"] },

  { term: "Testimonial", category: "Brand", level: "Beginner",
    definition: "A direct statement from a real customer describing their positive experience with a product or service. Testimonials are one of the most reliable forms of social proof for reducing purchase anxiety.",
    whyItMatters: "Testimonials work because they transfer trust from a real person to a prospective user. The most persuasive ones are specific — naming a concrete outcome or a real before/after rather than offering vague praise. 'We saved twelve hours a week' outperforms 'It's amazing!'.",
    example: "\"The current testimonials are too generic — anyone could have said them about any product. Source specific, outcome-led quotes that demonstrate real results. That's what builds credibility at the decision point.\"",
    related: ["Social Proof", "Trust", "Brand Identity", "Conversion Rate"] },

  { term: "Trust", category: "Brand", level: "Beginner",
    definition: "The degree to which users feel safe, confident, and comfortable engaging with a product — sharing personal data, making purchases, or committing to ongoing use. Trust is earned through consistency, transparency, and quality.",
    whyItMatters: "Trust is the prerequisite for conversion. No amount of CTA optimisation or landing page copy will overcome a design that feels untrustworthy. Every small inconsistency — a misaligned element, an off-brand colour, a suspicious-looking form — erodes it.",
    example: "\"The checkout page doesn't feel trustworthy — there's no security badge, the form looks generic, and the total only appears after payment details are entered. Any one of those alone would be a concern; all three together are a conversion killer.\"",
    related: ["Social Proof", "Brand Identity", "Testimonial", "Conversion Rate"] },

  { term: "Typography", category: "Copy", level: "Beginner",
    definition: "The craft of arranging type to make language readable, legible, and visually effective — encompassing typeface choice, sizing, weight, spacing, line height, and how all these decisions work in combination.",
    whyItMatters: "Typography is one of the most impactful and most neglected aspects of digital design. Well-considered type communicates personality, aids comprehension, and signals craft. Most users won't consciously notice great typography — they'll just find the product easier and more pleasant to use.",
    example: "\"The typography is technically functional but it's not doing any design work — the scale is flat, the weights aren't creating hierarchy, and the line length is too wide for comfortable reading. It needs a full typographic pass.\"",
    related: ["Typeface", "Line Height", "Font Weight", "Visual Hierarchy"] },

  { term: "User flow", category: "Ideation", level: "Beginner",
    definition: "A diagram that maps the complete path a user takes through a product to accomplish a specific goal — from their entry point to their destination, including every screen and decision point along the way.",
    whyItMatters: "User flows reveal the full scope and complexity of a journey before any individual screens are designed. They prevent designers from solving single screens without understanding how they connect — which is how you end up with beautiful screens that don't work as a product.",
    example: "\"Before we wireframe anything, map the full user flow for registration through to first use. I want to see every step, including email verification, before we design a single screen.\"",
    related: ["Task Flow", "Wireframe", "Prototype", "Information Architecture"] },

  { term: "User research", category: "Research", level: "Beginner",
    definition: "The systematic study of users — their contexts, behaviours, goals, frustrations, and mental models — through direct engagement via interviews, observation, and testing. The evidential foundation of user-centred design.",
    whyItMatters: "User research is the discipline that separates design from decoration. Teams that conduct regular user research — even lightweight studies — consistently make better product decisions, waste less time building wrong things, and create products people actually use.",
    example: "\"We're making a significant change to the navigation — we need user research before we commit to a direction. Even three days of interviews and a card sort would dramatically reduce our risk.\"",
    related: ["User Interview", "Usability Test", "Qualitative", "Affinity Map"] },

  // ── MARKETING (10) ────────────────────────────────────────────────────────
  { term: "Marketing Funnel", category: "Marketing", level: "Beginner",
    definition: "A model describing the stages a potential customer moves through — from first discovering a brand to making a purchase and beyond. Typically: Awareness, Interest, Consideration, Intent, Purchase, and Loyalty.",
    whyItMatters: "The funnel locates where in the customer journey your product needs to work harder. High awareness with low conversion is a middle-funnel problem; strong conversion with poor retention is a bottom-funnel one. You can't fix what you can't locate.",
    example: "\"We have strong top-of-funnel traffic but our consideration-to-purchase drop-off is too high. The issue isn't acquisition — it's the evaluation experience.\"",
    related: ["Conversion Rate", "Acquisition", "Retention", "Bounce Rate"] },

  { term: "SEO", category: "Marketing", level: "Beginner",
    definition: "Search Engine Optimisation. The practice of improving a website's content, structure, and authority so it ranks higher in search engine results pages — driving organic (unpaid) traffic from people actively searching for what you offer.",
    whyItMatters: "Organic search is one of the highest-intent acquisition channels. But SEO is a long game — teams that invest consistently build a compounding advantage. Treating it as an afterthought hands that advantage to competitors.",
    example: "\"The blog content is good, but it hasn't been written for SEO — no keyword targeting, no internal links. It's getting zero organic traffic. Let's fix the strategy before writing more.\"",
    related: ["Organic Reach", "Content Marketing", "Acquisition", "Conversion Rate"] },

  { term: "Customer Acquisition Cost", category: "Marketing", level: "Intermediate",
    definition: "Also called CAC — the total cost of acquiring a single new customer, calculated by dividing total sales and marketing spend by the number of new customers gained in the same period.",
    whyItMatters: "CAC is one of the most important economic metrics in any business. A low CAC is only sustainable if the product retains customers — otherwise you're paying to acquire people who immediately leave. CAC must always be evaluated alongside Lifetime Value.",
    example: "\"Our CAC has doubled since last quarter — paid channels are getting more expensive. We need to improve organic and referral acquisition or the unit economics stop working.\"",
    related: ["Lifetime Value", "Retention", "Acquisition", "KPI"] },

  { term: "Lifetime Value", category: "Marketing", level: "Intermediate",
    definition: "Also called LTV or CLV — the total revenue a business can expect to earn from a single customer across their entire relationship. Typically compared against CAC to assess whether the business model is viable.",
    whyItMatters: "LTV tells you how much you can afford to spend acquiring a customer. If LTV is £200 and CAC is £180, margin is dangerously thin. Improving LTV — through better retention, upsells, or product stickiness — is often more impactful than cutting acquisition costs.",
    example: "\"Our LTV:CAC ratio is 2:1 — that's too low for the risk we're taking. Best-in-class SaaS runs at 3:1 or above. We need to improve retention or reduce what we're spending to acquire.\"",
    related: ["Customer Acquisition Cost", "Retention", "NPS", "KPI"] },

  { term: "Segmentation", category: "Marketing", level: "Intermediate",
    definition: "The practice of dividing a target market or user base into distinct groups — segments — based on shared characteristics: demographics, behaviour, needs, geography, or psychographics. Each segment is then addressed with tailored messaging or product decisions.",
    whyItMatters: "A message that speaks to everyone speaks to no one. Segmentation lets teams prioritise who they're serving and what those people actually need. It's the antidote to generic decisions that try to please all users equally.",
    example: "\"We've been treating all users the same in onboarding, but power users and casual users have completely different goals. We need to segment the flow and speak to each group separately.\"",
    related: ["Persona", "Voice of Customer", "Marketing Funnel", "B2B vs B2C"] },

  { term: "Content Marketing", category: "Marketing", level: "Beginner",
    definition: "A strategy of creating and distributing valuable, relevant content — articles, videos, guides, podcasts — to attract and retain a clearly defined audience, with the goal of driving profitable action over time rather than through direct advertising.",
    whyItMatters: "Content marketing builds trust and authority before a purchase decision is made. Unlike paid ads, good content compounds — a well-optimised article from two years ago can still drive qualified leads today. It's a long-term asset, not a recurring expense.",
    example: "\"Our paid ads are expensive and stop the moment we stop paying. Let's invest in content marketing — educational articles that rank in search and build authority over time.\"",
    related: ["SEO", "Organic Reach", "Brand Identity", "Marketing Funnel"] },

  { term: "Paid Media", category: "Marketing", level: "Beginner",
    definition: "Advertising that requires direct payment to reach an audience — search ads (Google), social ads (Meta, LinkedIn), display advertising, and sponsored content. Results are immediate but stop the moment spending stops.",
    whyItMatters: "Paid media is the fastest way to reach a specific audience at scale. But it's a rented channel — costs typically rise over time and results stop immediately when spend stops. Most sustainable growth strategies combine paid with owned and organic channels.",
    example: "\"Paid media is driving 80% of our acquisition — that's a single point of failure. If CPCs rise or the platform changes its algorithm, we lose overnight. We need to invest in owned channels in parallel.\"",
    related: ["Organic Reach", "Customer Acquisition Cost", "Marketing Funnel", "Conversion Rate"] },

  { term: "Organic Reach", category: "Marketing", level: "Beginner",
    definition: "The audience reached through unpaid channels — search engine rankings, social media without paid boosting, word of mouth, direct traffic, and referrals. Organic reach is earned over time rather than bought.",
    whyItMatters: "Organic reach is the most cost-efficient acquisition channel when it works — but it takes time and consistency to build. Businesses that invest in SEO, content, and community early create a compounding advantage that competitors struggle to replicate quickly.",
    example: "\"60% of our traffic is organic — our strongest channel and it cost us nothing this month. Protect it by keeping the site fast and the content current.\"",
    related: ["SEO", "Content Marketing", "Paid Media", "Acquisition"] },

  { term: "Brand Positioning", category: "Marketing", level: "Intermediate",
    definition: "How a brand is perceived in the minds of its target audience relative to competitors. Positioning defines the unique space a brand occupies — its promise, its differentiation, and the reason someone would choose it over an alternative.",
    whyItMatters: "Positioning is the strategic foundation everything else is built on. Without a clear position, marketing messages conflict, product decisions lack direction, and users can't articulate why they'd choose you. A strong position makes every downstream decision easier.",
    example: "\"We're positioned as 'affordable' when our product is actually premium. That mismatch brings in price-sensitive customers who churn immediately. We need to reposition — and that means changing the messaging, the price point, or both.\"",
    related: ["Brand Identity", "Tone of Voice", "Persona", "B2B vs B2C"] },

  { term: "Go-to-Market Strategy", category: "Marketing", level: "Intermediate",
    definition: "A plan for launching a product or feature to market — covering target audience, value proposition, pricing model, distribution channels, and marketing approach. A GTM strategy answers: who are we selling to, how will they find us, and why will they buy?",
    whyItMatters: "A great product with a poor GTM strategy will underperform a good product with a sharp one. The launch moment is when positioning, messaging, and channel decisions all converge — and mistakes made here are expensive and slow to recover from.",
    example: "\"Before we set a launch date, we need a GTM strategy. Who's the primary audience? What's the positioning? Which channels will we use and in what order? Those decisions need to be made before the product ships.\"",
    related: ["Brand Positioning", "Segmentation", "Marketing Funnel", "KPI"] },

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
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.name, c]));

const DOMAINS = [
  { id: "All",            name: "All" },
  { id: "Product Design", name: "Product Design" },
  { id: "Engineering",    name: "Engineering" },
  { id: "Business",       name: "Business" },
  { id: "Marketing",      name: "Marketing" },
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
          <div style={{ height:1, background:"#F1F5F9", marginBottom:26 }}/>
          <section style={{ marginBottom:26 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#94A3B8", marginBottom:10 }}>In a real conversation</p>
            <div style={{ background:"#1A1A2E", borderRadius:14, padding:"20px 22px", borderLeft:`4px solid ${cat.accent}` }}>
              <p style={{ fontSize:15, color:"#E2E8F0", lineHeight:1.65, margin:0, fontStyle:"italic" }}>{word.example}</p>
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
