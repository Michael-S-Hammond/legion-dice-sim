import Ajv  from 'ajv';
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
                        minimumRange: { type: "number", minimum: 0, maximum: 3 },
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
                                blast: { type: "boolean" },
                                critical: { type: "number", minimum: 1, maximum: 2 },
                                cumbersome: { type: "boolean" },
                                fixed: { type: "array", items: { enum: ["front", "rear"] } },
                                highVelocity: { type: "boolean" },
                                impact: { type: "number", minimum: 1, maximum: 3 },
                                immune: {
                                    type: "array",
                                    items: [{
                                        enum: ["deflect"]
                                    }]
                                },
                                lethal: { type: "number", minimum: 1, maximum: 1 },
                                pierce: { type: "number", minimum: 1, maximum: 3 },
                                ram: { type: "number", minimum: 1, maximum: 1 },
                                scatter: { type: "boolean" },
                                suppressive: { type: "boolean" }
                            },
                            additionalProperties: false
                        }
                    },
                    required: ["name", "minimumRange", "dice"],
                    additionalProperties: false
                }
            }
        };

        const unitRankSchema = {
            $id: "http://www.legiondice.com/schemas/unitrank",
            definitions: {
                unitRank: {
                    enum: [
                        "commander",
                        "operative",
                        "corps",
                        "specialForces",
                        "support",
                        "heavy"
                    ]
                },
            }
        };

        const unitTypeSchema = {
            $id: "http://www.legiondice.com/schemas/unittype",
            definitions: {
                unitType: {
                    enum: [
                        "cloneTrooper",
                        "creatureTrooper",
                        "droidTrooper",
                        "emplacementTrooper",
                        "trooper",
                        "wookieTrooper",
                        "groundVehicle",
                        "repulsorVehicle"
                    ]
                },
            }
        };

        const unitCriteriaSchema = {
            $id: "http://www.legiondice.com/schemas/unitcriteria",
            definitions: {
                unitCriteria: {
                    type: "object",
                    properties: {
                        rank: { $ref: "unitrank#/definitions/unitRank" },
                        type: { $ref: "unittype#/definitions/unitType" }
                    },
                    additionalProperties: false
                }
            }
        };

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
                        rank: { $ref: "unitrank#/definitions/unitRank" },
                        miniCount: { type: "number", minimum: 1, maximum: 6 },
                        points: { type: "number", minimum: 1, maximum: 250 },
                        unitType: { $ref: "unittype#/definitions/unitType" },
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
                        keywords: {
                            type: "object",
                            properties: {
                                agile: { type: "number", minimum: 1, maximum: 1 },
                                ai: {
                                    type: "array",
                                    items: { enum: ["attack", "dodge", "move"] }
                                },
                                armor: { type: "boolean" },
                                armorX: { type: "number", minimum: 1, maximum: 2 },
                                arsenal: { type: "number", minimum: 2, maximum: 3 },
                                ataruMastery: { type: "boolean" },
                                authoritative: { type: "boolean" },
                                barrage: { type: "boolean" },
                                block: { type: "boolean" },
                                bolster: { type: "number", minimum: 1, maximum: 2 },
                                bounty: { type: "boolean" },
                                calculateOdds: { type: "boolean" },
                                charge: { type: "boolean" },
                                climbingVehicle: { type: "boolean" },
                                compel: { type: "boolean" },
                                contingencies: { type: "number", minimum: 1, maximum: 3 },
                                coordinate: {
                                    type: "array",
                                    items: {
                                        type: "string", minLength: 1
                                    }
                                },
                                cover: { type: "number", minimum: 1, maximum: 2 },
                                covertOps: { type: "boolean" },
                                cunning: { type: "boolean" },
                                dangerSense: { type: "number", minimum: 1, maximum: 4 },
                                dauntless: { type: "boolean" },
                                defend: { type: "number", minimum: 1, maximum: 1 },
                                deflect: { type: "boolean" },
                                detachment: { type: "string", minLength: 1 },
                                direct: { $ref: "unitcriteria#/definitions/unitCriteria" },
                                disengage: { type: "boolean" },
                                disciplined: { type: "number", minimum: 1, maximum: 2 },
                                djemSoMastery: { type: "boolean" },
                                duelist: { type: "boolean" },
                                enrage: { type: "number", minimum: 1, maximum: 4 },
                                entourage: { type: "string", minLength: 1 },
                                equip: { type: "array", items: { type: "string" } },
                                exemplar: { type: "boolean" },
                                expertClimber: { type: "boolean" },
                                fireSupport: { type: "boolean" },
                                flawed: { type: "boolean" },
                                fullPivot: { type: "boolean" },
                                generator: { type: "number", minimum: 1, maximum: 4 },
                                grounded: { type: "boolean" },
                                guardian: { type: "number", minimum: 1, maximum: 3 },
                                guidance: { type: "boolean" },
                                gunslinger: { type: "boolean" },
                                heavyWeaponTeam: { type: "boolean" },
                                hover: {
                                    type: "object",
                                    oneOf: [{
                                        properties: {
                                            ground: { type: "boolean" }
                                        },
                                        required: ["ground"],
                                        additionalProperties: false
                                    },{
                                        properties: {
                                            air: { type: "number", minimum: 1, maximum: 2 }
                                        },
                                        required: ["air"],
                                        additionalProperties: false
                                    }]
                                  },
                                immune: {
                                    type: "array",
                                    items: [{
                                        enum: ["blast", "melee", "pierce", "range1Weapons"]
                                    }]
                                },
                                impervious: { type: "boolean" },
                                incognito: { type: "boolean" },
                                inconspicuous: { type: "boolean" },
                                indomitable: { type: "boolean" },
                                infiltrate: { type: "boolean" },
                                inspire: { type: "number", minimum: 1, maximum: 2 },
                                jediHunter: { type: "boolean" },
                                jump: { type: "number", minimum: 1, maximum: 2 },
                                juyoMastery: { type: "boolean" },
                                lightTransport: {
                                    type: "object",
                                    oneOf: [{
                                        properties: {
                                            closed: { type: "number", minimum: 1, maximum: 1 },
                                        },
                                        required: ["closed"],
                                        additionalProperties: false
                                    },{
                                        properties: {
                                            open: { type: "number", minimum: 1, maximum: 1 }
                                        },
                                        required: ["open"],
                                        additionalProperties: false
                                    }]
                                },
                                loadout: { type: "boolean" },
                                lowProfile: { type: "boolean" },
                                makashiMastery: { type: "boolean" },
                                marksman: { type: "boolean" },
                                masterOfTheForce: { type: "number", minimum: 1, maximum: 2 },
                                nimble: { type: "boolean" },
                                observe: { type: "number", minimum: 1, maximum: 3 },
                                outmaneuver: { type: "boolean" },
                                precise: { type: "number", minimum: 1, maximum: 2 },
                                pullingTheStrings: { type: "boolean" },
                                quickThinking: { type: "boolean" },
                                ready: { type: "number", minimum: 1, maximum: 1 },
                                regenerate: { type: "number", minimum: 1, maximum: 3 },
                                relentless: { type: "boolean" },
                                reliable: { type: "number", minimum: 1, maximum: 1 },
                                repair: {
                                    type: "object",
                                    properties: {
                                        value: { type: "number", minimum: 1, maximum: 2 },
                                        capacity: { type: "number", minimum: 1, maximum: 2 }
                                    },
                                    required: ["value", "capacity"],
                                    additionalProperties: false
                                },
                                reposition: { type: "boolean" },
                                retinue: { type: "string", minLength: 1 },
                                scale: { type: "boolean" },
                                scout: { type: "number", minimum: 1, maximum: 3 },
                                scoutingParty: { type: "number", minimum: 1, maximum: 2 },
                                secretMission: { type: "boolean" },
                                sentinel: { type: "boolean" },
                                sharpshooter: { type: "number", minimum: 1, maximum: 2 },
                                shielded: { type: "number", minimum: 1, maximum: 4 },
                                soresuMastery: { type: "boolean" },
                                speeder: { type: "number", minimum: 1, maximum: 2 },
                                spotter: { type: "number", minimum: 1, maximum: 2 },
                                spur: { type: "boolean" },
                                stationary: { type: "boolean" },
                                steady: { type: "boolean" },
                                tactical: { type: "number", minimum: 1, maximum: 1 },
                                takeCover: { type: "number", minimum: 1, maximum: 2 },
                                target: { type: "number", minimum: 1, maximum: 1 },
                                teamwork: { type: "string", minLength: 1 },
                                tempted: { type: "boolean" },
                                transport: {
                                    type: "object",
                                    oneOf: [{
                                        properties: {
                                            closed: { type: "number", minimum: 1, maximum: 1 },
                                        },
                                        required: ["closed"],
                                        additionalProperties: false
                                    },{
                                        properties: {
                                            open: { type: "number", minimum: 1, maximum: 1 }
                                        },
                                        required: ["open"],
                                        additionalProperties: false
                                    }]
                                },
                                uncannyLuck: { type: "number", minimum: 1, maximum: 3 },
                                unhindered: { type: "boolean" },
                                weakPoint: {
                                    type: "object",
                                    properties: {
                                        rear: { type: "number", minimum: 1, maximum: 2 },
                                        sides: { type: "number", minimum: 1, maximum: 1 }
                                    },
                                    additionalProperties: false
                                },
                                wheelMode: { type: "boolean" }
                            },
                            additionalProperties: false
                        }
                    },
                    required: ["faction", "name", "rank", "miniCount", "points",
                        "unitType", "defenseDie", "wounds", "attackSurge", "defenseSurge",
                        "speed"],
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
        ajv.addSchema(unitRankSchema);
        ajv.addSchema(unitTypeSchema);
        ajv.addSchema(unitCriteriaSchema);
        const validator = ajv.getSchema("http://www.legiondice.com/schemas/unitcollection");
        const validationResult = validator ? validator(units) : false;
        if(!validationResult) {
            // Display errors if we have them.
            expect(validator?.errors).toBeNull();
        }
        expect(validationResult).toBe(true);
    });
});
