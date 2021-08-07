import * as T from '../../../code/Types';
import * as UP from '../../../code/profiles/UnitProfile';

describe('UnitProfile', () => {
    it('converts critical surge', () => {
        const result = UP.convertUnitProfileSurgeToAttackSurge(UP.AttackSurge.critical);
        expect(result).toEqual(T.AttackSurgeConversion.Critical);
    });

    it('converts hit surge', () => {
        const result = UP.convertUnitProfileSurgeToAttackSurge(UP.AttackSurge.hit);
        expect(result).toEqual(T.AttackSurgeConversion.Hit);
    });

    it('converts blank surge', () => {
        const result = UP.convertUnitProfileSurgeToAttackSurge(UP.AttackSurge.blank);
        expect(result).toEqual(T.AttackSurgeConversion.Blank);
    });
});
