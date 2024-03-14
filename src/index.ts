import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

//A schema is a collection of type definitions
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book],
    students: [Student],
    teachers: [Teacher],
    studentsbyTeacherName(name:String!):[Student]
  }

  type Student {
    id:String,
    name:String,
    sex:Boolean,
    age:Int
  }

  type Teacher{
    id:String,
    name:String,
    sex:Boolean,
    age:Int,
    students:[Student],
    subjects:[String]
  }

 type Res {
  success: Boolean
  id: String
 }

 type Mutation{
  addStudent(name: String! age: Int! sex: Boolean):Res

  updateStudent (id: String! name:String! age: Int! sex: Boolean): Res

  deleteStudent (id:String!): Res
 }

 schema{
  mutation:Mutation
  query: Query
 }
`;


//define data set
const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
  ];


  const students = [
    {
      id:'1',
      name:'jack',
      sex:true,
      age:12
    },
    {
      id:'2',
      name:'mike',
      sex:false,
      age:10
    }

  ]

  const teachers=[
    {
      id:'1',
      name:'lee',
      sex:true,
      age:30,
      subjects:['math','science'],
      students: students
    }
  ]
//define resolver
async function addStudent(_, {name, age, sex}) {
  students.push({
    id:'random',
    name,
    age,
    sex
  })

  return {
    success:true,
    id:'test'
  }
}

async function updateStudent(_, {id, name, age, sex}) {
  return {
    success: true,
    id:'test'
  }
}

async function deleteStudent(_, id) {
  return {
    success:true,
    id:'test'
  }
}

const resolvers = {
    Query: {
      books: () => books,
      students: ()=> students,
      teachers: ()=> teachers,
      studentsbyTeacherName: async(...args)=>{
        //second parameter comes from client
        console.log(args)
        await 'async test...'
        return students;
      }
    },
    Mutation:{
      addStudent: addStudent,
      updateStudent: updateStudent,
      deleteStudent: deleteStudent
    }
  };

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url}`);