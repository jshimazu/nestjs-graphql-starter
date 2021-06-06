import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GqlModuleOptions, GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useFactory: () => {
        const schemaModuleOptions: Partial<GqlModuleOptions> = {};
        const isDevelopment = process.env.NODE_ENV === 'development';
        const isTest = process.env.NODE_ENV === 'test';
        console.log(isDevelopment);

        // If we are in development, we want to generate the schema.graphql
        if (isDevelopment || isTest || process.env.IS_OFFLINE) {
          schemaModuleOptions.autoSchemaFile = 'src/schema.gql';
        } else {
          // For production, the file should be generated
          schemaModuleOptions.typePaths = ['dist/*.gql'];
        }

        return {
          context: ({ req }) => ({ req }),
          playground: isDevelopment,
          introspection: isDevelopment,
          ...schemaModuleOptions,
        };
      },
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
