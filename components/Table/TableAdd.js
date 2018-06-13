import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import {COMPANIES_QUERY} from '../../pages/index';

const ADD_COMPANY = gql`
    mutation addCompany($companyName: String!, $price: Float!) {
        addCompany(companyName: $companyName, price: $price) {
            id
            companyName
            price
        }
    }
`;

class TableAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyValid: true,
            companyName: '',
            priceValid: true,
            price: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleSave() {
        const companyValid = this.validate();
        if (companyValid) {
            const { mutate } = this.props;
            const { companyName, price } = this.state;
            mutate({
                variables: { companyName, price: parseFloat(price) },
                update: (store, { data: { addCompany } }) => {
                    const data = store.readQuery({query: COMPANIES_QUERY });
                    data.companies.push(addCompany);
                    store.writeQuery({ query: COMPANIES_QUERY, data });
                },
                optimisticResponse: {
                    addCompany: {
                        companyName,
                        price,
                        id: Math.round(Math.random() * -1000000),
                        __typename: 'Company',
                    },
                },
            });
            this.setState({
                companyValid: true,
                companyName: '',
                priceValid: true,
                price: ''
            });
            this.props.onChange('saved');
        } 
    }
    
    handleClose() {
        this.setState({
            companyValid: true,
            companyName: '',
            priceValid: true,
            price: ''
        });
        this.props.onChange('closed');
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
            <tr className={this.props.visible?'':'hidden'}>
                <td className="whitespace-no-wrap">
                    <input className={companyBorder} type="text" name="companyName" 
                        value={ this.state.companyName } onChange={ this.handleChange }/>
                </td>
                <td className="whitespace-pre w-1/4">
                    <input className={priceBorder} type="text" name="price" 
                        value={this.state.price} onChange={ this.handleChange } />
                </td>
                <td>
                    <div className="flex justify-around">
                        <i className="fas fa-check-circle text-grey hover:text-grey-darker" onClick={this.handleSave.bind(this)}/>
                        <i className="fas fa-times-circle text-grey hover:text-grey-darker" onClick={this.handleClose.bind(this)}></i>
                    </div>
                </td>
            </tr>            
        );
    }
}

TableAdd.propTypes = {
    visible: PropTypes.bool,
    onChange: PropTypes.func.isRequired
};

const AddWithMutation = graphql(ADD_COMPANY)(TableAdd);

export default AddWithMutation;                                                                                                