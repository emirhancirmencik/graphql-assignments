const { ApolloServer, gql } = require("apollo-server");
const data = require("./data.json");

const typeDefs = gql`
  type Query {
    events: [Event!]!
    event(id: ID!): Event!
    users: [User]!
    user(id: ID!): User!
    locations: [Location!]!
    location(id: ID!): Location!
    participants: [Participant!]!
    participant(id: ID!): Participant
  }

  type Event {
    id: ID!
    title: String!
    user: User!
    location: Location!
    participants: [Participant!]!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    events: [Event!]!
  }

  type Participant {
    id: ID!
    event: Event!
    user: User!
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float
    lng: Float
    events: [Event!]!
  }
`;

const resolvers = {
  Query: {
    // event
    events: () => data.events,
    event: (parents, args) => data.events.find((event) => event.id == args.id),

    //user
    users: () => data.users,
    user: (parents, args) => data.users.find((user) => user.id == args.id),

    //location
    locations: () => data.locations,
    location: (parents, args) =>
      data.locations.find((location) => location.id == args.id),

    //participant
    participants: () => data.participants,
    participant: (parents, args) =>
      data.participants.find((participant) => participant.id == args.id),
  },
  Event: {
    user: (parents) => data.users.find((user) => user.id === parents.user_id),

    location: (parents) =>
      data.locations.find((location) => location.id === parents.location_id),

    participants: (parents, args) =>
      data.participants.filter(
        (participant) => participant.event_id === parents.id
      ),
  },
  User: {
    events: (parents) =>
      data.events.filter((event) => event.user_id == parents.id),
  },
  Location: {
    events: (parents) =>
      data.events.filter((event) => event.location_id == parents.id),
  },
  Participant: {
    user: (parents, args) =>
      data.users.find((user) => user.id === parents.user_id),
    event: (parents, args) =>
      data.events.find((event) => event.id === parents.event_id),
  },
};

const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
