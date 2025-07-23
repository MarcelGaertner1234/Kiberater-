# Database Schema

## Overview
PostgreSQL database with the following main entities:

## Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Users     │────▶│ Assessments │────▶│  Roadmaps   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ UserProfiles│     │   Answers   │     │Recommendations│
└─────────────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Projects   │────▶│    Tasks    │     │  Messages   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ProjectMembers│    │ TimeEntries │     │Notifications│
└─────────────┘     └─────────────┘     └─────────────┘
```

## Tables

### users
Primary user authentication table.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    provider VARCHAR(50), -- 'local', 'google', 'github', 'apple'
    provider_id VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    role VARCHAR(50) DEFAULT 'client', -- 'client', 'consultant', 'admin', 'super_admin'
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'suspended', 'deleted'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

### user_profiles
Extended user information.

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company_name VARCHAR(255),
    company_size VARCHAR(50), -- '1-10', '11-50', '51-250', '250+'
    industry VARCHAR(100),
    position VARCHAR(100),
    phone VARCHAR(50),
    website VARCHAR(255),
    country VARCHAR(100),
    timezone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'de',
    avatar_url VARCHAR(500),
    bio TEXT,
    linkedin_url VARCHAR(255),
    notification_preferences JSONB,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### subscriptions
User subscription management.

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(50), -- 'starter', 'business', 'premium', 'enterprise'
    status VARCHAR(50), -- 'active', 'canceled', 'past_due', 'trialing'
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT false,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### assessments
KI-readiness assessments.

```sql
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'started', -- 'started', 'completed', 'expired'
    industry VARCHAR(100),
    company_size VARCHAR(50),
    readiness_score INTEGER,
    data_maturity_score INTEGER,
    tech_stack_score INTEGER,
    process_automation_score INTEGER,
    organization_readiness_score INTEGER,
    financial_readiness_score INTEGER,
    strategic_alignment_score INTEGER,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    expires_at TIMESTAMP,
    results JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### assessment_questions
Dynamic assessment questions.

```sql
CREATE TABLE assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100),
    question_text TEXT NOT NULL,
    question_type VARCHAR(50), -- 'scale', 'multiple_choice', 'checkbox', 'text'
    options JSONB,
    weight INTEGER DEFAULT 1,
    industry_specific BOOLEAN DEFAULT false,
    industries TEXT[], -- Array of applicable industries
    min_company_size VARCHAR(50),
    max_company_size VARCHAR(50),
    order_index INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### assessment_answers
User answers to assessment questions.

```sql
CREATE TABLE assessment_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    question_id UUID REFERENCES assessment_questions(id),
    answer_value TEXT,
    answer_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### roadmaps
Generated KI implementation roadmaps.

```sql
CREATE TABLE roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'generated', -- 'generated', 'in_progress', 'completed'
    phases JSONB, -- Array of implementation phases
    total_duration_months INTEGER,
    estimated_investment_min DECIMAL(10,2),
    estimated_investment_max DECIMAL(10,2),
    expected_roi_percentage INTEGER,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_viewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### projects
KI implementation projects.

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    roadmap_id UUID REFERENCES roadmaps(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'in_progress', 'on_hold', 'completed', 'canceled'
    priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    budget DECIMAL(10,2),
    spent_budget DECIMAL(10,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    actual_end_date DATE,
    completion_percentage INTEGER DEFAULT 0,
    assigned_consultant_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### project_milestones
Project milestones and deliverables.

```sql
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'delayed'
    due_date DATE,
    completed_date DATE,
    deliverables JSONB,
    acceptance_criteria TEXT,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### tasks
Project tasks and subtasks.

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES project_milestones(id),
    parent_task_id UUID REFERENCES tasks(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo', -- 'todo', 'in_progress', 'review', 'done'
    priority VARCHAR(50) DEFAULT 'medium',
    assigned_to UUID REFERENCES users(id),
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    due_date DATE,
    completed_at TIMESTAMP,
    labels TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### time_entries
Time tracking for tasks.

```sql
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    description TEXT,
    hours DECIMAL(5,2) NOT NULL,
    date DATE NOT NULL,
    billable BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### messages
Communication between users and consultants.

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    attachments JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### courses
Learning platform courses.

```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
    industry_specific BOOLEAN DEFAULT false,
    industries TEXT[],
    duration_hours INTEGER,
    thumbnail_url VARCHAR(500),
    is_published BOOLEAN DEFAULT false,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### course_modules
Course content modules.

```sql
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50), -- 'video', 'article', 'quiz', 'assignment'
    content_url VARCHAR(500),
    content_data JSONB,
    duration_minutes INTEGER,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### user_course_progress
Track user progress through courses.

```sql
CREATE TABLE user_course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES course_modules(id),
    status VARCHAR(50) DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
    progress_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    time_spent_seconds INTEGER DEFAULT 0,
    quiz_scores JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);
```

### gamification_points
User points and achievements.

```sql
CREATE TABLE gamification_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(100), -- 'course_completed', 'assessment_done', 'project_milestone', etc.
    action_id UUID, -- Reference to the specific action
    points INTEGER NOT NULL,
    multiplier DECIMAL(3,2) DEFAULT 1.0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### user_badges
Badges earned by users.

```sql
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id VARCHAR(100), -- 'first_assessment', 'quick_learner', etc.
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);
```

### content_library
Platform content resources.

```sql
CREATE TABLE content_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50), -- 'guide', 'template', 'video', 'case_study'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    tags TEXT[],
    industries TEXT[],
    access_level VARCHAR(50) DEFAULT 'all', -- 'all', 'starter', 'business', 'premium', 'enterprise'
    download_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_provider ON users(provider, provider_id);
CREATE INDEX idx_assessments_user_status ON assessments(user_id, status);
CREATE INDEX idx_projects_user_status ON projects(user_id, status);
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, is_read);
CREATE INDEX idx_user_course_progress ON user_course_progress(user_id, course_id);

-- Full-text search indexes
CREATE INDEX idx_content_search ON content_library USING gin(to_tsvector('german', title || ' ' || description));
CREATE INDEX idx_course_search ON courses USING gin(to_tsvector('german', title || ' ' || description));
```

## Migrations

Migrations are managed using Prisma or a similar migration tool. Each change to the schema should be versioned and reversible.

Example migration structure:
```
database/migrations/
├── 001_initial_schema.sql
├── 002_add_gamification.sql
├── 003_add_content_library.sql
└── 004_add_search_indexes.sql
```