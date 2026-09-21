import { listRows } from "@/lib/sheetRepo";
import NewProjectForm from "./NewProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const customers = await listRows("customers");
  return <NewProjectForm customers={customers.map((c) => ({ id: c["id"], nama: c["nama"] }))} />;
}
