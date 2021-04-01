import * as T from "./Types";
import * as RS from "./RerollStrategy"

import ArmorRerollStrategy from "./ArmorRerollStrategy"
import SimpleRerollStrategy from "./SimpleRerollStrategy"
import ArmorXRerollStrategy from "./ArmorXRerollStrategy";

class RerollStrategyFactory {
    private _strategies: RS.RerollStrategy[];
    private _defaultStrategy: RS.RerollStrategy;

    constructor() {
        this._strategies = [
            new ArmorRerollStrategy(),
            new ArmorXRerollStrategy(),
        ];
        this._defaultStrategy = new SimpleRerollStrategy()
    }

    public selectStrategy(input: T.AttackInput, reason: RS.RerollReason) : RS.RerollStrategy {
        let strategy = this._defaultStrategy;
        this._strategies.forEach((rrs) => {
            if(rrs.shouldHandle(input, reason)) {
                strategy = rrs;
            }
        })
        return strategy;
    }
}

export default RerollStrategyFactory;
