import { OpaqueToken } from '@angular/core';
import { MessageService } from './message.service';
/**
 * Localization prefix for the component messages.
 *
 * For internal use.
 * @hidden
 */
export declare const L10N_PREFIX: OpaqueToken;
/**
 * Component localization service.
 *
 * For internal use.
 * @hidden
 */
export declare class LocalizationService {
    private prefix;
    private messageService;
    private dictionary;
    constructor(prefix: string, messageService: MessageService);
    get(shortKey: string): string;
    register(shortKey: string, value: string, override?: boolean): void;
    private key(shortKey);
    private defaultValue(key, value);
}
