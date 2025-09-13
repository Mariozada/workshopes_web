-- Synthetic Workshops Seed Data
-- Run this after creating the schema (schema.sql)
-- Usage: mysql -u root -p workshop_booking < database/seed_workshops.sql

USE workshop_booking;

INSERT INTO workshops (
  title,
  description,
  instructor,
  date,
  start_time,
  end_time,
  location,
  price,
  max_capacity,
  category,
  status,
  image_url,
  created_by
) VALUES
-- Technology
('React Fundamentals', 'Build modern UIs with React 18, hooks, and component patterns.', 'Ava Thompson', '2025-10-03', '09:00:00', '16:00:00', 'Tech Lab', 249.00, 20, 'Technology', 'active', 'https://picsum.photos/seed/react/800/400', 1),
('Node.js APIs with Express', 'Create secure REST APIs with Express, JWT, and MySQL.', 'Liam Patel', '2025-10-10', '10:00:00', '17:00:00', 'Conference Room A', 259.00, 18, 'Technology', 'active', 'https://picsum.photos/seed/node/800/400', 1),
('TypeScript for JavaScript Devs', 'Strong typing, generics, and tooling for large codebases.', 'Sophia Nguyen', '2025-10-17', '09:30:00', '16:30:00', 'Tech Lab', 279.00, 22, 'Technology', 'active', 'https://picsum.photos/seed/ts/800/400', 1),
('Full-Stack with Vite + React', 'Scaffold fast SPAs with Vite, React Router, and Tailwind.', 'Ethan Garcia', '2025-10-24', '09:00:00', '15:30:00', 'Workshop Hall', 239.00, 24, 'Technology', 'active', 'https://picsum.photos/seed/vite/800/400', 1),
('Database Design with MySQL', 'Model entities, relationships, indexes, and migrations.', 'Mia Rossi', '2025-11-07', '09:00:00', '16:00:00', 'Training Center', 229.00, 20, 'Technology', 'active', 'https://picsum.photos/seed/mysql/800/400', 1),
('Advanced React Patterns', 'Context, reducers, compound components, and performance.', 'Noah Kim', '2025-11-14', '10:00:00', '17:00:00', 'Conference Room B', 299.00, 16, 'Technology', 'active', 'https://picsum.photos/seed/react-adv/800/400', 1),

-- Design
('UI/UX Design Basics', 'User-centered design, wireframes, and usability testing.', 'Zoe Clark', '2025-10-06', '09:00:00', '15:00:00', 'Design Studio', 199.00, 25, 'Design', 'active', 'https://picsum.photos/seed/uiux/800/400', 1),
('Tailwind CSS in Practice', 'Utility-first workflows, responsive and accessible UI.', 'Lucas Almeida', '2025-10-20', '09:30:00', '16:30:00', 'Conference Room C', 189.00, 28, 'Design', 'active', 'https://picsum.photos/seed/tailwind/800/400', 1),
('Design Systems 101', 'Tokens, components, documentation, and governance.', 'Emma Wilson', '2025-11-03', '10:00:00', '16:00:00', 'Design Studio', 219.00, 20, 'Design', 'active', 'https://picsum.photos/seed/designsys/800/400', 1),

-- Business
('Startup Fundamentals', 'Ideation, validation, MVPs, and lean execution.', 'Daniel Perez', '2025-10-08', '09:00:00', '15:30:00', 'Workshop Hall', 209.00, 30, 'Business', 'active', 'https://picsum.photos/seed/startup/800/400', 1),
('Product Management Essentials', 'Roadmaps, prioritization, and stakeholder management.', 'Olivia Martin', '2025-10-29', '10:00:00', '17:00:00', 'Executive Room', 289.00, 18, 'Business', 'active', 'https://picsum.photos/seed/pm/800/400', 1),
('Effective Remote Teams', 'Async collaboration, rituals, and performance.', 'Henry Chen', '2025-11-19', '09:00:00', '15:30:00', 'Training Center', 179.00, 26, 'Business', 'active', 'https://picsum.photos/seed/remote/800/400', 1),

-- Marketing
('Digital Marketing Strategy', 'Channels, attribution, and campaign planning.', 'Sarah Johnson', '2025-10-22', '10:00:00', '16:00:00', 'Training Center', 199.99, 15, 'Marketing', 'active', 'https://picsum.photos/seed/marketing/800/400', 1),
('SEO Deep Dive', 'Keyword research, on-page optimization, and analytics.', 'Jackson Lee', '2025-11-01', '09:00:00', '15:00:00', 'Conference Room A', 169.00, 24, 'Marketing', 'active', 'https://picsum.photos/seed/seo/800/400', 1),
('Content Marketing Workshop', 'Editorial calendars, storytelling, and distribution.', 'Grace Turner', '2025-11-22', '10:00:00', '16:30:00', 'Workshop Hall', 189.00, 22, 'Marketing', 'active', 'https://picsum.photos/seed/content/800/400', 1),

-- Personal Development
('Public Speaking Mastery', 'Structure, delivery, and audience engagement.', 'Michael Scott', '2025-10-13', '09:00:00', '15:00:00', 'Auditorium', 149.00, 40, 'Personal Development', 'active', 'https://picsum.photos/seed/speaking/800/400', 1),
('Time Management for Pros', 'Systems, prioritization, and focus for knowledge work.', 'Isabella Diaz', '2025-10-27', '09:30:00', '14:30:00', 'Executive Room', 129.00, 35, 'Personal Development', 'active', 'https://picsum.photos/seed/time/800/400', 1),
('Negotiation Skills', 'Frameworks, tactics, and practical role-playing.', 'William Green', '2025-11-10', '10:00:00', '16:00:00', 'Conference Room B', 179.00, 28, 'Personal Development', 'active', 'https://picsum.photos/seed/negotiation/800/400', 1),

-- Health & Wellness
('Mindfulness at Work', 'Stress reduction, mindfulness, and resilience.', 'Harper Young', '2025-10-16', '09:00:00', '12:30:00', 'Wellness Room', 89.00, 30, 'Health & Wellness', 'active', 'https://picsum.photos/seed/mind/800/400', 1),
('Ergonomics for Developers', 'Posture, workspace setup, and mobility routines.', 'Benjamin Ward', '2025-11-06', '13:00:00', '16:00:00', 'Training Center', 99.00, 26, 'Health & Wellness', 'active', 'https://picsum.photos/seed/ergo/800/400', 1),
('Healthy Habits Sprint', 'Habit formation, nutrition basics, and tracking.', 'Chloe Baker', '2025-11-18', '09:00:00', '13:00:00', 'Wellness Room', 109.00, 24, 'Health & Wellness', 'active', 'https://picsum.photos/seed/habits/800/400', 1),

-- Management
('Leadership Bootcamp', 'Modern leadership, coaching, and decision-making.', 'Emily Brown', '2025-11-12', '09:00:00', '15:00:00', 'Executive Room', 249.99, 25, 'Management', 'active', 'https://picsum.photos/seed/lead/800/400', 1),
('Agile Delivery Workshop', 'Scrum, Kanban, and flow metrics for teams.', 'Jacob Rivera', '2025-12-02', '09:30:00', '16:30:00', 'Conference Room C', 259.00, 20, 'Management', 'active', 'https://picsum.photos/seed/agile/800/400', 1),
('Data-Driven Decisions', 'KPIs, dashboards, and lightweight analytics.', 'Avery Cooper', '2025-12-09', '10:00:00', '16:00:00', 'Executive Room', 269.00, 18, 'Management', 'active', 'https://picsum.photos/seed/data/800/400', 1);
