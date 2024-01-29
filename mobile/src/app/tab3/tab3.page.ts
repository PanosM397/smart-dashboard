import { Component, OnInit } from '@angular/core';
import { EnergyDataService } from 'src/shared/energy-data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  solarData: any;
  options: any;
  realTimeData: any;
  summaryMetrics: any;
  historicalChartData: any;
  historicalOptions: any;

  dashboardItems: any[] = [
    { id: 'realTimeData', type: 'realTimeData' },
    { id: 'historicalData', type: 'historicalData' },
    { id: 'summaryMetrics', type: 'summaryMetrics' }
  ];

  constructor(private energyDataService: EnergyDataService) {

    this.options = {
      tooltip: {
        trigger: 'axis',
        formatter: function(params: { seriesName: string; value: number; }[]) {
          let label = params[0].seriesName + ': ' + params[0].value.toFixed(2);
          return label;
        }
      },
      title: {
        text: 'Solar Energy Generation',
        textStyle: {
          fontSize: 16
        }
      },
      legend: {
        data: ['Solar Energy'], // Replace with your dataset names
        bottom: 0
      },
      xAxis: {
        type: 'category',
        data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'], // Sample times of day
        axisLabel: {
          formatter: function(value: any) {
            return value; // Format as needed
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} kWh'
        }
      },
      series: [{
        name: 'Solar Energy',
        type: 'line',
        data: [120, 200, 150, 80, 70, 110, 130, 100], // Sample data
        smooth: true // For a smoother line chart
      }]
    };

    this.historicalOptions = {
      tooltip: {
        trigger: 'item',
        formatter: function(params: { seriesName: string; value: number; }) {
          let label = params.seriesName + ': ' + params.value.toFixed(2);
          return label;
        }
      },
      title: {
        text: 'Solar Energy Generation',
        textStyle: {
          fontSize: 16
        }
      },
      legend: {
        data: ['Solar Energy'], // Replace with your dataset names
        bottom: 0
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Sample days
        axisLabel: {
          formatter: function(value: any) {
            return value; // Format as needed
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} kWh'
        }
      },
      series: [{
        name: 'Solar Energy',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110, 130, 100], // Sample data
        barWidth: '60%' // Adjust as needed
      }]
    };


  }

  ngOnInit() {

    this.fetchLatestSolarData();
    this.fetchHistoricalSolarData();
  }

  fetchLatestSolarData() {
    this.energyDataService.getLatestSolarData().subscribe(
      latestData => {
        this.realTimeData = this.transformDataForChart([latestData]);
      },
      error => console.error('Error fetching latest solar data:', error)
    );
  }

  fetchHistoricalSolarData() {
    const dataLimit = 20; // Adjust the number as needed

    this.energyDataService.getLimitedSolarData(dataLimit)
      .subscribe(
        historicalData => {
          this.historicalChartData = this.prepareHistoricalChartData(historicalData);
          this.summaryMetrics = this.calculateSummaryMetrics(historicalData);
        },
        error => console.error('Error fetching historical solar data:', error)
      );
  }

  transformDataForChart(data: any[]): any {
    const labels = data.map(d => new Date(d.timestamp).toLocaleTimeString());
    const energyGeneratedDataset = {
      label: 'Energy Generated (kWh)',
      data: data.map(d => d.energyGenerated),
      fill: false,
      borderColor: '#42A5F5',
      backgroundColor: '#42A5F5'
    };
    // Add more datasets if you have other data points to show on the same chart

    return {
      labels: labels,
      datasets: [energyGeneratedDataset]
    }
  }

  calculateSummaryMetrics(data: any[]): any {
    const totalEnergyGenerated = data.reduce((total, current) => total + current.energyGenerated, 0);
    const averageEfficiency = data.reduce((total, current) => total + current.efficiency, 0) / data.length;
    const totalEnergyConsumed = data.reduce((total, current) => total + current.energyConsumed, 0);

    return [
      { title: 'Total Energy Generated', value: totalEnergyGenerated.toFixed(2) + ' kWh', description: 'Total solar energy generated' },
      { title: 'Average Efficiency', value: averageEfficiency.toFixed(2) + '%', description: 'Average efficiency of solar panels' },
      { title: 'Total Energy Consumed', value: totalEnergyConsumed.toFixed(2) + ' kWh', description: 'Total energy consumed by the system' }
    ];
  }

  prepareHistoricalChartData(data: any[]): any {
    const labels = data.map(d => new Date(d.timestamp).toLocaleDateString());
    const energyGeneratedData = data.map(d => d.energyGenerated);
    const energyConsumedData = data.map(d => d.energyConsumed);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Energy Generated (kWh)',
          data: energyGeneratedData,
          fill: false,
          borderColor: '#42A5F5',
          backgroundColor: '#42A5F5'
        },
        {
          label: 'Energy Consumed (kWh)',
          data: energyConsumedData,
          fill: false,
          borderColor: '#FF6384',
          backgroundColor: '#FF6384'
        }
      ]
    };
  }

}
