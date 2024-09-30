-- 插入测试数据到 retro_card 表
INSERT INTO retro_card (type, content, is_anonymous, author, likes, created_at)
VALUES 
('good', '本周团队协作非常顺畅', false, '张三', '李四,王五', CURRENT_TIMESTAMP()),
('bad', '项目进度有些延迟', true, NULL, '赵六', CURRENT_TIMESTAMP()),
('change', '建议增加每日站会', false, '李四', '张三,王五,赵六', CURRENT_TIMESTAMP());

-- 插入测试数据到 action_item 表
INSERT INTO action_item (assignee, due_date, content)
VALUES 
('张三', '2023-05-15', '优化代码审查流程'),
('李四', '2023-05-20', '完成新功能的单元测试'),
('王五', '2023-05-18', '更新项目文档');