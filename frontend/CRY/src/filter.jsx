import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ItemList() {
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/items?name=${searchQuery}`);
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, [searchQuery]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div>
            <h1>Items</h1>
            <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            <ul>
                {items.map(item => (
                    <li key={item._id}>
                        {item.name}: {item.description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ItemList;
