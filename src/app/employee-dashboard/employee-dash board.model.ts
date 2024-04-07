export class EmployeeModel {
  static lastId: number = 0; // Static variable to track last assigned ID

  id: number ;
  taskTitle: string = '';
  description: string = '';
  assignedTo: string = '';
  priority: string = '';
  date: any = '';
  status: string = '';

  constructor() {
    this.id = ++EmployeeModel.lastId; // Increment and assign ID on object creation
  }
}
