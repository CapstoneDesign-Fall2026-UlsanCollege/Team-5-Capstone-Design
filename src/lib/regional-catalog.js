import {
  COUNTRIES,
  UNIVERSITIES_BY_COUNTRY,
  SUBJECTS_CATALOG,
  getUniversities,
  getCountries
} from './academic-catalog.js';

export const REGIONAL_CATALOG = UNIVERSITIES_BY_COUNTRY;

export function universitiesFor(country) {
  return getUniversities(country);
}

export const COMMON_COURSES = SUBJECTS_CATALOG;

export function coursesFor(university) {
  return SUBJECTS_CATALOG;
}

export { COUNTRIES, UNIVERSITIES_BY_COUNTRY, SUBJECTS_CATALOG, getUniversities, getCountries };
