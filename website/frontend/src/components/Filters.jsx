

import React from 'react'

function Filters({ filters, setFilters }) {
    

    const onChangeHandler = (event, field) => {
        const value = event.target.value;
        setFilters({
            ...filters,
            [field]: value
        });
    }

    const classNom = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500"

    return (
        <>
            <div>Search Filters</div>
            <div className=''>
                <label>Model Name</label>
                <input type='text'                    
                    value={filters.name||''}
                    onChange={(event) => onChangeHandler(event, "name")}
                    className={classNom}
                />
            </div>
            <div className=''>
                <label>Organisation</label>
                <input type='text'                    
                    value={filters.organisation||''}
                    onChange={(event) => onChangeHandler(event, "organisation")}
                    className={classNom}
                />
            </div>
        </>
      
    )
}

export default Filters