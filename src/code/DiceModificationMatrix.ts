import * as T from "./Types";

const iCrit = 0;
const iHit = 1;
const iSurge = 2;
const iMiss = 3;

export type DieConversion = {
    roll: T.AttackRoll,
    conversion: T.AttackDieResult,
}

type MatchCriteriaCount = {
    roll: T.AttackRoll,
    count: number,
};

class DiceModificationMatrix {
    private _rolls: T.AttackRoll[];
    private matrices = {
        red:    [[0, 0, 0, 0],
                 [0, 0, 0, 0],
                 [0, 0, 0, 0],
                 [0, 0, 0, 0]],
        black:  [[0, 0, 0, 0],
                 [0, 0, 0, 0],
                 [0, 0, 0, 0],
                 [0, 0, 0, 0]],
        white:  [[0, 0, 0, 0],
                 [0, 0, 0, 0],
                 [0, 0, 0, 0],
                 [0, 0, 0, 0]],
    };

    constructor(rolls: T.AttackRoll[]) {
        this._rolls = rolls;
        for(let i = 0; i < rolls.length; i++) {
            const matrix = this.mtx4c(rolls[i].color);
            const index = this.idx4ar(rolls[i].result);
            matrix[index][index]++;
        }
    }

    public getRerollIndexes(hits: number, misses: number) : number[] {
        const indexes: number[] = [];
        const criteria : MatchCriteriaCount[] = [];
        let remainingMiss = misses;
        let remainingHits = hits;

        // TODO: improve this to take natural misses of the same color over converted misses
        const matchList = this.getConversions().filter((element: DieConversion, idx: number) : boolean => {
            if(element.conversion === T.AttackDieResult.Miss && remainingMiss > 0) {
                remainingMiss--;
                return true;
            }
            if(element.conversion === T.AttackDieResult.Hit && remainingHits > 0) {
                remainingHits--;
                return true;
            }
            return false;
        });

        matchList.forEach((element: DieConversion) => {
            let found = false;
            for(let i = 0; i < criteria.length; i++) {
                if(criteria[i].roll.color === element.roll.color &&
                    criteria[i].roll.result === element.roll.result) {
                    found = true;
                    criteria[i].count++;
                    break;
                }
            }

            if(!found) {
                criteria.push({
                    roll: {
                        color: element.roll.color,
                        result: element.roll.result,
                    },
                    count: 1,
                })
            }
        });

        this._rolls.forEach((element: T.AttackRoll, idx: number) => {
            for(let i = 0; i < criteria.length; i++) {
                if(criteria[i].roll.color === element.color &&
                    criteria[i].roll.result === element.result) {
                    if(criteria[i].count > 0) {
                        indexes.push(idx);
                        criteria[i].count--;
                    }
                    break;
                }
            }
        });

        return indexes;
    }

    public getResultCount(result: T.AttackDieResult) : number {
        const index = this.idx4ar(result);

        // count = original + sum(column) - sum(row)
        let count = this.matrices.red[index][index] +
                    this.matrices.black[index][index] +
                    this.matrices.white[index][index];
        for(let i = 0; i < 4; i++) {
            // subtract the values of the row (dice that have been converted from expected)
            count -= this.matrices.red[index][i] +
                     this.matrices.black[index][i] +
                     this.matrices.white[index][i];
            // add the values of the column (dice that have been converted to expected)
            count += this.matrices.red[i][index] +
                     this.matrices.black[i][index] +
                     this.matrices.white[i][index];
        }

        return count;
    }

    public getConversions() : DieConversion[] {
        const result : DieConversion[] = [];

        this.addConversions(T.DieColor.Red, result);
        this.addConversions(T.DieColor.Black, result);
        this.addConversions(T.DieColor.White, result);

        return result;
    }

    private addConversions(color: T.DieColor, conversions: DieConversion[]) {
        const matrix = this.mtx4c(color);
        for(let row = 0; row < 4; row++) {
            for(let col = 0; col < 4; col++) {
                let count = 0;
                if(row === col) {
                    count = (2 * matrix[row][col]) - this.sumRow(row, matrix);
                } else {
                    count = matrix[row][col];
                }

                for(let i = 0; i < count; i++) {
                    conversions.push({
                        roll: {
                            color: color,
                            result: this.idx2atk(row),
                        },
                        conversion: this.idx2atk(col),
                    })
                }
            }
        }
    }

    public tryConvertResult(originalResult: T.AttackDieResult, newResult: T.AttackDieResult) : boolean {
        let converted = false;
        if(this.isConvertingUp(originalResult, newResult)) {
            converted =
                this.tryConvertResultForColor(T.DieColor.White, originalResult, newResult) ||
                this.tryConvertResultForColor(T.DieColor.Black, originalResult, newResult) ||
                this.tryConvertResultForColor(T.DieColor.Red, originalResult, newResult);
        } else {
            converted =
                this.tryConvertResultForColor(T.DieColor.Red, originalResult, newResult) ||
                this.tryConvertResultForColor(T.DieColor.Black, originalResult, newResult) ||
                this.tryConvertResultForColor(T.DieColor.White, originalResult, newResult);
        }
        return converted;
    }

    public tryConvertResultCount(oldResult: T.AttackDieResult, newResult: T.AttackDieResult, count: number) : number {
        let converted = 0;
        for(let i = 0; i < count; i++) {
            if(!this.tryConvertResult(oldResult, newResult)) {
                break;
            }
            converted++;
        }
        return converted;
    }

    public tryConvertResultAllExcept(oldResult: T.AttackDieResult, newResult: T.AttackDieResult, maintain: number) : number {
        let converted = 0;
        let remaining = this.getResultCount(oldResult);
        while(remaining > maintain) {
            if(!this.tryConvertResult(oldResult, newResult)) {
                break;
            }
            converted++;
            remaining = this.getResultCount(oldResult);
        }
        return converted;
    }

    private getResultCountInMatrix(matrix: number[][], result: T.AttackDieResult) : number {
        const index = this.idx4ar(result);
        return matrix[index][index] + this.sumColumn(index, matrix) - this.sumRow(index, matrix);
    }

    private tryConvertResultForColor(color: T.DieColor, originalResult: T.AttackDieResult, newResult: T.AttackDieResult) : boolean {
        const matrix = this.mtx4c(color);
        const oridx = this.idx4ar(originalResult);
        const nridx = this.idx4ar(newResult);

        let converted = false;
        if(matrix[nridx][oridx] > 0) {
            matrix[nridx][oridx]--;
            converted = true;
        } else if((2 * matrix[oridx][oridx]) - this.sumRow(oridx, matrix) > 0) {
            matrix[oridx][nridx]++;
            converted = true;
        } else if(this.getResultCountInMatrix(matrix, originalResult) > 0) {
            for(let i = 3; i >= 0; i--) {
                if(i === oridx || i === nridx) {
                    // we checked these in the previous cases
                    continue;
                }
                if(matrix[i][oridx] > 0) {
                    matrix[i][oridx]--;
                    matrix[i][nridx]++;
                    converted = true;
                    break;
                }
            }
        }
        return converted;
    }

    private mtx4c(color: T.DieColor) : number[][] {
        if(color === T.DieColor.Red) {
            return this.matrices.red;
        }
        if(color === T.DieColor.Black) {
            return this.matrices.black;
        }
        return this.matrices.white;
    }

    private idx4ar(result: T.AttackDieResult) : number {
        return (result === T.AttackDieResult.Critical) ? iCrit :
                (result === T.AttackDieResult.Hit) ? iHit :
                (result === T.AttackDieResult.Surge) ? iSurge : iMiss;
    }

    private idx2atk(index: number) : T.AttackDieResult {
        return (index === iCrit) ? T.AttackDieResult.Critical :
                (index === iHit) ? T.AttackDieResult.Hit :
                (index === iSurge) ? T.AttackDieResult.Surge :
                T.AttackDieResult.Miss;
    }

    private sumRow(row: number, matrix: number[][]) {
        let sum = 0;
        for(let i = 0; i < 4; i++) {
            sum += matrix[row][i];
        }
        return sum;
    }

    private sumColumn(column: number, matrix: number[][]) {
        let sum = 0;
        for(let i = 0; i < 4; i++) {
            sum += matrix[i][column];
        }
        return sum;
    }

    private isConvertingUp(originalResult: T.AttackDieResult, newResult: T.AttackDieResult) : boolean {
        return newResult === T.AttackDieResult.Critical ||
                originalResult === T.AttackDieResult.Miss ||
                (originalResult === T.AttackDieResult.Surge && newResult !== T.AttackDieResult.Miss);
    }
}

export default DiceModificationMatrix;
