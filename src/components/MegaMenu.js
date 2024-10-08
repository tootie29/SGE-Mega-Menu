import React, { useState, useEffect, useRef } from "react";
import Spinner from "./Spinner";
import "./../styles/MegaMenu.css";

const MenuLevel = ({
    items,
    level,
    visibleItems,
    toggleVisibility,
    activeTab,
    setActiveTab,
    selectedTabText,
    setSelectedTabText,
    activeItem,
    setActiveItem,
    isMobile,
}) => {
    useEffect(() => {
        // Automatically select the first tab in level 3 if visible and not already selected
        if (level === 3 && items.length > 0 && activeTab[level] === undefined && !isMobile) {
            const firstItemWithChildren = items.find((item) => item.level_4);
            if (firstItemWithChildren) {
                const index = items.indexOf(firstItemWithChildren);
                setActiveTab((prevState) => ({
                    ...prevState,
                    [level]: index,
                }));
                setSelectedTabText(items[index].text);
            }
        }
    }, [level, items, activeTab, setActiveTab, setSelectedTabText, isMobile]);

    useEffect(() => {
        // Set the width of menu-level-2 and tab-menu to match the body width
        const updateWidth = () => {
            const bodyWidth = document.body.clientWidth;
            if ((level === 2 || level === 3) && !isMobile) {
                const menuElement = document.querySelector(`.menu-level-${level}`);
                if (menuElement) {
                    menuElement.style.width = `${bodyWidth}px`;
                }
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);

        return () => {
            window.removeEventListener("resize", updateWidth);
        };
    }, [level, isMobile]);

    if (!items || items.length === 0) {
        return null;
    }

    const hasNoChildren = items.every((item) => !item.level_4);
    const level2HasNoChildren = level === 2 && items.every((item) => !item.level_3);

    return (
        <div
            className={`menu-level menu-level-${level} ${isMobile ? "accordion" : ""} ${
                level === 3 && hasNoChildren ? "no-children" : ""
            } ${level2HasNoChildren ? "no-children-level-2" : ""}`}
        >
            {items.map((item, index) => {
                const hasChildren =
                    item.level_1 || item.level_2 || item.level_3 || item.level_4 || item.level_5;
                const isTab = level === 3 && item.level_4 && !isMobile;
                const isActive = activeTab[level] === index;
                const isItemActive = activeItem[level] === index;
                const isVisible = visibleItems[level] === index;
                const itemClass = !hasChildren && level === 3 ? "menu-item no-children" : "menu-item";
                const parentClass =
                    level === 1 && item.level_2 && item.level_2.every((subItem) => !subItem.level_3)
                        ? "no-children-level-2-parent"
                        : "";
                const level1Class = level === 1 && hasChildren ? "has-children" : "";
                const normalMenuItemClass =
                    level === 1 && item.level_2 && item.level_2.every((subItem) => !subItem.level_3)
                        ? "normal-menu-item"
                        : "";
                const hasChildrenClass = isMobile && hasChildren ? "has-children" : "";

                return (
                    <div
                        key={index}
                        className={`${itemClass} ${isActive ? "active" : ""} ${
                            isItemActive ? "selected" : ""
                        } ${isVisible ? "open" : ""} ${parentClass} ${level1Class} ${normalMenuItemClass} ${hasChildrenClass}`}
                        onMouseEnter={() => {
                            if (!isMobile && level === 1 && item.level_2) {
                                toggleVisibility(level, index);
                            }
                            if (!isMobile && level === 2 && item.level_3) {
                                toggleVisibility(level, index);
                                setActiveTab((prevState) => ({
                                    ...prevState,
                                    [3]: item.level_3[0] && item.level_3[0].level_4 ? 0 : null,
                                }));
                                setActiveItem((prevState) => ({
                                    ...prevState,
                                    [level]: index,
                                }));
                                setSelectedTabText(
                                    item.level_3[0] && item.level_3[0].level_4
                                        ? item.level_3[0].text
                                        : ""
                                );
                            }
                        }}
                        onMouseLeave={() => {
                            if (!isMobile && level === 1) {
                                toggleVisibility(level, null); // Hide the submenu on mouse leave
                            }
                            if (!isMobile && level === 2) {
                                toggleVisibility(level, null); // Hide the submenu on mouse leave
                                setActiveTab((prevState) => ({
                                    ...prevState,
                                    [3]: null,
                                }));
                                setSelectedTabText("");
                            }
                        }}
                        onClick={(e) => {
                            if (isMobile && hasChildren) {
                                e.preventDefault();
                                toggleVisibility(level, index);
                            }
                        }}
                    >
                        {item.link ? (
                            <a
                                href={item.link}
                                className="menu-link"
                                onClick={(e) => {
                                    if (isMobile && hasChildren) {
                                        e.preventDefault();
                                        toggleVisibility(level, index);
                                        setTimeout(() => {
                                            window.location.href = item.link;
                                        }, 100);
                                    } else {
                                        e.stopPropagation();
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: item.text }}
                            />
                        ) : (
                            <span
                                className="menu-link"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isMobile && hasChildren) {
                                        toggleVisibility(level, index);
                                    } else if (level !== 2 && level !== 1) {
                                        if (isTab) {
                                            setActiveTab((prevState) => ({
                                                ...prevState,
                                                [level]: prevState[level] === index ? null : index,
                                            }));
                                            setSelectedTabText(item.text);
                                        } else {
                                            toggleVisibility(level, index);
                                            setActiveItem((prevState) => ({
                                                ...prevState,
                                                [level]: index,
                                            }));
                                        }
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: item.text }}
                            />
                        )}
                        {/* Add a toggle arrow for mobile */}
                        {hasChildren && isMobile && (
                            <span
                                className="toggle-arrow"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent click from bubbling up
                                    toggleVisibility(level, index); // Toggle visibility
                                }}
                            >
                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 17.4761L19 7.47607L11.9305 10.2539L5 7.47607L12 17.4761Z" fill="#D4D4D4"/>
                                </svg>
                            </span> // Arrow for toggling
                        )}
                        {(isVisible || (isTab && isActive)) && (
                            <>
                                {item.level_1 && (
                                    <MenuLevel
                                        items={item.level_1}
                                        level={level + 1}
                                        visibleItems={visibleItems}
                                        toggleVisibility={toggleVisibility}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        selectedTabText={selectedTabText}
                                        setSelectedTabText={setSelectedTabText}
                                        activeItem={activeItem}
                                        setActiveItem={setActiveItem}
                                        isMobile={isMobile}
                                    />
                                )}
                                {item.level_2 && (
                                    <MenuLevel
                                        items={item.level_2}
                                        level={level + 1}
                                        visibleItems={visibleItems}
                                        toggleVisibility={toggleVisibility}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        selectedTabText={selectedTabText}
                                        setSelectedTabText={setSelectedTabText}
                                        activeItem={activeItem}
                                        setActiveItem={setActiveItem}
                                        isMobile={isMobile}
                                    />
                                )}
                                {level === 2 && isVisible && isMobile && (
                                    <div className={`menu-level menu-level-3 ${isMobile ? "accordion" : ""}`}>
                                        {item.level_3.map((subItem, subIndex) => (
                                            <div
                                                key={subIndex}
                                                className={`menu-item ${
                                                    visibleItems[3] === subIndex ? "active" : ""
                                                } ${subItem.level_4 ? "has-children" : ""} ${
                                                    visibleItems[3] === subIndex ? "open" : ""
                                                }`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleVisibility(3, subIndex);
                                                }}
                                            >
                                                {subItem.link ? (
                                                    <a
                                                        href={subItem.link}
                                                        className="menu-link"
                                                        onClick={(e) => {
                                                            if (isMobile && subItem.level_4) {
                                                                e.preventDefault();
                                                                toggleVisibility(3, subIndex);
                                                                setTimeout(() => {
                                                                    window.location.href = subItem.link;
                                                                }, 100);
                                                            } else {
                                                                e.stopPropagation();
                                                            }
                                                        }}
                                                        dangerouslySetInnerHTML={{ __html: subItem.text }}
                                                    />
                                                ) : (
                                                    <span
                                                        dangerouslySetInnerHTML={{ __html: subItem.text }}
                                                    />
                                                )}
                                                {visibleItems[3] === subIndex && subItem.level_4 && (
                                                    <div className="menu-level-4">
                                                        {subItem.level_4.map((childItem, childIndex) => (
                                                            <a
                                                                key={childIndex}
                                                                href={childItem.link}
                                                                className="menu-item"
                                                                dangerouslySetInnerHTML={{ __html: childItem.text }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {level === 2 && isVisible && !isMobile && item.level_3 && (
                                    <div
                                        className={`tab-menu ${
                                            item.level_3.some((tabItem) => tabItem.level_4) ? "" : "no-children"
                                        }`}
                                        style={item.level_3.some((tabItem) => tabItem.level_4) ? { width: "100vw" } : {}}
                                    >
                                        {item.level_3.some((tabItem) => tabItem.level_4) ? (
                                            <div className="tab-lists">
                                                {item.level_3.map((tabItem, tabIndex) => (
                                                    <span
                                                        key={tabIndex}
                                                        className={`tab-item ${activeTab[3] === tabIndex ? "active" : ""}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveTab((prevState) => ({
                                                                ...prevState,
                                                                3: tabIndex,
                                                            }));
                                                            setSelectedTabText(tabItem.text);
                                                        }}
                                                        dangerouslySetInnerHTML={{ __html: tabItem.text }}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="normal-menu-items">
                                                {item.level_3.map((tabItem, tabIndex) => (
                                                    <a
                                                        key={tabIndex}
                                                        href={tabItem.link}
                                                        className="normal-menu-item"
                                                        dangerouslySetInnerHTML={{ __html: tabItem.text }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {item.level_3[activeTab[3]] && item.level_3[activeTab[3]].level_4 && (
                                            <div className="tab-content">
                                                <div
                                                    className="selected-tab-text"
                                                    dangerouslySetInnerHTML={{ __html: selectedTabText }}
                                                />
                                                <MenuLevel
                                                    items={item.level_3[activeTab[3]].level_4}
                                                    level={4}
                                                    visibleItems={visibleItems}
                                                    toggleVisibility={toggleVisibility}
                                                    activeTab={activeTab}
                                                    setActiveTab={setActiveTab}
                                                    selectedTabText={selectedTabText}
                                                    setSelectedTabText={setSelectedTabText}
                                                    activeItem={activeItem}
                                                    setActiveItem={setActiveItem}
                                                    isMobile={isMobile}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                                {level === 3 && !isTab && (
                                    <div className="normal-menu-content">
                                        <MenuLevel
                                            items={item.level_4}
                                            level={4}
                                            visibleItems={visibleItems}
                                            toggleVisibility={toggleVisibility}
                                            activeTab={activeTab}
                                            setActiveTab={setActiveTab}
                                            selectedTabText={selectedTabText}
                                            setSelectedTabText={setSelectedTabText}
                                            activeItem={activeItem}
                                            setActiveItem={setActiveItem}
                                            isMobile={isMobile}
                                        />
                                    </div>
                                )}
                                {item.level_5 && (
                                    <MenuLevel
                                        items={item.level_5}
                                        level={level + 1}
                                        visibleItems={visibleItems}
                                        toggleVisibility={toggleVisibility}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        selectedTabText={selectedTabText}
                                        setSelectedTabText={setSelectedTabText}
                                        activeItem={activeItem}
                                        setActiveItem={setActiveItem}
                                        isMobile={isMobile}
                                    />
                                )}
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const MegaMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [visibleItems, setVisibleItems] = useState({});
    const [activeTab, setActiveTab] = useState({});
    const [selectedTabText, setSelectedTabText] = useState("");
    const [activeItem, setActiveItem] = useState({});
    const [parentNoChildrenClass, setParentNoChildrenClass] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1280);
    const [isLoading, setIsLoading] = useState(true);
    const menuRef = useRef(null);

    useEffect(() => {
        // Fetch menu items from ACF options
        fetch("/wp-json/acf/v3/options/options")
            .then((response) => response.json())
            .then((data) => {
                if (data.acf && data.acf.level_1) {
                    const items = data.acf.level_1;
                    setMenuItems(items);
                    setIsLoading(false); // Set loading to false when menu items are fetched
                } else {
                    console.error("No level_1 data found in ACF options.");
                    setIsLoading(false); // Set loading to false even if there's an error
                }
            })
            .catch((error) => {
                console.error("Error fetching menu items:", error);
                setIsLoading(false); // Set loading to false on error
            });

        // Handle outside clicks
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setVisibleItems({});
                setActiveTab({});
                setSelectedTabText("");
                setActiveItem({});
                setParentNoChildrenClass(false);
            }
        };

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1280);
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("resize", handleResize);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const toggleVisibility = (level, index) => {
        setVisibleItems((prevState) => ({
            ...prevState,
            [level]: prevState[level] === index ? null : index,
            ...Object.keys(prevState).reduce((acc, key) => {
                if (parseInt(key) > level) acc[key] = null;
                return acc;
            }, {}),
        }));
        if (level === 2) {
            setActiveTab({});
            setActiveItem((prevState) => ({
                ...prevState,
                [level]: index,
            }));
            setParentNoChildrenClass(visibleItems[level] === index);
        }
    };

    return (
        <div
            ref={menuRef}
            className={`mega-menu ${parentNoChildrenClass ? "no-children-level-2-parent" : ""}`}
        >
            {isLoading && isMobile && <Spinner />} {/* Show spinner while loading */}
            {!isLoading && (
                <MenuLevel
                    items={menuItems}
                    level={1}
                    visibleItems={visibleItems}
                    toggleVisibility={toggleVisibility}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    selectedTabText={selectedTabText}
                    setSelectedTabText={setSelectedTabText}
                    activeItem={activeItem}
                    setActiveItem={setActiveItem}
                    isMobile={isMobile}
                />
            )}
        </div>
    );
};

export default MegaMenu;