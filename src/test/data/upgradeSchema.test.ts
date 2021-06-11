import Ajv  from 'ajv';

import upgrades from '../../data/upgrades.json';

import factionSchema from './schema/faction.json';
import unitCriteriaSchema from './schema/unitCriteria.json';
import unitKeywordSchema from './schema/unitKeywords.json';
import unitRankSchema from './schema/unitRank.json';
import unitTypeSchema from './schema/unitType.json';
import upgradeSchema from './schema/upgrade.json';
import weaponSchema from './schema/weapon.json';

describe('upgrades.json schema', () => {
    it('is valid', () => {
        const schema = {
            $id: "http://www.legiondice.com/schemas/upgradecollection",
            type: "object",
            properties: {
                upgrades: {
                    type: "array",
                    items: {
                        $ref: "upgrade#/definitions/upgrade"
                    }
                }
            },
            required: ["upgrades"],
            additionalProperties: false
        };

        const ajv = new Ajv();
        ajv.addSchema(schema);
        ajv.addSchema(factionSchema);
        ajv.addSchema(unitCriteriaSchema);
        ajv.addSchema(unitKeywordSchema);
        ajv.addSchema(unitRankSchema);
        ajv.addSchema(unitTypeSchema);
        ajv.addSchema(upgradeSchema);
        ajv.addSchema(weaponSchema);

        const validator = ajv.getSchema("http://www.legiondice.com/schemas/upgradecollection");
        const validationResult = validator ? validator(upgrades) : false;

        if(!validationResult) {
            // Display errors if we have them.
            expect(validator?.errors).toBeNull();
        }
        expect(validationResult).toBe(true);
    })
});

