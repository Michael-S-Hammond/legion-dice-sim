import { Validator }  from 'jsonschema';
import units from '../../data/units.json';

describe('units.json schema', () => {
    it('is valid', () => {
        const validator = new Validator();
        const unitSchema = {
            "id": "/unitSchema",
            "type": "object",
            "properties": {
                "id": { "type": "number" },
                "faction": { "type": "tbd" }
            }
        };

        const schema = {
            "id": "/completeSchema",
            "type": "object",
            "properties": {
                "units": {
                    "type": "array",
                    "items": {
                    }
                }
            }
        };

        validator.addSchema(unitSchema, '/unitSchema');
        const result = validator.validate(units, schema);
        expect(result.valid).toBe(true);
    });
});
