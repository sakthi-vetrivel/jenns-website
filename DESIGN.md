---
# gstack: design-md-format=spec
name: Jenn's Notebooks
description: A workbench in afternoon light. Sun-struck leather, ink on linen paper, few words, one object made by hand for one person.
colors:
  primary: "#2F4390"          # fountain-pen blue: the single CTA, links, selected rings, focus
  on-primary: "#F9F6EF"
  primary-hover: "#243677"
  surface: "#F9F6EF"          # insert paper: the order ticket, luggage-tag blocks
  surface-2: "#E3DACB"        # suede: preview stage, hover states
  background: "#F1ECE2"       # washed linen: the page ground
  text: "#1C1F2B"             # iron-gall ink, blue-black. Never pure black, never brown
  text-muted: "#6B675E"       # graphite
  rule: "#CFC6B3"             # 1px hairlines, ledger style
  accent: "#2F4390"           # same as primary; there is only one accent
  success: "#4B6B4A"          # moss
  warning: "#A8772B"          # ochre
  error: "#8C2F2F"            # oxblood
  leather-natural: "#C99C6B"  # tint fallbacks for the preview only; real swatches are photos
  leather-cognac: "#B5622E"
  leather-mustard: "#C9962E"
  leather-cherry: "#A8202A"
  leather-burgundy: "#5E2A32"
  leather-black: "#1A1613"
typography:
  display:
    fontFamily: "'Young Serif', Georgia, serif"
    fontWeight: 400
    fontSize: clamp(2rem, 5.6vw, 6rem)
    lineHeight: 0.98
    letterSpacing: -0.02em
  heading:
    fontFamily: "'Young Serif', Georgia, serif"
    fontWeight: 400
    fontSize: clamp(1.75rem, 3.5vw, 3rem)
    lineHeight: 1.05
    letterSpacing: -0.01em
  body:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontWeight: 400
    fontSize: 1.0625rem
    lineHeight: 1.55
  label:
    fontFamily: "'Source Serif 4', Georgia, serif"
    fontWeight: 500
    fontSize: 0.75rem
    letterSpacing: 0.08em
    textTransform: uppercase
  mono:
    fontFamily: "'Courier Prime', 'Courier New', monospace"
    fontWeight: 400
    fontSize: 0.8125rem
    letterSpacing: 0.04em
    fontFeature: tnum
rounded:
  none: 0px
  sm: 2px
  md: 4px
  lg: 8px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 96px
  4xl: 160px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
    fontFamily: "{typography.label.fontFamily}"
    letterSpacing: "{typography.label.letterSpacing}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.text}"
    borderColor: "{colors.text}"
    rounded: "{rounded.sm}"
  link:
    textColor: "{colors.primary}"
    textDecoration: none
  link-hover:
    textDecoration: underline
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.rule}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  input-focus:
    borderColor: "{colors.primary}"
  swatch:
    borderColor: transparent
    borderWidth: 1px
    rounded: "{rounded.sm}"
  swatch-selected:
    borderColor: "{colors.primary}"
    outlineOffset: 3px
  ticket:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.rule}"
    rounded: "{rounded.none}"
    padding: "{spacing.xl}"
  tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    fontFamily: "{typography.mono.fontFamily}"
    padding: "{spacing.md}"
  nav-link:
    textColor: "{colors.text}"
    fontFamily: "{typography.body.fontFamily}"
  hairline:
    borderColor: "{colors.rule}"
    borderWidth: 1px
---

# Jenn's Notebooks

## Overview

**Creative North Star:** Luxury/Refined warmed by Organic. A workbench in afternoon light: one hand-made leather notebook, sun-struck and honest, on a page that reads like paper and ink. The memorable thing is "an heirloom object, made by hand for you," so every screen shows one object, says little, and leaves a blank for the visitor's name.

**Product context:** A marketing and custom-order site for Jenn, who hand-makes leather traveler's notebooks (leather cover, elastic cord closure, refillable inserts, optional stone charm, optional hand-stamped initials). Six saturated leathers today: natural, cognac, mustard, cherry, burgundy, black. Customers configure an order, submit it, and pay by Venmo; every order lands in a Google Sheet Jenn owns. No cart, no checkout. Static site on Vercel. Buyers are mostly women 25 to 45 who journal, plan, and travel, and who arrive from Instagram on a phone in daylight. Peers: Louise Carmen (Paris, restrained, all-Garamond), Dôen (California, sun-bleached editorial), Chic Sparrow and Foxy Fix (American craft Shopify).

**Mode per surface:**
- Home: Persuade. One object per viewport, the constraint said out loud, one link.
- Notebooks: Persuade, then Read. One leather per viewport with a note on how it ages.
- Order: Operate. A long ticket with numbered sections and a live total.
- Confirmation: Read. A full-page ticket with the Venmo handle, the order number, and one sentence in Jenn's voice.

**Reference sites:** https://www.louisecarmen.com, https://shopdoen.com, https://www.chicsparrow.com

**Approved mockups:** `~/.gstack/projects/sakthi-vetrivel-jenns-website/designs/design-system-20260912/variant-A.png` (home hero) and `variant-B.png` (order ticket). Copies live in `design/reference/` in this repo.

**Key characteristics:**
- A photograph too big and too honest to be stock, owning 60% of the first viewport.
- Blue-black ink on washed linen. The UI has no brown; the leather brings every warm color.
- A chunky upright serif set huge, once per screen, with its last word touching the photo.
- Hairline ledger rules and a typewriter face for the order number, price, and queue.
- Nothing centered except the confirmation ticket.

## Colors

**Strategy:** Restrained. One accent, used rarely. Fountain-pen blue is the only color the UI owns; it carries the single CTA, links, the selected-state ring, and focus. Everything else is paper, suede, ink, and graphite.

**Light or dark:** Light, and it stays light. The product is paper, buyers look at it in daylight on a phone, and the reference world (Dôen's sun-bleached linen) is light. A dark theme would flatter the leather and betray the scene. Do not build a dark mode.

Named rules:
- `text` is iron-gall blue-black. Never `#000`, never a brown. Brown on cream is the category default and it is refused here.
- `primary` carries interaction. `text` set in `display` carries emphasis. Weight and size are the only emphasis tools; no gradient text, no italics for emphasis.
- Neutrals derive from paper: background is washed linen, surface is the whiter insert paper, surface-2 is suede. Surfaces step lighter as they come forward (ticket on page), darker as they recede (preview stage).
- Leather colors are photographs. In the configurator every leather swatch is a cropped macro photo of the real hide. The `leather-*` tokens exist only to tint a preview layer or fill a fallback; they are never UI chrome, never a button, never a badge.
- Semantic colors are quiet: moss for success, ochre for warning, oxblood for error. Each appears as a text color or a hairline, not a filled banner.

## Typography

Type comes from the object's world: a notebook, a brass stamp, a receipt.

- **Young Serif** is the display voice. A chunky, low-contrast old-style with soft terminals, from the world of 1970s paperback jackets and hand-cut lettering. It looks like something you could strike into leather. One weight, upright only; there is no italic, which is the point. Set it huge (the `display` token) once per screen, or as `heading` for section titles. Never in body text, never in the ticket.
- **Source Serif 4** is body and label. A modern book face with optical sizes, so it holds up at 17px on a phone and at 12px tracked uppercase for labels. Labels are the Dôen and Louise Carmen convention: tiny, uppercase, tracked 0.08em. Use weight 500 for labels and 400 for reading; do not use 600 or 700.
- **Courier Prime** is the mono, and it is fenced. It appears only where the site behaves like a receipt: order numbers, prices, the live queue, the luggage-tag block on the hero, section numbers on the ticket, the running total, and the confirmation. If Courier appears in a headline, a nav item, or a paragraph, that is a bug. A typewriter face reads cheap the moment it leaks.

Loading: Google Fonts, one `<link>` with `display=swap`, families `Young+Serif`, `Source+Serif+4:opsz,wght@8..60,400;8..60,500`, `Courier+Prime:wght@400;700`. Preconnect to fonts.gstatic.com. Fallback stack is Georgia so a slow load still reads as a book.

Scale: display is a `clamp` from 32px on a phone to 96px on desktop; heading from 28px to 48px; body 17px; label 12px; mono 13px. Levels differ by more than a weight. Nothing sits within a step of body size.

No exceptions were made to the overused list. EB Garamond was rejected because Louise Carmen uses it and copying the reference is not a design.

## Layout

Creative-editorial. A 12-column grid on desktop that every composition breaks asymmetrically: 5/7 for the hero, 55/45 for the order page, 4/8 for text beside a photo. Max content width 1280px with 32px gutters on desktop, 24px on tablet, 20px on phone. Density is low: sections are padded 96px to 160px (`3xl` to `4xl`); the ticket interior uses 16px and 24px. Big step between sections, small step inside a ticket.

- **Home hero:** the photograph owns the right 60% of the viewport, full-bleed to the edge, hard shadow falling left. Wordmark "JENN" small top-left in Young Serif; nav is two words top-right: Notebooks / Order. The headline sits lower-left in three short lines and its last word overlaps the photo edge by a few characters, so type and object touch. One link under it: "Make yours →". Bottom-right, pinned like a luggage tag, a mono block on `surface`: order number, leather, size, `MADE FOR ______`.
- **Below the fold:** no product grid. One leather per viewport, each a full-bleed photograph with a mono note on how it ages. Between them, one mono receipt block that says the constraint out loud: no cart, no checkout, you tell me what you want, I make it, you Venmo me. Under it the live queue from the sheet.
- **Order page ("the cutting table"):** left 55% is a sticky preview stage on `surface-2` with a large photo of the current configuration and a mono caption. Right 45% is one long scrolling ticket on `surface`, sections numbered in mono with hairline rules between them. A fixed footer strip carries the total in mono on the left and the one primary button on the right. On phones the preview collapses to a sticky 180px strip at the top and the ticket runs full width.
- **Mobile:** the hero stacks photo above headline, still left-aligned, photo full-bleed. Nav stays two words; no hamburger.

What breaks the grid on purpose: the headline's last word crossing into the photo, and the luggage tag pinned to the viewport corner.

## Elevation & Depth

Depth is shown with surface steps and hairlines, not shadows. The ticket sits on the page as a lighter surface with a 1px `rule` border. The preview stage recedes as darker suede. The only shadow on the site is inside the photographs. The one exception is the debossed personalization preview: stamped initials render with a 1px inset shadow (offset 1px 1px, dark at 25% alpha) plus a 1px highlight below, so the letters look pressed into leather rather than printed on it. Never a zero-offset glow, never a card drop shadow, never a frosted panel.

## Shapes

Square by default. Radius hierarchy: `none` for the ticket, inputs, and photographs; `sm` (2px) for buttons and swatches, just enough to not look cut with a knife; `md` (4px) for the tag block; `lg` (8px) is reserved and currently unused; `full` only for the elastic-cord color dots, which are round because cords are round. Nested elements use inner radius = outer radius minus the gap, which at these sizes means nested elements are square.

## Components

- **button-primary:** the only filled element on the site. One per screen. Label in the `label` style (uppercase, tracked). Hover darkens to `primary-hover`; focus-visible shows a 2px `primary` outline offset 3px; active shifts 1px down; disabled drops to 40% opacity and keeps its color. The label names the outcome: "Reserve my notebook," never "Submit."
- **button-ghost:** text with a 1px `text` border, for the rare secondary action ("Start over"). Same states as primary with the border carrying the color.
- **link:** `primary`, no underline at rest, underline on hover and focus. The hero link "Make yours →" is this component set in `body` size.
- **input:** `surface` fill, 1px `rule` border, square, mono placeholder in `text-muted`. Focus swaps the border to `primary`. Error swaps it to `error` and adds a one-line mono message below. The stamp input shows a live character count in mono.
- **swatch (leather):** a square photo crop, 64px on desktop, 56px on phone, 1px transparent border. Selected gets a 1px `primary` border with a 3px gap (outline-offset), so the ring floats off the photo. Changes snap; no crossfade.
- **swatch (cord):** a 28px circle of the cord color, `full` radius, same selected ring. The one place a flat color is allowed as a swatch, because a cord is a flat color.
- **ticket:** `surface` with a 1px `rule` border and 32px padding. Sections are numbered `01`, `02` in mono, titled in `label`, separated by hairlines. The ticket never scrolls inside itself; the page scrolls.
- **tag:** the luggage-tag block. `surface`, mono, 16px padding, `md` radius, pinned to a viewport corner on the hero.
- **nav-link:** `body` face, `text` color, no underline; the current page gets a 1px `text` underline offset 4px.
- **hairline:** 1px `rule`. The site's only divider.

### The order ticket, in order

The form asks exactly these, in this order. Each is a numbered section on the ticket.

1. **01 Leather:** which color. Photo swatches: natural, cognac, mustard, cherry, burgundy, black (grow this list from the sheet).
2. **02 Size:** Full size or Passport. Two text options with dimensions in mono under each.
3. **03 Edges:** Rounded corners, yes or no. Two text options.
4. **04 Cord:** which color. Round color dots.
5. **05 Charm:** none, or yes, then where: on the spine or on the front, then a description of the charm and an optional photo of it. One of description or photo is required. The photo is downscaled in the browser and saved to Jenn's Drive by the sheet script; the sheet row gets the link. The where, description, and photo fields appear only after yes.
6. **06 Stamp:** none, or yes, then the initials (short text input with a live count) and where (spine, front, or inside cover). Preview renders debossed.
7. **07 You:** name, email, phone. Delivery method: meet at Noe Valley Town Square, or an address for delivery. The address fields appear only when delivery is chosen.
8. **08 Payment:** a statement, not a form. Total in mono, then: pay by Venmo to Jenn's handle after she confirms by hand within a day. The button reads "Reserve my notebook."

Submission writes one row to the Google Sheet. The confirmation page repeats the order number, the configuration as a ticket, the Venmo handle with a QR, and the one sentence from Jenn.

Every component designs its empty, loading, error, and long-content states. A ticket with nothing selected shows the preview stage with the natural leather and a mono caption "Start with a leather." A failed submission keeps every field and says, in mono under the button, what happened and that nothing was charged.

## Do's and Don'ts

- Do: put one photograph and one headline in the first viewport, and nothing else but the nav, the link, and the tag.
- Do: keep Courier Prime inside the ticket, the tag, the queue, and prices. Nowhere else.
- Do: left-align everything; the only centered composition is the confirmation ticket.
- Do: use real leather photographs as swatches, cropped square, color-graded to the site's light.
- Do: say the constraint plainly in Jenn's voice: no cart, Venmo, made by hand, confirmed within a day.
- Don't: use any brown, tan, or terracotta in the UI. If it isn't a photograph, it isn't brown.
- Don't: build a product grid, a three-column feature row, icons in circles, a testimonial carousel, or a stats row.
- Don't: use an italic anywhere in display or heading. Young Serif has none and Source Serif 4's italic is for citations in body text only.
- Don't: add CSS leather grain, kraft-paper textures, wax seals, stitched borders, script fonts, or dried-flower photography.
- Don't: crossfade swatch changes, fade sections in on scroll, zoom photos on hover, or add parallax. The only motion is the two moments below.
- Don't: use "Get started," "Learn more," "Explore," "Seamless," or "Handcrafted with love." Name the outcome: "Make yours," "Reserve my notebook."

## Motion

- **Approach:** minimal-functional, plus two authored moments.
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:** micro(50-100ms) short(150-250ms) medium(250-400ms) long(400-700ms)
- **The one authored moment: the page turn.** Clicking "Make yours" turns the page. The hero's left panel (linen ground, headline, link) is the page: it lifts from its right edge and turns over toward the left across roughly 700ms with move easing, a soft gradient darkening its underside as it passes vertical, revealing the order ticket beneath. The photograph stays put through the turn, so the object is the constant and the page moves around it. Implement it with a 3D rotateY on a wrapper with perspective, driven by the View Transitions API where available and a plain CSS transition otherwise. It plays once per navigation, never on scroll. With `prefers-reduced-motion`, the turn is replaced by a 200ms crossfade.
- **The secondary moment: the stamp.** On hero load, the headline appears as flat ink, then over 600ms ease-out an inset shadow deepens and the letters shift 1px down and right, like a brass stamp lifting off leather. Plays once per session. Reduced-motion gets the final state.
- Everything else is a hard cut or a short transition: swatch selection snaps, the total ticks with a 150ms color pulse in `primary`, hover states change in 150ms, the conditional sections of the ticket (charm where, stamp where, address) expand in 250ms ease-out.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-12 | Initial design system created | Created by /design-consultation from research on Louise Carmen, Dôen, and Chic Sparrow, plus an independent subagent direction. User confirmed the memorable thing as "an heirloom object, made by hand for you." |
| 2026-09-12 | Ink-blue accent, no brown in the UI | Every leather shop is cream and brown; Jenn's leathers are saturated (mustard, cherry, burgundy), so the UI stays paper-and-ink and the photographs own all color. |
| 2026-09-12 | Young Serif display, Source Serif 4 body, Courier Prime fenced to the ticket | Object-world faces: a stamp, a book, a receipt. Subagent proposed a grotesk body; overruled because the reference world is all-serif and "heirloom" reads better in a book face. |
| 2026-09-12 | Home hero: mockup A approved; order page: mockup B approved | User: "A is really beautiful." Headline overlaps the photo edge; tag pinned bottom-right. |
| 2026-09-12 | Page-turn animation on "Make yours" opens the order flow | User request. Replaces the stamp settle as the primary authored moment; stamp kept as secondary. |
| 2026-09-12 | Charm section takes a description and an optional photo, stored in Drive | User request. Keeps every order artifact inside Jenn's Google account. |
| 2026-09-12 | Order ticket fields fixed at eight numbered sections | User-supplied list: leather, size (full/passport), rounded edges, cord color, charm (spine/front), stamp (initials, where), contact + delivery (Noe Valley Town Square meetup or address), Venmo payment statement. |
