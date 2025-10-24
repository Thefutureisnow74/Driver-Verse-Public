import { NextResponse } from 'next/server';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));

  const notifications: Notification[] = [
    {
      id: "notif_1",
      title: "New High-Paying Gig Available",
      message: "UberEats has a premium delivery opportunity in downtown SF - $35/hour",
      type: "success",
      read: false,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
      actionUrl: "/dashboard/opportunities",
      actionLabel: "View Gig"
    },
    {
      id: "notif_2", 
      title: "Peak Hours Alert",
      message: "Lunch rush starting in 15 minutes. Head to Financial District for best rates.",
      type: "info",
      read: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      actionUrl: "/dashboard/fleet",
      actionLabel: "Navigate"
    },
    {
      id: "notif_3",
      title: "Weekly Earnings Summary",
      message: "Great week! You earned $1,247 - that's 18% more than last week.",
      type: "success",
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: "notif_4",
      title: "Document Expiring Soon",
      message: "Your vehicle registration expires in 30 days. Renew now to avoid interruptions.",
      type: "warning",
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      actionUrl: "/dashboard/fleet",
      actionLabel: "Update Documents"
    },
    {
      id: "notif_5",
      title: "New Feature: Route Optimization",
      message: "Try our new AI-powered route optimization to increase earnings by up to 15%.",
      type: "info",
      read: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      actionUrl: "/dashboard/fleet",
      actionLabel: "Learn More"
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const response: NotificationsResponse = {
    notifications,
    unreadCount
  };

  return NextResponse.json(response);
}

export async function PATCH(request: Request) {
  try {
    const { notificationId, markAsRead } = await request.json();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In a real app, you would update the notification in the database
    // For now, just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}
