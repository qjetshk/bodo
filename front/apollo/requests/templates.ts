import { gql } from "@apollo/client";

export interface GetTemplatesData {
  getAllBoardTemplates: {
    id: string;
    name: string;
    description: string;
    columns: Column[];
  }[];
}

interface Column {
  title: string;
  order: number;
}

export const GET_BOARD_TEMPLATES = gql`
  query GetAllBoardTemplates {
    getAllBoardTemplates {
      id
      name
      description
      columns {
        title
        order
      }
    }
  }
`;
