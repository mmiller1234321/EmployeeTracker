DROP DATABASE IF EXISTS work_db;
CREATE DATABASE work_db;

\c work_db;

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    title_id INTEGER NOT NULL,
    department_id INTEGER NOT NULL,
    manager VARCHAR(20) NOT NULL,
    FOREIGN KEY (title_id) REFERENCES roles(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
