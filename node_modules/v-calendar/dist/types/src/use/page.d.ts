import { type Ref } from 'vue';
import { type Page } from '../utils/page';
export interface MonthNavItem {
    month: number;
    year: number;
    id: string;
    label: string;
    ariaLabel: string;
    isActive: boolean;
    isCurrent: boolean;
    isDisabled: boolean;
}
export type YearNavItem = Omit<MonthNavItem, 'month'>;
export type CalendarPageContext = ReturnType<typeof createPage>;
export declare function createPage(page: Ref<Page>): {
    page: Ref<Page>;
    getMonthItems: (year: number, mask: string) => MonthNavItem[];
    getYearItems: (startYear: number, endYear: number) => YearNavItem[];
};
export declare function usePage(): CalendarPageContext;
