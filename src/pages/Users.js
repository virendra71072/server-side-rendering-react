import React, { Component } from 'react'
import { connect } from 'react-redux'
// Webpack still can't learn how to tree-shake.
// import { Modal, TextInput, Button } from 'react-responsive-ui'
import Modal from 'react-responsive-ui/commonjs/Modal'
import TextInput from 'react-responsive-ui/commonjs/TextInput'
import Button from 'react-responsive-ui/commonjs/Button'
import TimeAgo from 'react-time-ago'
import Form, { Field, Submit } from 'simpler-redux-form'
import { meta, preload } from 'react-website'

import
{
	connectUsers,
	getUsers,
	addUser,
	deleteUser
}
from '../redux/users'

import './Users.css'

@preload(async ({ dispatch }) => await dispatch(getUsers()))
@meta(({ state }) =>
({
	title       : 'Simple REST API example',
	description : 'A list of users',
	image       : 'https://www.famouslogos.us/images/facebook-logo.jpg'
}))
@connect
(
	({ users }) => connectUsers(users),
	{
		getUsers,
		addUser,
		deleteUser
	}
)
export default class UsersPage extends Component
{
	state = {}

	constructor()
	{
		super()

		this.deleteUser = this.deleteUser.bind(this)
	}

	showAddUserForm = () =>
	{
		this.setState({ showAddUserForm: true })
	}

	hideAddUserForm = () =>
	{
		this.setState({ showAddUserForm: false })
	}

	async deleteUser(id)
	{
		const { getUsers, deleteUser } = this.props

		this.setState({ userBeingDeleted: id })
		await deleteUser(id)
		// TODO: wrap this `setState()` into `if (this.isStillMounted) {}`.
		this.setState({ userBeingDeleted: undefined })
		getUsers()
	}

	userAdded = () =>
	{
		const { getUsers } = this.props

		this.hideAddUserForm()
		getUsers()
	}

	render()
	{
		const
		{
			users,
			getUsers,
			getUsersPending,
			addUserPending,
			deleteUserPending
		}
		= this.props

		const
		{
			showAddUserForm
		}
		= this.state

		const disableButtons = getUsersPending || addUserPending || deleteUserPending

		return (
			<section className="page-content container">
				<div>
					<p className="users__description">
						This is an example of REST API data querying (try disabling javascript and reloading the page).<br/>
						Page still render after disabling javascript.
					</p>

					

					<div>
						<Button
							disabled={ disableButtons }
							action={ this.showAddUserForm }>
							Add user
						</Button>

						<Button
							busy={ getUsersPending }
							disabled={ disableButtons }
							action={ getUsers }
							className="users__refresh">
							Reload User List
						</Button>

						<div className="users__content">
							{ this.renderUsers() }
						</div>

						<Modal
							isOpen={ showAddUserForm }
							close={ this.hideAddUserForm }
							busy={ addUserPending }>
							<AddUserForm onSubmitted={ this.userAdded }/>
						</Modal>
					</div>
				</div>
			</section>
		)
	}

	renderUsers()
	{
		const
		{
			users,
			getUsersPending,
			getUsersError,
			addUserPending,
			addUserError,
			deleteUserPending,
			deleteUserError
		}
		= this.props

		const { userBeingDeleted } = this.state

		if (getUsersPending)
		{
			return 'Loading users...'
		}

		if (getUsersError)
		{
			return 'Failed to load the list of users'
		}

		if (users.length === 0)
		{
			return 'No users'
		}

		const disableButtons = getUsersPending || addUserPending || deleteUserPending

		return (
			<table className="users__list">
				<tbody>
					{ users.map((user) => {
						return (
							<tr key={ user.id }>
								<td className="user__id">
									{ user.id }
								</td>
								<td className="user__name">
									{ user.name }
								</td>
								<td className="user__place">
									{ user.place }
								</td>
								<td>
									<TimeAgo>
										{ user.dateAdded }
									</TimeAgo>
								</td>
								
								<td>
									<Button
										busy={ userBeingDeleted === user.id }
										disabled={ disableButtons }
										action={ () => this.deleteUser(user.id) }
										className="user__delete">
										delete
									</Button>
								</td>
							</tr>
						)
					}) }
				</tbody>
			</table>
		)
	}
}

@Form
@connect(state => ({}), { addUser })
class AddUserForm extends Component
{
	constructor()
	{
		super()

		this.submit = this.submit.bind(this)
	}

	async submit(values)
	{
		const { addUser, onSubmitted } = this.props
		await addUser(values)
		onSubmitted()
	}

	render()
	{
		const { submit, submitting } = this.props

		return (
			<form
				onSubmit={ submit(this.submit) }
				className="add-user">

				<Field
					required
					name="name"
					label="Name"
					component={ TextInput }
					className="add-user__name"/>
				<Field
					required
					name="place"
					label="Place"
					component={ TextInput }
					className="add-user__name"/>

				<Submit
					submit
					component={ Button }
					className="rrui__button--border add-user__submit">
					Add
				</Submit>
			</form>
		)
	}
}