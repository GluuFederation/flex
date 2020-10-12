import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col,
  FormSelect
} from "shards-react";

import colors from "../../utils/colors";
import Chart from "../../utils/chart";

class UsersByDevice extends React.Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const chartConfig = {
      type: "doughnut",
      options: {
        ...{
          legend: false,
          cutoutPercentage: 80,
          tooltips: {
            enabled: false,
            mode: "index",
            position: "nearest"
          }
        },
        ...this.props.chartOptions
      },
      data: this.props.chartData
    };

    new Chart(this.canvasRef.current, chartConfig);
  }

  render() {
    const { title } = this.props;
    const labels = this.getParsedLabels();

    return (
      <Card small className="ubd-stats h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
          <div className="block-handle" />
        </CardHeader>

        <CardBody className="d-flex flex-column">
          {/* Chart */}
          <canvas
            width="100"
            ref={this.canvasRef}
            className="analytics-users-by-device mt-3 mb-4"
          />

          {/* Legend */}
          <div className="ubd-stats__legend w-75 m-auto pb-4">
            {labels.map((label, idx) => (
              <div key={idx} className="ubd-stats__item">
                {label.icon && (
                  <div
                    dangerouslySetInnerHTML={{ __html: label.icon }}
                    style={{ color: label.iconColor }}
                  />
                )}
                <span className="ubd-stats__category">{label.title}</span>
                <span className="ubd-stats__value">{label.value}%</span>
              </div>
            ))}
          </div>
        </CardBody>

        <CardFooter className="border-top">
          <Row>
            {/* Time Span */}
            <Col>
              <FormSelect
                size="sm"
                value="last-week"
                style={{ maxWidth: "130px" }}
                onChange={() => {}}
              >
                <option value="last-week">Last Week</option>
                <option value="today">Today</option>
                <option value="last-month">Last Month</option>
                <option value="last-year">Last Year</option>
              </FormSelect>
            </Col>

            {/* View Full Report */}
            <Col className="text-right view-report">
              {/* eslint-disable-next-line */}
              <a href="#">View full report &rarr;</a>
            </Col>
          </Row>
        </CardFooter>
      </Card>
    );
  }

  getParsedLabels() {
    const { chartData } = this.props;

    if (!chartData || typeof chartData.labels === "undefined") {
      return [];
    }

    return chartData.labels.map((label, idx) => {
      const dataset = chartData.datasets[0];

      return {
        title: label,
        icon: dataset.icons[idx],
        iconColor: dataset.backgroundColor[idx],
        value: dataset.data[idx]
      };
    });
  }
}

UsersByDevice.propTypes = {
  /**
   * The card's title.
   */
  title: PropTypes.string,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object,
  /**
   * The chart data.
   */
  chartData: PropTypes.object,
  /**
   * The Chart.js config.
   */
  chartConfig: PropTypes.object
};

UsersByDevice.defaultProps = {
  title: "Users by Device",
  chartConfig: Object.create(null),
  chartOptions: Object.create(null),
  chartData: {
    labels: ["Desktop", "Tablet", "Mobile"],
    datasets: [
      {
        hoverBorderColor: colors.white.toRGBA(1),
        data: [68.3, 24.2, 7.5],
        icons: [
          '<i class="material-icons">&#xE30B;</i>',
          '<i class="material-icons">&#xE32F;</i>',
          '<i class="material-icons">&#xE325;</i>'
        ],
        backgroundColor: [
          colors.primary.toRGBA(0.9),
          colors.primary.toRGBA(0.5),
          colors.primary.toRGBA(0.3)
        ]
      }
    ]
  }
};

export default UsersByDevice;
