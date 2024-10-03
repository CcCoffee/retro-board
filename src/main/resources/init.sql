-- 插入测试数据到 retro_card 表
INSERT INTO retro_card (type, content, is_anonymous, author_id, author_name, likes_json, created_at)
VALUES 
('good', '本周团队协作非常顺畅', false, 'E001', '张三', '[{"user_id":"E002","username":"李四"},{"user_id":"E003","username":"王五"}]', CURRENT_TIMESTAMP()),
('bad', '项目进度有些延迟', true, NULL, NULL, '[{"user_id":"E004","username":"赵六"}]', CURRENT_TIMESTAMP()),
('change', '建议增加每日站会', false, 'E002', '李四', '[{"user_id":"E001","username":"张三"},{"user_id":"E003","username":"王五"},{"user_id":"E004","username":"赵六"},{"user_id":"E005","username":"钱七"}]', CURRENT_TIMESTAMP());

-- 插入测试数据到 action_item 表
INSERT INTO action_item (assignee_id, assignee_name, due_date, content, created_at)
VALUES 
('E001', '张三', '2023-05-15', '优化代码审查流程', CURRENT_TIMESTAMP()),
('E002', '李四', '2023-05-20', '完成新功能的单元测试', CURRENT_TIMESTAMP()),
('E003', '王五', '2023-05-18', '更新项目文档', CURRENT_TIMESTAMP());

-- 测试数据 retro_board_history
INSERT INTO retro_board_history (cards_json, deleted_by_user_id, deleted_by_username, deleted_at) VALUES 
('[{"id":2,"type":"bad","content":"项目进度有些延迟","authorId":null,"authorName":null,"likesJson":"[{\"user_id\":\"E004\",\"username\":\"赵六\"}]","createdAt":"2024-10-03T10:54:00.92034","isAnonymous":true},{"id":4,"type":"good","content":"完成了项目里程碑","authorId":"E001","authorName":"张三","likesJson":"[]","createdAt":"2024-10-03T02:54:52.971","isAnonymous":false},{"id":5,"type":"bad","content":"迟到问题","authorId":"E005","authorName":"Anonymous","likesJson":"[]","createdAt":"2024-10-03T02:55:12.283","isAnonymous":true}]', 'E001', '张三', '2024-10-03 10:55:37.281534'),
('[{"id":1,"type":"good","content":"本周团队协作非常顺畅","authorId":"E001","authorName":"张三","likesJson":"[{\"user_id\":\"E002\",\"username\":\"李四\"},{\"user_id\":\"E003\",\"username\":\"王五\"}]","createdAt":"2024-10-03T10:45:14.709983","isAnonymous":false},{"id":2,"type":"bad","content":"项目进度有些延迟","authorId":null,"authorName":null,"likesJson":"[{\"user_id\":\"E004\",\"username\":\"赵六\"}]","createdAt":"2024-10-03T10:45:14.709983","isAnonymous":true},{"id":3,"type":"change","content":"建议增加每日站会","authorId":"E002","authorName":"李四","likesJson":"[{\"user_id\":\"E001\",\"username\":\"张三\"},{\"user_id\":\"E003\",\"username\":\"王五\"},{\"user_id\":\"E004\",\"username\":\"赵六\"},{\"user_id\":\"E005\",\"username\":\"钱七\"}]","createdAt":"2024-10-03T10:45:14.709983","isAnonymous":false}]', 'E001', '张三', '2024-10-03 10:49:39.655164');
