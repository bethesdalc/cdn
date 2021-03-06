import { Component, ContentChildren, Input, QueryList, Inject, Optional } from '@angular/core';
import { saveAs } from '@progress/kendo-file-saver';
import { RTL } from '@progress/kendo-angular-l10n';
import { workbookOptions, toDataURL, isWorkbookOptions } from './ooxml/workbook';
import { ColumnBase } from './columns/column-base';
/**
 * Configures the settings for the Excel export of the Kendo UI Grid.
 */
var ExcelExportComponent = (function () {
    function ExcelExportComponent(rtl) {
        this.rtl = rtl;
        /**
         * Specifies the file name of the file exported to Excel.
         * @default "Export.xlsx"
         */
        this.fileName = 'Export.xlsx';
        /**
         * @hidden
         */
        this.columns = new QueryList();
        this.saveFile = this.saveFile.bind(this);
    }
    /**
     * Saves the data to Excel.
     *
     * @param exportData - An optional parameter. Can be the data that is to be exported or [`WorkbookOptions`]({% slug api_excel-export_workbookoptions_kendouiforangular %}).
     */
    ExcelExportComponent.prototype.save = function (exportData) {
        this.toDataURL(exportData).then(this.saveFile);
    };
    /**
     * Returns [`WorkbookOptions`]({% slug api_excel-export_workbookoptions_kendouiforangular %}) based on the specified columns and data.
     *
     * @param exportData - The optional data to be exported.
     * @returns {WorkbookOptions} - The workbook options.
     */
    ExcelExportComponent.prototype.workbookOptions = function (exportData) {
        var currentData = this.getExportData(exportData);
        var options = workbookOptions({
            columns: this.columns,
            data: currentData.data,
            group: currentData.group,
            filterable: this.filterable,
            creator: this.creator,
            date: this.date,
            rtl: this.rtl,
            paddingCellOptions: this.paddingCellOptions,
            headerPaddingCellOptions: this.headerPaddingCellOptions
        });
        return options;
    };
    /**
     * Returns a promise which will be resolved with the file data URI.
     *
     * @param exportData - The optional data or [`WorkbookOptions`]({% slug api_excel-export_workbookoptions_kendouiforangular %}) that are to be used to generate the data URI.
     * @returns {Promise<string>} - The promise that will be resolved by the file data URI.
     */
    ExcelExportComponent.prototype.toDataURL = function (exportData) {
        var options = isWorkbookOptions(exportData) ? exportData : this.workbookOptions(exportData);
        return toDataURL(options);
    };
    ExcelExportComponent.prototype.getExportData = function (exportData) {
        var result;
        if (exportData) {
            if (Array.isArray(exportData)) {
                result = {
                    data: exportData
                };
            }
            else {
                result = exportData;
            }
        }
        else {
            result = {
                data: this.data,
                group: this.group
            };
        }
        return result;
    };
    ExcelExportComponent.prototype.saveFile = function (dataURL) {
        saveAs(dataURL, this.fileName, {
            forceProxy: this.forceProxy,
            proxyURL: this.proxyURL
        });
    };
    return ExcelExportComponent;
}());
export { ExcelExportComponent };
ExcelExportComponent.decorators = [
    { type: Component, args: [{
                exportAs: 'kendoExcelExport',
                selector: 'kendo-excelexport',
                template: ""
            },] },
];
/** @nocollapse */
ExcelExportComponent.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RTL,] },] },
]; };
ExcelExportComponent.propDecorators = {
    'fileName': [{ type: Input },],
    'filterable': [{ type: Input },],
    'creator': [{ type: Input },],
    'date': [{ type: Input },],
    'forceProxy': [{ type: Input },],
    'proxyURL': [{ type: Input },],
    'data': [{ type: Input },],
    'group': [{ type: Input },],
    'paddingCellOptions': [{ type: Input },],
    'headerPaddingCellOptions': [{ type: Input },],
    'columns': [{ type: ContentChildren, args: [ColumnBase, { descendants: true },] },],
};
