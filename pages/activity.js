import React, { useState } from 'react'
import { useRouter } from 'next/router'
import url from '../utils/server.js'
import Link from 'next/link'
import log from '../utils/log.js'
import ActivityItem from '../components/activity-score-item.js'
import ReviewItem from'../components/review-item.js'

const ActivityPage = ({
	activity,
	actScore
}) => {
	const router = useRouter()

	const deleteActivity = async event => {
		event.preventDefault()

		const res = await fetch(
			`${url}/api/deleteActivityById`,{
				body: JSON.stringify({	
					id_activity: activity.id_activity
				}),
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST'
			})
			.then(response => console.log(response))
			.then(router.push('/activities'))
	}

	return (
		<>
			<div className="w-full h-screen flex flex-col space-y-12 my-24 items-center">
        
				<h1 className="text-4xl font-medium">Actividad</h1>

				<div className="flex flex-col space-y-4">
					<ActivityItem
						key={activity.id_activity}
						id_activity={activity.id_activity}
						title={activity.title}
						description={activity.description}
						id_entity_host={activity.id_entity_creator}
						seats={activity.seats}
						price={activity.price}
						location={activity.location}
						dateAct={activity.dateAct}
						min_duration={activity.min_duration}
						score={actScore[0].media}
					/>
					<Link
						href = {{
							pathname: '/modify-activity',
							query: {id : `${activity.id_activity}`},
						}}
					>
						<button className="rounded-full border-2 ">Modificar</button>
					</Link>

					<form className="flex flex-col space-y-4" onSubmit={deleteActivity}>
						<button type="submit" className="rounded-full border-2 ">Borrar</button>
					</form>

					<ReviewItem id_activity_prop={activity.id_activity}/>
					
				</div>
			</div>
		</>
	)
}

export async function getServerSideProps(ctx) {

	const {id} = ctx.query

	const res = await fetch(`${url}/api/getActivityByID?id_activity=${id}`)
	 	.then(response => response.json())
	const activity = res

	const actScore = await fetch(`${url}/api/getAverageScoreByActivities?id_activity=${id}`)
		.then(response => response.json())
	console.log(actScore)
	return {
		props: {
			activity,
			actScore
		}
	}

}

export default ActivityPage