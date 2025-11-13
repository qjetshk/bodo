import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello(): void {
    console.log('Hello GraphQL');
  }
}
