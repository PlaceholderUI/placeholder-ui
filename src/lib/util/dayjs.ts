import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

// Configure the shared dayjs singleton. dayjs is a singleton, so extending it
// here applies globally wherever this module is loaded: every date component
// gets the same setup, and consumers can import a ready-to-use instance instead
// of installing and configuring dayjs themselves.
// - customParseFormat: used internally — the date/time pickers parse input
//   against format arrays such as ['D MMMM YYYY', 'DD/MM/YYYY'].
// - advancedFormat: not used by this library's own components; bundled as a
//   convenience so consumers get tokens like Do / Q / X out of the box.
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

export { dayjs };
export default dayjs;
export type { Dayjs, ConfigType, OpUnitType, QUnitType, UnitType } from 'dayjs';
