import * as React from "react";
import * as ReactDOM from "react-dom";
import * as classNames from 'classnames';

const styles: { [key: string]: any } = require('./popover.css');

// Space between container and positioning element / viewport edges
const CONTAINER_SPACER = 5;

export type PopoverPositionAlign = 'top' | 'bottom' | 'auto';

export interface PopoverPosition {
    left?: number;
    top?: number;
}

export interface PopoverProps {
    visible: boolean;
    positionElement: HTMLElement | React.Component;
    onCloseRequest: () => void;
}

export interface PopoverState {
    position: PopoverPosition;
    animateInProgress: boolean;
}

export class Popover extends React.Component<PopoverProps, PopoverState> {

    private _containerElement: HTMLDivElement = null;

    constructor(props) {
        super(props);

        this.state = {
            position: null,
            animateInProgress: false
        }

        this._handleClickOutside = this._handleClickOutside.bind(this);
    }

    public render() {

        const classes = classNames(styles.root, {
            [styles.visible]: this.props.visible
        });

        return (
            <div
                className={classes}
                style={this.state.position}
                ref={(elm) => this._containerElement = elm}
                onTransitionEnd={() => this.setState({ animateInProgress: false })}
            >
                {this.props.children}
            </div>
        );
    }

    public componentWillReceiveProps(props: PopoverProps) {
        if (props.visible && !this.props.visible) {
            this._prepareVisible();
            this.setState({ animateInProgress: true });
        }
    }

    public componentDidMount() {
        document.addEventListener('click', this._handleClickOutside);
        this._prepareVisible();
    }

    public componentWillUnmount() {
        document.removeEventListener('click', this._handleClickOutside);
    }

    private _prepareVisible() {
        this._setContainerPosition();
    }

    private _handleClickOutside(evt) {

        if (this.state.animateInProgress) {
            return;
        }

        if (this._containerElement && (this._containerElement.contains(evt.target) || this._containerElement === evt.target)) {
            return;
        }

        this._requestClose();
    }

    private _requestClose() {
        this.props.onCloseRequest();
    }

    private _setContainerPosition() {
        const { positionElement } = this.props;

        if (!positionElement) {
            return;
        }

        let positionObj: PopoverPosition = null;

        if (positionElement) {
            let htmlElement: HTMLElement;

            // If the passed positionElement is react element, find first real
            // DOM node under it
            if (isLikeReactComponent(positionElement)) {
                htmlElement = ReactDOM.findDOMNode(positionElement) as HTMLElement;
            } else {
                htmlElement = positionElement as HTMLElement;
            }

            if (!htmlElement) {
                return;
            }

            const offsetLeft = htmlElement.offsetLeft;
            const posElmHeight = htmlElement.clientHeight;
            const posElmPosition = htmlElement.getBoundingClientRect();

            // Dont allow container position overflow viewport horizontally
            const overflow = document.body.clientWidth - posElmPosition.left - this._containerElement.clientWidth;
            const left = (overflow < 0) ? offsetLeft + overflow - CONTAINER_SPACER : offsetLeft;
            const top = htmlElement.offsetTop + posElmHeight + CONTAINER_SPACER;

            positionObj = { top, left };
        }

        this.setState({ position: positionObj });
    }
}

function isLikeReactComponent(component: any) {
    return component && component.render && component.forceUpdate && component.props && component.setState;
}