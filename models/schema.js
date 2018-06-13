module.exports = `
type Company {
    id: ID!,
    companyName: String,
    price: Float
}

type Query {
    companies: [Company]
}

type Mutation {
    addCompany(companyName: String!, price: Float!): Company
    updateCompany(id: ID!, companyName: String!, price: Float!): Company
    deleteCompany(id: ID!): ID
}
`;

