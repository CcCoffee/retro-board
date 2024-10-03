-- 插入测试数据到 retro_card 表
INSERT INTO retro_card (type, content, is_anonymous, author, likes, created_at)
VALUES 
('good', '本周团队协作非常顺畅', false, 'E001', 'E002,E003', CURRENT_TIMESTAMP()),
('bad', '项目进度有些延迟', true, NULL, 'E004', CURRENT_TIMESTAMP()),
('change', '建议增加每日站会', false, 'E002', 'E001,E003,E004,E005', CURRENT_TIMESTAMP());

-- 插入测试数据到 action_item 表
INSERT INTO action_item (assignee, due_date, content)
VALUES 
('E001', '2023-05-15', '优化代码审查流程'),
('E002', '2023-05-20', '完成新功能的单元测试'),
('E003', '2023-05-18', '更新项目文档');

-- Test data for retro_board_history
INSERT INTO retro_board_history (cards_json, deleted_by, deleted_at) VALUES 
('[{"id":2,"type":"bad","content":"项目进度有些延迟","author":null,"likes":"E004","createdAt":"2024-10-03T10:54:00.92034","anonymous":true},{"id":4,"type":"good","content":"完成了项目里程碑","author":"E001","likes":"","createdAt":"2024-10-03T02:54:52.971","anonymous":false},{"id":5,"type":"bad","content":"迟到问题","author":"Anonymous","likes":"","createdAt":"2024-10-03T02:55:12.283","anonymous":false}]', 'E001', '2024-10-03 10:55:37.281534'),
('[{"id":1,"type":"good","content":"本周团队协作非常顺畅","author":"E001","likes":"E002,E003","createdAt":"2024-10-03T10:45:14.709983","anonymous":false},{"id":2,"type":"bad","content":"项目进度有些延迟","author":null,"likes":"E004","createdAt":"2024-10-03T10:45:14.709983","anonymous":true},{"id":3,"type":"change","content":"建议增加每日站会","author":"E002","likes":"E001,E003,E004,E005","createdAt":"2024-10-03T10:45:14.709983","anonymous":false}]', 'E001', '2024-10-03 10:49:39.655164');
