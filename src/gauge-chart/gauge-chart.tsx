import * as React from "react";
import * as d3 from "d3";
import * as classNames from "classnames";

const styles: any = require("./gauge-chart.css");

interface ElementRefs {
    container: HTMLDivElement;
    bgPath: SVGPathElement;
    valuePath: SVGPathElement;
    svg: SVGSVGElement;
}

interface XY {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

interface Range {
    min: number;
    max: number;
}

const ARC_LENGTH = 0.5;
const CIRCULATION = Math.PI * ARC_LENGTH;

const GAUGE_WIDTH = 60;
const INNER_RADIUS = 60;
const OUTER_RADIUS = INNER_RADIUS + GAUGE_WIDTH;

export interface GaugeChartProps {
    min: number;
    max: number;
    value: number;
    unitText?: string;
    valueTextBuilder?: (value: number) => string;
    warningLevel?: number;
    errorLevel?: number;
}

export class GaugeChart extends React.Component<GaugeChartProps, {}> {

    static defaultProps: Partial<GaugeChartProps> = {
        valueTextBuilder: (value: number) => "" + value
    }

    private _elms: ElementRefs = { bgPath: null, valuePath: null, svg: null, container: null };
    private _arc: d3.Arc<any, d3.DefaultArcObject> = null;
    private _svgSize: Size = { width: 0, height: 0 }

    constructor(props) {
        super(props);

        this._handleResize = this._handleResize.bind(this);
    }

    public render(): JSX.Element {

        const { value, errorLevel, warningLevel, min, max, valueTextBuilder, unitText } = this.props;

        if (this._elms.bgPath) {
            this._update()
        }

        const gaugeClasses = classNames({
            [styles.valuePath]: true,
            [styles.valuePathWarning]: warningLevel && warningLevel < value,
            [styles.valuePathError]: errorLevel && errorLevel < value
        });

        const textValue = valueTextBuilder(value);

        const { x, y } = this._getCenter();
        const gaugeCenterFromCenterPoint = OUTER_RADIUS - OUTER_RADIUS * 0.25;
        const xLeft = x - gaugeCenterFromCenterPoint;
        const xRight = x + gaugeCenterFromCenterPoint;
        const levelTextY = y + 15;

        const { width, height } = this._svgSize;

        return (
            <div className={styles.root} ref={(ref) => this._elms.container = ref}>
                <svg width={width} height={height} className={styles.svg} ref={(ref) => this._elms.svg = ref} viewBox="0 0 300 150" preserveAspectRatio="xMinYMin meet">
                    <g transform="translate(0,0)">
                        <path fill="#efefef" ref={(ref) => this._elms.bgPath = ref} />
                        <path className={gaugeClasses} ref={(ref) => this._elms.valuePath = ref} />
                    </g>
                    <g transform="translate(0,0)">
                        <text x={x} y={y - 15} textAnchor="middle" className={styles.valueText}>{textValue}</text>
                        {unitText && <text x={x} y={y + 5} textAnchor="middle" className={styles.unitText}>{unitText}</text>}
                        <text x={xLeft} y={levelTextY} textAnchor="middle" className={styles.levelText}>{min}</text>
                        <text x={xRight} y={levelTextY} textAnchor="middle" className={styles.levelText}>{max}</text>
                    </g>
                    <g transform="translate(0,0)">
                        {warningLevel && this._createLevelMarker(warningLevel)}
                        {errorLevel && this._createLevelMarker(errorLevel)}
                    </g>
                </svg>
            </div >
        );
    }

    public componentDidMount() {
        this._updateSvgSize();
        this._create();
        this.forceUpdate();

        window.addEventListener("resize", this._handleResize);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this._handleResize);
    }

    private _handleResize() {
        this._updateSvgSize();
        this.forceUpdate();
    }

    private _create() {

        this._arc = d3.arc()
            .innerRadius(INNER_RADIUS)
            .outerRadius(OUTER_RADIUS)
            .startAngle(-CIRCULATION);

        const { x, y } = this._getCenter();

        const bgPath = d3.select(this._elms.bgPath)
            .attr('transform', `translate(${x}, ${y})`)
            .datum({ endAngle: CIRCULATION })
            .attr('d', this._arc)

        const valuePath = d3.select(this._elms.valuePath)
            .datum({ endAngle: -CIRCULATION })
            .attr('transform', `translate(${x}, ${y})`)
            .attr('d', this._arc);

    }

    private _updateSvgSize() {
        const width = this._elms.container.clientWidth;
        this._svgSize = {
            width,
            height: width / 2
        }
    }

    private _update() {
        const { value, min, max } = this.props;
        const fixedValue = fixValue(value, { min, max });
        const v = getMatchingValueFromRange(fixedValue, { min, max }, { min: -CIRCULATION, max: CIRCULATION });

        d3.select(this._elms.valuePath)
            .transition()
            .duration(1000)
            .attrTween('d', arcTween(v, this._arc))
            .ease(d3.easeExp);
    }

    private _getCenter(): XY {
        if (!this._elms.svg) {
            return { x: 0, y: 0 }
        }

        return {
            y: 125,
            x: 150
        }
    }

    private _createLevelMarker(level: number): JSX.Element {
        const { min, max } = this.props;
        const radius = INNER_RADIUS + GAUGE_WIDTH / 2;
        const centerPoint = this._getCenter();
        const startEndPosition = 360 * ARC_LENGTH / 2;
        const arcValue = getMatchingValueFromRange(level, { min, max }, { min: -startEndPosition, max: startEndPosition });
        const arc = describeArc(centerPoint.x, centerPoint.y, radius, arcValue, arcValue + 1);

        return <path className={styles.levelMarker} strokeWidth={OUTER_RADIUS - INNER_RADIUS + 5} d={arc} />
    }
}

export default GaugeChart;

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number): string => {

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number): XY => {
        let angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    let start = polarToCartesian(x, y, radius, endAngle);
    let end = polarToCartesian(x, y, radius, startAngle);

    let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
}

const arcTween = (newAngle, arc) => {
    return function (d) {
        const interpolate = d3.interpolate(d.endAngle, newAngle);
        return function (t) {
            d.endAngle = interpolate(t);
            return arc(d);
        };
    };
}


const fixValue = (value: number, range: Range): number => {
    const { min, max } = range;
    let fixedValue = value;
    fixedValue = Math.max(min, fixedValue);
    fixedValue = Math.min(max, fixedValue);
    return fixedValue;
}

const getMatchingValueFromRange = (value: number, origRange: Range, fromRange: Range): number => {

    const getValueOfPercentageInRange = (percentage: number, range: Range): number => {
        return (percentage * (range.max - range.min) / 100) + range.min;
    }

    const getPercentageOfValueInRange = (value: number, range: Range): number => {
        if (range.max < range.min) {
            throw "Range max value must be larger than min value";
        }

        const r = range.max - range.min;
        const newStartValue = value - range.min;
        return (newStartValue * 100) / r;
    }

    const p = getPercentageOfValueInRange(value, origRange);
    return getValueOfPercentageInRange(p, fromRange);
}