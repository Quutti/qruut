import * as React from "react";
import * as d3 from "d3";
import * as classNames from "classnames";

const styles: any = require("./line-chart.css");

export interface LineChartLine {
    data: LineChartPoint[];
    color?: string;
    curve?: d3.CurveFactory;
}

export interface LineChartPoint {
    date: Date;
    value: number;
}

export type LineCustomChartTickFormatFunction = (date: Date, index: number) => string;

export interface LineChartProps {
    lines: LineChartLine[];
    curve?: d3.CurveFactory;
    height?: number;
    yTickCount?: number;
    xTickFormat?: LineCustomChartTickFormatFunction;
    xTickCount?: number;
    animationDuration?: number;
    showDots?: boolean;
}

export interface LineChartState {
    fading: boolean;
}

interface MinMax<T> {
    min: T;
    max: T;
}

interface XY<t1, t2> {
    x: t1,
    y: t2
}

const MARGIN = 30;
const CHART_PADDING = 5;

type D3SelectionElement = d3.Selection<d3.BaseType, any, any, any>;
type D3TransitionElement = d3.Transition<d3.BaseType, any, any, any>;

type D3Element = D3SelectionElement | D3TransitionElement;

export class LineChart extends React.Component<LineChartProps, LineChartState> {

    static defaultProps: Partial<LineChartProps> = {
        height: 250,
        curve: d3.curveLinear,
        yTickCount: 5,
        xTickCount: 4,
        showDots: true,
        animationDuration: 750
    }

    private _timeoutHandle: any;

    private _containerRef: HTMLDivElement = null;

    private _svg: D3SelectionElement = null;
    private _mainG: D3SelectionElement = null;
    private _pathsG: D3SelectionElement = null;
    private _lineGs: D3SelectionElement[] = [];
    private _scales: XY<d3.ScaleTime<number, number>, d3.ScaleLinear<number, number>> = { x: null, y: null };
    private _axes: XY<D3SelectionElement, D3SelectionElement> = { x: null, y: null };

    constructor(props) {
        super(props);

        this.state = {
            fading: false
        }

        this._handleWindowResize = this._handleWindowResize.bind(this);
    }

    public render(): JSX.Element {
        const classes = classNames({
            [styles.root]: true,
            [styles.fading]: this.state.fading
        });

        return (
            <div ref={(ref => this._containerRef = ref)} className={classes} style={{ height: this.props.height }}></div>
        );
    }

    public componentDidUpdate() {
        this._updateChart();
    }

    public componentWillMount() {
        window.addEventListener("resize", this._handleWindowResize);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this._handleWindowResize);
    }

    public componentDidMount() {
        this._createChart();
        this._updateChart();
    }

    private _createChart() {
        const self = this;
        const containerOffsetWidth = this._containerRef.offsetWidth;

        this._svg = d3.select(this._containerRef).append("svg")
            .attr('height', this.props.height)
            .attr('width', "100%");

        this._mainG = this._svg.append("g")
            .attr('transform', `translate(0, 0)`);

        // Group to serve as a wrapper for line paths
        this._pathsG = this._mainG.append("g")
            .attr("transform", `translate(${MARGIN}, 0)`)

        const domains = this._getDomains();
        const width = containerOffsetWidth - MARGIN * 2;
        const height = this._getInnerHeight();

        this._scales.x = d3.scaleTime().domain(domains.x).rangeRound([CHART_PADDING, width - CHART_PADDING]);
        this._scales.y = d3.scaleLinear().domain(domains.y).rangeRound([height, 0]);

        this._axes.x = this._mainG.append("g")
            .attr("class", styles.axisGroup)
            .attr("transform", `translate(${MARGIN}, ${height})`)
            .call(this._getAxisBottom());

        this._axes.y = this._mainG.append("g")
            .attr("class", styles.axisGroup)
            .attr("transform", `translate(${MARGIN}, 0)`)
            .call(this._getAxisLeft());
    }

    private _updateChart(animate: boolean = true) {

        const { showDots, animationDuration } = this.props;

        const domains = this._getDomains();
        this._scales.x.domain(domains.x);
        this._scales.y.domain(domains.y);

        this._axes.x.transition().call(this._getAxisBottom() as any);
        this._axes.y.transition().call(this._getAxisLeft() as any);

        this._updatePaths(animate);
        if (showDots) {
            this._updateDots(animate);
        }
    }

    private _removeChart() {
        this._svg.remove();
        this._svg = null;

        this._lineGs = [];
    }

    private _updatePaths(animate: boolean) {

        const setD = (elems: D3Element, fromBottom: boolean = false) => {
            const a = fromBottom ? this._getInnerHeight() : undefined;
            return elems.attr("d", this._getLine(a));
        }

        const { lines, animationDuration } = this.props;
        const data = lines.map(l => l.data);

        const updatePaths = this._pathsG.selectAll(`.${styles.linePath}`).data(data);

        // Remove removed lines
        updatePaths.exit().remove();

        const existingLines = this._pathsG.selectAll(`.${styles.linePath}`);
        const existingLineCount = existingLines.nodes().length;
        const newLines = updatePaths.enter().append("path").attr("class", styles.linePath);

        newLines.nodes().forEach((node, index) => {
            const line = lines[existingLineCount + index];
            if (line && line.color) {
                d3.select(node).attr("style", `stroke: ${line.color}`);
            }
        });

        if (animate) {
            // Add and animate new lines
            const elems = setD(newLines, true);
            setD(elems.transition().duration(animationDuration));
            // and update existing ones
            setD(existingLines.transition().duration(animationDuration));
        } else {
            setD(newLines);
            setD(existingLines);
        }
    }

    private _updateDots(animate: boolean) {

        const setCXCY = (elems: D3Element, fromBottom: boolean = false): D3Element => {
            return elems
                .attr("cx", (d: LineChartPoint, index) => this._scales.x(d.date))
                .attr("cy", (d: LineChartPoint, index) => {
                    return (fromBottom) ? this._getInnerHeight() : this._scales.y(d.value);
                });
        }

        const { lines, animationDuration } = this.props;

        // Create g :s for every new path to wrap
        // dots for that path
        this.props.lines.forEach((d, index) => {
            if (!this._lineGs[index]) {
                this._lineGs[index] = this._pathsG.append("g");
            }
        });

        lines.forEach((line, index) => {
            const lineG = this._lineGs[index];
            const updateDots = lineG.selectAll(`.${styles.linePathDot}`).data(line.data);

            // Remove existing dots
            updateDots.exit().remove();

            const existingDots = lineG.selectAll(`.${styles.linePathDot}`) as D3SelectionElement;
            const newDots = updateDots.enter().append("circle").attr("class", styles.linePathDot);

            if (animate) {
                // Animate existing dots to their new positions
                setCXCY(existingDots.transition().duration(animationDuration));

                // Then set new dots to the point where we want them
                // to be when animation begins
                const trans = setCXCY(newDots, true);
                // ... and animate
                setCXCY(trans.transition().duration(animationDuration));
            } else {
                setCXCY(existingDots);
                setCXCY(newDots);
            }
        });
    }

    private _handleWindowResize() {
        // Fade out the component when resize event is triggered
        if (this._timeoutHandle === null) {
            this.setState({ fading: true });
        }

        // Be lazy
        clearTimeout(this._timeoutHandle);
        this._timeoutHandle = setTimeout(() => {
            this._removeChart();
            this._createChart();
            this._updateChart(false);

            // Show container after resize is over
            this.setState({ fading: false });

            this._timeoutHandle = null;
        }, 200);
    }

    private _getLine(fixedYPos?: number): d3.Line<[number, number]> {
        const { curve } = this.props;

        return d3.line()
            .curve(curve)
            .x((d: any) => {
                const data = d as LineChartPoint;
                return this._scales.x(data.date.valueOf());
            })
            .y((d: any) => {
                if (fixedYPos !== undefined) {
                    return fixedYPos
                }

                const data = d as LineChartPoint;
                return this._scales.y(data.value);
            });
    }

    private _getInnerHeight(): number {
        return this.props.height - MARGIN;
    }

    private _getDomains(): XY<number[], number[]> {
        const dateBoundaries = this._getDateBoundaries();
        const x = [
            dateBoundaries.min.valueOf(),
            dateBoundaries.max.valueOf()
        ];

        const maxPoints = this._getMaxValue() * 1.1;
        const y = [0, maxPoints];

        return { x, y };
    }

    private _getDateBoundaries(): MinMax<Date> {
        const dates: Date[] = [];
        const dateMsMap: number[] = [];

        this.props.lines.forEach(line => {
            line.data.forEach(dataset => {
                const date = new Date(dataset.date.valueOf());
                date.setHours(0, 0, 0, 0);

                const ms = date.valueOf();
                if (dateMsMap.indexOf(ms) === -1) {
                    dates.push(date);
                    dateMsMap.push(ms);
                }
            });
        });

        dates.sort((d1, d2) => d1.valueOf() - d2.valueOf());

        const first = dates[0];
        const last = dates[dates.length - 1];
        const min = first ? new Date(dates[0].valueOf()) : new Date();
        const max = last ? new Date(dates[dates.length - 1].valueOf()) : new Date();

        return { min, max };
    }

    private _getMaxValue(): number {
        let max = 0;
        this.props.lines.forEach(line => {
            line.data.forEach(dataset => max = Math.max(dataset.value, max))
        });
        return max;
    }

    private _getAxisLeft(): d3.Axis<number | { valueOf(): number; }> {
        const { yTickCount } = this.props;

        return d3.axisLeft(this._scales.y)
            .tickFormat(this._shortenValue as any)
            .tickPadding(7)
            .ticks(yTickCount)
            .tickSize(-this._containerRef.offsetWidth + 2 * MARGIN);
    }

    private _getAxisBottom(): d3.Axis<number | { valueOf(): number }> {
        const { xTickFormat, xTickCount } = this.props;
        const axis = d3.axisBottom(this._scales.x)
            .ticks(xTickCount);

        if (typeof xTickFormat === "function") {
            return axis.tickFormat(xTickFormat);
        } else {
            return axis;
        }
    }

    private _shortenValue(value: number, index: number): string {
        return (value >= 1000) ? `${Math.ceil(value / 1000)}k` : `${value}`;
    }

}