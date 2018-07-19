DROP DATABASE chat_app;
CREATE DATABASE chat_app;

\c chat_app

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  username TEXT,
  content TEXT
);