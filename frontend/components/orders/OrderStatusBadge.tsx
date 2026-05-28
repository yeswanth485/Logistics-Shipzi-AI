export default function OrderStatusBadge({ status }: { status: string }) {
  const getStyles = () => {
    switch (status.toLowerCase()) {
      case "optimized":
        return "bg-packiq-emerald/10 text-packiq-emerald border-packiq-emerald/20";
      case "pending":
        return "bg-packiq-amber/10 text-packiq-amber border-packiq-amber/20";
      case "shipped":
        return "bg-packiq-cyan/10 text-packiq-cyan border-packiq-cyan/20";
      case "failed":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStyles()}`}>
      {status}
    </span>
  );
}
