import * as MJS from "mathjs";
import { Stats } from "./Types"

export function computeStats(values: Array<number>) : Stats {
    return {
        mean: values.length > 0 ? MJS.mean(values) : 0,
        median: values.length > 0 ? MJS.median(values) : 0,
        stddev: values.length > 0 ? MJS.std(values) : 0,
    };
}
