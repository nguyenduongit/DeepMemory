import AdmZip from 'adm-zip';
import { countries } from 'countries-list';
import { geoMercator, geoPath } from 'd3-geo';
import isoCountries from 'i18n-iso-countries';
import { mkdir, mkdtemp, rm, writeFile, copyFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { open } from 'shapefile';

const NATURAL_EARTH_URL =
  'https://naturalearth.s3.amazonaws.com/50m_cultural/ne_50m_admin_0_countries.zip';

const COUNTRY_CODES = `
AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG MK NO OM PK PW PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VE VN YE ZM ZW PS VA
`.trim().split(/\s+/);

const CONTINENT_LABELS = {
  AF: 'Châu Phi',
  AS: 'Châu Á',
  EU: 'Châu Âu',
  NA: 'Bắc Mỹ',
  OC: 'Châu Đại Dương',
  SA: 'Nam Mỹ',
};

const CAPITAL_OVERRIDES = {
  VN: 'Hà Nội',
  CN: 'Bắc Kinh',
  KP: 'Bình Nhưỡng',
  LA: 'Viêng Chăn',
  KH: 'Phnôm Pênh',
  MN: 'Ulaanbaatar',
  BN: 'Bandar Seri Begawan',
};

const NAME_OVERRIDES = {
  BO: 'Bolivia',
  BN: 'Brunei',
  CD: 'Cộng hòa Dân chủ Congo',
  CG: 'Cộng hòa Congo',
  CI: 'Bờ Biển Ngà',
  CZ: 'Séc',
  FM: 'Micronesia',
  GB: 'Anh',
  IR: 'Iran',
  LA: 'Lào',
  MD: 'Moldova',
  PS: 'Palestine',
  RU: 'Nga',
  SY: 'Syria',
  TL: 'Đông Timor',
  TZ: 'Tanzania',
  US: 'Hoa Kỳ',
  VA: 'Vatican',
  VE: 'Venezuela',
};

const clean = (value) => String(value ?? '').replaceAll('\0', '').trim();

async function downloadNaturalEarth(destination) {
  const response = await fetch(NATURAL_EARTH_URL);
  if (!response.ok) throw new Error(`Natural Earth download failed: ${response.status}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

async function readCountryFeatures(shpPath, dbfPath) {
  const source = await open(shpPath, dbfPath);
  const byCode = new Map();

  while (true) {
    const result = await source.read();
    if (result.done) break;

    const properties = result.value.properties;
    const candidates = [
      properties.ISO_A2,
      properties.ISO_A2_EH,
      properties.WB_A2,
      properties.POSTAL,
    ].map(clean);
    const code = candidates.find((candidate) => COUNTRY_CODES.includes(candidate));
    if (!code) continue;

    const features = byCode.get(code) ?? [];
    features.push(result.value);
    byCode.set(code, features);
  }

  return byCode;
}

function renderMapSvg(features, label) {
  const geo = features.length === 1
    ? features[0]
    : { type: 'FeatureCollection', features };
  const projection = geoMercator().fitExtent([[18, 18], [302, 222]], geo);
  const path = geoPath(projection)(geo);
  if (!path) throw new Error(`Could not render map for ${label}`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" role="img" aria-label="Bản đồ ${label}"><path d="${path}" fill="#a5b4fc" stroke="#6366f1" stroke-width="1.5" stroke-linejoin="round"/></svg>\n`;
}

async function main() {
  const projectRoot = process.cwd();
  const flagDirectory = join(projectRoot, 'public', 'country-flags');
  const mapDirectory = join(projectRoot, 'public', 'country-maps');
  const generatedDataPath = join(
    projectRoot,
    'src',
    'modules',
    'world-countries',
    'data.generated.ts',
  );
  const workingDirectory = await mkdtemp(join(tmpdir(), 'deepmemory-countries-'));

  await mkdir(flagDirectory, { recursive: true });
  await mkdir(mapDirectory, { recursive: true });
  await mkdir(join(projectRoot, 'src', 'modules', 'world-countries'), { recursive: true });

  try {
    const archivePath = join(workingDirectory, 'natural-earth.zip');
    await downloadNaturalEarth(archivePath);
    new AdmZip(archivePath).extractAllTo(workingDirectory, true);

    const featuresByCode = await readCountryFeatures(
      join(workingDirectory, 'ne_50m_admin_0_countries.shp'),
      join(workingDirectory, 'ne_50m_admin_0_countries.dbf'),
    );

    const vietnameseNames = isoCountries.getNames('vi');
    const missingMaps = [];
    const generatedCountries = [];

    for (const [sortOrder, code] of COUNTRY_CODES.entries()) {
      const country = countries[code];
      const features = featuresByCode.get(code);
      if (!country) throw new Error(`countries-list has no data for ${code}`);
      if (!features?.length) {
        missingMaps.push(code);
        continue;
      }

      const codeLower = code.toLowerCase();
      const vietnameseName = NAME_OVERRIDES[code] || vietnameseNames[code] || country.name;
      const capital = CAPITAL_OVERRIDES[code] || country.capital;
      const continent = CONTINENT_LABELS[country.continent];
      if (!capital || !continent) throw new Error(`Incomplete country data for ${code}`);

      await copyFile(
        join(projectRoot, 'node_modules', 'flag-icons', 'flags', '4x3', `${codeLower}.svg`),
        join(flagDirectory, `${codeLower}.svg`),
      );
      await writeFile(
        join(mapDirectory, `${codeLower}.svg`),
        renderMapSvg(features, vietnameseName),
      );

      generatedCountries.push({
        id: `country-${codeLower}`,
        code,
        code3: isoCountries.alpha2ToAlpha3(code),
        vietnameseName,
        internationalName: country.name,
        capital,
        continent,
        flagUrl: `/country-flags/${codeLower}.svg`,
        mapUrl: `/country-maps/${codeLower}.svg`,
        sortOrder,
      });
    }

    if (missingMaps.length > 0) {
      throw new Error(`Natural Earth has no matched map for: ${missingMaps.join(', ')}`);
    }

    const file = `// Generated by scripts/generate-country-assets.mjs. Do not edit manually.\n` +
      `import type { WorldCountryItem } from './types';\n\n` +
      `export const worldCountries: WorldCountryItem[] = ${JSON.stringify(generatedCountries, null, 2)};\n`;
    await writeFile(generatedDataPath, file);
    console.log(`Generated ${generatedCountries.length} countries, flags and maps.`);
  } finally {
    await rm(workingDirectory, { recursive: true, force: true });
  }
}

await main();
