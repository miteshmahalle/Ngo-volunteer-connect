// import {
//   BookOpen,
//   ChevronRight,
//   CircleHelp,
//   ClipboardList,
//   KeyRound,
//   LogOut,
//   UserRound,
//   X,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// type SidebarItem = {
//   label: string;
//   icon?: React.ElementType;
//   onClick?: () => void;
// };

// type ProfileSidebarProps = {
//   open: boolean;
//   onClose: () => void;
//   user: {
//     name: string;
//     email?: string;
//     role?: string;
//   };
//   items?: SidebarItem[];
// };

// export default function ProfileSidebar({
//   open,
//   onClose,
//   user,
//   items,
// }: ProfileSidebarProps) {
//   const navigate = useNavigate();
//   if (!open) return null;

//   const defaultItems: SidebarItem[] = [
//     { label: "Edit Profile", icon: UserRound,
//        onClick: () => {
//     navigate("/profile/edit");
//     onClose(); // close sidebar
//     }},
//     { label: "Change Password", icon: KeyRound },
//     { label: "Projects", icon: ClipboardList },
//     { label: "FAQs", icon: CircleHelp },
//     { label: "Guidelines", icon: BookOpen },
//     {
//       label: "Logout",
//       icon: LogOut,
//       onClick: () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         window.location.href = "/auth/login";
//       },
//     },
//   ];

//   const sidebarItems = items ?? defaultItems;

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40">
//       <aside className="ml-auto h-full w-full max-w-sm bg-white text-slate-800 shadow-2xl">
//         <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
//           <div className="flex items-center gap-4">
//             <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-leaf-100 bg-leaf-100 text-leaf-700">
//               <UserRound size={32} />
//             </div>

//             <div>
//               <h2 className="text-lg font-black">{user.name}</h2>
//               <p className="text-sm text-slate-500">{user.email}</p>
//               <p className="mt-1 text-xs font-bold uppercase text-leaf-600">
//                 {user.role}
//               </p>
//             </div>
//           </div>

//           <button onClick={onClose}>
//             <X />
//           </button>
//         </div>

//         <nav className="px-5 py-6">
//           {sidebarItems.map((item) => {
//             const Icon = item.icon ?? ChevronRight;

//             return (
//               <button
//                 key={item.label}
//                 onClick={item.onClick}
//                 className="mb-3 flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-bold text-leaf-700 hover:bg-leaf-50"
//               >
//                 <span className="flex items-center gap-3">
//                   <Icon size={20} className="text-leaf-600"/>
//                   {item.label}
//                 </span>
//                 <ChevronRight size={18}  className="text-leaf-500"/>
//               </button>
//             );
//           })}
//         </nav>
//       </aside>
//     </div>
//   );
// }

import {
  BookOpen,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  KeyRound,
  LogOut,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type SidebarItem = {
  label: string;
  icon?: React.ElementType;
  onClick?: () => void;
};

type ProfileSidebarProps = {
  open: boolean;
  onClose: () => void;
  user: {
    name: string;
    email?: string;
    role?: string;
  };
  items?: SidebarItem[];
};

export default function ProfileSidebar({
  open,
  onClose,
  user,
  items,
}: ProfileSidebarProps) {
  const navigate = useNavigate();
  if (!open) return null;

  const defaultItems: SidebarItem[] = [
    {
      label: "Edit Profile",
      icon: UserRound,
      onClick: () => {
        navigate("/profile/edit");
        onClose();
      },
    },
    {
      label: "Change Password",
      icon: KeyRound,
      onClick: () => {
        navigate("/profile/change-password");
        onClose();
      },
    },
    {
      label: "Projects",
      icon: ClipboardList,
      onClick: () => {
        navigate("/projects");
        onClose();
      },
    },
    {
      label: "FAQs",
      icon: CircleHelp,
      onClick: () => {
        navigate("/faqs");
        onClose();
      },
    },
    {
      label: "Guidelines",
      icon: BookOpen,
      onClick: () => {
        navigate("/guidelines");
        onClose();
      },
    },
    {
      label: "Logout",
      icon: LogOut,
      onClick: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      },
    },
  ];

  const sidebarItems = items ?? defaultItems;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col animate-slide-in bg-white shadow-2xl">
        {/* Header Section - Medium Size */}
        <div className="relative flex-shrink-0 overflow-hidden">
          {/* Decorative gradient blobs */}
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-leaf-100/20 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-leaf-50/30 blur-2xl" />

          <div className="relative px-5 pb-5 pt-3">
            {/* Close Button - Top Right */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 transition-all duration-200 hover:bg-leaf-50 hover:text-leaf-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Section - Medium, Horizontal Layout */}
            <div className="mt-2 flex items-center gap-4">
              {/* Medium Avatar */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-leaf-400 to-leaf-600 opacity-20 blur-sm" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-3 border-white bg-gradient-to-br from-leaf-100 to-leaf-200 shadow-md">
                  <UserRound size={28} className="text-leaf-700" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-800">{user.name}</h2>
                <p className="text-xs text-slate-500">{user.email}</p>
                <div className="mt-1">
                  <span className="inline-flex items-center rounded-full bg-leaf-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-leaf-700 ring-1 ring-leaf-200/50">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Navigation Items - Scrollable */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-5 pt-4">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon ?? ChevronRight;

            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all duration-200 hover:bg-leaf-50 active:scale-[0.98]"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className="flex items-center gap-3">
                  <div className="rounded-md bg-leaf-50 p-1.5 text-leaf-600 transition-all duration-200 group-hover:bg-leaf-100 group-hover:text-leaf-700">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 transition-colors duration-200 group-hover:text-leaf-700">
                    {item.label}
                  </span>
                </span>
                <ChevronRight
                  size={14}
                  className="text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-leaf-500"
                />
              </button>
            );
          })}
        </nav>

        {/* Footer Decoration */}
        <div className="flex-shrink-0 border-t border-slate-100 px-5 py-3">
          <p className="text-center text-[10px] text-slate-400">SevaSetu Portal</p>
        </div>
      </aside>

      {/* Add animation keyframes to your global CSS or tailwind config */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}