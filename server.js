const inquirer = require('inquirer');
const { Pool } = require('pg');

//Creates a pool for connecting to the database.
const pool = new Pool(
    {
      user: 'postgres',
      password: '1102',
      host: 'localhost',
      database: 'work_db'
    },
    console.log(`Connected to the work_db database.`)
  )

pool.connect();
  
// inquirer is a function so that we can run it again after each user action instead of having to exit and restart the program
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
        //add department section
        .then((answers) => {
            if (answers.choice === 'Add a department') {
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
                            runInquirer(); //Runs inquirer again from the beginning since were at the end of the prompt series
                        });
                    });
            // add role section
            } else if (answers.choice === 'Add a role') {
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
                            runInquirer(); //Runs inquirer again from the beginning since were at the end of the prompt series
                        });
                    });
            // add employee section
            } else if (answers.choice === 'Add an employee') {
                pool.query('SELECT title, department_id FROM roles', (err, res) => {
                    if (err) throw err;
                    //We pull the current roles from the database and use map to make a new array of objects with the title and department_id rows.
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
                                //We map the role array to create another array of just the titles to use as choices in the prompt. 
                                choices: roles.map(role => role.title)
                            },
                            {
                                type: 'input',
                                name: 'manager',
                                message: 'What is the name of the manager for this employee?'
                            }
                        ])
                        .then((answers) => {
                            //selectedrole is created to match the selected title of the employee and then we use the find method to find the role that matches the user selected title. 
                            //We do this so the user doesn't have to worry about the department_id and can just select the title from the list of roles.
                            const selectedRole = roles.find(role => role.title === answers.title);
                            pool.query('INSERT INTO employees (first_name, last_name, title, department_id, manager) VALUES ($1, $2, $3, $4, $5)', [answers.first_name, answers.last_name, answers.title, selectedRole.department_id, answers.manager], (err, res) => {
                                if (err) throw err;
                                console.log('Employee added successfully');
                                runInquirer(); //Runs inquirer again from the beginning since were at the end of the prompt series
                            });
                        });
                });
            //view department section
            } else if (answers.choice === 'View departments') {
                pool.query('SELECT * FROM departments', (err, res) => {
                    if (err) throw err;
                    console.table(res.rows);
                    runInquirer(); //Runs inquirer again from the beginning since were at the end of the prompt series
                });
            //view roles section
            } else if (answers.choice === 'View roles') {
                pool.query('SELECT roles.*, departments.name AS Department FROM roles JOIN departments ON roles.department_id = departments.id', (err, res) => {
                    if (err) throw err;
                    console.table(res.rows);
                    runInquirer(); //Runs inquirer again from the beginning since were at the end of the prompt series
                });
            //view employees section
            } else if (answers.choice === 'View employees') {
                pool.query('SELECT employees.*, departments.name  AS Department FROM employees JOIN departments ON employees.department_id = departments.id', (err, res) => {
                    if (err) throw err;
                    console.table(res.rows);
                    runInquirer(); //Runs inquirer again from the beginning since were at the end of the prompt series
                });
            //update employee role section
            } else if (answers.choice === 'Update employee role') {
                pool.query('SELECT id, first_name FROM employees', (err, res) => {
                    if (err) throw err;
                    //this const is pulling from the employees table and creating a new array of objects with the name and value of the employee id
                    const employees = res.rows.map(employee => ({ name: employee.first_name, value: employee.id }));
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'employee_id',
                                message: 'Select the employee:',
                                //this is where the const we created above come into play. This way the user can choose from a list instead of having to know the employee prior to the prompt.
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
                                runInquirer(); //Runs inquirer again from the beginning since were at the end of the prompt series
                            });
                        });
                });
            }
        });
}

runInquirer(); // Start the inquirer prompt