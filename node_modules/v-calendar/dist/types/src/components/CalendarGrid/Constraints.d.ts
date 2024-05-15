type ConstraintType = 'MIN_DURATION' | 'MAX_DURATION' | 'BEFORE_DAY' | 'AFTER_DAY' | 'OUTSIDE_DAY';
type ConstraintRecovery = false | 'RESIZE';
interface ConstraintOptions {
    durationMinutes?: number;
    recover: ConstraintRecovery;
}
export interface Constraint {
    type: ConstraintType;
    options?: ConstraintOptions;
}
export declare class Constraints {
    constraints: Constraint[];
    constructor(constraints: Constraint[]);
    validConstraint(constraint: Constraint): false | undefined;
}
export {};
