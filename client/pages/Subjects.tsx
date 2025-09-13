import AppLayout from "@/components/layout/AppLayout";
import { useGetSubjectsQuery } from "@/store/api";

export default function SubjectsPage() {
  const { data: raw, isLoading } = useGetSubjectsQuery();
  const data = Array.isArray(raw) ? raw : (raw && (raw.results || raw.data) ? (raw.results || raw.data) : []);
  return (
    <AppLayout>
      <h1 className="text-2xl font-bold">Subjects</h1>
      <div className="mt-6 rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="p-3">Code</th>
              <th className="p-3">Name</th>
              <th className="p-3">Department</th>
              <th className="p-3">Credits</th>
              <th className="p-3">Lectures/Wk</th>
              <th className="p-3">Labs/Wk</th>
              <th className="p-3">Requires Lab</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td className="p-3" colSpan={7}>Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td className="p-3" colSpan={7}>No subjects found</td></tr>
            ) : (
              data.map((s: any) => (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.code}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.department}</td>
                  <td className="p-3">{s.credits}</td>
                  <td className="p-3">{s.lectures_per_week}</td>
                  <td className="p-3">{s.labs_per_week}</td>
                  <td className="p-3">{s.requires_lab ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
