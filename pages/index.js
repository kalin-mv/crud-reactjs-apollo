import '../scss/style.scss';

import _ from 'lodash';
import React, { Component } from 'react';

import Layout from '../components/Layout';
import Table from '../components/Table/Table';

import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

export const COMPANIES_QUERY = gql`
    query CompaniesQuery {
        companies {
            id
            companyName
            price
        }
    }
`;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    
    render() {
        const {loading, error, companies } = this.props.companiesQuery;
        if (loading) {
            return <p>Loading ...</p>;
        }
        if (error) {
            return <p>{error.message}</p>;
        }
        console.log('Redraw table');
        return (
            <Layout>
                <div className="bg-white border-l border-r rounded shadow mb-6">
                    <div className="border-b px-6 py-6 flex justify-center">
                        <div className="w-1/2 border border-grey-light rounded">
                            <Table items={companies}/>
                        </div>
                    </div>
                </div>
            </Layout> 
        );
    }
}

const companiesWithData = graphql(
    COMPANIES_QUERY, { 
        name: 'companiesQuery',
        // options: { pollInterval: 3000 }
    })(Index);

export default companiesWithData;