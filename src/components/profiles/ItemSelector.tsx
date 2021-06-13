import React from 'react';

import * as UP from '../../code/profiles/UnitProfile';

type ItemSelectorProps<T extends UP.NamedItem> = {
    id: string,
    dataIndex: number,
    items: Array<T>,
    selectedItem: T | null,
    onItemChange: (index: number, item: T | null) => void,
}

class ItemSelector<T extends UP.NamedItem> extends React.Component<ItemSelectorProps<T>> {
    private onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newName = e.target.value;
        let newItem: T | null = null;
        if(newName.length > 0) {
            const possibleItems = this.props.items.filter(i => i.name === newName);
            if(possibleItems.length > 0) {
                newItem = possibleItems[0];
            }
        }
        this.props.onItemChange(this.props.dataIndex, newItem);
    }

    render() : JSX.Element {
        return (
            <select
                id={this.props.id + "-itemSelect"}
                value={this.props.selectedItem?.name}
                className="rounded-lg px-2"
                onChange={this.onChange}>
                <option key="" value=""></option>
                { this.props.items?.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}
            </select>
        );
    }
}

export default ItemSelector;
