-- Recrear la DB
DROP DATABASE IF EXISTS mail_app;
CREATE DATABASE mail_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mail_app;

-- Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Folders
CREATE TABLE folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Mails
CREATE TABLE mails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT,
  receiver_email VARCHAR(100) NOT NULL,
  subject VARCHAR(150) NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Mail ↔ Folder
CREATE TABLE mail_folders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mail_id INT NOT NULL,
  folder_id INT NOT NULL,
  FOREIGN KEY (mail_id) REFERENCES mails(id) ON DELETE CASCADE,
  FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- Attachments
CREATE TABLE attachments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mail_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mail_id) REFERENCES mails(id) ON DELETE CASCADE
);

-- Insertar usuarios de prueba
-- password = 123456 (bcrypt)
INSERT INTO users (email, password) VALUES
(
  'user1@test.com',
  '$2b$10$QZ0Y3z8EwJ6LzqvWZp2n9uGJmZQF0sKXcJm7F4n0wP7ZkYvZxQH8m'
),
(
  'user2@test.com',
  '$2b$10$QZ0Y3z8EwJ6LzqvWZp2n9uGJmZQF0sKXcJm7F4n0wP7ZkYvZxQH8m'
);

-- Carpetas Base
INSERT INTO folders (user_id, name) VALUES
(1, 'Inbox'),
(1, 'Trabajo'),
(1, 'Personal'),
(2, 'Inbox'),
(2, 'Trabajo');

-- Correos de Prueba
INSERT INTO mails (sender_id, receiver_email, subject, body, is_read) VALUES
(
  2,
  'user1@test.com',
  'Bienvenido a Mail App 👋',
  'Este es tu primer correo de prueba. Aquí podrás ver, responder y organizar tus mensajes.',
  FALSE
),
(
  2,
  'user1@test.com',
  'Reunión de proyecto',
  'Recuerda que mañana tenemos reunión a las 10:00 AM.',
  TRUE
),
(
  1,
  'user2@test.com',
  'Hola!',
  'Solo paso a saludar 👋',
  FALSE
);

-- Asignar correos a carpetas
INSERT INTO mail_folders (mail_id, folder_id) VALUES
(1, 1), -- Inbox user1
(2, 2), -- Trabajo user1
(3, 4); -- Inbox user2