import * as React from "react";
import * as classNames from "classnames";

const styles: { [key: string]: any } = require("./list.css");

export interface ListProps {
    className?: string;
}

export const List: React.SFC<ListProps> = (props) => {
    const classes = classNames(styles.root, props.className);
    return <ul className={classes}>{props.children}</ul>
}

List.defaultProps = {
    className: ""
}

export default List;