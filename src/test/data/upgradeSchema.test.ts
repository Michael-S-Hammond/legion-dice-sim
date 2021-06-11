import Ajv  from 'ajv';

import upgrades from '../../data/upgrades.json';

import weaponSchema from './schema/weapon.json';

describe('upgrades.json schema', () => {
    it('is valid', () => {
        const schema = {
            $id: "http://www.legiondice.com/schemas/upgradecollection",
            type: "object",
            properties: {
                upgrades: {
                    type: "array",
                    // TODO: Enable once we have valid schemas for upgrades.
                    // items: {
                    //     $ref: "upgrade#/definitions/upgrade"
                    // }
                }
            },
            required: ["upgrades"],
            additionalProperties: false
        };

        const ajv = new Ajv();
        ajv.addSchema(schema);
        ajv.addSchema(weaponSchema);

        const validator = ajv.getSchema("http://www.legiondice.com/schemas/upgradecollection");
        const validationResult = validator ? validator(upgrades) : false;

        expect(validationResult);   // TODO: Replace once we have valid schemas for upgrades.
        // if(!validationResult) {
        //     // Display errors if we have them.
        //     expect(validator?.errors).toBeNull();
        // }
        // expect(validationResult).toBe(true);
    })
});

