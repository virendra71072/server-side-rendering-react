import React, { Component } from 'react'
import { meta } from 'react-website'


import './Home.css'

@meta(({ state }) => ({ title: 'Home' }))
export default class Page extends Component
{
	render()
	{
		return (
			<section className="page-content container">
				<h1 className="page-header">
					Testing Page
				</h1>

				<a className="button" href="/users">Show user Detail</a>
			</section>
		)
	}
}