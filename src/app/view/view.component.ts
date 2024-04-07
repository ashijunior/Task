import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit{

  taskData: any[] = [];
  task: any; // Define task property to store task details

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const taskId: any = params['id']; // Extract task ID from URL parameter
      if (taskId !== null && taskId !== undefined) { // Check if taskId is not null or undefined
        this.api.getTaskById(taskId).subscribe((res: any) => {
          this.task = res; // Store fetched task details in the task property
          console.log('details', this.task);
        });
      } else {
        console.error('Invalid task ID');
      }
    });
  }



}
