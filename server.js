const inquirer = require('inquirer');
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'your_database',
  password: '1102',
  port: 5432,
});

client.connect();

function startApp() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
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
  ]).then(answer => {
    switch (answer.action) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        console.log('Exiting application...');
        client.end();
        break;
    }
  });
}

function viewAllDepartments() {
  client.query('SELECT * FROM departments', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    startApp();
  });
}

function viewAllRoles() {
  client.query('SELECT * FROM roles', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    startApp();
  });
}

function viewAllEmployees() {
  client.query('SELECT * FROM employees', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    startApp();
  });
}

function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    },
  ]).then(answer => {
    client.query('INSERT INTO departments (name) VALUES ($1)', [answer.name], (err, res) => {
      if (err) throw err;
      console.log('Department added successfully!');
      startApp();
    });
  });
}

// Implement similar functions for addRole, addEmployee, and updateEmployeeRole

startApp(); // Start the application
