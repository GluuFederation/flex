import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  ButtonGroup,
  Button
} from "shards-react";

import RangeDatePicker from "../common/RangeDatePicker";

import colors from "../../utils/colors";
import Chart from "../../utils/chart";

class Sessions extends React.Component {
  constructor(props) {
    super(props);

    this.legendRef = React.createRef();
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const chartOptions = {
      ...{
        responsive: true,
        legend: false,
        elements: {
          line: {
            // A higher value makes the line look skewed at this ratio.
            tension: 0.38
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: false,
              ticks: {
                callback(tick, index) {
                  return index % 2 === 0 ? "" : tick;
                }
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                suggestedMax: 45
              }
            }
          ]
        },
        tooltips: {
          enabled: false,
          mode: "index",
          position: "nearest"
        }
      },
      ...this.props.chartOptions
    };

    const AnalyticsOverviewChart = new Chart(this.canvasRef.current, {
      type: "line",
      data: this.props.chartData,
      options: chartOptions
    });

    // Generate the analytics overview chart labels.
    this.legendRef.current.innerHTML = AnalyticsOverviewChart.generateLegend();

    // Hide initially the first and last analytics overview chart points.
    // They can still be triggered on hover.
    const meta = AnalyticsOverviewChart.getDatasetMeta(0);
    meta.data[0]._model.radius = 0;
    meta.data[
      this.props.chartData.datasets[0].data.length - 1
    ]._model.radius = 0;

    // Render the chart.
    AnalyticsOverviewChart.render();
  }

  render() {
    const { title } = this.props;

    return (
      <Card small className="h-100">
        {/* Card Header */}
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
          <div className="block-handle" />
        </CardHeader>

        <CardBody className="pt-0">
          <Row className="border-bottom py-2 bg-light">
            {/* Time Interval */}
            <Col sm="6" className="col d-flex mb-2 mb-sm-0">
              <ButtonGroup>
                <Button theme="white" active>
                  Hour
                </Button>
                <Button theme="white">Day</Button>
                <Button theme="white">Week</Button>
                <Button theme="white">Month</Button>
              </ButtonGroup>
            </Col>

            {/* DatePicker */}
            <Col sm="6" className="col">
              <RangeDatePicker className="justify-content-end" />
            </Col>
          </Row>

          <div ref={this.legendRef} />
          <canvas
            height="120"
            ref={this.canvasRef}
            style={{ maxWidth: "100% !important" }}
            className="analytics-overview-sessions"
          />
        </CardBody>
      </Card>
    );
  }
}

Sessions.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The Chart.js data.
   */
  chartData: PropTypes.object,
  /**
   * The Chart.js config options.
   */
  chartOptions: PropTypes.object
};

Sessions.defaultProps = {
  title: "Sessions",
  chartData: {
    labels: [
      "09:00 PM",
      "10:00 PM",
      "11:00 PM",
      "12:00 PM",
      "13:00 PM",
      "14:00 PM",
      "15:00 PM",
      "16:00 PM",
      "17:00 PM"
    ],
    datasets: [
      {
        label: "Today",
        fill: "start",
        data: [5, 5, 10, 30, 10, 42, 5, 15, 5],
        backgroundColor: colors.primary.toRGBA(0.1),
        borderColor: colors.primary.toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: colors.primary.toRGBA(1),
        borderWidth: 1.5
      },
      {
        label: "Yesterday",
        fill: "start",
        data: ["", 23, 5, 10, 5, 5, 30, 2, 10],
        backgroundColor: colors.salmon.toRGBA(0.1),
        borderColor: colors.salmon.toRGBA(1),
        pointBackgroundColor: colors.white.toHex(),
        pointHoverBackgroundColor: colors.salmon.toRGBA(1),
        borderDash: [5, 5],
        borderWidth: 1.5,
        pointRadius: 0,
        pointBorderColor: colors.salmon.toRGBA(1)
      }
    ]
  }
};

export default Sessions;
