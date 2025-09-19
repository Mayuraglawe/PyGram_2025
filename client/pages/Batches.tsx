import { useGetBatchesQuery } from "@/store/api";

export default function BatchesPage() {
  const { data: raw, isLoading } = useGetBatchesQuery();
  const data = Array.isArray(raw) ? raw : (raw && typeof raw === 'object' && 'results' in raw ? (raw as any).results : raw && typeof raw === 'object' && 'data' in raw ? (raw as any).data : []);
  return (
    <>
      <h1 className="text-2xl font-bold">Student Batches</h1>
      <div className="mt-6 rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Year</th>
              <th className="p-3">Semester</th>
              <th className="p-3">Strength</th>
              <th className="p-3">Department</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td className="p-3" colSpan={5}>Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td className="p-3" colSpan={5}>No batches found</td></tr>
            ) : (
              data.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3">{b.name}</td>
                  <td className="p-3">{b.year}</td>
                  <td className="p-3">{b.semester}</td>
                  <td className="p-3">{b.strength}</td>
                  <td className="p-3">{b.department}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
