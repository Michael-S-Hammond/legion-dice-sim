import Ajv  from 'ajv';

import units from '../../data/units.json';

import factionSchema from './schema/faction.json';
import unitCriteriaSchema from './schema/unitCriteria.json';
import unitKeywordSchema from './schema/unitKeywords.json';
import unitRankSchema from './schema/unitRank.json';
import unitSchema from './schema/unit.json';
import unitTypeSchema from './schema/unitType.json';
import weaponSchema from './schema/weapon.json';

describe('units.json schema', () => {
    it('is valid', () => {
        const schema = {
            $id: "http://www.legiondice.com/schemas/unitcollection",
            type: "object",
            properties: {
                units: {
                    type: "array",
                    items: {
                        $ref: "unit#/definitions/unit"
                    }
                }
            },
            required: ["units"],
            additionalProperties: false
        };

        const ajv = new Ajv();
        ajv.addSchema(schema);
        ajv.addSchema(factionSchema);
        ajv.addSchema(unitCriteriaSchema);
        ajv.addSchema(unitKeywordSchema);
        ajv.addSchema(unitRankSchema);
        ajv.addSchema(unitSchema);
        ajv.addSchema(unitTypeSchema);
        ajv.addSchema(weaponSchema);

        const validator = ajv.getSchema("http://www.legiondice.com/schemas/unitcollection");
        const validationResult = validator ? validator(units) : false;

        if(!validationResult) {
            // Display errors if we have them.
            expect(validator?.errors).toBeNull();
        }
        expect(validationResult).toBe(true);
    });
});
