import _ from 'lodash';
import React, { Component } from 'react';

import TableRow from './TableRow';
import TableAdd from './TableAdd';
import './Table.scss';

class Table extends Component {
    constructor(props) {
        super(props);
        this.state = { addVisible : false };
    }

    handleAdd() {
        this.setState({ addVisible : !this.state.addVisible });
    }

    handleAddChanged(status) {
        if (status==='saved') {
            console.log('saved');
        }
        this.setState({ addVisible : false });
    }

    render() {
        const { items } = this.props;
        return (
            <table className="w-full text-left table-main">
                <thead>
                    <tr>
                        <th className="rounded">Item</th>
                        <th>Cost per lb/kg</th>
                        <th className="w-1/6 rounded">
                            <button 
                                className="bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-1 px-4 border border-blue hover:border-transparent rounded"
                                onClick={this.handleAdd.bind(this)}>
                                + row
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {_.map(items, (item) => 
                        <TableRow key={item.id} item={item}/> 
                    )}
                    <TableAdd visible={this.state.addVisible} onChange={this.handleAddChanged.bind(this)}/>
                </tbody>
            </table>
        );
    }
}

export default Table;