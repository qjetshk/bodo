import { Input } from "@/components/ui/input";
import { Metadata } from "next";
import BoardTemplate from "./BoardTemplate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import NewBoardForm from "./NewBoardForm";

export const metadata: Metadata = {
  title: "Bōdo - Новая канбан-доска",
};


const AddNewBoardPage = () => {

  return (
    <main className="lg:px-20 sm:px-10 px-5 py-10">
      <NewBoardForm/>
    </main>
  );
};

export default AddNewBoardPage;
