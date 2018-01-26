import * as React from "react";
import * as classNames from "classnames";

import * as utils from "../utils";
import { MouseEvent } from "react";

const styles: { [key: string]: any } = require("./calendar.css");

export type CalendarDayClick = (date: Date) => void;

export interface CalendarDayProps {
    date: Date;
    onClick: CalendarDayClick;
    selected?: boolean;
    fade?: boolean;
}

export class CalendarDay extends React.Component<CalendarDayProps, {}> {

    private _buttonRef: HTMLButtonElement = null;

    constructor(props) {
        super(props);
        this._handleClick = this._handleClick.bind(this);
    }

    public render(): JSX.Element {
        const { date, selected, fade } = this.props;

        const classes = classNames(styles.dayButton, {
            [styles.daySelected]: selected,
            [styles.dayToday]: utils.isCurrentDate(date),
            [styles.dayFade]: fade
        });

        if (selected && this._buttonRef) {
            this._buttonRef.focus();
        }

        return (
            <td className={styles.dayRoot}>
                <button className={classes} ref={(ref) => this._buttonRef = ref} onClick={this._handleClick}>{date.getDate()}</button>
            </td>
        );
    }

    private _handleClick(evt: MouseEvent<HTMLButtonElement>) {
        const date = new Date(this.props.date.valueOf());
        this.props.onClick(date);
    }

}