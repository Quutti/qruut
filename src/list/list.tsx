import * as React from "react";

const styles: { [key: string]: any } = require("./list.css");

export interface ListProps {
    className?: string;
}

export class List extends React.Component<ListProps, {}> {

    static defaultProps: Partial<ListProps> = {
        className: ""
    }

    public render(): JSX.Element {
        const { className, children } = this.props;
        const classes = [styles.root, ...className.split(" ")].join(" ");
        return <ul className={classes}>{this.props.children}</ul>
    }

}
