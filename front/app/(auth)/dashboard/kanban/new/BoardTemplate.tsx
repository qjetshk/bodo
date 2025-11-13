import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

interface Props {
  template: Template;
}

interface Template {
  id: string;
  name: string;
  description?: string;
  columns: Column[];
}

interface Column {
  title: string;
  order: number;
}

const BoardTemplate = ({ template }: Props) => {
  const titlesString = template.columns
    .slice()
    .sort((a, b) => a.order - b.order) 
    .map((col) => col.title)
    .join(" | ");

  return (
    <Card className="h-full cursor-pointer min-h-[250px]">
      <CardHeader>
        <CardTitle className="font-unbounded">{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <div className="p-5 h-full text-center flex justify-center items-center text-lg ">{titlesString}</div>
      </CardContent>
    </Card>
  );
};

export default BoardTemplate;
