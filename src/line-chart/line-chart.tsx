import * as React from "react";
import * as d3 from "d3";
import * as classNames from "classnames";
import * as objectAssign from "object-assign";

const styles: any = require("./line-chart.css");

export interface LineChartLine<XType> {
    data: LineChartPoint<XType>[];
    color?: string;
    curve?: d3.CurveFactory;
}

export interface LineChartPoint<XType> {
    xValue: XType;
    yValue: number;
}

export type LineChartScaleType = "time" | "linear";

export type LineCustomChartTickFormatFunction<T> = (xValue: T, index: number) => string;

export interface LineChartAxisOptionsBase {
    tickCount?: number;
}

export interface LineChartXAxisOptions extends LineChartAxisOptionsBase {
    tickCount?: number;
    tickFormat?: LineCustomChartTickFormatFunction<any>;
    scale?: LineChartScaleType;
}

export interface LineChartYAxisOptions extends LineChartAxisOptionsBase { }

export interface LineChartDotsOptions {
    radius?: number;
    show?: boolean;
}

export interface LineChartProps {
    lines: LineChartLine<any>[];
    curve?: d3.CurveFactory;
    height?: number;
    xAxis?: LineChartXAxisOptions;
    yAxis?: LineChartYAxisOptions;
    animationDuration?: number;
    dots?: LineChartDotsOptions;
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

type PropDefaultTypes = "xAxis" | "yAxis" | "dots";

const PROP_DEFAULTS: { [key: string]: any } = {

    "xAxis": {
        tickCount: 4,
        tickFormat: null,
        scale: "time"
    } as LineChartXAxisOptions,

    "yAxis": {
        tickCount: 5
    } as LineChartYAxisOptions,

    "dots": {
        radius: 3.5,
        show: true
    } as LineChartDotsOptions

}

type D3SelectionElement = d3.Selection<d3.BaseType, any, any, any>;
type D3TransitionElement = d3.Transition<d3.BaseType, any, any, any>;

type D3Element = D3SelectionElement | D3TransitionElement;

export class LineChart extends React.Component<LineChartProps, LineChartState> {

    static defaultProps: Partial<LineChartProps> = {
        height: 250,
        curve: d3.curveLinear,
        yAxis: PROP_DEFAULTS["yAxis"],
        xAxis: PROP_DEFAULTS["xAxis"],
        dots: PROP_DEFAULTS["dots"],
        animationDuration: 750
    }

    private _timeoutHandle: any;

    private _containerRef: HTMLDivElement = null;

    private _svg: D3SelectionElement = null;
    private _mainG: D3SelectionElement = null;
    private _pathsG: D3SelectionElement = null;
    private _lineGs: D3SelectionElement[] = [];
    private _scales: XY<any, d3.ScaleLinear<number, number>> = { x: null, y: null };
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
        const { scale: xScaleType } = this._getProps("xAxis") as LineChartXAxisOptions;
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

        if (xScaleType === "time") {
            this._scales.x = d3.scaleTime().domain(domains.x).rangeRound([CHART_PADDING, width - CHART_PADDING]);
        } else {
            this._scales.x = d3.scaleLinear().domain(domains.x).range([CHART_PADDING, width - CHART_PADDING]);
        }

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
        const dots = this._getProps("dots") as LineChartDotsOptions;
        const { animationDuration } = this.props;

        const domains = this._getDomains();
        this._scales.x.domain(domains.x);
        this._scales.y.domain(domains.y);

        this._axes.x.transition().call(this._getAxisBottom() as any);
        this._axes.y.transition().call(this._getAxisLeft() as any);

        this._updatePaths(animate);
        if (dots.show) {
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
        const { radius } = this._getProps("dots") as LineChartDotsOptions;
        const setCXCY = (elems: D3Element, fromBottom: boolean = false): D3Element => {
            return elems
                .attr("r", radius)
                .attr("cx", (d: LineChartPoint<any>, index) => this._scales.x(d.xValue))
                .attr("cy", (d: LineChartPoint<any>, index) => {
                    return (fromBottom) ? this._getInnerHeight() : this._scales.y(d.yValue);
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
        const { scale } = this._getProps("xAxis") as LineChartXAxisOptions;
        return d3.line()
            .curve(curve)
            .x((d: any) => {
                const data = d as LineChartPoint<any>;
                if (scale === "time" && data.xValue instanceof Date) {
                    return this._scales.x(data.xValue.valueOf());
                } else {
                    return this._scales.x(data.xValue);
                }
            })
            .y((d: any) => {
                if (fixedYPos !== undefined) {
                    return fixedYPos
                }

                const data = d as LineChartPoint<any>;
                return this._scales.y(data.yValue);
            });
    }

    private _getInnerHeight(): number {
        return this.props.height - MARGIN;
    }

    private _getDomains(): XY<number[], number[]> {
        const { min, max } = this._getXBoundaries();
        const x = [min, max];
        const maxPoints = this._getMaxValue() * 1.1;
        const y = [0, maxPoints];

        return { x, y };
    }

    private _getXBoundaries(): MinMax<number> {
        const { scale } = this._getProps("xAxis") as LineChartXAxisOptions;
        const values: number[] = [];

        if (scale === "linear") {

            const mins = [];
            const maxs = [];

            this.props.lines.forEach(line => {
                const xValues = line.data.map(d => d.xValue);
                mins.push(Math.min(...xValues));
                maxs.push(Math.max(...xValues));
            });

            return {
                min: Math.min(...mins),
                max: Math.max(...maxs)
            }
        }

        this.props.lines.forEach(line => {
            line.data.forEach(dataset => {
                let value;

                if (dataset.xValue instanceof Date) {
                    const date = new Date(dataset.xValue.valueOf());
                    date.setHours(0, 0, 0, 0);
                    value = date.valueOf();
                } else {
                    value = dataset.xValue;
                }

                values.push(value);
            });
        });

        return {
            min: Math.min(...values),
            max: Math.max(...values)
        }

    }

    private _getMaxValue(): number {
        let max = 0;
        this.props.lines.forEach(line => {
            line.data.forEach(dataset => max = Math.max(dataset.yValue, max))
        });
        return max;
    }

    private _getAxisLeft(): d3.Axis<number | { valueOf(): number; }> {
        const { tickCount } = this._getProps("yAxis") as LineChartYAxisOptions;

        return d3.axisLeft(this._scales.y)
            .tickFormat(this._shortenValue as any)
            .tickPadding(7)
            .ticks(tickCount)
            .tickSize(-this._containerRef.offsetWidth + 2 * MARGIN);
    }

    private _getAxisBottom(): d3.Axis<number | { valueOf(): number }> {
        const { tickCount, tickFormat } = this._getProps("xAxis") as LineChartXAxisOptions;
        let axis = d3.axisBottom(this._scales.x)
            .ticks(tickCount);

        if (typeof tickFormat === "function") {
            axis = axis.tickFormat(tickFormat);
        }

        return axis as d3.Axis<number | { valueOf(): number }>;
    }

    private _shortenValue(value: number, index: number): string {
        return (value >= 1000) ? `${Math.ceil(value / 1000)}k` : `${value}`;
    }

    private _getProps(prop: PropDefaultTypes): any {
        if (!(prop in PROP_DEFAULTS)) {
            return {};
        }

        return objectAssign({}, PROP_DEFAULTS[prop], this.props[prop]);
    }

}