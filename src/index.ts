import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import bodyParser from "body-parser";
import { testDefs } from "./graphql/typeDefs/test";
import { testResolver } from "./graphql/resolvers/test";
const PORT = process.env.PORT || 8900;
async function init() {
  const app = express();
  app.use(express.json());
  app.use(bodyParser.json());
  app.use(cors());
  const typeDefs = [testDefs];
  const resolvers = [testResolver];
  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await graphqlServer.start();

  app.get("/", (req, res) => {
    res.status(200).send({ message: "Welcome to my world!" });
  });
  /** Route for graphql */
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(graphqlServer)
  );

  app.listen(PORT, () => {
    console.log(`Application is running on http://localhost:${PORT}`);
    console.log(`Graphql is running on http://localhost:${PORT}/graphql`);
  });
}
init();
