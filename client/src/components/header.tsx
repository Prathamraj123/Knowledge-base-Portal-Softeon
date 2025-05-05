import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

export function Header() {
  const { employeeId, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-neutral-700">Knowledge Base Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-neutral-500">{employeeId}</span>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-neutral-500 hover:text-neutral-700 font-medium text-sm"
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
