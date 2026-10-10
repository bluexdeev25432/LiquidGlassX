import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Resvg } from '@resvg/resvg-js';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  IconAdjustmentsHorizontal,
  IconColorFilter,
  IconGlassFull,
  IconShieldCheck,
} from '@tabler/icons-react';

const destination = resolve('..', 'tweak/Preferences/Resources');
const icons = [
  ['IconGlassFull', IconGlassFull],
  ['IconAdjustmentsHorizontal', IconAdjustmentsHorizontal],
  ['IconShieldCheck', IconShieldCheck],
  ['IconColorFilter', IconColorFilter],
];

await mkdir(destination, { recursive: true });

for (const [name, Icon] of icons) {
  const svg = renderToStaticMarkup(createElement(Icon, {
    size: 72,
    stroke: 1.7,
    color: '#9CE8D0',
  }));
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 144 } }).render().asPng();
  await writeFile(resolve(destination, `${name}.png`), png);
}