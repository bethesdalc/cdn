/**
 * The exported package module.
 *
 * The package exports:
 * - `CalendarComponent`&mdash;The Calendar component class.
 * - `CellTemplateDirective`&mdash;The cell template directive.
 *
 * @example
 *
 * ```ts-no-run
 * // Import the Calendar module.
 * import { CalendarModule } from '@progress/kendo-angular-dateinputs';
 *
 * // The browser platform with a compiler.
 * import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 *
 * import { NgModule } from '@angular/core';
 *
 * // Import the app component.
 * import { AppComponent } from './app.component';
 *
 * // Define the app module.
 * @@NgModule({
 *     declarations: [AppComponent], // declare app component
 *     imports:      [BrowserModule, CalendarModule], // import Calendar module
 *     bootstrap:    [AppComponent]
 * })
 * export class AppModule {}
 *
 * // Compile and launch the module.
 * platformBrowserDynamic().bootstrapModule(AppModule);
 *
 * ```
 */
export declare class CalendarModule {
}
