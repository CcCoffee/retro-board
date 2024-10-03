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
INSERT INTO retro_board_history (cards_json, deleted_by) VALUES 
('[{"id":1,"type":"GOOD","content":"Great teamwork","isAnonymous":false,"author":"John","likes":"2","createdAt":"2023-04-01 10:00:00"},{"id":2,"type":"BAD","content":"Communication issues","isAnonymous":true,"author":"Anonymous","likes":"1","createdAt":"2023-04-01 11:00:00"}]', 'admin'),
('[{"id":3,"type":"ACTION","content":"Improve documentation","isAnonymous":false,"author":"Alice","likes":"3","createdAt":"2023-04-02 09:00:00"}]', 'manager');