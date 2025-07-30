import { BarChart, Calendar, Home, Lock, Settings, UserPlus, Users, DollarSign } from "lucide-react"

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
  sidebarOpen: boolean
  onCloseSidebar: () => void
  hostName: string
  hostAvatar: string
  hostLocation: string
}

const CommunityNavigation = ({
  activeSection,
  onSectionChange,
  sidebarOpen,
  onCloseSidebar,
  hostName,
  hostAvatar,
  hostLocation,
}: NavigationProps) => {
  /* …component body remains unchanged… */
}

export default CommunityNavigation
export { CommunityNavigation } // <— optional named export

export const menuItems = [
  {
    id: "users",
    label: "Users",
    icon: Users,
    description: "Manage community users",
  },
  {
    id: "invite",
    label: "Invite User",
    icon: UserPlus,
    description: "Invite a new user to the community",
  },
  {
    id: "roles",
    label: "Roles & Permissions",
    icon: Lock,
    description: "Manage roles and permissions",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart,
    description: "View community analytics",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    description: "Manage community settings",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    description: "View community calendar",
  },
  {
    id: "homepage-content",
    label: "Homepage Tours",
    icon: Home,
    description: "Manage tours shown on homepage",
  },
  {
    id: "pricing",
    label: "Edit Prices",
    icon: DollarSign,
    description: "Update tour pricing",
  },
]
