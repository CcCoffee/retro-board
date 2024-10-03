DROP TABLE IF EXISTS retro_board_history;
DROP TABLE IF EXISTS retro_card;
DROP TABLE IF EXISTS action_item;

CREATE TABLE retro_card (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255),
    content TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    author_json TEXT,
    likes_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE action_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignee_json TEXT,
    due_date DATE,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE retro_board_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cards_json TEXT,
    deleted_by TEXT,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);