import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardBody } from "shards-react";

import Chart from "../../utils/chart";

class UserPerformance extends React.Component {
  constructor(props) {
    super(props);

    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const defaultOptions = {
      responsive: true,
      scaleBeginsAtZero: true,
      legend: false,
      tooltips: {
        enabled: false,
        mode: "index",
        position: "nearest"
      },
      elements: {
        line: {
          tension: 0
        }
      },
      scales: {
        xAxes: [
          {
            stacked: true,
            gridLines: false
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    };

    const chartConfig = {
      type: "bar",
      data: this.props.chartData,
      options: {
        ...defaultOptions,
        ...this.props.chartOptions
      }
    };

    new Chart(this.canvasRef.current, chartConfig);
  }

  render() {
    const { title } = this.props;

    return (
      <Card small className="card-small mb-4">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{title}</h6>
          <div className="block-handle" />
        </CardHeader>
        <CardBody className="pt-0">
          <canvas
            ref={this.canvasRef}
            height="130"
            className="user-profile-weekly-performance mt-3"
          />
        </CardBody>
      </Card>
    );
  }
}

UserPerformance.propTypes = {
  /**
   * The component's title.
   */
  title: PropTypes.string,
  /**
   * The chart dataset.
   */
  chartData: PropTypes.object,
  /**
   * The Chart.js options.
   */
  chartOptions: PropTypes.object
};

UserPerformance.defaultProps = {
  title: "Weekly Performance Report",
  chartData: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Hours",
        fill: "start",
        data: [5, 6.4, 7.2, 6, 9, 4.7, 7],
        backgroundColor: "rgba(0, 123, 255, 1)",
        borderColor: "rgba(0, 123, 255, 1)",
        pointBackgroundColor: "#FFFFFF",
        pointHoverBackgroundColor: "rgba(0, 123, 255, 1)",
        borderWidth: 0
      }
    ]
  }
};

export default UserPerformance;
