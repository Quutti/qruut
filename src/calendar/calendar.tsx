import * as React from "react";
import * as classNames from "classnames";

import { CalendarDay, CalendarDayClick } from "./calendar-day";
import * as utils from "../utils";

const styles: { [key: string]: any } = require("./calendar.css");
const faStyles: { [key: string]: any } = require("font-awesome/css/font-awesome.min.css");

export type CalendarSelectedDateChange = (date: Date) => void;

export interface CalendarProps {
    onSelectedDateChange: CalendarSelectedDateChange;
    defaultDate?: Date;
}

export interface CalendarState {
    activeMonthFirstDate: Date;
    selectedDate: Date;
}

export class Calendar extends React.Component<CalendarProps, CalendarState> {

    constructor(props) {
        super(props);

        this.state = {
            activeMonthFirstDate: getFirstDayOfMonth(new Date()),
            selectedDate: null
        }

        this._handleDayClick = this._handleDayClick.bind(this);
        this._handlePrevButtonClick = this._handlePrevButtonClick.bind(this);
        this._handleNextButtonClick = this._handleNextButtonClick.bind(this);
    }

    public render(): JSX.Element {

        const { activeMonthFirstDate } = this.state;
        const label = `${activeMonthFirstDate.getMonth() + 1} / ${activeMonthFirstDate.getFullYear()}`;
        const prevButtonClasses = classNames(styles.navigationButton, faStyles.fa, faStyles["fa-angle-left"]);
        const nextButtonClasses = classNames(styles.navigationButton, faStyles.fa, faStyles["fa-angle-right"]);

        return (
            <div className={styles.root}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.prevButtonContainer} colSpan={2}>
                                <button className={prevButtonClasses} onClick={this._handlePrevButtonClick} />
                            </th>
                            <th className={styles.label} colSpan={3}>{label}</th>
                            <th className={styles.nextButtonContainer} colSpan={2}>
                                <button className={nextButtonClasses} onClick={this._handleNextButtonClick} />
                            </th>
                        </tr>
                        <tr>{this._createHeader()}</tr>
                    </thead>
                    <tbody>{this._createWeeks()}</tbody>
                </table>
            </div>
        )
    }

    private _createHeader(): JSX.Element[] {
        return utils.getDayShortNames().map((dayName: string, index: number) => {
            return <th key={index} className={styles.dayName}>{dayName}</th>;
        });
    }

    private _getSelectedDate(): Date {
        const { defaultDate } = this.props;
        const { selectedDate } = this.state;

        return selectedDate || defaultDate || null;
    }

    private _createWeeks(): JSX.Element[] {

        const { activeMonthFirstDate } = this.state;
        const selectedDate = this._getSelectedDate();
        const activeMonth = activeMonthFirstDate.getMonth();
        const dayCount = utils.getMonthDayCount(activeMonthFirstDate.getFullYear(), activeMonth + 1);
        const startingDayNumber = utils.getDayNumberStartingFromMonday(activeMonthFirstDate);

        const weeks: JSX.Element[] = [];
        const weekCount = Math.ceil((startingDayNumber + dayCount) / 7);

        let runningDate = new Date(activeMonthFirstDate.valueOf());

        for (let i = 0; i < weekCount; i++) {
            const days: JSX.Element[] = [];
            let dayNumber = 0;

            // Add also the visible days from the last month to the beginning
            // of the first week.
            if (i === 0) {
                dayNumber = startingDayNumber;
                days.push(...this._createLastMonthDays(startingDayNumber));
            }

            // Fills also the visible days of the next month
            while (dayNumber < 7) {
                const date = new Date(runningDate.valueOf());
                const selected = (selectedDate) ? utils.datesMatch(selectedDate, date) : false;
                const fade = activeMonth !== runningDate.getMonth();

                days.push(
                    <CalendarDay
                        key={`w-${i}-d-${dayNumber}`}
                        date={date}
                        onClick={this._handleDayClick}
                        selected={selected}
                        fade={fade}
                    />
                );

                runningDate.setDate(runningDate.getDate() + 1);
                dayNumber++;
            }

            weeks.push(<tr key={`week-${i}`}>{days}</tr>);
        }

        return weeks;
    }

    private _createLastMonthDays(dayNumber: number): JSX.Element[] {
        const lastMonthDays: JSX.Element[] = [];
        let runningDate = new Date(this.state.activeMonthFirstDate.valueOf());
        let dayIndex = 0;

        // Fill array in a reverse order
        while (lastMonthDays.length < dayNumber) {
            runningDate.setDate(runningDate.getDate() - 1);

            lastMonthDays.push(
                <CalendarDay
                    key={`w-0-lm-${dayIndex}`}
                    date={new Date(runningDate.valueOf())}
                    onClick={this._handleDayClick}
                    fade={true}
                />
            );

            dayIndex++;
        }

        return lastMonthDays.reverse();
    }

    private _handleDayClick(date: Date) {
        const dateMs = utils.dateInMs(date);
        this.setState({
            activeMonthFirstDate: getFirstDayOfMonth(date),
            selectedDate: new Date(dateMs)
        });

        // Propagate date also to the onSelectedDateChange listener
        this.props.onSelectedDateChange(new Date(dateMs));
    }

    private _handlePrevButtonClick() {
        const { activeMonthFirstDate } = this.state;
        activeMonthFirstDate.setMonth(activeMonthFirstDate.getMonth() - 1);
        this.setState({ activeMonthFirstDate });
    }

    private _handleNextButtonClick() {
        const { activeMonthFirstDate } = this.state;
        activeMonthFirstDate.setMonth(activeMonthFirstDate.getMonth() + 1);
        this.setState({ activeMonthFirstDate });
    }

}

export default Calendar;

function getFirstDayOfMonth(date: Date): Date {
    const d = new Date(date.valueOf());
    d.setDate(1);
    return d;
}