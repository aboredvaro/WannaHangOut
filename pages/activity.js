import React, { useState, useEffect } from 'react'
import { useRouter} from 'next/router'
import url from '../utils/server.js'
import Link from 'next/link'
import log from '../utils/log.js'
import ActivityItem from '../components/activity-score-item.js'
import CreateReviewItem from'../components/create-review-item.js'
import ReviewItem from '../components/review-item.js'
import { session, getSession } from '../utils/session.js'

const ActivityPage = ({
	activity,
	actScore,
	reviewsList
}) => {
	const router = useRouter()
	
	console.log(reviewsList)

	const [buttonValue, setButton] = useState('Mostrar Reviews')

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

	var loggedUserHash = false
	var isLogged = false
	var loggedUserId = 0
	var participatedB = false
	var prueba = false
	useEffect(() => {
		isLogged = session()
		loggedUserHash = getSession()		
		const check = async () => {
			if(loggedUserHash != false) {
				const auxUser = await fetch(`${url}/api/getEntityByHash?entityHash=${loggedUserHash}`)
					.then(response => response.json())
				loggedUserId = auxUser.id_entity
				
				const auxBool = await fetch(`${url}/api/checkIfUserInActivity`,{
					body: JSON.stringify({	
						id_entity: loggedUserId,
						id_activity: activity.id_activity
					}),
					headers: {
						'Content-Type': 'application/json'
					},
					method: 'POST'
				})
					.then(response => response.json())
				participatedB = (auxBool.cond == 1)
			}
			console.log('loggedUserId: ' + loggedUserId + ', participatedB: ' + participatedB)
			prueba = true
		}
		check()
	})

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
					
					{/*{(!isLogged && haparticipado) && <CreateReviewItem */}
					{(!isLogged  && participatedB) && <CreateReviewItem 
						id_activity_prop={activity.id_activity}
					/>}

					{reviewsList.map(review => {
							return (
								<ReviewItem
									key={review.id_review}
									id_review={review.id_review}
									id_activity={review.id_activity}
    								id_entity={review.id_entity}
    								title={review.title}
    								description={review.description}
    								points={review.points}
    								deleted={review.deleted}
									userId={loggedUserId}
								/>
							)
						})
					}
					
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

	const reviewsList = await fetch(`${url}/api/getAllReviewByActivityID?id_activity=${id}`)
		.then(response => response.json())

	return {
		props: {
			activity,
			actScore,
			reviewsList
		}
	}

}

export default ActivityPage