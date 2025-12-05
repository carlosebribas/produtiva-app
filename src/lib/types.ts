export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date?: string;
  assignee?: string;
  created_at: string;
  updated_at: string;
};

export type KPI = {
  id: string;
  name: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  category: string;
  assignee?: string;
  period: string;
  created_at: string;
  updated_at: string;
};

export type Evaluation = {
  id: string;
  evaluator: string;
  evaluated: string;
  rating: number;
  category: string;
  feedback?: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
};

export type Report = {
  id: string;
  title: string;
  type: string;
  data: any;
  generated_by?: string;
  period_start?: string;
  period_end?: string;
  created_at: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  team?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};
