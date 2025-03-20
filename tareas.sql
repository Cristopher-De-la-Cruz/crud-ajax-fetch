CREATE DATABASE tareas;

USE tareas;

CREATE TABLE tareas (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name text NOT NULL,
  description text NOT NULL
);

INSERT INTO tareas (name, description) VALUES
('Flexiones', '100 por día'),
('Sentadillas', '100 por día'),
('Abdominales', '100 por día'),
('Correr', '10 km por día'),
('Leer', 'Crimen y castigo'),
('Jugar', 'Minecraft');

