declare const _default: ({
    it: string;
    props: {
        initialPage: {
            month: number;
            year: number;
        };
        minDate: Date;
        maxDate?: undefined;
    };
    disabledDays: {
        start: number;
        end: number;
    }[];
    disabledArrows: string[];
    nav: {
        months: {
            disabledArrows: string[];
            disabledMonths: number[];
            year: number;
        };
        years: {
            disabledArrows: string[];
            disabledYears: number[];
        };
    };
} | {
    it: string;
    props: {
        initialPage: {
            month: number;
            year: number;
        };
        maxDate: Date;
        minDate?: undefined;
    };
    disabledDays: {
        start: number;
        end: number;
    }[];
    disabledArrows: string[];
    nav: {
        months: {
            disabledArrows: string[];
            disabledMonths: number[];
            year: number;
        };
        years: {
            disabledArrows: string[];
            disabledYears: number[];
        };
    };
} | {
    it: string;
    props: {
        initialPage: {
            month: number;
            year: number;
        };
        minDate: Date;
        maxDate: Date;
    };
    disabledDays: {
        start: number;
        end: number;
    }[];
    disabledArrows: string[];
    nav: {
        months: {
            disabledArrows: string[];
            disabledMonths: number[];
            year: number;
        };
        years: {
            disabledArrows: string[];
            disabledYears: number[];
        };
    };
})[];
export default _default;
