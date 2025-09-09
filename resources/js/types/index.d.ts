import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface PageProps {
    auth: Auth;
    errors: Record<string, string>;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface FormToken {
    id: number;
    token: string;
    leader_name: string;
    description?: string | null;
    expires_at: string;
    is_active: boolean;
    max_uses?: number | null;
    used_count: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    remaining_uses?: number | string;
}

export interface DiscipleshipUpdate {
    id: number;
    user_id?: number | null;
    form_token_id?: number | null;
    leader_name: string;
    mobile_number: string;
    ministry_involvement?: string | null;
    coach?: string | null;
    services_attended?: string | null;
    victory_groups_leading: number;
    victory_group_active: boolean;
    inactive_reason?: string | null;
    last_victory_group_date?: string | null;
    victory_group_types?: string[] | null;
    intern_invite_status: string;
    victory_group_schedule: string;
    venue?: string | null;
    concerns?: string | null;
    status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
}
