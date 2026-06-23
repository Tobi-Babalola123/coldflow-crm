import { Suspense } from "react";
import LeadsContent from "./LeadsContent";

function LeadsLoading() {
  return <div className="p-8">Loading leads...</div>;
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<LeadsLoading />}>
      <LeadsContent />
    </Suspense>
  );
}
