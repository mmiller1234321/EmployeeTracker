const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '1102',
  host: 'localhost',
  database: 'work_db',
});

async function startApp() {
  while (true) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      },
    ]);

    switch (answer.choice) {
      case 'View all departments':
        await viewAllDepartments();
        break;
      case 'View all roles':
        await viewAllRoles();
        break;
      case 'View all employees':
        await viewAllEmployees();
        break;
      case 'Add a department':
        await addDepartment();
        break;
      case 'Add a role':
        await addRole();
        break;
      case 'Add an employee':
        await addEmployee();
        break;
      case 'Update an employee role':
        await updateEmployeeRole();
        break;
      case 'Exit':
        console.log('Exiting application...');
        await pool.end();
        return;
    }
  }
}

async function viewAllDepartments() {
  const res = await pool.query('SELECT * FROM departments');
  console.table(res.rows);
}

async function viewAllRoles() {
  const res = await pool.query('SELECT * FROM roles');
  console.table(res.rows);
}

async function viewAllEmployees() {
  const res = await pool.query('SELECT * FROM employees');
  console.table(res.rows);
}

async function addDepartment() {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    },
  ]);

  await pool.query('INSERT INTO departments (name) VALUES ($1)', [answer.name]);
  console.log('Department added successfully!');
}

async function addRole() {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for this role:',
    },
    {
      type: 'input',
      name: 'department_id',
      message: 'Enter the department ID for this role:',
    },
  ]);

  await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [answer.title, answer.salary, answer.department_id]);
  console.log('Role added successfully!');
}

async function addEmployee() {
  const rolesRes = await pool.query('SELECT title, department_id FROM roles');
  const roles = rolesRes.rows.map(role => ({ title: role.title, department_id: role.department_id }));

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter the first name of the employee:',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter the last name of the employee:',
    },
    {
      type: 'list',
      name: 'title',
      message: 'Choose the title of the employee:',
      choices: roles.map(role => role.title),
    },
    {
      type: 'input',
      name: 'manager',
      message: 'Enter the manager name for this employee:',
    },
  ]);

  const selectedRole = roles.find(role => role.title === answer.title);
  await pool.query('INSERT INTO employees (first_name, last_name, title, department_id, manager) VALUES ($1, $2, $3, $4, $5)', [answer.first_name, answer.last_name, answer.title, selectedRole.department_id, answer.manager]);
  console.log('Employee added successfully!');
}

async function updateEmployeeRole() {
  const employeesRes = await pool.query('SELECT id, first_name FROM employees');
  const employees = employeesRes.rows.map(employee => ({ name: employee.first_name, value: employee.id }));

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select the employee:',
      choices: employees,
    },
    {
      type: 'input',
      name: 'title',
      message: 'Enter the new title of the employee:',
    },
  ]);

  await pool.query('UPDATE employees SET title = $1 WHERE id = $2', [answer.title, answer.employee_id]);
  console.log('Employee role updated successfully!');
}

startApp(); // Start the application
