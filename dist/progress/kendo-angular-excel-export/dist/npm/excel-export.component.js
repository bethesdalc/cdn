"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var kendo_file_saver_1 = require("@progress/kendo-file-saver");
var kendo_angular_l10n_1 = require("@progress/kendo-angular-l10n");
var workbook_1 = require("./ooxml/workbook");
var column_base_1 = require("./columns/column-base");
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
        this.columns = new core_1.QueryList();
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
        var options = workbook_1.workbookOptions({
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
        var options = workbook_1.isWorkbookOptions(exportData) ? exportData : this.workbookOptions(exportData);
        return workbook_1.toDataURL(options);
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
        kendo_file_saver_1.saveAs(dataURL, this.fileName, {
            forceProxy: this.forceProxy,
            proxyURL: this.proxyURL
        });
    };
    return ExcelExportComponent;
}());
ExcelExportComponent.decorators = [
    { type: core_1.Component, args: [{
                exportAs: 'kendoExcelExport',
                selector: 'kendo-excelexport',
                template: ""
            },] },
];
/** @nocollapse */
ExcelExportComponent.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [kendo_angular_l10n_1.RTL,] },] },
]; };
ExcelExportComponent.propDecorators = {
    'fileName': [{ type: core_1.Input },],
    'filterable': [{ type: core_1.Input },],
    'creator': [{ type: core_1.Input },],
    'date': [{ type: core_1.Input },],
    'forceProxy': [{ type: core_1.Input },],
    'proxyURL': [{ type: core_1.Input },],
    'data': [{ type: core_1.Input },],
    'group': [{ type: core_1.Input },],
    'paddingCellOptions': [{ type: core_1.Input },],
    'headerPaddingCellOptions': [{ type: core_1.Input },],
    'columns': [{ type: core_1.ContentChildren, args: [column_base_1.ColumnBase, { descendants: true },] },],
};
exports.ExcelExportComponent = ExcelExportComponent;
