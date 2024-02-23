import { Component, OnInit } from '@angular/core';
import { EnergyDataService } from 'src/shared/energy-data.service';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';

@Component({
  selector: 'app-solar-overview',
  templateUrl: './solar-overview.component.html',
  styleUrls: ['./solar-overview.component.scss'],
})
export class SolarOverviewComponent implements OnInit {
  solarData: any;
  options: any;
  realTimeData: any;
  summaryMetrics: any;
  historicalChartData: any;
  historicalOptions: any;

  dashboardItems: any[] = [
    { id: 'realTimeData', type: 'realTimeData' },
    { id: 'historicalData', type: 'historicalData' },
    { id: 'summaryMetrics', type: 'summaryMetrics' },
  ];
  draggedItemIndex!: number;

  uniqueIdCounter = 0; // Initialize a global counter or a stateful variable

  // gridsterOptions!: GridsterConfig;
  // dashboard!: Array<GridsterItem>;

  constructor(private energyDataService: EnergyDataService) {
    this.options = {
      tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
          // You can customize these callbacks to display additional data
          label: function (
            tooltipItem: { datasetIndex: string | number; yLabel: number },
            data: { datasets: { [x: string]: { label: string } } }
          ) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            label += tooltipItem.yLabel.toFixed(2); // Adjust precision as needed
            return label;
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Solar Energy Generation',
          fontSize: 16,
        },
        legend: {
          display: true,
          position: 'bottom',
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Energy (kWh)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Time of Day',
          },
        },
      },
    };

    this.historicalOptions = {
      tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
          // You can customize these callbacks to display additional data
          label: function (
            tooltipItem: { datasetIndex: string | number; yLabel: number },
            data: { datasets: { [x: string]: { label: string } } }
          ) {
            let label = data.datasets[tooltipItem.datasetIndex].label || '';
            if (label) {
              label += ': ';
            }
            label += tooltipItem.yLabel.toFixed(2); // Adjust precision as needed
            return label;
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Solar Energy Generation',
          fontSize: 16,
        },
        legend: {
          display: true,
          position: 'bottom',
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Energy (kWh)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Day',
          },
        },
      },
    };
  }

  ngOnInit() {
    this.fetchLatestSolarData();
    this.fetchHistoricalSolarData();
  }

  onDragStart(event: any, index: number) {
    this.draggedItemIndex = index;
  }

  onDrop(event: any, dropIndex: number) {
    if (this.draggedItemIndex !== undefined && dropIndex !== undefined) {
      const draggedItem = this.dashboardItems[this.draggedItemIndex];
      this.dashboardItems.splice(this.draggedItemIndex, 1);
      this.dashboardItems.splice(dropIndex, 0, draggedItem);
    }
  }

  // initializeGridster(): void {
  //   this.gridsterOptions = {
  //     draggable: {
  //       enabled: true,
  //     },
  //     resizable: {
  //       enabled: true,
  //     },
  //     // You can add more options as needed
  //   };

  //   this.dashboard = [
  //     { cols: 2, rows: 1, y: 0, x: 0 }, // For real-time data chart
  //     { cols: 2, rows: 1, y: 0, x: 2 }, // For historical data chart
  //     { cols: 2, rows: 2, y: 1, x: 0 }, // For summary metrics
  //     // Add more items if needed
  //   ];
  // }

  fetchLatestSolarData() {
    this.energyDataService.getLatestSolarData().subscribe(
      (latestData) => {
        this.realTimeData = this.transformDataForChart([latestData]);
      },
      (error) => console.error('Error fetching latest solar data:', error)
    );
  }

  fetchHistoricalSolarData() {
    const dataLimit = 20; // Adjust the number as needed

    this.energyDataService.getLimitedSolarData(dataLimit).subscribe(
      (historicalData) => {
        this.historicalChartData =
          this.prepareHistoricalChartData(historicalData);
        this.summaryMetrics = this.calculateSummaryMetrics(historicalData);
        this.dashboardItems = [
          ...this.dashboardItems,
          ...this.summaryMetrics.map((metric: any) => ({
            id: this.generateUniqueId(), // Create a unique Id for each metric
            type: 'summaryMetric',
            data: metric,
          })),
        ];
      },
      (error) => console.error('Error fetching historical solar data:', error)
    );
  }

  generateUniqueId() {
    return 'metric_' + this.uniqueIdCounter++;
  }

  transformDataForChart(data: any[]): any {
    const labels = data.map((d) => new Date(d.timestamp).toLocaleTimeString());
    const energyGeneratedDataset = {
      label: 'Energy Generated (kWh)',
      data: data.map((d) => d.energyGenerated),
      fill: false,
      borderColor: '#42A5F5',
      backgroundColor: '#42A5F5',
    };
    // Add more datasets if you have other data points to show on the same chart

    return {
      labels: labels,
      datasets: [energyGeneratedDataset],
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

  prepareHistoricalChartData(data: any[]): any {
    const labels = data.map((d) => new Date(d.timestamp).toLocaleDateString());
    const energyGeneratedData = data.map((d) => d.energyGenerated);
    const energyConsumedData = data.map((d) => d.energyConsumed);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Energy Generated (kWh)',
          data: energyGeneratedData,
          fill: false,
          borderColor: '#42A5F5',
          backgroundColor: '#42A5F5',
        },
        {
          label: 'Energy Consumed (kWh)',
          data: energyConsumedData,
          fill: false,
          borderColor: '#FF6384',
          backgroundColor: '#FF6384',
        },
      ],
    };
  }
}
