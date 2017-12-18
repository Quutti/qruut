/* Filters */

export type TableFilterFunction = (propertyValue: string, text: string) => boolean;

export interface TableFilterItem {
    value: string;
    filterFunction: TableFilterFunction;
}

export const defaultFilter: TableFilterFunction = (propertyValue: string, text: string): boolean => {
    return propertyValue.toLowerCase().indexOf(text.toLowerCase()) > -1;
}

/* Sorters */

export enum TableSortDirection { ASC = 0, DESC = 1 }

export type TableSorterFunctionFactory = (propertyKey: string, direction: TableSortDirection) => TableSorterFunction;

export type TableSorterFunction = (v1: any, v2: any) => number;

export interface TableSorterItem {
    direction: TableSortDirection;
    propertyKey: string;
    factory: TableSorterFunctionFactory;
}

export const defaultSorterFactory: TableSorterFunctionFactory = (propertyKey: string, direction: TableSortDirection): TableSorterFunction => {
    return (item1: any, item2: any): number => {
        let res;

        const v1 = item1[propertyKey];
        const v2 = item2[propertyKey];

        if (v1 === v2) {
            return 0;
        } else {
            res = (v1 < v2) ? -1 : 1;

            if (direction === TableSortDirection.DESC) {
                return (res === -1) ? 1 : -1;
            }

            return res;
        }
    }
}
