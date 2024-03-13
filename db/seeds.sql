INSERT INTO departments (name)
VALUES  ('Executive'),
        ('Finance'),
        ('Sales'),
        ('Marketing'),
        ('Janitorial');

INSERT INTO roles (department_id, title, salary)
VALUES  (1, 'CEO', 1000000),
        (2, 'CFO', 1000000),
        (3, 'Manager', 300000),
        (4, 'General', 40000),
        (5, 'Janitor', 35000);

INSERT INTO employees (first_name, last_name,  title, department_id, manager) 
VALUES  ('John', 'Doe', 'CEO', 1, 'John'),
        ('Jennifer', 'Smith', 'CFO', 2, 'John'),
        ('Matt', 'Johnson', 'Manager', 3, 'Jennifer'),
        ('Tim', 'Pillow', 'Manager', 3, 'Jennifer'),
        ('Tiffany', 'Pearls', 'General', 4, 'Matt'),
        ('Don', 'Mustache', 'General', 4, 'Matt'),
        ('Lisa', 'Simpson', 'General', 4, 'Tim'),
        ('Sarah', 'Stanley', 'General', 4, 'Tim'),
        ('Paul', 'Whoknows', 'Janitor', 5, 'Matt');