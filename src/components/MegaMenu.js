import React, { useState, useEffect, useRef } from "react";
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
    parentHasNoChildren,
}) => {
    const hasNoChildren = items.every((item) => !item.level_4);
    const level2HasNoChildren = level === 2 && items.every((item) => !item.level_3);

    useEffect(() => {
        // Automatically select the first tab in level 3 if visible and not already selected
        if (level === 3 && items.length > 0 && activeTab[level] === undefined) {
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
    }, [level, items, activeTab, setActiveTab, setSelectedTabText]);

    useEffect(() => {
        // Set the width of menu-level-2 and tab-menu to match the body width
        const updateWidth = () => {
            const bodyWidth = document.body.clientWidth;
            if (level === 2 || level === 3) {
                const menuElement = document.querySelector(
                    `.menu-level-${level}`
                );
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
    }, [level]);

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div
            className={`menu-level menu-level-${level} ${
                level === 3 && hasNoChildren ? "no-children" : ""
            } ${level2HasNoChildren ? "no-children-level-2" : ""}`}
        >
            {items.map((item, index) => {
                const hasChildren = 
                    item.level_1 ||
                    item.level_2 ||
                    item.level_3 ||
                    item.level_4 ||
                    item.level_5;
                const isTab = level === 3 && item.level_4;
                const isActive = activeTab[level] === index;
                const isItemActive = activeItem[level] === index;
                const itemClass = !hasChildren && level === 3
                    ? "menu-item no-children"
                    : "menu-item";
                const parentClass = level === 1 && item.level_2 && item.level_2.every((subItem) => !subItem.level_3)
                    ? "no-children-level-2-parent"
                    : "";
                const level1Class = level === 1 && hasChildren
                    ? "has-children"
                    : "";
                const normalMenuItemClass = level === 1 && item.level_2 && item.level_2.every((subItem) => !subItem.level_3)
                    ? "normal-menu-item"
                    : "";

                return (
                    <div
                        key={index}
                        className={`${itemClass} ${isActive ? "active" : ""} ${
                            isItemActive ? "selected" : ""
                        } ${parentClass} ${level1Class} ${normalMenuItemClass}`}
                        onMouseEnter={() => {
                            if (level === 1 && item.level_2) {
                                toggleVisibility(level, index);
                            }
                            if (level === 2 && item.level_3) {
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
                            if (level === 1) {
                                toggleVisibility(level, null); // Hide the submenu on mouse leave
                            }
                            if (level === 2) {
                                toggleVisibility(level, null); // Hide the submenu on mouse leave
                                setActiveTab((prevState) => ({
                                    ...prevState,
                                    [3]: null,
                                }));
                                setSelectedTabText("");
                            }
                        }}
                    >
                        {item.link ? (
                            <a
                                href={item.link}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                dangerouslySetInnerHTML={{ __html: item.text }}
                            />
                        ) : (
                            <span
                                onClick={(e) => {
                                    if (level !== 2 && level !== 1) {
                                        e.stopPropagation();
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
                        {(visibleItems[level] === index ||
                            (isTab && isActive)) && (
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
                                        parentHasNoChildren={level2HasNoChildren}
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
                                        parentHasNoChildren={level2HasNoChildren}
                                    />
                                )}
                                {level === 2 &&
                                    visibleItems[level] === index &&
                                    item.level_3 && (
                                        <div
                                            className={`tab-menu ${
                                                item.level_3.some(
                                                    (tabItem) => tabItem.level_4
                                                )
                                                    ? ""
                                                    : "no-children"
                                            }`}
                                            style={
                                                item.level_3.some(
                                                    (tabItem) => tabItem.level_4
                                                )
                                                    ? { width: "100vw" }
                                                    : {}
                                            }
                                        >
                                            {item.level_3.some(
                                                (tabItem) => tabItem.level_4
                                            ) ? (
                                                <div className="tab-lists">
                                                    {item.level_3.map(
                                                        (tabItem, tabIndex) => (
                                                            <span
                                                                key={tabIndex}
                                                                className={`tab-item ${
                                                                    activeTab[3] === 
                                                                    tabIndex
                                                                        ? "active"
                                                                        : ""
                                                                }`}
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    setActiveTab(
                                                                        (
                                                                            prevState
                                                                        ) => ({
                                                                            ...prevState,
                                                                            3: tabIndex,
                                                                        })
                                                                    );
                                                                    setSelectedTabText(
                                                                        tabItem.text
                                                                    );
                                                                }}
                                                                dangerouslySetInnerHTML={{
                                                                    __html: tabItem.text,
                                                                }}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="normal-menu-items">
                                                    {item.level_3
                                                        ? item.level_3.map(
                                                            (
                                                                tabItem,
                                                                tabIndex
                                                            ) => (
                                                                <a
                                                                    key={
                                                                        tabIndex
                                                                    }
                                                                    href={
                                                                        tabItem.link
                                                                    }
                                                                    className="normal-menu-item"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: tabItem.text,
                                                                    }}
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        e.stopPropagation()
                                                                    }
                                                                />
                                                            )
                                                        )
                                                        : null}
                                                </div>
                                            )}
                                            {item.level_3[activeTab[3]] &&
                                                item.level_3[activeTab[3]]
                                                    .level_4 && (
                                                    <div className="tab-content">
                                                        <div
                                                            className="selected-tab-text"
                                                            dangerouslySetInnerHTML={{
                                                                __html: selectedTabText,
                                                            }}
                                                        />
                                                        <MenuLevel
                                                            items={
                                                                item.level_3[
                                                                    activeTab[3]
                                                                ].level_4
                                                            }
                                                            level={4}
                                                            visibleItems={
                                                                visibleItems
                                                            }
                                                            toggleVisibility={
                                                                toggleVisibility
                                                            }
                                                            activeTab={
                                                                activeTab
                                                            }
                                                            setActiveTab={
                                                                setActiveTab
                                                            }
                                                            selectedTabText={
                                                                selectedTabText
                                                            }
                                                            setSelectedTabText={
                                                                setSelectedTabText
                                                            }
                                                            activeItem={
                                                                activeItem
                                                            }
                                                            setActiveItem={
                                                                setActiveItem
                                                            }
                                                            parentHasNoChildren={level2HasNoChildren}
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
                                            setSelectedTabText={
                                                setSelectedTabText
                                            }
                                            activeItem={activeItem}
                                            setActiveItem={setActiveItem}
                                            parentHasNoChildren={level2HasNoChildren}
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
                                        parentHasNoChildren={level2HasNoChildren}
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
    const menuRef = useRef(null);

    useEffect(() => {
        // Fetch menu items from ACF options
        fetch("/wp-json/acf/v3/options/options")
            .then((response) => response.json())
            .then((data) => {
                if (data.acf && data.acf.level_1) {
                    const items = data.acf.level_1;
                    setMenuItems(items);
                } else {
                    console.error("No level_1 data found in ACF options.");
                }
            })
            .catch((error) =>
                console.error("Error fetching menu items:", error)
            );

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

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
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
                parentHasNoChildren={parentNoChildrenClass}
            />
        </div>
    );
};

export default MegaMenu;
