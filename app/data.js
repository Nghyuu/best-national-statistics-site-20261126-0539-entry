// DataNusa data: national statistics for Indonesia.
// Every figure is a rounded, clearly labelled public figure from BPS
// (Statistics Indonesia) publications. Figures are shown rounded to
// one decimal or a whole number; nothing here claims fake precision.

export const META = {
  country: 'Indonesia',
  source: 'BPS — Statistics Indonesia',
  updated: '2024',
};

// --- Overview ---------------------------------------------------------------

export const HEADLINE = [
  { label: 'Population', value: '283.5m', note: '2024 estimate', page: 'population' },
  { label: 'GDP', value: 'US$1.40tn', note: '2024', page: 'economy' },
  { label: 'GDP growth', value: '5.0%', note: '2024, year on year', page: 'economy' },
  { label: 'Inflation', value: '1.6%', note: '2024, annual CPI', page: 'economy' },
  { label: 'Unemployment', value: '4.9%', note: 'Aug 2024', page: 'employment' },
  { label: 'Life expectancy', value: '74.1 yrs', note: '2024', page: 'health' },
];

// --- Population -------------------------------------------------------------

export const POPULATION_SERIES = [
  { year: 2019, value: 269.6 },
  { year: 2020, value: 270.2 },
  { year: 2021, value: 272.5 },
  { year: 2022, value: 275.8 },
  { year: 2023, value: 279.4 },
  { year: 2024, value: 283.5 },
];

// Population by province, 2024 estimate, millions. Region groups drive the filter.
export const PROVINCES = [
  { name: 'West Java', region: 'Java', pop: 50.4 },
  { name: 'East Java', region: 'Java', pop: 41.9 },
  { name: 'Central Java', region: 'Java', pop: 38.0 },
  { name: 'North Sumatra', region: 'Sumatra', pop: 15.6 },
  { name: 'Banten', region: 'Java', pop: 12.7 },
  { name: 'Jakarta', region: 'Java', pop: 10.6 },
  { name: 'South Sulawesi', region: 'Sulawesi', pop: 9.5 },
  { name: 'Lampung', region: 'Sumatra', pop: 9.4 },
  { name: 'South Sumatra', region: 'Sumatra', pop: 8.8 },
  { name: 'Riau', region: 'Sumatra', pop: 7.1 },
  { name: 'West Sumatra', region: 'Sumatra', pop: 6.0 },
  { name: 'East Kalimantan', region: 'Kalimantan', pop: 4.0 },
  { name: 'South Kalimantan', region: 'Kalimantan', pop: 4.3 },
  { name: 'Bali', region: 'Bali & Nusa Tenggara', pop: 4.4 },
  { name: 'Papua', region: 'Maluku & Papua', pop: 1.1 },
];

export const POPULATION_FACTS = [
  { label: 'Median age', value: '30.4 years', note: '2024' },
  { label: 'Population density', value: '147 / km²', note: '2024' },
  { label: 'Urban share', value: '58%', note: '2024 estimate' },
  { label: 'Annual growth', value: '1.1%', note: '2020–2024 average' },
  { label: 'Sex ratio', value: '101', note: 'males per 100 females, 2024' },
  { label: 'Households', value: '75.4m', note: '2024 estimate' },
];

// --- Economy ----------------------------------------------------------------

export const GDP_SERIES = [
  { year: 2019, gdp: 1119, growth: 5.0, inflation: 2.7 },
  { year: 2020, gdp: 1059, growth: -2.1, inflation: 1.7 },
  { year: 2021, gdp: 1186, growth: 3.7, inflation: 1.9 },
  { year: 2022, gdp: 1319, growth: 5.3, inflation: 5.5 },
  { year: 2023, gdp: 1371, growth: 5.0, inflation: 2.6 },
  { year: 2024, gdp: 1400, growth: 5.0, inflation: 1.6 },
];

export const GDP_SHARES = [
  { sector: 'Household consumption', share: 54.0 },
  { sector: 'Investment (GFCF)', share: 29.0 },
  { sector: 'Government spending', share: 8.5 },
  { sector: 'Net exports', share: 5.5 },
  { sector: 'Other', share: 3.0 },
];

export const ECONOMY_FACTS = [
  { label: 'GDP per capita', value: 'US$4,980', note: '2024' },
  { label: 'Poverty rate', value: '9.0%', note: 'Mar 2024' },
  { label: 'Gini ratio', value: '0.379', note: 'Mar 2024' },
  { label: 'Exports', value: 'US$265bn', note: '2024' },
  { label: 'Foreign reserves', value: 'US$155bn', note: 'Dec 2024' },
  { label: 'Policy rate', value: '6.0%', note: 'Dec 2024' },
];

// --- Employment -------------------------------------------------------------

export const UNEMPLOYMENT_SERIES = [
  { year: 2019, rate: 5.2 },
  { year: 2020, rate: 7.1 },
  { year: 2021, rate: 6.5 },
  { year: 2022, rate: 5.9 },
  { year: 2023, rate: 5.3 },
  { year: 2024, rate: 4.9 },
];

export const SECTOR_SHARES = [
  { sector: 'Services', share: 48.9 },
  { sector: 'Agriculture', share: 28.2 },
  { sector: 'Manufacturing', share: 18.5 },
  { sector: 'Mining & quarrying', share: 1.5 },
  { sector: 'Construction', share: 2.9 },
];

export const EMPLOYMENT_FACTS = [
  { label: 'Labour force', value: '152.1m', note: 'Aug 2024' },
  { label: 'Employed', value: '144.6m', note: 'Aug 2024' },
  { label: 'Informal workers', value: '59.2%', note: 'of employed, Aug 2024' },
  { label: 'Youth unemployment', value: '17.3%', note: 'ages 15–24, Aug 2024' },
  { label: 'Female participation', value: '54.5%', note: 'Aug 2024' },
  { label: 'Minimum wage (Jakarta)', value: 'Rp 5.1m / mo', note: '2024' },
];

// --- Health -----------------------------------------------------------------

export const LIFE_SERIES = [
  { year: 2019, value: 71.7 },
  { year: 2020, value: 71.9 },
  { year: 2021, value: 72.3 },
  { year: 2022, value: 73.3 },
  { year: 2023, value: 73.9 },
  { year: 2024, value: 74.1 },
];

export const HEALTH_BY_PROVINCE = [
  { name: 'Jakarta', value: 75.9 },
  { name: 'Yogyakarta', value: 75.4 },
  { name: 'East Java', value: 74.3 },
  { name: 'Bali', value: 74.1 },
  { name: 'Central Java', value: 74.1 },
  { name: 'West Java', value: 73.8 },
  { name: 'South Sulawesi', value: 72.4 },
  { name: 'Papua', value: 66.1 },
];

export const HEALTH_FACTS = [
  { label: 'Infant mortality', value: '15.5 / 1,000', note: 'live births, 2023' },
  { label: 'Stunting (under 5)', value: '19.8%', note: '2024 survey' },
  { label: 'Health insurance cover', value: '98%', note: 'JKN, 2024' },
  { label: 'Doctors per 10,000', value: '5.5', note: '2023' },
  { label: 'Hospital beds / 10,000', value: '14.0', note: '2023' },
  { label: 'Smoking (adults)', value: '33%', note: '2023 survey' },
];

// --- Education --------------------------------------------------------------

export const LITERACY_SERIES = [
  { year: 2019, value: 95.7 },
  { year: 2020, value: 95.9 },
  { year: 2021, value: 96.0 },
  { year: 2022, value: 96.0 },
  { year: 2023, value: 96.0 },
  { year: 2024, value: 96.0 },
];

export const ENROLMENT = [
  { group: 'Ages 7–12 (primary)', rate: 99.5 },
  { group: 'Ages 13–15 (junior secondary)', rate: 96.5 },
  { group: 'Ages 16–18 (senior secondary)', rate: 84.9 },
  { group: 'Ages 19–23 (tertiary)', rate: 31.2 },
];

export const EDUCATION_FACTS = [
  { label: 'Mean years of schooling', value: '9.0 yrs', note: '2024' },
  { label: 'Expected years of schooling', value: '13.2 yrs', note: '2024' },
  { label: 'Primary schools', value: '148,000', note: '2023' },
  { label: 'University students', value: '9.3m', note: '2023' },
  { label: 'Teachers', value: '3.4m', note: '2023' },
  { label: 'Education budget share', value: '20%', note: 'of state budget, 2024' },
];
