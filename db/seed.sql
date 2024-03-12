INSERT INTO departments (name)
VALUES  ('Executive'),
        ('Finance'),
        ('Sales'),
        ('Marketing'),
        ('Janitorial');

INSERT INTO roles (title, salary, department_id)
VALUES  ('CEO', 1000000, 1),
        ('CFO', 1000000, 2),
        ('Manager', 300000, 3),
        ('General', 40000, 4),
        ('Janitor', 35000, 5);

INSERT INTO employees (first_name, last_name, title_id, department_id, manager) 
VALUES  ('John', 'Doe', 1, 1, 'John'),
        ('Jennifer', 'Smith', 2, 2, 'John'),
        ('Matt', 'Johnson', 3, 3, 'Jennifer'),
        ('Tim', 'Pillow', 3, 3, 'Jennifer'),
        ('Paul', 'Whoknows', 5, 5, 'Matt');
