const _ = require('lodash') ;
const faker = require('faker');

const companies = _.times(5, () => {
    return {
        id: _.uniqueId(),
        companyName : faker.company.companyName(),
        price: faker.finance.amount()
    };
});

module.exports = {
    Query: {
        companies: () => {
            return companies;
        },
    },
    Mutation: {
        addCompany: (root, {companyName, price}) => {
            const company = {
                id: _.uniqueId(),
                companyName,
                price
            };
            companies.push(company);
            return company;
        },
        updateCompany: (root, {id, companyName, price}) => {
            const company = _.chain(companies).find({'id': id}).merge({companyName, price}).value();
            if (!company) {
                throw 'Cand\'t find company by id';
            }
            return company;
        },
        deleteCompany: (root, { id }) => {
            _.remove(companies, (o) => o.id == id);
            return id;
        }
    }
};