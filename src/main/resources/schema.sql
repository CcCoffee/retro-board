DROP TABLE IF EXISTS retro_card;
DROP TABLE IF EXISTS action_item;

CREATE TABLE retro_card (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    content TEXT,
    is_anonymous BOOLEAN,
    author VARCHAR(255),
    likes VARCHAR(255),
    created_at TIMESTAMP
);

CREATE TABLE action_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignee VARCHAR(255),
    due_date DATE,
    content TEXT
);