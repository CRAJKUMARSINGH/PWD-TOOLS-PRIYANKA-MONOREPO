// basic.test.ts
import { readFileSync } from 'fs';
import path from 'path';

test('JATAKS database loads', () => {
  const file = path.resolve(__dirname, '../Vedic_Rajkumar/src/data/jataks/JATAKS_DATABASE.json');
  const data = JSON.parse(readFileSync(file, 'utf-8')) as any;
  expect(Array.isArray(data.jataks)).toBe(true);
  expect(data.jataks.length).toBeGreaterThan(0);
});
