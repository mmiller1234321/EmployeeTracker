const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: '1102',
  host: 'localhost',
  database: 'work_db'
});

pool.connect();

function runInquirer() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['Add a department', 'Add a role', 'Add an employee', 'View departments', 'View roles', 'View employees', 'Update employee role']
      }
    ])
    .then(handleUserChoice);
}

function handleUserChoice(answers) {
  switch (answers.choice) {
    case 'Add a department':
      addDepartment();
      break;
    case 'Add a role':
      addRole();
      break;
    case 'Add an employee':
      addEmployee();
      break;
    case 'View departments':
      viewDepartments();
      break;
    case 'View roles':
      viewRoles();
      break;
    case 'View employees':
      viewEmployees();
      break;
    case 'Update employee role':
      updateEmployeeRole();
      break;
    default:
      console.log('Invalid choice');
      runInquirer();
  }
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?'
      }
    ])
    .then((answers) => {
      pool.query('INSERT INTO departments (name) VALUES ($1)', [answers.department], (err, res) => {
        if (err) throw err;
        console.log('Department added successfully');
        runInquirer();
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the role?'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?'
      },
      {
        type: 'input',
        name: 'department_id',
        message: 'What is the department ID of the role?'
      }
    ])
    .then((answers) => {
      pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id], (err, res) => {
        if (err) throw err;
        console.log('Role added successfully');
        runInquirer();
      });
    });
}

function addEmployee() {
  pool.query('SELECT title, department_id FROM roles', (err, res) => {
    if (err) throw err;
    const roles = res.rows.map(role => ({ title: role.title, department_id: role.department_id }));
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'first_name',
          message: 'What is the first name of the employee?'
        },
        {
          type: 'input',
          name: 'last_name',
          message: 'What is the last name of the employee?'
        },
        {
          type: 'list',
          name: 'title',
          message: 'What is the title of the employee?',
          choices: roles.map(role => role.title)
        },
        {
          type: 'input',
          name: 'manager',
          message: 'What is the name of the manager for this employee?'
        }
      ])
      .then((answers) => {
        const selectedRole = roles.find(role => role.title === answers.title);
        pool.query('INSERT INTO employees (first_name, last_name, title, department_id, manager) VALUES ($1, $2, $3, $4, $5)', [answers.first_name, answers.last_name, answers.title, selectedRole.department_id, answers.manager], (err, res) => {
          if (err) throw err;
          console.log('Employee added successfully');
          runInquirer();
        });
      });
  });
}

function viewDepartments() {
  pool.query('SELECT * FROM departments', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    runInquirer();
  });
}

function viewRoles() {
  pool.query('SELECT roles.*, departments.name AS Department FROM roles JOIN departments ON roles.department_id = departments.id', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    runInquirer();
  });
}

function viewEmployees() {
  pool.query('SELECT employees.*, departments.name AS Department FROM employees JOIN departments ON employees.department_id = departments.id', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    runInquirer();
  });
}

function updateEmployeeRole() {
  pool.query('SELECT id, first_name FROM employees', (err, res) => {
    if (err) throw err;
    const employees = res.rows.map(employee => ({ name: employee.first_name, value: employee.id }));
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Select the employee:',
          choices: employees
        },
        {
          type: 'input',
          name: 'title',
          message: 'What is the new title of the employee?'
        }
      ])
      .then((answers) => {
        pool.query('UPDATE employees SET title = $1 WHERE id = $2', [answers.title, answers.employee_id], (err, res) => {
          if (err) throw err;
          console.log('Employee role updated successfully');
          runInquirer();
        });
      });
  });
}

runInquirer();
