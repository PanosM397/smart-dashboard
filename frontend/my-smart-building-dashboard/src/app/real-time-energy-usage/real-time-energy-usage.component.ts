import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import 'chartjs-adapter-moment';


interface TempAggregator {
  [key: string]: {
    sum: number;
    count: number;
  };
}


@Component({
  selector: 'app-real-time-energy-usage',
  templateUrl: './real-time-energy-usage.component.html',
  styleUrls: ['./real-time-energy-usage.component.scss'],
})
export class RealTimeEnergyUsageComponent implements OnInit {
  private intervalId: any;

  chartOption: any;
  initOpts: any;
  // energyData: any;
  // historicalChartOptions: any;
  historicalData!: any;
  heatmapOptions!: any;

  energyData: any;
  public realTimeChartData: ChartDataset[] = [
    { data: [], label: 'Real Time Data' },
  ];
  public realTimeChartLabels: string[] = [
    'Energy Consumption',
    'Room Temperature',
    'Humidity',
    'Occupancy',
  ];

  public occupancyChartData: ChartDataset[] = [
    {
      data: [], // Your data here
      label: 'Occupancy',
      fill: true, // This creates the area effect
      backgroundColor: 'rgba(0, 123, 255, 0.3)', // Adjust the color as needed
      borderColor: 'rgb(0, 123, 255)'
    }
  ];
  public occupancyChartLabels: string[] = []; // Your labels here (e.g., dates)
  public occupancyChartOptions: ChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            // You can customize your tooltip label here
            return `Occupancy: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          parser: 'YYYY-MM-DDTHH:mm:ssZ',
          tooltipFormat: 'll HH:mm',
          displayFormats: {
            hour: 'HH:mm',  // Change this according to your data granularity
            day: 'MMM D'
          }
        },
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          autoSkip: true,
          maxRotation: 90,
          minRotation: 90
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Occupancy'
        },
        ticks: {
          precision: 0 // No decimal places for occupancy
        }
      }
    },
    elements: {
      point: {
        radius: 3 // Adjust the radius of the points on the line
      },
      line: {
        tension: 0.3 // Adjust the line tension (curviness)
      }
    }
  };



  public historicalChartLabels: string[] = [];

  public historicalChartData: ChartDataset[] = [
    {
      data: [],
      label: 'Energy Consumption',
      borderColor: '#42A5F5',
      backgroundColor: 'rgba(66, 165, 245, 0.3)', // Light blue
      fill: false
    },
    {
      data: [],
      label: 'Room Temperature',
      borderColor: '#9CCC65',
      backgroundColor: 'rgba(156, 204, 101, 0.3)', // Light green
      fill: false
    },
    {
      data: [],
      label: 'Humidity',
      borderColor: '#FFA726',
      backgroundColor: 'rgba(255, 167, 38, 0.3)', // Light orange
      fill: false
    },
    {
      data: [],
      label: 'Occupancy',
      borderColor: '#26C6DA',
      backgroundColor: 'rgba(38, 198, 218, 0.3)', // Light cyan
      fill: false
    },
  ];
  public historicalChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true, // This can be set to `true` based on your design needs
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'MMM D, YYYY',
          displayFormats: {
            quarter: 'MMM YYYY',
          },
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    elements: {
      line: {
        tension: 0.5, // Smoothes the line
      },
      point: {
        radius: 3, // Adjust point size
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: true,
    },
  };
  energyData1: any;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initOpts = {
      devicePixelRatio: window.devicePixelRatio,
      // renderer: 'canvas',
      // width: '550%',
      // height: 230
    };

    // this.chartOption= {
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
        console.log("Fetched data:", data);
      this.energyData1 = data;
      this.updateRealTimeChart();
    } catch (error) {
      console.error('Could not fetch real-time data', error);
    }
  }

  private updateRealTimeChart() {
    if (this.energyData1 && this.energyData1.energyConsumption !== undefined) {
      this.realTimeChartData[0].data = [
        this.energyData1.energyConsumption,
        this.energyData1.roomTemperature,
        this.energyData1.humidity,
        this.energyData1.occupancy,
      ];
    }
  }

  private async fetchHistoricalData() {
    try {
      const data = await this.http
        .get<any[]>('http://localhost:3000/api/historical')
        .toPromise();
      if (data && data.length > 0) {
        this.historicalData = data;
        this.updateHistoricalChart();
      } else {
        console.warn('No historical data available');
      }
    } catch (error) {
      console.error('Could not fetch historical data', error);
    }
  }

  private updateHistoricalChart() {
    if (this.historicalData && this.historicalData.length > 0) {
      // Get the last 100 entries
      const slicedData = this.historicalData.slice(-50);

      this.historicalChartLabels = slicedData.map(
        (d: { timestamp: any }) => d.timestamp
      );

      // Update each dataset
      this.historicalChartData[0].data = slicedData.map(
        (d: { energyConsumption: any }) => d.energyConsumption
      );
      this.historicalChartData[1].data = slicedData.map(
        (d: { roomTemperature: any }) => d.roomTemperature
      );
      this.historicalChartData[2].data = slicedData.map(
        (d: { humidity: any }) => d.humidity
      );
      this.historicalChartData[3].data = slicedData.map(
        (d: { occupancy: any }) => d.occupancy
      );

          // Update the occupancy chart
    this.updateOccupancyChart(slicedData);

    const heatmapData = this.processDataForHeatmap(this.historicalData);
    this.updateHeatmap(heatmapData);
    }
  }

  private updateOccupancyChart(data: any[]) {
    this.occupancyChartLabels = data.map((d: { timestamp: any }) => d.timestamp);
    this.occupancyChartData[0].data = data.map((d: { occupancy: any }) => d.occupancy);
  }

  private updateHeatmap(data: any[]) {
    this.heatmapOptions = {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const value = params.value;
          // Assuming value format is [hourIndex, dayIndex, temperature]
          return `Temperature: ${value[2]}°C<br/>Day: ${this.getDayOfWeek(value[1])}<br/>Time: ${this.formatTimeLabel(value[0])}`;
        }
      },
      animation: false,
      grid: {
        height: '50%',
        y: '10%',
        y2: '15%'
      },
      xAxis: {
        type: 'category',
        data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 21, // Assuming 10 is the minimum temperature in your data
        max: 22.2, // Assuming 35 is the maximum temperature in your data
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '22%',
        textStyle: {
          color: '#000'
        },
        inRange: {
          // Define a color gradient from cool to warm temperatures
          color: [
            '#e0f3f8', // Moderate - Very light blue
            '#ffffbf', // Warm - Yellow
            '#fdae61', // Warmer - Orange
          ]
        }
      },

      series: [{
        name: 'Room Temperature',
        type: 'heatmap',
        data: data,
        label: {
          normal: {
            show: false
          }
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  }

  // Helper method to format time label
  private formatTimeLabel(hourIndex: number): string {
    return `${hourIndex.toString().padStart(2, '0')}:00`;
  }

  // Helper method to get day of the week
  private getDayOfWeek(dayIndex: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  }
  private processDataForHeatmap(data: any[]): any[] {
    // This map will aggregate temperatures by the hour across all days.
    const tempByHourMap: { [key: string]: any } = {};

    data.forEach(item => {
      const date = new Date(item.timestamp);
      const dayHour = `${date.getDay()}-${date.getHours()}`;

      if (!tempByHourMap[dayHour]) {
        tempByHourMap[dayHour] = [];
      }

      tempByHourMap[dayHour].push(item.roomTemperature);
    });

    // Now convert this map into an array of [dayIndex, hourIndex, averageTemp].
    const heatmapData = Object.keys(tempByHourMap).map(key => {
      const [day, hour] = key.split('-').map(Number);
      const temperatures = tempByHourMap[key];
      const averageTemp = temperatures.reduce((sum: any, temp: any) => sum + temp, 0) / temperatures.length;
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
