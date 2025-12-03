import { UserRole } from "@/modules/users/entities";

interface RoleSelectionTabsProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  roles?: Array<{ value: UserRole; label: string }>;
}

const DEFAULT_ROLES = [
  { value: "ADMIN" as UserRole, label: "Admin" },
  { value: "EXAMINER" as UserRole, label: "Penguji" },
  { value: "EXAMINEE" as UserRole, label: "Peserta" },
];

export function RoleSelectionTabs({
  selectedRole,
  onRoleChange,
  roles = DEFAULT_ROLES,
}: RoleSelectionTabsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 p-1 bg-muted/50 rounded-lg">
      {roles.map((role) => (
        <button
          key={role.value}
          type="button"
          onClick={() => onRoleChange(role.value)}
          className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
            selectedRole === role.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {role.label}
        </button>
      ))}
    </div>
  );
}
