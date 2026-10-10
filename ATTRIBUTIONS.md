# Third-Party Attributions

## Tabler Icons

Website icons are rendered from the locally installed `@tabler/icons-react` package (Tabler Icons v3.49.0). Source: [tabler-icons/tabler-icons](https://github.com/tabler/tabler-icons). License: [MIT](https://github.com/tabler/tabler-icons/blob/main/LICENSE).

The Preferences bundle contains 144 px PNG renditions generated from Tabler React SVG components using the same package. The vector design is retained; only rasterization, stroke color, and output size differ for UIKit/PreferenceLoader compatibility. Regenerate these assets with the website package's `icons:preferences` task.

## Fonts

- **Manrope** by The Manrope Project Authors, distributed by [`@fontsource/manrope`](https://github.com/fontsource/fontsource/tree/main/fonts/google/manrope). License: [SIL Open Font License 1.1](https://openfontlicense.org/).
- **Space Grotesk** by The Space Grotesk Project Authors, distributed by [`@fontsource/space-grotesk`](https://github.com/fontsource/fontsource/tree/main/fonts/google/space-grotesk). License: [SIL Open Font License 1.1](https://openfontlicense.org/).

Font files are bundled locally by the website build; the site does not fetch fonts from a third-party runtime CDN. Each upstream Fontsource package includes its copyright and OFL notice.

## SVG Rasterizer

`@resvg/resvg-js` is a development-only tool for rendering the Preferences PNG assets. It is not required by the website at runtime.