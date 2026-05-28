import { Users, UserPlus } from "lucide-react";

export default function TeamMembers() {
  const members = [
    { name: "Jane Doe", email: "jane@example.com", role: "Owner" },
    { name: "John Smith", email: "john@example.com", role: "Admin" },
    { name: "Alice Johnson", email: "alice@example.com", role: "Member" },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-packiq-blue/20 text-packiq-blue">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Team Members</h3>
            <p className="text-sm text-gray-400">Manage who has access to this workspace.</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20">
          <UserPlus className="h-4 w-4" />
          <span>Invite</span>
        </button>
      </div>

      <div className="space-y-4">
        {members.map((member, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl bg-black/40 p-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-xs font-bold text-white">
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{member.name}</p>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>
            </div>
            <span className="rounded-full bg-white/5 px-2 py-1 text-xs font-medium text-gray-400 border border-white/10">
              {member.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
