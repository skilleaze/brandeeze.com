# Brandeeze Design System

Brandeeze is a full-service agency covering six services: Branding, Video and content, Performance marketing, Social media, Automation, and Web and software. The logo puts one bar on each service: in the wordmark BRANDEEZE, the first two E's are drawn as six Marigold bars and the final E stays a letter. Website: brandeeze.com (I couldn't open it, so nothing here is taken from it).

**Source:** `uploads/Brand Book Barandeeze-53ad25a5.pdf` (42 pages, current). The pages were converted to `brandbook/v2/p01–p42.svg`. `brandbook/svg/` holds pages from the earlier "Brandeez" book, which is superseded.

## Index
- `styles.css`: entry point, made up only of `@import` lines
- `tokens/`: `colors.css`, `typography.css`, `spacing.css`, `fonts.css`, `base.css`
- `assets/logo/`: wordmark (on dark, on light, on Marigold, all white), monogram (Marigold, Noctis, white), app icons (primary, alternate). `assets/logo.svg` is the primary wordmark.
- `assets/icons/`: the 24 Lucide-style stroke icons the brand uses
- `assets/imagery/`: landscape photos, each in colour and black and white
- `assets/fonts/`: Archivo woff2 files, weights 400–900
- `guidelines/`: specimen cards for the foundations (Brand, Colors, Type, Spacing)
- `components/`: React primitives (listed below)
- `thumbnail.html`: the project's homepage tile

## Components
- Actions: Button, IconButton
- Brand: Logo, Monogram, BarMarker
- Display: Card, Badge, Tag, SectionLabel, Icon (plus ICON_NAMES)
- Forms: Input, Select, Checkbox, Radio, RadioGroup, Switch
- Feedback: Dialog, Toast, Tooltip
- Navigation: RunningHead, Tabs

**Intentional additions:** the brand book defines no UI components, so this set was written as a standard set in the brand's style. `--bz-signal-error` is the one colour not in the brand book; use it only for form errors.

## Logo rules (Brand Book §02)
- The wordmark is set in Archivo ExtraBold capitals. The two E's become six bars.
- Approved versions: Primary (white letters on Noctis), Light (Noctis letters on white), On Marigold (all Noctis), Mono (all white).
- Monogram: the two E's on their own. Use it for avatars, favicons, app icons and stamps.
- Construction: bar height = x. Gap between bars 0.7x, bar width 3.1x, space between the two E's 0.5x, total height 4.4x.
- Clear space: one E's width on every side. Minimum size: wordmark 120 px or 30 mm; monogram 24 px or 8 mm.
- Don't: stretch, recolour the bars, rotate, colour the letters Marigold, put Marigold bars on Marigold, or outline the bars.

## Visual foundations
- **Colour:** Noctis `#1F2235` is the main ground and text colour. Marigold `#E3A419` is for the bars, the monogram and emphasis, and should be used sparingly. White `#FFFFFF` is for letters on Noctis, and Ground `#F3F2F2` is the page background. Both Marigold and the warm greys have 100–900 ramps.
- **Type:** Archivo is the only typeface. Display text is ExtraBold 800 capitals, headings are SemiBold 600 in sentence case, body text is Regular 400 at 135% line height, and labels are capitals tracked at 0.1em.
- **Layout:** every page has a running head (monogram, BRANDEEZE, section on the right) above a hairline rule. Lists use rule-separated rows, each with a label on the left and a bold value on the right. Section numbers (01, 02…) appear in Marigold.
- **Surfaces:** flat colour blocks with square corners and no shadows or gradients. Cards are a block of colour or a set of rules.
- **Imagery:** landscape photos, either in colour or converted to black and white.

## Iconography
Thin-stroke line icons in the Lucide style (`assets/icons/*.svg`), drawn with Noctis or currentColor strokes. Use them through `<Icon name="…" />`. No emoji. The bar, as `BarMarker`, is the brand's own bullet.
