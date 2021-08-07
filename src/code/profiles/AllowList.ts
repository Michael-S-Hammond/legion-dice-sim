import allowListFile from '../../data/allowList.json';

import * as UC from './UpgradeCard';

export enum AllowListName {
    attack = "attack",
    defense = "defense"
}

type AllowList = {
    armament?: Array<string>,
    command?: Array<string>,
    comms?: Array<string>,
    counterpart?: Array<string>,
    crew?: Array<string>,
    force?: Array<string>,
    gear?: Array<string>,
    generator?: Array<string>,
    grenades?: Array<string>,
    hardpoint?: Array<string>,
    heavyWeapon?: Array<string>,
    ordinance?: Array<string>,
    personnel?: Array<string>,
    pilot?: Array<string>,
    training?: Array<string>,
}

export function isUpgradeInAllowList(upgrade: UC.Upgrade, allowListName: AllowListName) : boolean {
    if(allowListFile[allowListName]) {
        const list = allowListFile[allowListName] as AllowList;
        if(list[upgrade.type]?.includes(upgrade.name)) {
            return true;
        }
    }
    return false;
}
