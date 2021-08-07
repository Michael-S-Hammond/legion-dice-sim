import * as MJS from "mathjs";
import { Stats } from "./Types"

export function computeStats(values: Array<number>) : Stats {
    return {
        mean: values.length > 0 ? MJS.round(MJS.mean(values), 3) : 0,
        median: values.length > 0 ? MJS.median(values) : 0,
        stddev: values.length > 0 ? MJS.round(MJS.std(values), 3) : 0,
    };
}
