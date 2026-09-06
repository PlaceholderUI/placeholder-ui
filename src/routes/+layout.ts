// Configures the shared dayjs singleton with the library's plugins
// (advancedFormat, customParseFormat) before any page renders.
import '$lib/util/dayjs.js';

export const prerender = true;
export const ssr = false;
