import React, { useState } from 'react'
import AtmButton from '../AtmComponents/AtmButton'
import AtmInput from '../AtmComponents/AtmInput';
import AtmSearchInput from '../AtmComponents/AtmSearchInput';
import AtmDropdown from '../AtmComponents/AtmDropdown';
import AtmTable from '../AtmComponents/AtmTable';

const Test = () => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };

    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = (e) => {
      setSearchValue(e.target.value);
    };

    const [selectedValue, setSelectedValue] = useState('');

    const handleDropdownChange = (e) => {
      setSelectedValue(e.target.value);
    };
  
    const dropdownOptions = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];


        const columns = [
            { header: 'Name', accessor: 'name' },
            { header: 'Age', accessor: 'age' },
            { header: 'Email', accessor: 'email' },
          ];

    
      const data = [
        { name: 'John Doe', age: 28, email: 'john.doe@example.com' },
        { name: 'Jane Smith', age: 32, email: 'jane.smith@example.com' },
        { name: 'Mike Johnson', age: 45, email: 'mike.johnson@example.com' },
        { name: 'John Doe', age: 28, email: 'john.doe@example.com' },
        { name: 'Jane Smith', age: 32, email: 'jane.smith@example.com' },
        { name: 'Mike Johnson', age: 45, email: 'mike.johnson@example.com' },
        { name: 'John Doe', age: 28, email: 'john.doe@example.com' },
        { name: 'Jane Smith', age: 32, email: 'jane.smith@example.com' },
        { name: 'Mike Johnson', age: 45, email: 'mike.johnson@example.com' },
        { name: 'John Doe', age: 28, email: 'john.doe@example.com' },
        { name: 'Jane Smith', age: 32, email: 'jane.smith@example.com' },
        { name: 'Mike Johnson', age: 45, email: 'mike.johnson@example.com' },
      ];

      const handleRowClick = (row) => {
        alert(`Row clicked: ${JSON.stringify(row)}`);
      };
    
  return (
    <div  className="">
        <AtmButton 
        label={"Test"}
        onClick={() => console.log("Test")}
        type={"button"}
        />
          <AtmInput
        label="Name"
        type="text"
        placeholder="Type here..."
        value={inputValue}
        onChange={handleInputChange}
        className="w-full max-w-md"
      />
        <AtmSearchInput
        placeholder="Search items..."
        value={searchValue}
        onChange={handleSearchChange}
        className="w-full max-w-md"
      />
       <AtmDropdown
        options={dropdownOptions}
        value={selectedValue}
        onChange={handleDropdownChange}
        placeholder="Select an option"
        className="w-full max-w-md"
      />
       <AtmTable columns={columns} data={data} onRowClick={handleRowClick}/>
    </div>
  )
}

export default Test