import _ from 'lodash';
import React, { Component } from 'react';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';

import {COMPANIES_QUERY} from '../../pages/index';

const UPDATE_COMPANY = gql`
    mutation updateCompany($id: ID!, $companyName: String!, $price: Float!) {
        updateCompany(id: $id, companyName: $companyName, price: $price) {
            id
            companyName
            price
        }
    }
`;

const DELETE_COMPANY = gql`
    mutation deleteCompany($id: ID!) {
        deleteCompany(id: $id)
    }
`;

class TableRow extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            isEdit : false,
            companyValid: true,
            companyName: this.props.item.companyName,
            priceValid: true,
            price: this.props.item.price,
        };
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleEdit() {
        this.setState({ isEdit: true });
    }

    handleDelete() {
        const { deleteCompany } = this.props;
        deleteCompany({
            variables: { id: this.props.item.id },
            update: (store, { data: { deleteCompany } }) => {
                const companyId = deleteCompany;
                const data = store.readQuery({ query: COMPANIES_QUERY });
                _.remove(data.companies, (o) => o.id == companyId);
                store.writeQuery({
                    query: COMPANIES_QUERY,
                    data
                });
            }
        });
    }

    handleSave() {
        const companyValid = this.validate();
        if (companyValid) {
            const { updateCompany } = this.props;
            const { companyName, price } = this.state;
            updateCompany({
                variables: { id: this.props.item.id, companyName, price: parseFloat(price) },
                update: (store, { data: { updateCompany } }) => {
                    const data = store.readQuery({
                        query: COMPANIES_QUERY
                    });
                    _.chain(data.companies)
                        .find({'id': updateCompany.id})
                        .merge({companyName: updateCompany.companyName, price: updateCompany.price});
                    store.writeQuery({
                        query: COMPANIES_QUERY,
                        data
                    });
                }
            });
            this.setState({ isEdit: false });
        }
    }

    handleChange(e) {
        switch (e.target.name) {
        case 'companyName':
            this.setState({ companyName: e.target.value });
            break;
        case 'price':
            this.setState({ price: e.target.value });
            break;
        }
    }

    validate() {
        const companyValid = /^[A-Za-z\s\.,-]+$/.test(this.state.companyName);
        const priceValid = /^[0-9.,]+$/.test(this.state.price);
        this.setState({companyValid, priceValid});
        return companyValid && priceValid;
    }

    render() {
        const companyBorder = this.state.companyValid?'active text-purple-dark':'error text-purple-dark';
        const priceBorder = this.state.priceValid?'active text-blue-dark':'error text-blue-dark';

        return (
            <tr>
                <td className="whitespace-no-wrap">
                    {
                        this.state.isEdit?
                            <input className={companyBorder} type="text" name="companyName" 
                                value={ this.state.companyName } onChange={ this.handleChange }/>:
                            <span className="text-purple-dark">{this.state.companyName}</span>
                    }
                </td>
                <td className="whitespace-pre w-1/4">
                    {
                        this.state.isEdit?
                            <input className={priceBorder} type="text" name="price" 
                                value={this.state.price} onChange={ this.handleChange } />:
                            <span className="text-blue-dark">{this.state.price}</span>
                    }
                </td>
                <td>
                    <div className="flex justify-around">
                        {
                            this.state.isEdit?
                                <i className="fas fa-check-circle text-grey hover:text-grey-darker" onClick={this.handleSave.bind(this)}/>:
                                <i className="fas fa-edit text-grey hover:text-grey-darker" onClick={this.handleEdit.bind(this)}></i>
                                
                        }
                        <i className="fas fa-trash-alt text-grey hover:text-grey-darker" onClick={this.handleDelete.bind(this)}></i>
                    </div>
                </td>
            </tr>            
        );
    }
}
const withData = compose(
    graphql(UPDATE_COMPANY,{ name : 'updateCompany'}),
    graphql(DELETE_COMPANY,{ name : 'deleteCompany'})
)(TableRow);

export default withData;