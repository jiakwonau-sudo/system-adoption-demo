# V4 Design System — Quiet Premium Enterprise

Status: ACTIVE
Applies to: `/v4/` Commercial Field Service Training Twin
Updated: 2026-09-28

## Intent

The product should feel like a premium consumer product applied to enterprise work:

- calm before clever
- clear before dense
- spacious at summary level, progressively denser in operational detail
- one obvious primary action at a time
- software that disappears behind the task

The visual language is original. It takes inspiration from the public product principles seen in premium services such as Airbnb and Toss, but does not copy their layouts, proprietary fonts, brand colors, or components.

Reference inspiration:
- Airbnb-style public design-system observations: strong whitespace grouping, hairline borders, rounded cards, restrained typography, minimal decorative shadows.
- Toss design-system principles: progressive density, one primary action, interaction colors used for interaction rather than decoration, restrained elevation, accessibility built into components.

References:
- https://github.com/nexu-io/open-design/blob/main/plugins/_official/design-systems/airbnb/DESIGN.md
- https://toss.tech/article/toss-design-system

---

## 1. Product personality

**Quiet confidence.**
The UI should feel expensive because it removes noise, not because it adds decoration.

Keywords:
- precise
- calm
- tactile
- spacious
- trustworthy
- operational
- human

Avoid:
- dashboard chrome everywhere
- heavy gradients
- glowing neon accents
- excessive shadows
- tiny enterprise typography
- five equally strong buttons in one view
- decorative icons that compete with task information

---

## 2. Layout philosophy

### Summary → detail = progressive density

At the summary layer:
- larger typography
- fewer cards
- more whitespace
- key metrics and next action only

At the detail layer:
- denser tables/forms
- tighter metadata groups
- more operational evidence

### Spacing scale

Base unit: **8 px**

Preferred scale:
- 4
- 8
- 12
- 16
- 24
- 32
- 40
- 48
- 64

Default content padding:
- desktop large card: 24 px
- compact operational card: 16 px
- mobile horizontal gutter: 16–20 px

---

## 3. Typography

Use system fonts only.

Stack:
`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Scale:
- Display: 40–52 / 700
- Page title: 28–32 / 700
- Section title: 20–24 / 650–700
- Card title: 16–18 / 650
- Body: 14–16 / 400–500
- Metadata: 12–13 / 500
- Caption: 11–12 / 500

Rules:
- Never use 7–9 px for operational content.
- Keep labels compact but readable.
- Use weight and whitespace before introducing additional colors.
- Use tabular numerals for quantities, durations, money, readiness and inventory.

---

## 4. Color

### Neutrals
- Canvas: `#F7F7F5`
- Surface: `#FFFFFF`
- Surface subtle: `#F4F4F1`
- Text: `#191B1A`
- Text muted: `#717572`
- Hairline: `#E7E7E3`

### Product accent
- Teal interaction: `#0B8F87`
- Teal soft: `#E5F5F2`

Use teal for:
- current selection
- buttons / active controls
- success/readiness
- focus / interactive state

Do **not** use accent color as large decorative background areas.

Semantic:
- Warning: warm amber
- Error: muted rose
- Info: desaturated blue
- Success: teal/green

---

## 5. Radius and elevation

Radius:
- small controls: 10–12 px
- cards: 18–20 px
- hero/large panel: 24 px
- pills: 999 px

Elevation:
- default card: no visible shadow, hairline border
- floating/important panel: one subtle neutral shadow only
- modal: stronger neutral shadow + backdrop

Premium = restraint.

---

## 6. Cards

Cards are used only when they represent a meaningful object:
- Work Order
- Resource Candidate
- Customer Asset
- Agreement
- IoT Alert
- Scenario
- Workflow Demo

Cards should not wrap every sentence.

A card should have:
1. object/category label
2. clear title
3. one or two pieces of meaningful metadata
4. one primary action or obvious click target

---

## 7. Buttons and actions

Rule: **one dominant action per task state.**

Primary:
- solid near-black or interaction teal
- minimum 44 px touch height
- short verb phrase

Secondary:
- white / subtle neutral
- hairline border

Danger:
- muted rose, never bright red unless destructive confirmation

Never:
- two equal primary buttons side-by-side
- icon-only actions without accessible label

---

## 8. Scenario Library

Scenario cards should feel like premium listing cards:
- large whitespace
- no decorative shadow by default
- clear scenario name
- role chips
- object/workflow summary
- estimated demo time
- "Open scenario" as one primary action

Scenario library is the first-class demo navigation.

Required scenarios:
1. Reactive Break/Fix
2. Preventative Maintenance Agreement
3. IoT Predictive Maintenance
4. Schedule Disruption / Reassignment
5. Inspection Failure / Follow-up
6. Inventory Replenishment
7. RMA / RTV Return
8. Back Office Completion / Posting
9. Offline Technician / Sync

---

## 9. Workflow Library

Every workflow should be individually launchable.

Workflow row/card:
- role
- workflow name
- target system area
- training modes available
- source-grounded status
- launch action

The learner/demo viewer should never be forced to run the full end-to-end scenario just to show one workflow.

---

## 10. Training modes

### Guided
- visible context
- why this step matters
- preferred path
- error prevention

### Practice
- reduced guidance
- outcome visible
- learner chooses path

### Assessment
- no coaching
- required task/decision validation
- readiness evidence recorded

Visual treatment changes subtly by mode. No theatrical theme switch.

---

## 11. Motion

Use motion only for:
- selected state
- dialog opening
- card/menu transition
- progress update
- toast

Default:
- 160–220 ms
- ease-out

Respect `prefers-reduced-motion`.

No looping decorative animation.

---

## 12. Accessibility

- minimum 44 px primary touch targets
- visible focus state
- native controls where possible
- no color-only status communication
- responsive to large text
- meaningful icon labels
- mobile layout must work at 360 px
- tables may use local horizontal scroll, never page-level overflow

---

## 13. Commercial-demo rule

The system should look real enough to sell the delivery capability, while clearly stating:

- Training Twin
- synthetic demo data
- original UI
- Microsoft-documented workflow semantics
- not a pixel clone of Dynamics 365 Field Service

The demo's job is to prove:
**"We can reconstruct a real role workflow into a safe, polished, measurable training environment."**
