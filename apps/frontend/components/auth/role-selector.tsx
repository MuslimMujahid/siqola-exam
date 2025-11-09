import { type UserRoleType } from "@/lib/schemas/auth";

interface RoleSelectorProps {
  selectedRole: UserRoleType;
  onRoleChange: (role: UserRoleType) => void;
}

export function RoleSelector({
  selectedRole,
  onRoleChange,
}: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2 p-1 bg-muted/50 rounded-lg">
      <button
        type="button"
        onClick={() => onRoleChange("institution")}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
          selectedRole === "institution"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Institution
      </button>
      <button
        type="button"
        onClick={() => onRoleChange("examiner")}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
          selectedRole === "examiner"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Examiner
      </button>
      <button
        type="button"
        onClick={() => onRoleChange("examinee")}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
          selectedRole === "examinee"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Examinee
      </button>
    </div>
  );
}
