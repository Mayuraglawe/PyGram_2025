import TimetableEditPage from "../../../client/pages/TimetableEdit";
import { useRouter } from 'next/router';

export default function TimetableEdit() {
  const router = useRouter();
  const { id } = router.query;
  
  return <TimetableEditPage />;
}