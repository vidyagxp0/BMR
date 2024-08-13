import { useState, useEffect, Children } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaChevronDown } from "react-icons/fa";
import { asideLinks } from './SidebarData';
import './Sidebar.css';
import { FaChevronUp } from "react-icons/fa";

function Sidebar() {
    const [openItems, setOpenItems] = useState({});
    const location = useLocation();

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

    const isParentActive = (children) => {
        return children.some(child => child.link === location.pathname);
    };

    return (
        <aside>
        <div className="inner-block">
            <Each of={asideLinks} render={(item) =>
                <div className="sidebar-link" key={item.id}>
                    {item.hasChild ? 
                        <div className={`link-head ${isParentActive(item.child) ? 'active-link' : ''}`} onClick={() => toggleItem(item.id)}>
                            <div>
                                {item.icon}
                                <div className="title">{item.title}</div>
                            </div>
                            {openItems[item.id] ? <FaChevronUp /> : <FaChevronDown />}
                        </div> :
                        <NavLink 
                          to={item.link} 
                          className={({ isActive }) => isActive ? 'link-head active-link' : 'link-head inactive-link'}
                        >
                            <div>
                                {item.icon}
                                <div className="title">{item.title}</div>
                            </div>
                        </NavLink>
                    }
                    {item.hasChild && openItems[item.id] && 
                        <div className="sidebar-subList">
                            {item.child ? 
                                <Each of={item.child} render={(child) => 
                                    <NavLink 
                                      to={child.link} 
                                      className={({ isActive }) => isActive ? 'sidebar-subLink active-subLink' : 'sidebar-subLink inactive-subLink'}
                                    >
                                        <span className='flex items-center'>
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