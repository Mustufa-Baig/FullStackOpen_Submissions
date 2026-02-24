const Notification = ({message}) => {
	const text=message.text
	const success=message.success
	
	if (text==null){
		return null
	}

	let divStyle={color:'red', background:'lightgrey',
		padding:'10px 20px',margin:"10px 0px",
		borderColor:'red', borderStyle:'solid',
		borderWidth:'5px',borderRadius:'10px'}

	if (success){
		divStyle={color:'green', background:'lightgrey',
			padding:'10px 20px',margin:"10px 0px",
			borderColor:'green', borderStyle:'solid',
			borderWidth:'5px',borderRadius:'10px'}
	}

	return (
		<div style={divStyle}>
			<h2 style={{margin:'0px'}}>{text}</h2>
		</div>
	)
}

export default Notification