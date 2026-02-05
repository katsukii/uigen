import { Loader2, FilePlus, FilePen, Eye, Trash2, ArrowRightLeft } from "lucide-react";

interface ToolInvocationDisplayProps {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
}

function getLabel(toolName: string, args: Record<string, unknown>, isDone: boolean): { icon: React.ElementType; text: string } {
  const path = typeof args?.path === "string" ? args.path : "";

  if (toolName === "str_replace_editor") {
    const command = args?.command;
    switch (command) {
      case "create":
        return { icon: FilePlus, text: isDone ? `Created ${path}` : `Creating ${path}` };
      case "str_replace":
      case "insert":
        return { icon: FilePen, text: isDone ? `Edited ${path}` : `Editing ${path}` };
      case "view":
        return { icon: Eye, text: isDone ? `Read ${path}` : `Reading ${path}` };
      default:
        return { icon: FilePen, text: isDone ? `Edited ${path}` : `Editing ${path}` };
    }
  }

  if (toolName === "file_manager") {
    const command = args?.command;
    if (command === "delete") {
      return { icon: Trash2, text: isDone ? `Deleted ${path}` : `Deleting ${path}` };
    }
    if (command === "rename") {
      const newPath = typeof args?.new_path === "string" ? args.new_path : "";
      return { icon: ArrowRightLeft, text: isDone ? `Moved ${path} to ${newPath}` : `Moving ${path}` };
    }
  }

  return { icon: FilePen, text: toolName };
}

export function ToolInvocationDisplay({ toolName, args, state }: ToolInvocationDisplayProps) {
  const isDone = state === "result";
  const { icon: Icon, text } = getLabel(toolName, args, isDone);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isDone ? (
        <Icon className="w-3 h-3 text-emerald-600" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{text}</span>
    </div>
  );
}
