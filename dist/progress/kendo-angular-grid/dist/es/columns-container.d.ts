import { QueryList, EventEmitter } from '@angular/core';
import { ColumnBase } from './column-base';
/**
 * @hidden
 */
export declare class ColumnsContainer {
    private columns;
    allColumns: QueryList<ColumnBase>;
    leafColumns: QueryList<ColumnBase>;
    lockedColumns: QueryList<ColumnBase>;
    nonLockedColumns: QueryList<ColumnBase>;
    lockedLeafColumns: QueryList<ColumnBase>;
    nonLockedLeafColumns: QueryList<ColumnBase>;
    totalLevels: number;
    changes: EventEmitter<any>;
    constructor(columns: Function);
    refresh(): void;
}
