import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";

class DoughnutChart extends Component {
  render() {
    const data = {
      weight: 0,
      defaultFontFamily: "Poppins",
      datasets: [
        {
          data: [this.props.value, 100 - this.props.value],
          borderWidth: 0,
          backgroundColor: [
            this.props.backgroundColor ? this.props.backgroundColor : "#EA7A9A",
            this.props.backgroundColor2,
          ],
        },
      ],
    };

    const options = {
      width: this.props.width ? this.props.width : 110,
      cutoutPercentage: this.props.cutoutPercentage
        ? this.props.cutoutPercentage
        : 70,
      responsive: false,
      maintainAspectRatio: true,
      tooltips: { enabled: false },
      hover: { mode: null },
    };
    return (
      <div className="donught-chart" style={{ marginTop: "-10px" }}>
        <Doughnut
          data={data}
          options={options}
          height={this.props.height ? this.props.height : 110}
          width={this.props.width ? this.props.width : 110}
        />
      </div>
    );
  }
}

export default DoughnutChart;
