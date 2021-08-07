import React from 'react';

import * as UP from '../../code/profiles/UnitProfile';

type ItemSelectorProps<T extends UP.NamedItem> = {
    id: string,
    dataIndex: number,
    ariaLabel: string,
    items: Array<T>,
    includeBlankItem: boolean,
    selectedItem: T | null,
    onItemChange: (index: number, item: T | null) => void,
}

function ItemSelector<T extends UP.NamedItem>(props: ItemSelectorProps<T>) : JSX.Element {
    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newName = e.target.value;
        let newItem: T | null = null;
        if(newName.length > 0) {
            const possibleItems = props.items.filter(i => i.name === newName);
            if(possibleItems.length > 0) {
                newItem = possibleItems[0];
            }
        }
        props.onItemChange(props.dataIndex, newItem);
    }

    function getStringOrDefault(value: string | undefined) : string {
        return value ? value : "";
    }

    return (
        <select
            id={props.id + "-itemSelect"}
            value={getStringOrDefault(props.selectedItem?.name)}
            className="rounded-lg px-2 ml-2"
            onChange={onChange}
            aria-label={props.ariaLabel}>
            { props.includeBlankItem &&
                <option key="" value=""></option>
            }
            { props.items?.map(i => <option key={i.name} value={i.name}>{i.name}</option>) }
        </select>
    );
}

export default ItemSelector;
