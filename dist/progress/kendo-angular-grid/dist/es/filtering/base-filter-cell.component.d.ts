import { QueryList, AfterContentInit, OnDestroy } from '@angular/core';
import { FilterService } from './filter.service';
import { CompositeFilterDescriptor, FilterDescriptor } from '@progress/kendo-data-query';
import { FilterOperatorBase } from './operators/filter-operator.base';
/**
 * @hidden
 */
export declare const localizeOperators: (operators: any) => (localization: any) => {
    text: any;
    value: any;
}[];
/**
 * An abstract base class for the filter-cell component.
 */
export declare abstract class BaseFilterCellComponent implements AfterContentInit, OnDestroy {
    protected filterService: FilterService;
    /**
     * @hidden
     */
    readonly hostClasses: boolean;
    operatorList: QueryList<FilterOperatorBase>;
    operators: Array<{
        text: string;
        value: string;
    }>;
    filter: CompositeFilterDescriptor;
    protected defaultOperators: Array<{
        text: string;
        value: string;
    }>;
    private _operators;
    private operationListSubscription;
    constructor(filterService: FilterService);
    /**
     * @hidden
     */
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    protected filterByField(field: string): FilterDescriptor;
    protected filtersByField(field: string): FilterDescriptor[];
    protected removeFilter(field: string): CompositeFilterDescriptor;
    protected updateFilter(filter: FilterDescriptor): CompositeFilterDescriptor;
    protected applyFilter(filter: CompositeFilterDescriptor): void;
}
