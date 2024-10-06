-- 插入测试数据到 retro_card 表
INSERT INTO retro_card (content, type, is_anonymous, author_json, likes_json, created_at)
VALUES
('我们成功地完成了项目', 'good', FALSE, '{"id": "E001", "name": "张三", "email": "zhangsan@example.com"}', '[{"id": "E002", "name": "李四", "email": "lisi@example.com"}, {"id": "E003", "name": "王五", "email": "wangwu@example.com"}]', '2023-03-01 10:00:00'),
('沟通还需要改进', 'bad', FALSE, '{"id": "E002", "name": "李四", "email": "lisi@example.com"}', '[{"id": "E001", "name": "张三", "email": "zhangsan@example.com"}]', '2023-03-01 11:00:00'),
('我们应该更频繁地进行代码审查', 'change', FALSE, '{"id": "E003", "name": "王五", "email": "wangwu@example.com"}', '[]', '2023-03-01 12:00:00');

-- 插入测试数据到 action_item 表
INSERT INTO action_item (assignee_json, due_date, content, created_at)
VALUES 
('{"id":"E001","name":"张三","email":"zhangsan@example.com"}', '2023-05-15', '优化代码审查流程', CURRENT_TIMESTAMP),
('{"id":"E002","name":"李四","email":"lisi@example.com"}', '2023-05-20', '完成新功能的单元测试', CURRENT_TIMESTAMP),
('{"id":"E003","name":"王五","email":"wangwu@example.com"}', '2023-05-18', '更新项目文档', CURRENT_TIMESTAMP);

-- 测试数据 retro_board_history
INSERT INTO retro_board_history (cards_json, deleted_by, deleted_at) VALUES 
('[{"id":2,"type":"bad","content":"项目进度有些延迟","authorJson":null,"likesJson":"[{\"id\":\"E004\",\"name\":\"赵六\",\"email\":\"zhaoliu@example.com\"}]","createdAt":"2024-10-03T10:54:00.92034","isAnonymous":true},{"id":4,"type":"good","content":"完成了项目里程碑","authorJson":"{\"id\":\"E001\",\"name\":\"张三\",\"email\":\"zhangsan@example.com\"}","likesJson":"[]","createdAt":"2024-10-03T02:54:52.971","isAnonymous":false},{"id":5,"type":"bad","content":"迟到问题","authorJson":"{\"id\":\"E005\",\"name\":\"Anonymous\",\"email\":\"anonymous@example.com\"}","likesJson":"[]","createdAt":"2024-10-03T02:55:12.283","isAnonymous":true}]', '{"id":"E001","name":"张三","email":"zhangsan@example.com"}', '2024-10-03 10:55:37.281534'),
('[{"id":1,"type":"good","content":"本周团队协作非常顺畅","authorJson":"{\"id\":\"E001\",\"name\":\"张三\",\"email\":\"zhangsan@example.com\"}","likesJson":"[{\"id\":\"E002\",\"name\":\"李四\",\"email\":\"lisi@example.com\"},{\"id\":\"E003\",\"name\":\"王五\",\"email\":\"wangwu@example.com\"}]","createdAt":"2024-10-03T10:45:14.709983","isAnonymous":false},{"id":2,"type":"bad","content":"项目进度有些延迟","authorJson":null,"likesJson":"[{\"id\":\"E004\",\"name\":\"赵六\",\"email\":\"zhaoliu@example.com\"}]","createdAt":"2024-10-03T10:45:14.709983","isAnonymous":true},{"id":3,"type":"change","content":"建议增加每日站会","authorJson":"{\"id\":\"E002\",\"name\":\"李四\",\"email\":\"lisi@example.com\"}","likesJson":"[{\"id\":\"E001\",\"name\":\"张三\",\"email\":\"zhangsan@example.com\"},{\"id\":\"E003\",\"name\":\"王五\",\"email\":\"wangwu@example.com\"},{\"id\":\"E004\",\"name\":\"赵六\",\"email\":\"zhaoliu@example.com\"},{\"id\":\"E005\",\"name\":\"钱七\",\"email\":\"qianqi@example.com\"}]","createdAt":"2024-10-03T10:45:14.709983","isAnonymous":false}]', '{"id":"E001","name":"张三","email":"zhangsan@example.com"}', '2024-10-03 10:49:39.655164');