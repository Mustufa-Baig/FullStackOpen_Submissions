import {useState} from 'react'

const Filter = ({searchName,handleSearchNameChange}) => {
	return (
		<div>
			filter shown with <input value={searchName} onChange={handleSearchNameChange} />
		</div>
	)
}

export default Filter