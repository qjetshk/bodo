import { Metadata } from "next";
import NewBoardForm from "./NewBoardForm";


export const metadata: Metadata = {
  title: "Bōdo - Add New Kanban Board",
  description: "Create a new Kanban board with templates, add members, and set board type.",
  keywords: ["Kanban", "Board", "Project Management", "Bōdo", "Create Board"],
  authors: [{ name: "Bōdo Team", url: "https://bodo-planner.com" }],
  openGraph: {
    title: "Bōdo - Add New Kanban Board",
    description: "Create a new Kanban board with templates, add members, and set board type.",
    url: "https://bodo-planner.com/dashboard/kanban/new",
    siteName: "Bōdo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bōdo - Add New Kanban Board",
    description: "Create a new Kanban board with templates, add members, and set board type.",
  },
};


const AddNewBoardPage = () => {

  return (
    <main className="lg:px-20 sm:px-10 px-5 py-10">
      <NewBoardForm/>
    </main>
  );
};

export default AddNewBoardPage;
