import React from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from "react-native-chart-kit";

export default function Chart_Head({ x_label, peak_head, headY, max_head_timestamp }) {  
  const settings = {
    data: {
      labels: x_label,
      datasets: [
        {
          data: peak_head,
          strokeWidth: 10,
          color: (opacity = 1) => `rgba(252, 140, 3,${opacity})`, // optional
        },
        {
          data: headY,
        },
      ],
      legend: [`Busiest at ${max_head_timestamp}`],
    },
    width: Dimensions.get("window").width,
    height: 175,
    yAxisLabel: "",
    yAxisSuffix: "",
    yAxisInterval: 1,
    chartConfig: {
      backgroundColor: "#0a5274",
      backgroundGradientFrom: "#0a5255",
      backgroundGradientTo: "#0a5274",
      decimalPlaces: 1, // optional, defaults to 2dp
      // color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: "0",
        strokeWidth: "0",
        stroke: "#ffa726",
      },
    },
    style: {
      marginVertical: 8,
      borderRadius: 16,
    }
  }

	return (
		<LineChart
      bezier
      data={settings.data}
      width={settings.width} // from react-native
      height={settings.height}
      yAxisLabel={settings.yAxisLabel}
      yAxisSuffix={settings.yAxisSuffix}
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={settings.chartConfig}
      style={settings.style}
    />
	);
}