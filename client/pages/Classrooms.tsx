import AppLayout from "@/components/layout/AppLayout";
import { useGetClassroomsQuery } from "@/store/api";

export default function ClassroomsPage() {
  const { data: raw, isLoading } = useGetClassroomsQuery();
  const data = Array.isArray(raw) ? raw : (raw && (raw.results || raw.data) ? (raw.results || raw.data) : []);
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold">Classrooms</h1>
      <div className="mt-6 rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Type</th>
              <th className="p-3">Projector</th>
              <th className="p-3">Smartboard</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td className="p-3" colSpan={5}>Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td className="p-3" colSpan={5}>No classrooms found</td></tr>
            ) : (
              data.map((c: any) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.capacity}</td>
                  <td className="p-3">{c.type}</td>
                  <td className="p-3">{c.has_projector ? "Yes" : "No"}</td>
                  <td className="p-3">{c.has_smartboard ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
