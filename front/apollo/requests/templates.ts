import { graphql } from "../gql";


export const GET_BOARD_TEMPLATES = graphql(`
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
`);
