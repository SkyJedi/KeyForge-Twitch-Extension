import React from 'react';
import {Button} from 'reactstrap';

export default class DeleteButton extends React.Component {
	state = {confirmation: false};

	confirmDelete = () => {
		this.setState({confirmation: true});
		this.timer = setTimeout(() => this.setState({confirmation: false}), 2000);
	};

	componentWillUnmount() {
		clearTimeout(this.timer)
	}

	render() {
		if (this.state.confirmation) {
			return <Button {...this.props} size='sm' color="danger">✓</Button>
		}
		return <Button outline color='danger' size='sm' onClick={this.confirmDelete}>X</Button>
	}
}