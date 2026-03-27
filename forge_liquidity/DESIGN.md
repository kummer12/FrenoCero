```markdown
# Design System Specification: Industrial Liquidity & Precision

## 1. Overview & Creative North Star: "The Kinetic Forge"
The Creative North Star for this design system is **"The Kinetic Forge."** This concept bridges the raw, tactile world of mechanical engineering with the fluid, high-frequency nature of blockchain liquidity. 

To move beyond a "standard" fintech template, this system rejects the flat, paper-like layouts of Silicon Valley. Instead, it embraces **Industrial Brutalism refined by Digital Precision.** We achieve this through:
*   **Intentional Asymmetry:** Breaking the 12-column grid with "offset" data visualizations that mimic technical blueprints.
*   **Tonal Depth:** Replacing harsh borders with layered, metallic surfaces that feel like machined components.
*   **High-Contrast Utility:** Using neon accents not as decoration, but as "status indicators" found on high-end diagnostic machinery.

---

## 2. Colors & Atmospheric Depth

### Palette Definition
The palette is rooted in deep slates and metallic blues, punctuated by high-visibility "Logic Accents."

*   **Foundation:** `background` (#0b1326) and `surface` (#0b1326). These are deep, non-neutral slates that provide a more sophisticated "midnight" feel than pure black.
*   **Primary (Liquidity):** `primary` (#00dce5) — An electric cyan-blue representing flow and digital assets.
*   **Secondary (Success):** `secondary` (#d7ffc5) — A neon-tinted green for growth metrics and "Go" states.
*   **Tertiary (Industrial):** `tertiary` (#b4c8e2) — A muted metallic blue used for inactive states or secondary information.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Boundaries must be defined solely through background color shifts. To separate a sidebar from a main feed, use `surface-container-low` against the `background`. To define a card, use `surface-container-high`. If elements feel "lost," increase the spacing rather than adding a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass or machined aluminum:
1.  **Base Layer:** `surface` (#0b1326) - The workshop floor.
2.  **Section Layer:** `surface-container-low` (#131b2e) - Defined zones.
3.  **Component Layer:** `surface-container-high` (#222a3d) - Individual interactive units.
4.  **Elevation Layer:** `surface-container-highest` (#2d3449) - Modals and active states.

### The "Glass & Gradient" Rule
To achieve a "Metallic" soul, use linear gradients (45-degree angle) for primary CTAs:
*   **Button Gradient:** From `primary` (#00dce5) to `on-primary-container` (#009ca2).
*   **Glassmorphism:** For floating overlays, use `surface-variant` (#2d3449) at 60% opacity with a `20px` backdrop-blur.

---

## 3. Typography: The Blueprint Hierarchy

We utilize a dual-typeface system to balance technical authority with digital readability.

*   **Display & Headlines (Space Grotesk):** This is our "Technical" face. Its geometric apertures mimic industrial stencils. Use `display-lg` (3.5rem) for token balances and `headline-md` (1.75rem) for section titles.
*   **Body & Labels (Inter):** Our "Utility" face. Inter provides maximum legibility for complex financial data. Use `body-md` (0.875rem) for all descriptive text.
*   **Visual Authority:** Maintain a high contrast between Headline and Body. If a headline is `headline-lg`, the supporting text should be `body-sm`. This "Editorial Gap" creates an authoritative, premium feel.

---

## 4. Elevation & Depth: Tonal Layering

### The Layering Principle
Depth is achieved by "stacking" the surface-container tiers. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural lift without needing a shadow.

### Ambient Shadows
When an element must "float" (e.g., a dropdown), use an **Ambient Shadow**:
*   **Color:** `on-primary-fixed-variant` (#004f53) at 8% opacity.
*   **Blur:** 32px.
*   **Spread:** -4px.
*   *Note: Never use pure black shadows; they muddy the slate-blue backgrounds.*

### The "Ghost Border" Fallback
If a border is required for accessibility, it must be a **Ghost Border**:
*   **Token:** `outline-variant` (#44474c).
*   **Opacity:** 15%.
*   **Weight:** 1px.

---

## 5. Components: Machined Precision

### Buttons
*   **Primary:** Gradient fill (`primary` to `on-primary-container`), `on-primary` text, `xl` (0.75rem) rounded corners.
*   **Secondary:** `surface-container-highest` background, `primary` text. No border.
*   **Interaction:** On hover, increase the gradient intensity; do not change the background color to a flat hex.

### Cards & Lists
*   **Constraint:** Forbid divider lines.
*   **Structure:** Separate list items using `spacing-2` (0.4rem) and alternating `surface-container-low` and `surface-container-lowest` backgrounds. 
*   **Metrics:** Liquidity metrics should use `secondary` (#d7ffc5) for positive growth, styled in `title-md` Inter with a semi-bold weight.

### Input Fields
*   **State:** Default state uses `surface-container-highest`. 
*   **Focus:** The "Electric Pulse" — A 1px ghost border of `primary` with a subtle 4px outer glow of the same color.
*   **Typography:** Labels must use `label-sm` in `tertiary-fixed-dim` for a "dimmed dashboard" effect.

### Special Component: The Tokenization Gauge
A custom circular or linear progress bar using `secondary` for the "filled" state and `surface-variant` for the "track." This should look like a mechanical pressure gauge.

---

## 6. Do’s and Don’ts

### Do
*   **DO** use `spacing-8` (1.75rem) and `spacing-10` (2.25rem) to create "Breathing Room" between unrelated data sets.
*   **DO** use industrial-grade icons with a consistent 2px stroke weight.
*   **DO** use `tertiary` colors for "Secondary" metadata (e.g., timestamps, transaction hashes).

### Don't
*   **DON'T** use pure white (#FFFFFF). Always use `on-surface` (#dae2fd) to maintain the dark-mode eye comfort.
*   **DON'T** use standard "Material Design" shadows. They look "cheap" against metallic slates.
*   **DON'T** use Sharp corners. While the system is industrial, the `xl` (0.75rem) and `lg` (0.5rem) radiuses signify modern, high-end software.
*   **DON'T** use red for warnings if you can avoid it. Try `error_container` (#93000a) to keep the "Hot Metal" aesthetic rather than a "Software Error" look.```