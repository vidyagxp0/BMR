import { useState, useEffect, Children } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaChevronDown } from "react-icons/fa";
import { asideLinks } from './SidebarData';
import './Sidebar.css';
import { FaChevronUp } from "react-icons/fa";

function Sidebar() {
    const [openItems, setOpenItems] = useState({});

    useEffect(() => {
    }, [openItems]);

    const toggleItem = (id) => {
        setOpenItems(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const Each = ({ render, of }) =>
      Children.toArray(of.map((item, index) => render(item, index)))

    return (
        <aside>
        <div className="inner-block">
            <Each of={asideLinks} render={(item) =>
                <div className="sidebar-link" key={item.id}>
                    {item.hasChild ? 
                        <div className="link-head" onClick={() => toggleItem(item.id)}>
                            <div>
                                {item.icon}
                                <div className="title">{item.title}</div>
                            </div>
                            {openItems[item.id] ? <FaChevronUp /> : <FaChevronDown />}
                        </div> :
                        <Link to={item.link} className="link-head">
                            <div>
                                {item.icon}
                                <div className="title">{item.title}</div>
                            </div>
                        </Link>
                    }
                    {item.hasChild && openItems[item.id] && 
                        <div className="sidebar-subList">
                            {item.child ? 
                                <Each of={item.child} render={(child) => 
                                    <NavLink to={child.link} className="sidebar-subLink">
                                        <span className='flex'>
                                            {child.icon}&nbsp;{child.title}
                                        </span>
                                    </NavLink>
                                } /> : ''}
                        </div>
                    }
                </div>
            } />
        </div>
      </aside>
    );
}

export default Sidebar;