import Ajv  from 'ajv';
import { number } from 'mathjs';
import units from '../../data/units.json';

describe('units.json schema', () => {
    it('is valid', () => {
        const weaponSchema = {
            $id: "http://www.legiondice.com/schemas/weapon",
            definitions: {
                weapon: {
                    type: "object",
                    properties: {
                        name: { type: "string", minLength: 1 },
                        minimumRange: { type: "number", minimum: 0, maximum: 2 },
                        maximumRange: { type: "number", minimum: 0, maximum: 5 },
                        dice: {
                            type: "object",
                            properties: {
                                red: { type: "number", minimum: 0, maximum: 10 },
                                black: { type: "number", minimum: 0, maximum: 10 },
                                white: { type: "number", minimum: 0, maximum: 10 }
                            },
                            required: ["red", "black", "white"]
                        },
                        keywords: {
                            type: "object",
                            properties: {
                                impact: { type: "number", minimum: 1, maximum: 3 },
                                pierce: { type: "number", minimum: 1, maximum: 3 }
                            },
                            additionalProperties: false
                        }
                    },
                    required: ["name", "minimumRange", "dice"],
                    additionalProperties: false
                }
            }
        }

        const unitSchema = {
            $id: "http://www.legiondice.com/schemas/unit",
            definitions: {
                unit: {
                    type: "object",
                    properties: {
                        faction: { enum: ["rebel", "empire", "separatist", "republic"] },
                        name: { type: "string", minLength: 1 },
                        subtitle: { type: "string", minLength: 1 },
                        unique: { type: "boolean" },
                        rank: { enum: [ "commander", "operative", "corps", "specialist", "support", "heavy" ] },
                        miniCount: { type: "number", minimum: 1, maximum: 6 },
                        points: { type: "number", minimum: 1, maximum: 250 },
                        unitType: { enum: ["trooper", "vehicle"] },
                        defenseDie: { enum: ["red", "white"] },
                        wounds: { type: "number", minimum: 1, maximum: 11 },
                        courage: { type: "number", minimum: 1, maximum: 4 },
                        resilience: { type: "number", minimum: 1, maximum: 8 },
                        attackSurge: { enum: ["blank", "hit", "critical"] },
                        defenseSurge: { type: "boolean" },
                        speed: { type: "number", minimum: 0, maximum: 3 },
                        weapons: {
                            type: "array",
                            items: { $ref: "weapon#/definitions/weapon"}
                        },
                        upgrades: {
                            type: "array",
                            items: [{
                                enum: ["heavyWeapon", "personnel", "force", "command",
                                    "hardpoint", "gear", "grenades", "comms", "pilot",
                                    "training", "generator", "armament", "crew", "ordinance"]
                            }]
                        },
                        unitKeywords: {
                            type: "array",
                            items: [{
                                type: "object",
                                properties: {
                                    charge: { type: "boolean"},
                                    deflect: { type: "boolean" },
                                    immunePierce: { type: "boolean" },
                                    inspire: { type: "number", minimum: 1, maximum: 2 },
                                    jump: { type: "number", minimum: 1, maximum: 2 },
                                    nimble: { type: "boolean" },
                                    sharpshooter: { type: "number", minimum: 1, maximum: 2 },
                                    takeCover: { type: "number", minimum: 1, maximum: 2 }
                                },
                                additionalProperties: false
                            }]
                        }
                    },
                    required: ["faction", "name", "rank", "miniCount", "points",
                        "unitType", "defenseDie", "wounds", "attackSurge", "defenseSurge",
                        "speed", "weapons"],
                    additionalProperties: false
                }
            }
        };

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
        ajv.addSchema(unitSchema);
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
