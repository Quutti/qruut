
/* Dates */

export const isLeapYear = (year: number): boolean => {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

/**
 * @param year
 * @param month Month 1-12
 */
export const getMonthDayCount = (year: number, month: number): number => {
    if (month && (month < 1 || month > 12)) {
        throw new Error("Month must be between 1 and 12");
    }

    return [31, (isLeapYear ? 29 : 28), 31, 30, 31, 31, 30, 31, 30, 31, 30, 31][month - 1];
}

export const getDayShortNames = (): string[] => {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
}

export const dateInMs = (date: Date): number => {
    const d = new Date(date.valueOf());
    d.setHours(0, 0, 0, 0);
    return d.valueOf();
}

export const isCurrentDate = (date: Date): boolean => {
    return dateInMs(date) === dateInMs(new Date());
}

export const getDayNumberStartingFromMonday = (date: Date) => {
    const newDayNumber = date.getDay() - 1;
    return (newDayNumber < 0) ? 6 : newDayNumber;
}

export const datesMatch = (date1: Date, date2: Date): boolean => {
    return dateInMs(date1) === dateInMs(date2);
}

/* Validation */

export const isValidJsonDate = (dateString: string): boolean => {
    const parts = dateString.split('-');

    if (parts.length !== 3) {
        return false;
    }

    const [yInt, mInt, dInt] = parts.map(s => parseInt(s, 10));

    return (yInt >= 1500) &&
        (mInt >= 1 && mInt <= 12) &&
        (dInt >= 1 && dInt <= getMonthDayCount(yInt, mInt));
}