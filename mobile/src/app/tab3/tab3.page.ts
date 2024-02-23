import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { EnergyDataService } from 'src/shared/energy-data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  private intervalId: any;
  initOpts: any;
  solarData: any;
  options: any;
  realTimeData = [];
  historicalChartData = [];
  summaryMetrics: any;
  historicalOptions: any;

  dashboardItems: any[] = [
    { id: 'realTimeData', type: 'realTimeData' },
    { id: 'historicalData', type: 'historicalData' },
    { id: 'summaryMetrics', type: 'summaryMetrics' },
  ];

  constructor(
    private energyDataService: EnergyDataService,
    private cdr: ChangeDetectorRef
  ) {
    this.initOpts = {
      devicePixelRatio: window.devicePixelRatio,
      // renderer: 'canvas',
      // width: '200%',
      // height: 430
    };

    // this.cdr.detectChanges();
    console.log('Real Time Data:', this.realTimeData);
    // Verify that `this.realTimeData` is indeed an array and contains the expected structure

    this.options = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any[]) {
          // Ensures the tooltip content is concise and mobile-friendly
          let content = params
            .map((param: { marker: any; seriesName: any; value: number }) => {
              return `${param.marker}${param.seriesName}: ${param.value.toFixed(
                2
              )}`;
            })
            .join('<br/>'); // Use line break to separate series

          return content;
        },
        // Adjust tooltip styling for better readability on small screens
        textStyle: {
          fontSize: 12, // Smaller font size for mobile readability
          fontFamily: 'Arial, sans-serif', // Ensure a universally readable font is used
        },
        borderColor: '#333', // Optional: Customize border color for better visibility
        borderWidth: 1, // Optional: Adjust border width to suit mobile aesthetic
        backgroundColor: 'rgba(255,255,255,0.9)', // Light background with slight opacity for readability
        padding: 10, // Ensure there's padding around the text for better legibility
        extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.2);', // Optional: Add a subtle shadow for depth
        position: function (
          point: number[],
          params: any,
          dom: any,
          rect: any,
          size: { viewSize: number[] }
        ) {
          // Dynamically position the tooltip to ensure it does not overflow the chart bounds
          const obj: { top: number; left?: number; right?: number } = {
            top: 10,
          }; // Default to placing tooltip at the top to minimize overlap
          if (point[0] < size.viewSize[0] / 2) {
            obj.left = point[0] + 20; // Position to the right of the cursor if on the left half
          } else {
            obj.right = size.viewSize[0] - point[0] + 20; // Position to the left of the cursor if on the right half
          }
          return obj;
        },
      },
      title: {
        text: 'Solar Energy Generation',
        textStyle: {
          fontSize: 16,
        },
      },
      legend: {
        data: ['Energy Generated (KWh)'],
        bottom: 0,
      },
      xAxis: {
        type: 'category',
        data: this.realTimeData,
        axisLabel: {
          formatter: function (value: any) {
            return value; // Format as needed
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          rotate: 45, // Adjust angle based on your preference
          formatter: (value: number) => {
            // Shorten labels if necessary
            return value >= 1000 ? `${value / 1000}K` : value;
          },
          textStyle: {
            fontSize: 10, // Smaller font size for mobile
          },
        },
      },
      series: [
        {
          name: 'Energy Generated (KWh)',
          type: 'bar',
          data: this.realTimeData,
          barWidth: '60%',
        },
      ],
      media: [
        {
          query: {
            maxAspectRatio: 1, // when length-to-width ratio is less than 1
          },
          option: {
            legend: {
              // legend is placed in middle-bottom
              right: 'center',
              bottom: 0,
              orient: 'horizontal', // horizontal layout of legend
            },
            series: [
              // left and right layout of two pie charts
              {
                radius: [20, '50%'],
                center: ['50%', '30%'],
              },
              {
                radius: [30, '50%'],
                center: ['50%', '70%'],
              },
            ],
          },
        },
        {
          query: {
            maxWidth: 500, // when container width is smaller than 500
          },
          option: {
            legend: {
              right: 10, // legend is placed in middle-right
              top: '15%',
              orient: 'vertical', // vertical layout
            },
            series: [
              // top and bottom layout of two pie charts
              {
                radius: [20, '50%'],
                center: ['50%', '30%'],
              },
              {
                radius: [30, '50%'],
                center: ['50%', '75%'],
              },
            ],
          },
        },
      ],
    };

    this.historicalOptions = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any[]) {
          // Ensures the tooltip content is concise and mobile-friendly
          let content = params
            .map((param: { marker: any; seriesName: any; value: number }) => {
              return `${param.marker}${param.seriesName}: ${param.value.toFixed(
                2
              )}`;
            })
            .join('<br/>'); // Use line break to separate series

          return content;
        },
        // Adjust tooltip styling for better readability on small screens
        textStyle: {
          fontSize: 12, // Smaller font size for mobile readability
          fontFamily: 'Arial, sans-serif', // Ensure a universally readable font is used
        },
        borderColor: '#333', // Optional: Customize border color for better visibility
        borderWidth: 1, // Optional: Adjust border width to suit mobile aesthetic
        backgroundColor: 'rgba(255,255,255,0.9)', // Light background with slight opacity for readability
        padding: 10, // Ensure there's padding around the text for better legibility
        extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.2);', // Optional: Add a subtle shadow for depth
        position: function (
          point: number[],
          params: any,
          dom: any,
          rect: any,
          size: { viewSize: number[] }
        ) {
          // Dynamically position the tooltip to ensure it does not overflow the chart bounds
          const obj: { top: number; left?: number; right?: number } = {
            top: 10,
          }; // Default to placing tooltip at the top to minimize overlap
          if (point[0] < size.viewSize[0] / 2) {
            obj.left = point[0] + 20; // Position to the right of the cursor if on the left half
          } else {
            obj.right = size.viewSize[0] - point[0] + 20; // Position to the left of the cursor if on the right half
          }
          return obj;
        },
      },
      title: {
        text: 'Solar Energy Generation',
        textStyle: {
          fontSize: 16,
        },
      },
      legend: {
        data: ['Energy Generated (KWh)', 'Energy Consumed (KWh)'],
        bottom: 0,
      },
      xAxis: {
        type: 'category',
        xAxis: this.historicalChartData,
        axisLabel: {
          formatter: function (value: any) {
            return value;
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          rotate: 45,
          // Custom formatter to adjust label presentation for compactness
          formatter: function (value: number) {
            // Check if the value exceeds thousands to use 'K' for kilowatts
            if (value >= 1000) {
              return `${(value / 1000).toFixed(1)}k`; // Converts 1000 to 1.0k, for example
            } else {
              return `${value}`; // Keeps smaller values as is, for clarity
            }
          },
          textStyle: {
            fontSize: 10, // Reduce font size for mobile screens to save space
          },
        },
        // Additional yAxis options for better mobile presentation
        showMinLabel: true, // Ensures the minimum value label is shown
        showMaxLabel: true, // Ensures the maximum value label is shown
        boundaryGap: ['20%', '20%'], // Adds a little padding inside the chart area to prevent labels from being cut off
      },
      series: [
        {
          name: 'Energy Generated (KWh)',
          type: 'bar',
          series: this.historicalChartData,
          barWidth: '60%', // Adjust as needed
        },
      ],
    };
  }

  ngOnInit() {
    this.fetchLatestSolarData();
    this.fetchHistoricalSolarData();

    this.intervalId = setInterval(() => this.fetchLatestSolarData(), 5000);
  }

  // ngAfterViewInit() {

  // }

  fetchLatestSolarData() {
    this.energyDataService.getLatestSolarData().subscribe(
      (latestData) => {
        const formattedData = this.transformDataForChart([latestData]);
        this.options.xAxis.data = formattedData.xAxis.data;
        this.options.series = formattedData.series;
        // this.options.series[0].data = this.realTimeData;
        // this.cdr.detectChanges();
      },
      (error) => console.error('Error fetching latest solar data:', error)
    );
  }

  fetchHistoricalSolarData() {
    const dataLimit = 6;
    this.energyDataService.getLimitedSolarData(dataLimit).subscribe(
      (historicalData) => {
        const formattedData = this.prepareHistoricalChartData(historicalData);
        this.historicalOptions.xAxis.data = formattedData.xAxis.data;
        this.historicalOptions.series = formattedData.series;
        this.summaryMetrics = this.calculateSummaryMetrics(historicalData);
      },
      (error) => console.error('Error fetching historical solar data:', error)
    );
  }

  transformDataForChart(data: any[]): any {
    return {
      xAxis: {
        type: 'category',
        data: data.map((d) => new Date(d.timestamp).toLocaleDateString()),
      },
      series: [
        {
          name: 'Energy Generated (kWh)',
          type: 'bar',
          data: data.map((d) => d.energyGenerated),
        },
      ],
    };
  }

  prepareHistoricalChartData(data: any[]): any {
    // Echarts expects data in a format suitable for its configuration, especially for time-series data
    return {
      xAxis: {
        type: 'category',
        data: data.map((d) => new Date(d.timestamp).toLocaleDateString()),
      },
      series: [
        {
          name: 'Energy Generated (kWh)',
          type: 'bar', // or 'line', depending on your chart type
          data: data.map((d) => d.energyGenerated),
        },
        {
          name: 'Energy Consumed (kWh)',
          type: 'bar', // or 'line', depending on your chart type
          data: data.map((d) => d.energyConsumed),
        },
      ],
    };
  }

  calculateSummaryMetrics(data: any[]): any {
    const totalEnergyGenerated = data.reduce(
      (total, current) => total + current.energyGenerated,
      0
    );
    const averageEfficiency =
      data.reduce((total, current) => total + current.efficiency, 0) /
      data.length;
    const totalEnergyConsumed = data.reduce(
      (total, current) => total + current.energyConsumed,
      0
    );

    return [
      {
        title: 'Total Energy Generated',
        value: totalEnergyGenerated.toFixed(2) + ' kWh',
        description: 'Total solar energy generated',
      },
      {
        title: 'Average Efficiency',
        value: averageEfficiency.toFixed(2) + '%',
        description: 'Average efficiency of solar panels',
      },
      {
        title: 'Total Energy Consumed',
        value: totalEnergyConsumed.toFixed(2) + ' kWh',
        description: 'Total energy consumed by the system',
      },
    ];
  }
}
