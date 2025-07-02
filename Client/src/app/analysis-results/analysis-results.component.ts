import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Activity } from 'lucide-angular';

@Component({
  selector: 'app-analysis-results',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './analysis-results.component.html',
  styleUrls: ['./analysis-results.component.css'],
})
export class AnalysisResultsComponent {
  @Input() results: {
    energyUsage: number;
    recommendations: string[];
    simulationData: {
      month: string;
      usage: number;
    }[];
  } = {
    energyUsage: 0,
    recommendations: [],
    simulationData: [],
  };

  readonly Activity = Activity;

  idfFile: File | null = null;
  epwFile: File | null = null;
  simulationUrl: string | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  private apiUrl =
    'https://energyplus-flask-app-950448131349.us-central1.run.app/api/run-simulation';

  constructor(private http: HttpClient) {}

  onIdfFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.idfFile = input.files[0];
    }
  }

  onEpwFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.epwFile = input.files[0];
    }
  }

  runSimulation(): void {
    if (!this.idfFile || !this.epwFile) {
      this.errorMessage = 'Please upload both IDF and EPW files';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.simulationUrl = null;

    const formData = new FormData();
    formData.append('idf_file', this.idfFile);
    formData.append('epw_file', this.epwFile);

    this.http.post(this.apiUrl, formData, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        this.simulationUrl = window.URL.createObjectURL(response);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Simulation failed: ' + error.message;
        this.isLoading = false;
      },
    });
  }

  openSimulationResults(): void {
    if (this.simulationUrl) {
      window.open(this.simulationUrl, '_blank');
    }
  }
}
