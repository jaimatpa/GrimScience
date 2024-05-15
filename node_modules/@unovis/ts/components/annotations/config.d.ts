import { ComponentConfigInterface } from "../../core/component/config";
import { AnnotationItem } from './types';
export interface AnnotationsConfigInterface extends ComponentConfigInterface {
    /** Legend items. Array of `AnnotationItem`:
     * ```
     * {
     *   content: string | UnovisText | UnovisText[];
     *   subject?: AnnotationSubject;
     *   x?: LengthUnit;
     *   y?: LengthUnit;
     *   width?: LengthUnit;
     *   height?: LengthUnit;
     * }
     * ```
     * To learn more, see our docs https://unovis.dev/docs/auxiliary/Annotations/
    * Default: `[]` */
    items: AnnotationItem[] | undefined;
}
export declare const AnnotationsDefaultConfig: AnnotationsConfigInterface;
