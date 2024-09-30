-- Inserir Usuários
INSERT INTO "User" (email, password, name) VALUES
('alice@example.com', 'password123', 'Alice Johnson'),
('bob@example.com', 'password123', 'Bob Smith'),
('carol@example.com', 'password123', 'Carol White');

-- Inserir Projetos
INSERT INTO "Project" (name, description, ownerId) VALUES
('Project Alpha', 'Description for Project Alpha', 1),
('Project Beta', 'Description for Project Beta', 2);

-- Inserir Tarefas
INSERT INTO "Task" (title, description, status, priority, projectId) VALUES
('Task 1', 'Description for Task 1', 'PENDING', 'MEDIUM', 1),
('Task 2', 'Description for Task 2', 'IN_PROGRESS', 'HIGH', 1),
('Task 3', 'Description for Task 3', 'COMPLETED', 'LOW', 2);

-- Inserir Comentários
INSERT INTO "Comment" (content, taskId, userId) VALUES
('This is a comment on Task 1', 1, 2),
('This is a comment on Task 2', 2, 3);

-- Inserir UserProject (Relacionamento de Usuários com Projetos)
INSERT INTO "UserProject" (userId, projectId) VALUES
(1, 1),
(2, 1),
(2, 2),
(3, 2);

-- Inserir TaskAssignee (Relacionamento de Tarefas com Usuários)
INSERT INTO "TaskAssignee" (taskId, userId) VALUES
(1, 1),
(2, 2),
(3, 3);
