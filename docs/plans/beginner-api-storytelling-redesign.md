# Beginner API Storytelling Redesign

Status: implemented and verified on 2026-08-09

## Objective

Redesign the beginning of the landing page so a person who has only heard the
term API can understand why APIs exist, where they are useful, and how that
knowledge improves collaboration with a development team.

The target visitor may work in marketing, HR, accounting, finance, operations,
or another non-development role. They may use an LLM to describe or create tools
for work, but they do not naturally describe their work as interactions between
systems or data sources.

The page must retain its formal API curriculum. The redesign changes the order
and entry point: familiar work first, formal terminology second, manual practice
third, deeper implementation later.

## Success Statement

A visitor who leaves after the opening should be able to explain:

> An API is an agreed way for a tool to get information or request an action
> from another place. It is useful when we need a repeatable, controlled
> connection instead of moving information manually. I do not need to build it
> myself, but I know what to discuss with the development team.

## Product Principles

### Begin With Work, Not Architecture

Use words such as place, tool, information, report, and action before introducing
system, data, request, response, endpoint, or JSON.

The first example is a weekly report assembled from several familiar places:
an advertising platform, a spreadsheet, and a finance or accounting tool.

### Teach Recognition Before Operation

The primary outcome is recognizing when an API may help. Manually making an API
request is useful later because it makes the formal idea concrete, not because
every visitor is expected to become an API practitioner.

### Support Better Collaboration

The opening must give visitors useful questions for a development conversation:

- Does the tool where this information lives offer an API?
- What information or actions does it expose?
- What permissions are required?
- How current does the information need to be?
- What should happen if the connection fails?

### State Limits Honestly

APIs are useful, not universal. The opening must explain that:

- A one-time task may be easier to complete manually.
- An API cannot provide information its owner does not expose.
- Access may be restricted, paid, or unavailable.
- A successful connection does not prove the information is correct.
- A workflow still needs validation and a failure path.

### Position LLMs Accurately

An LLM can help clarify a workflow, read documentation, draft connection code,
explain errors, and transform a returned result. It does not automatically have
access to private or current workplace information. Official API documentation
and development review remain authoritative.

## Opening Narrative

The opening is a complete short lesson, not a teaser for material farther down
the page. It should fit within roughly the first two screenfuls on a typical
desktop and remain concise on mobile.

### Act 1: Familiar Work

Every Monday, a person opens several tools, finds the latest numbers, copies
them, changes their formats, and pastes them into a weekly report.

### Act 2: Friction

The information lives in different places that organize it differently. The
person understands the desired report but repeats the same transfer by hand.

### Act 3: The API Idea

The report tool can ask each place directly. Each place remains different; it
only agrees on how a specific question must be asked and what answer it returns.
That agreed way to ask and answer is an API.

Preferred plain-language definition:

> An API is an agreed way for one tool to ask another tool for information or
> request an action, without needing to understand everything happening inside
> it.

Formal transition:

> Developers describe this as a contract between systems.

### Act 4: Practical Value

Explain concrete benefits without promising effortless automation:

- Less repetitive copying and pasting
- More current information
- Fewer transcription mistakes
- Repeatable processes
- Controlled access to approved information
- Connections between tools made by different organizations

### Act 5: Use Cases

Use department-specific examples:

- Marketing: bring current campaign results into a weekly summary.
- HR: send approved employee details into an onboarding process.
- Accounting: move invoice information without entering it twice.
- Finance: use current rates in a report or internal calculator.

### Act 6: Collaboration And LLMs

Clarify responsibilities:

- The person defines the work goal and validates the outcome.
- The LLM can help describe and draft the tool.
- The API defines what another tool permits.
- The development team validates implementation, security, and reliability.

## Information Architecture

The revised main-page sequence is:

1. Split hero with the weekly-report hook
2. Beginner story and plain-language definition
3. Benefits, limitations, and representative use cases
4. Development collaboration and the role of an LLM
5. Formal request, processing, and response model
6. Guided manual API request
7. Detailed authentication and security
8. Analysis and visualization
9. LLM-assisted build workflow
10. Advanced labs

The existing history, Python comparison, security details, playground, charts,
and advanced material remain. History and code should become optional or later
detail instead of prerequisites for the first successful interaction.

## Layout Direction

### Hero

Replace the centered `min-h-dvh` hero with an asymmetric split layout.

- Desktop: left-aligned copy beside the primary illustration.
- Mobile: headline, illustration, short explanation, then action.
- Keep the existing restrained palette and theme behavior.
- Make the beginning of the explanation visible without requiring a full
  viewport scroll.
- Use a short headline and a concrete weekly-report lead.
- Avoid a decorative eyebrow pill, gradient text, glow effects, and oversized
  centered prose.

Suggested content direction:

Title: `What is an API?`

Lead: `Imagine preparing a weekly report without opening five tools, copying
numbers, and fixing their formats.`

Bridge: `Your report could ask each place for the information it needs. An API
is the agreed way that request happens.`

Primary action: `See how it works`

The final copy must be written naturally in both English and Spanish rather than
translated word for word.

### Beginner Story Section

Create a new section component after the hero. A working name is
`BeginnerStory.tsx`; use the smallest clear name that fits the final structure.

Do not build a uniform grid of interchangeable feature cards. Use an editorial
sequence with varied visual weight:

- One dominant narrative block
- One supporting before-and-after explanation
- One large plain-language definition set in type
- An asymmetric set of department use cases
- A compact suitability and limitations comparison
- A practical list of questions for a development team

HTML text must carry all meaning. Illustrations support the explanation.

### Formal Section

Reorder `WhatIsApi.tsx` so the formal request and response explanation follows
the beginner story naturally.

- Introduce technical terms only after the plain-language model.
- Present Python as code an LLM or developer may generate, not prerequisite
  knowledge.
- Put the history timeline in a native disclosure or a clearly optional block.
- Move the flight-search analogy earlier only if it still adds information after
  the weekly-report story; otherwise avoid repeating the same lesson.
- Place the detailed security curriculum after the first guided request when
  practical. Keep two essential safety statements earlier: verify generated API
  details against official documentation, and never expose secret keys.

### Playground

Add a recommended first path before exposing the full provider-oriented UI.

- Describe the goal before the provider.
- Give short numbered instructions for one default request.
- Explain what result the learner should look for.
- Present formatted output first.
- Label raw JSON as what the tool received behind the scenes.
- Keep advanced parameter control available.

When touching playground behavior, correct the known mismatch where hidden
defaults can appear in the URL while visible inputs remain blank, and reset old
response state when switching APIs if that behavior is still present.

### Build Section

Reframe the five steps around an LLM-assisted work process:

1. Define the work outcome.
2. Find the official source and API documentation.
3. Ask the LLM or development team to draft the connection.
4. Test inputs, outputs, permissions, and failures.
5. Protect credentials and deploy only when needed.

Framework names can remain as optional implementation detail. Do not make
choosing FastAPI or Express the first decision for the target audience.

## Illustration System

Use the `nano-banana-illustration` skill and its supplied scripts. Never create a
custom API request or expose the Gemini key.

### Shared Art Direction

Extend the current professional technical style with authored editorial
illustration. Use concrete workplace materials instead of abstract software
architecture in the opening.

- Restrained cobalt blue, emerald, amber, charcoal, and neutral palette
- Crisp geometric forms with subtle printed-paper texture
- Directional light and asymmetrical composition
- Hands and workspace rather than a generic office team
- No gradients, glossy 3D blobs, Corporate Memphis figures, neon glows, or
  floating AI symbols
- No text, logos, fake brand interfaces, watermarks added by the prompt, or
  critical information embedded in the image
- All generated output is JPEG and includes Nano Banana's invisible SynthID
  provenance watermark

Images need an intentional matte or framed surface because JPEG has no alpha
channel and the page supports both light and dark themes.

### Asset 1: Primary Hook

Tier: Pro

Target: 2K, 4:3

Placement: right side of the desktop hero, between headline and explanation on
mobile

Purpose: make the weekly-report problem recognizable before introducing API
terminology.

Prompt direction:

> A professional editorial illustration of a real working desk viewed from a
> slightly elevated three-quarter angle. Only a person's hands are visible. One
> hand is gathering information from several clearly different workplace
> materials: a spreadsheet grid, a campaign performance chart, an invoice, and
> a financial table. The other hand is assembling a concise weekly report at
> the center. Thin, purposeful visual paths show information moving toward the
> report without becoming a technical network diagram. Restrained cobalt blue,
> emerald green, amber, charcoal, and off-white palette. Crisp geometric forms
> with subtle printed-paper texture, controlled daylight from the upper left,
> asymmetrical composition, generous breathing room. No text, no logos, no
> gradients, no floating AI symbols, no futuristic interface.

Generate inexpensive composition studies first. Render the approved final
composition with Pro rather than spending Pro calls on broad exploration.

### Asset 2: Manual To Connected Explanation

Tier: Flash

Target: 2K, 16:9

Purpose: contrast repeated manual movement with one agreed connection. Keep the
same visual language by supplying the approved primary image as a style
reference.

HTML provides the labels `Without a connection` and `With an API`. Do not ask the
model to render them.

The visual must not suggest that APIs turn unlike tools into one universal
language. The tools remain distinct and agree only on the relevant exchange.

### Assets 3 Through 6: Department Vignettes

Tier: Lite

Target: 1K, 1:1

Subjects:

- Marketing campaign results entering a weekly summary
- Approved employee information entering onboarding
- Invoice information entering an accounting process
- Current rates entering a financial model

Use the primary image as the first style reference. Generate multiple cheap
variations and select a coherent set. These vignettes must illustrate specific
uses rather than act as generic feature icons.

### Generation Workflow

1. Check authentication without printing or recording the key.
2. Generate several Lite composition studies for the primary scene.
3. Select the strongest silhouette and information flow.
4. Finish the primary asset with Pro at 2K.
5. Use the approved primary asset as the reference for Flash and Lite images.
6. Fix isolated defects by editing the existing image with `-i`.
7. Inspect hands, object relationships, accidental words, unwanted logos,
   cropping, color consistency, and mobile readability.
8. Store final assets as `.jpg` under `public/images/api-story/`.

## Image Integration

- Use `next/image` for every generated asset.
- Mark only the hero image as `priority`.
- Supply accurate responsive `sizes` values.
- Localize meaningful alternative text in both message files.
- Use empty alternative text when the adjacent HTML caption fully duplicates a
  decorative vignette.
- Avoid conveying sequence or state through color alone.
- Test image crops at narrow mobile widths and common desktop widths.
- Preserve legibility in light and dark themes.

## Localization And Writing

Add every new content key to both `src/messages/en.json` and
`src/messages/es.json` with matching structure and meaning.

Writing constraints:

- Use familiar workplace language before technical vocabulary.
- Keep sentences concrete and varied in length.
- Avoid hype, generic AI language, and claims of effortless automation.
- Do not use em or en dashes.
- Follow the repository rule against double hyphens in user-facing content.
- Correct obvious punctuation and spelling errors in Spanish content touched by
  the redesign.
- Do not leave portions of the Spanish experience in English when those strings
  are part of the new opening.

Suggested translation namespace areas:

- `hero`
- `beginnerStory`
- `nav.startHere`
- additions under `tryIt`
- revised `buildOwn`

## Navigation

Prefer outcome-oriented labels over course terminology where space permits.
The opening section can use `start-here` as its ID.

Update together:

- `src/components/layout/Navbar.tsx`
- `src/hooks/useScrollSection.ts`
- hero CTA target
- English and Spanish navigation labels

Verify that adding another desktop link does not crowd the locale and theme
controls. Mobile navigation must close after selecting the link.

## Accessibility And Motion

- Maintain logical heading levels.
- Keep instructional body text at least 14 to 16 pixels.
- Maintain WCAG AA contrast for normal text.
- Ensure interactive disclosures work with the keyboard.
- Add visible focus states where existing shared styles do not provide them.
- Respect `prefers-reduced-motion` for hero and scroll animations.
- Do not make content unavailable when animation is disabled.
- Keep all essential illustration meaning in nearby text.

## Implementation Phases

### Phase 1: Content And Structure

- Finalize English opening copy.
- Write equivalent natural Spanish copy.
- Add translation keys.
- Add the beginner story component and revised page order.
- Convert the hero to its split arrangement using a temporary neutral image
  frame if final assets are not ready.

### Phase 2: Illustration Production

- Generate and review composition studies.
- Produce the final Pro, Flash, and Lite assets.
- Integrate with `next/image` and responsive behavior.

### Phase 3: Formal Curriculum Reordering

- Reorder the analogy, request flow, optional history, code, and security.
- Add progressive disclosure without deleting formal material.
- Ensure section numbering and navigation remain coherent.

### Phase 4: Guided Practice And Build Reframe

- Add the recommended playground path.
- Fix touched default and stale-response behavior.
- Rewrite the build steps for LLM-assisted collaboration.

### Phase 5: Quality Pass

- Review both locales end to end.
- Test light and dark themes.
- Test desktop and mobile layouts.
- Audit for generic AI design and writing patterns.
- Verify all internal anchor links and image references.
- Run the complete automated verification suite.

## Expected Files

Likely additions and edits include:

- `src/app/[locale]/page.tsx`
- `src/components/sections/Hero.tsx`
- `src/components/sections/BeginnerStory.tsx`
- `src/components/sections/WhatIsApi.tsx`
- `src/components/sections/TryItYourself.tsx`
- `src/components/sections/BuildYourOwn.tsx`
- `src/components/playground/ApiPlayground.tsx`
- `src/components/layout/Navbar.tsx`
- `src/hooks/useScrollSection.ts`
- `src/app/globals.css`
- `src/messages/en.json`
- `src/messages/es.json`
- `public/images/api-story/*.jpg`

Use fewer files if the implementation remains clear. Do not create abstractions
solely to match this projected list.

## Verification

Run:

```bash
npm test
npm run lint
npm run build
```

Manual checks:

- `/en` and `/es`
- Light and dark themes
- Narrow mobile, tablet, and desktop widths
- Hero image loading and layout shift
- Every new anchor and CTA
- Keyboard operation of disclosures and navigation
- Reduced-motion behavior
- No generated text or accidental logos in illustrations
- The first two screenfuls communicate the complete beginner lesson

## Acceptance Criteria

- A non-developer can understand the opening without knowing what a software
  system or data source is.
- The weekly-report story reaches a plain-language API definition quickly.
- The opening explains benefits, limits, representative use cases, and useful
  development-team questions.
- The role of an LLM is useful but accurately bounded.
- The Pro illustration is visible as a hook near the top of the first page.
- Supporting illustrations are consistent and instructional.
- Formal API depth remains available after the introduction.
- English and Spanish are complete and semantically aligned.
- The page works on mobile and desktop in both themes.
- Tests, lint, and production build pass.

## Out Of Scope

- Redesigning all nine advanced labs
- Replacing the complete site identity or typography system
- Turning the course into a no-code integration builder
- Promising that an LLM can securely integrate private tools without review
- Removing technical API material from the formal learning path
- Committing or deploying without explicit user approval
