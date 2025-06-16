import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
    new Chart("viewsChart", {
      type: 'bar',
      data: {
        labels: ['Article 1', 'Article 2', 'Article 3'],
        datasets: [{
          label: 'Vues',
          data: [120, 150, 90],
          backgroundColor: 'rgba(63,81,181,0.6)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
