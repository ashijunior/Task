import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { EmployeeModel } from './employee-dash board.model';
import { ApiService } from '../shared/api.service';
import Swal from 'sweetalert2';

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
  itemsPerPage :number=5
  p =1;
  filteredRows: any;
  searchText: string = '';

  constructor(private formBuilder: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    // Using this.formBuilder.group() to create a FormGroup instance.
    this.formValue = this.formBuilder.group({
      taskTitle: ['', Validators.required],
      description: ['', Validators.required],
      assignedTo: ['', Validators.required],
      priority: ['', Validators.required],
      date: ['', [Validators.required, this.validateDate]],
      duedate: ['', [Validators.required, this.validateDueDate.bind(this, 'date')]],
      status: ['', Validators.required]
    });

    this.getAllTasks();

  }


  // Custom validator function to check if the due date is not less than the reference date
  validateDueDate(date: string): any {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const referenceDateControl = this.formValue.get(date);
      if (referenceDateControl && referenceDateControl.value) {
        const referenceDate = new Date(referenceDateControl.value);
        const dueDate = new Date(control.value);
        if (dueDate <= referenceDate) {
          return { invalidDueDate: true };
        }
      }
      return null;
    };
  }

  // Custom validator function to check if the selected date is in the past
  validateDate(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date(); // Get the current date
    currentDate.setHours(0, 0, 0, 0); // Set the time to midnight to include today's date

    if (selectedDate < currentDate) {
      return { pastDate: true };
    }
    return null;
  }


  // Compare Date and Due Date
  compareDate(event: any, element: string): void {
    const startDate = this.formValue.get('date')?.value;
    const endDate = this.formValue.get('duedate')?.value;

    if (startDate && endDate) {
      const date1 = new Date(startDate);
      const date2 = new Date(endDate);
      if (date2 <= date1) {
        this.formValue.get('duedate')?.setErrors({ invalidDueDate: true });
        Swal.fire({
          icon: 'error',
          text: 'Due Date must be greater than Start Date'
        });
      } else {
        this.formValue.get('duedate')?.setErrors(null);
      }
    }
  }


  clickAddedTask() {
    //this reset the form after adding task
    this.formValue.reset();
        // this.showAdd = true; and this.showUpdate = false;
    //  are used to control the visibility of UI elements in your component
    this.showAdd = true; //this shows the 'add button'
    this.showUpdate = false; //to hide the 'update button'
  }

  //to add task to the table
  postTaskDetails() {
    const newTask = {
      taskTitle: this.formValue.value.taskTitle,
      priority: this.formValue.value.priority,
      date: this.formValue.value.date,
      duedate: this.formValue.value.duedate,
      description: this.formValue.value.description,
      status: this.formValue.value.status,
      assignedTo: this.formValue.value.assignedTo
    };

    this.api.postTask(newTask).subscribe(
      (res) => {
        console.log(res);
        Swal.fire('Success', 'Task Added Successfully', 'success').then(() => {
          let ref = document.getElementById('cancel');
          ref?.click();
          this.formValue.reset();
          this.getAllTasks();
        });
      },
      (err) => {
        console.error(err);
        Swal.fire('Error', 'Something went wrong', 'error');
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
      Swal.fire({
        title: 'Success',
        text: 'Task has been deleted',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        this.getAllTasks();
      });
    });

  }

  //to edit a task
  onEdit(row: any) {
    // this.showAdd = false; and this.showUpdate = true;
    //  are used to control the visibility of UI elements in your component
    this.showAdd = false; //to hide the 'add button'
    this.showUpdate = true; //this shows the update button

    //updates the form values with the details of the task being edited.
    this.employeeModelObj.id = row.id;
    this.formValue.patchValue({
      taskTitle: row.taskTitle,
      description: row.description,
      assignedTo: row.assignedTo,
      priority: row.priority,
      date: row.date,
      duedate:row.duedate,
      status: row.status
    });
  }

  //update button to update the edited task
  updateTaskDetails() {
    // Create an updatedTask object that contains the updated values for the task.
    const updatedTask = {
      id: this.employeeModelObj.id,
      taskTitle: this.formValue.value.taskTitle,
      priority: this.formValue.value.priority,
      date: this.formValue.value.date,
      duedate: this.formValue.value.duedate,
      description: this.formValue.value.description,
      status: this.formValue.value.status,
      assignedTo: this.formValue.value.assignedTo
    };
//  we call the updateTask() method from the API service to update task on the server
    this.api.updateTask(updatedTask, updatedTask.id).subscribe(
      () => {
        Swal.fire({
          title: 'Success',
          text: 'Updated Successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          let ref = document.getElementById('cancel');
          ref?.click();
          this.formValue.reset();
          this.getAllTasks();
        });
      },
      (err) => {
        console.error(err);
        Swal.fire('Error', 'Update Failed. Check console for details.', 'error');
      }
    );

  }

    // Function to filter teams based on search text
applyFilter(): void {
  if (this.searchText.trim().length === 0) {
    this.filteredRows = this.taskData;
  } else {
    // Selected table data to implement search
    this.filteredRows = this.taskData.filter((task: any) =>
      task.priority.toLowerCase().includes(this.searchText.toLowerCase()) ||
      task.taskTitle.toLowerCase().includes(this.searchText.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}



}
