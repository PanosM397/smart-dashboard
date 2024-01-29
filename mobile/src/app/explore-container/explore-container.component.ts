/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit, OnDestroy {
  private intervalId: any;

  chartOption: any;
  initOpts: any;
  occupancyTrendsOption: any;
  historicalChartOptions: any;
  // historicalData!: any;
  heatmapOptions!: any;
  occupancyChartOption!: any;

  energyData: any;
  public realTimeChartOption!: EChartsOption;
  public realTimeChartLabels: string[] = [
    'Energy Consumption',
    'Room Temperature',
    'Humidity',
    'Occupancy',
  ];

  energyData1: any;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initOpts = {
      devicePixelRatio: window.devicePixelRatio,
      // renderer: 'canvas',
      // width: '200%',
      // height: 430
    };

    // this.realTimeChartOption= {
    //   xAxis: {
    //     type: 'category',
    //     data: ['Energy Consumption', 'Room Temperature', 'Humidity', 'Occupancy']
    //   },
    //   yAxis: {
    //     type: 'value'
    //   },
    //   series: [
    //     {
    //       data: [],
    //       type: 'bar'
    //     }
    //   ]
    // };

    // this.historicalChartOptions = {
    //   tooltip: {
    //     trigger: 'axis'
    //   },
    //   legend: {
    //     data: ['Energy Consumption', 'Room Temperature', 'Humidity', 'Occupancy']
    //   },
    //   xAxis: {
    //     type: 'time',
    //   },
    //   yAxis: {
    //     type: 'value'
    //   },
    //   series: [
    //     {
    //       name: 'Energy Consumption',
    //       type: 'line',
    //       data: []
    //     },
    //     {
    //       name: 'Room Temperature',
    //       type: 'line',
    //       data: []
    //     },
    //     {
    //       name: 'Humidity',
    //       type: 'line',
    //       data: []
    //     },
    //     {
    //       name: 'Occupancy',
    //       type: 'line',
    //       data: []
    //     }
    //   ]
    // };
    this.fetchRealTimeData();
    this.fetchHistoricalData();

    this.intervalId = setInterval(() => this.fetchRealTimeData(), 5000);
  }

  // private async fetchRealTimeData() {
  //   try {
  //     const data = await this.http.get<any>('http://localhost:3000/api/realtime').toPromise();
  //     console.log("Received Data:", data);
  //     this.energyData = data;
  //     this.updateChart();
  //     this.cd.detectChanges();
  //   } catch (error) {
  //     console.error('Could not fetch real-time data', error);
  //   }
  // }

  // private updateChart() {
  //   if (this.energyData) {
  //     this.chartOption = {
  //       ...this.chartOption,
  //       series: [{
  //         data: [
  //           this.energyData.energyConsumption,
  //           this.energyData.roomTemperature,
  //           this.energyData.humidity,
  //           this.energyData.occupancy
  //         ],
  //         type: 'bar'
  //       }]
  //     };
  //   }
  // }

  // private async fetchHistoricalData() {
  //   try {
  //     const data = await this.http.get<any[]>('http://localhost:3000/api/historical').toPromise();
  //     if (data && data.length > 0) {
  //       this.historicalData = data;
  //       console.log("Fetched historical data: ", this.historicalData);
  //       this.updateHistoricalChart();
  //       this.cd.detectChanges();
  //     } else {
  //       console.warn("No historical data available");
  //     }
  //   } catch (error) {
  //     console.error('Could not fetch historical data', error);
  //   }
  // }

  // private updateHistoricalChart() {
  //   if (this.historicalData && this.historicalData.length > 0) {
  //     // Limiting data to last 100 records for easier rendering
  //     const limitedData = this.historicalData.slice(-100);

  //     this.historicalChartOptions = {
  //       ...this.historicalChartOptions,
  //       series: [
  //         {
  //           name: 'Energy Consumption',
  //           data: limitedData.map((d: { timestamp: any; energyConsumption: any; }) => [d.timestamp, d.energyConsumption]),
  //           type: 'line'
  //         },
  //         {
  //           name: 'Room Temperature',
  //           data: limitedData.map((d: { timestamp: any; roomTemperature: any; }) => [d.timestamp, d.roomTemperature]),
  //           type: 'line'
  //         },
  //         {
  //           name: 'Humidity',
  //           data: limitedData.map((d: { timestamp: any; humidity: any; }) => [d.timestamp, d.humidity]),
  //           type: 'line'
  //         },
  //         {
  //           name: 'Occupancy',
  //           data: limitedData.map((d: { timestamp: any; occupancy: any; }) => [d.timestamp, d.occupancy]),
  //           type: 'line'
  //         }
  //       ]
  //     };
  //     console.log("Updated chart with limited data: ", this.historicalChartOptions.series[0].data);
  //   } else {
  //     console.warn("No historical data to update chart");
  //   }
  // }

  private async fetchRealTimeData() {
    try {
      const data = await this.http
        .get<any>('http://localhost:3000/api/realtime')
        .toPromise();
      console.log('Fetched data:', data);
      this.updateRealTimeChart(data);
    } catch (error) {
      console.error('Could not fetch real-time data', error);
    }
  }

  private updateRealTimeChart(data: any) {
    if (data && data.energyConsumption !== undefined) {
      this.realTimeChartOption = {
        xAxis: {
          type: 'category',
          data: this.realTimeChartLabels,
        },
        yAxis: {
          type: 'value',
        },
        // dataZoom: [
        //   {
        //     show: true,
        //     realtime: true,
        //     start: 30,
        //     end: 70,
        //     xAxisIndex: [0, 1]
        //   },
        //   {
        //     type: 'inside',
        //     realtime: true,
        //     start: 30,
        //     end: 70,
        //     xAxisIndex: [0, 1]
        //   }
        // ],
        legend: {
          data: [
            'Energy Consumption',
            'Room Temperature',
            'Humidity',
            'Occupancy',
          ],
        },
        series: [
          {
            data: [
              { value: data.energyConsumption, name: 'Energy Consumption' },
              { value: data.roomTemperature, name: 'Room Temperature' },
              { value: data.humidity, name: 'Humidity' },
              { value: data.occupancy, name: 'Occupancy' },
            ],
            type: 'bar',
            label: {
              show: true,
              position: 'top',
            },
          },
        ],
      };
    }
  }

  private async fetchHistoricalData() {
    try {
      const data = await this.http
        .get<any[]>('http://localhost:3000/api/historical')
        .toPromise();
      if (data && data.length > 0) {
        this.updateHistoricalChart(data);
      } else {
        console.warn('No historical data available');
      }
    } catch (error) {
      console.error('Could not fetch historical data', error);
    }
  }

  private updateHistoricalChart(data: any[]) {
    const slicedData = data.slice(-50); // Slicing the last 50 data points

    // Preparing data for ECharts
    const energyConsumption = slicedData.map((d) => [
      d.timestamp,
      d.energyConsumption,
    ]);
    const roomTemperature = slicedData.map((d) => [
      d.timestamp,
      d.roomTemperature,
    ]);
    const humidity = slicedData.map((d) => [d.timestamp, d.humidity]);
    const occupancy = slicedData.map((d) => [d.timestamp, d.occupancy]);

    this.historicalChartOptions = {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'time',
      },
      yAxis: {
        type: 'value',
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 80,
          end: 100,
          xAxisIndex: [0, 1],
        },
        {
          type: 'inside',
          realtime: true,
          start: 80,
          end: 100,
          xAxisIndex: [0, 1],
        },
      ],
      series: [
        {
          name: 'Energy Consumption',
          type: 'line',
          data: energyConsumption,
        },
        {
          name: 'Room Temperature',
          type: 'line',
          data: roomTemperature,
        },
        {
          name: 'Humidity',
          type: 'line',
          data: humidity,
        },
        {
          name: 'Occupancy',
          type: 'line',
          data: occupancy,
        },
      ],
    };

    // Update the occupancy chart
    this.updateOccupancyChart(slicedData);

    const heatmapData = this.processDataForHeatmap(data);
    this.updateHeatmap(heatmapData);
  }

  private updateOccupancyChart(data: any[]) {
    const occupancyData = data.map((d) => [d.timestamp, d.occupancy]);

    this.occupancyTrendsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
      },
      xAxis: {
        type: 'time',
      },
      yAxis: {
        type: 'value',
        min: 'dataMin',
        max: 'dataMax',
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 80,
          end: 100,
          xAxisIndex: [0, 1],
        },
        {
          type: 'inside',
          realtime: true,
          start: 95,
          end: 100,
          xAxisIndex: [0, 1],
        },
      ],
      series: [
        {
          data: occupancyData,
          type: 'line',
          smooth: true, // Optional, for smoother line
          name: 'Occupancy',
          // Additional series options as needed
        },
      ],
    };
  }

  private updateHeatmap(data: any[]) {
    this.heatmapOptions = {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const value = params.value;
          // Assuming value format is [hourIndex, dayIndex, temperature]
          return `Temperature: ${value[2]}°C<br/>Day: ${this.getDayOfWeek(
            value[1]
          )}<br/>Time: ${this.formatTimeLabel(value[0])}`;
        },
      },
      animation: false,
      grid: {
        height: '50%',
        y: '10%',
        y2: '15%',
      },
      xAxis: {
        type: 'category',
        data: [
          '00:00',
          '01:00',
          '02:00',
          '03:00',
          '04:00',
          '05:00',
          '06:00',
          '07:00',
          '08:00',
          '09:00',
          '10:00',
          '11:00',
          '12:00',
          '13:00',
          '14:00',
          '15:00',
          '16:00',
          '17:00',
          '18:00',
          '19:00',
          '20:00',
          '21:00',
          '22:00',
          '23:00',
        ],
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: 'category',
        data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: 21, // Assuming 10 is the minimum temperature in your data
        max: 22.2, // Assuming 35 is the maximum temperature in your data
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '22%',
        textStyle: {
          color: '#000',
        },
        inRange: {
          // Define a color gradient from cool to warm temperatures
          color: [
            '#e0f3f8', // Moderate - Very light blue
            '#ffffbf', // Warm - Yellow
            '#fdae61', // Warmer - Orange
          ],
        },
      },

      series: [
        {
          name: 'Room Temperature',
          type: 'heatmap',
          data: data,
          label: {
            normal: {
              show: false,
            },
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }

  // Helper method to format time label
  private formatTimeLabel(hourIndex: number): string {
    return `${hourIndex.toString().padStart(2, '0')}:00`;
  }

  // Helper method to get day of the week
  private getDayOfWeek(dayIndex: number): string {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[dayIndex];
  }
  private processDataForHeatmap(data: any[]): any[] {
    // This map will aggregate temperatures by the hour across all days.
    const tempByHourMap: { [key: string]: any } = {};

    data.forEach((item) => {
      const date = new Date(item.timestamp);
      const dayHour = `${date.getDay()}-${date.getHours()}`;

      if (!tempByHourMap[dayHour]) {
        tempByHourMap[dayHour] = [];
      }

      tempByHourMap[dayHour].push(item.roomTemperature);
    });

    // Now convert this map into an array of [dayIndex, hourIndex, averageTemp].
    const heatmapData = Object.keys(tempByHourMap).map((key) => {
      const [day, hour] = key.split('-').map(Number);
      const temperatures = tempByHourMap[key];
      const averageTemp =
        temperatures.reduce((sum: any, temp: any) => sum + temp, 0) /
        temperatures.length;
      return [hour, day, parseFloat(averageTemp.toFixed(2))];
    });

    return heatmapData;
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
