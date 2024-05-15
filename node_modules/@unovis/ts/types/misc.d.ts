export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export declare type Rect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare type LengthUnit = number | `${number}%` | `${number}px`;
