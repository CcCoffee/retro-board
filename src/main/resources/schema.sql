CREATE TABLE IF NOT EXISTS retro_card (
    id VARCHAR(32) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN NOT NULL,
    author VARCHAR(100) NOT NULL,
    likes VARCHAR(1000),
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS action_item (
    id VARCHAR(32) PRIMARY KEY,
    assignee VARCHAR(100) NOT NULL,
    due_date DATE NOT NULL,
    content TEXT NOT NULL
);