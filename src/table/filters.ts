

export type TableFilterFunction = (propertyValue: string, text: string) => boolean;

export interface TableFilterItem {
    value: string;
    filterFunction: TableFilterFunction;
}

export const defaultFilter: TableFilterFunction = (propertyValue: string, text: string): boolean => {
    return propertyValue.toLowerCase().indexOf(text.toLowerCase()) > -1;
}