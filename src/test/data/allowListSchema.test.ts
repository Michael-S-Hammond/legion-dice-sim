import Ajv  from 'ajv';

import allowList from '../../data/allowList.json';

import allowListSchema from './schema/allowList.json';

describe('allowList.json schema', () => {
    it('is valid', () => {
        const schema = {
            $id: "http://www.legiondice.com/schemas/allowListTest",
            $ref: "allowList#/definitions/allowList"
        };


        const ajv = new Ajv();
        ajv.addSchema(schema);
        ajv.addSchema(allowListSchema);

        const validator = ajv.getSchema("http://www.legiondice.com/schemas/allowListTest");
        const validationResult = validator ? validator(allowList) : false;

        if(!validationResult) {
            // Display errors if we have them.
            expect(validator?.errors).toBeNull();
        }
        expect(validationResult).toBe(true);
    })
});

