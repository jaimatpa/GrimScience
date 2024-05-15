import { DateParts } from '@/utils/date/helpers';
export interface DayData extends Omit<Partial<DateParts>, 'date'> {
    date: string;
    timezone: string;
}
export declare const data: DayData[];
