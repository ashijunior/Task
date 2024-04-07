import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeModel } from './employee-dash board.model';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'] // Corrected styleUrls
})
export class EmployeeDashboardComponent implements OnInit {
  formValue!: FormGroup;
  employeeModelObj: EmployeeModel = new EmployeeModel();
  taskData: any[] = [];
  showAdd: boolean = false;
  showUpdate: boolean = false;
  itemsPerPage :number=10
  p =1;
  filteredRows: any;
  searchText: string = '';

  constructor(private formBuilder: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      taskTitle: ['', Validators.required],
      description: ['', Validators.required],
      assignedTo: ['', Validators.required],
      priority: ['', Validators.required],
      date: ['', Validators.required],
      status: ['', Validators.required]
    });

    this.getAllTasks();

  }

  clickAddedTask() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  //to add task to the table
  postTaskDetails() {
    const newTask = {
      taskTitle: this.formValue.value.taskTitle,
      priority: this.formValue.value.priority,
      date: this.formValue.value.date,
      description: this.formValue.value.description,
      status: this.formValue.value.status,
      assignedTo: this.formValue.value.assignedTo
    };

    this.api.postTask(newTask).subscribe(
      (res) => {
        console.log(res);
        alert('Task Added Successfully');
        let ref = document.getElementById('cancel')
        ref?.click();
        this.formValue.reset();
        this.getAllTasks();
      },
      (err) => {
        console.error(err);
        alert('Something went wrong');
      }
    );
  }
//for pagination
  pageChanged(event: any): void {
    this.p = event;
  }

  //to get all task in table
  getAllTasks() {
    this.api.getTask().subscribe((res) => {
      this.taskData = res;
      this.filteredRows = res;
      console.log(this.filteredRows);
    });
  }

  //to delete task
  deleteTasks(row: any) {
    this.api.deleteTask(row.id).subscribe(() => {
      alert('Task has been deleted');
      this.getAllTasks();
    });
  }

  //to edit a task
  onEdit(row: any) {
    this.showAdd = false;
    this.showUpdate = true;

    this.employeeModelObj.id = row.id;
    this.formValue.patchValue({
      taskTitle: row.taskTitle,
      description: row.description,
      assignedTo: row.assignedTo,
      priority: row.priority,
      date: row.date,
      status: row.status
    });
  }

  //update button to update the edited task
  updateTaskDetails() {
    const updatedTask = {
      id: this.employeeModelObj.id,
      taskTitle: this.formValue.value.taskTitle,
      priority: this.formValue.value.priority,
      date: this.formValue.value.date,
      description: this.formValue.value.description,
      status: this.formValue.value.status,
      assignedTo: this.formValue.value.assignedTo
    };

    this.api.updateTask(updatedTask, updatedTask.id).subscribe(
      () => {
        alert('Updated Successfully');
        let ref = document.getElementById('cancel')
        ref?.click();
        this.formValue.reset();
        this.getAllTasks();
      },
      (err) => {
        console.error(err);
        alert('Update Failed. Check console for details.');
      }
    );
  }

    // Function to filter teams based on search text
applyFilter(): void {
  if (this.searchText.trim().length === 0) {
    this.filteredRows = this.taskData;
  } else {
    this.filteredRows = this.taskData.filter((task: any) =>
      task.priority.toLowerCase().includes(this.searchText.toLowerCase()) ||
      task.taskTitle.toLowerCase().includes(this.searchText.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}



}
