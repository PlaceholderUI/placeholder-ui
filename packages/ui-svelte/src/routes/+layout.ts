import dayjs from "dayjs";
import AdvancedFormat from "dayjs/plugin/advancedFormat.js";
import CustomParseFormat from "dayjs/plugin/customParseFormat.js";
dayjs.extend(AdvancedFormat);
dayjs.extend(CustomParseFormat);

export const prerender = true;
export const ssr = false;
