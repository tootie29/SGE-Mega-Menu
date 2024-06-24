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
}) => {
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

    const hasNoChildren = items.every((item) => !item.level_4);

    return (
        <div
            className={`menu-level menu-level-${level} ${
                level === 3 && hasNoChildren ? "no-children" : ""
            }`}
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
                const itemClass =
                    !hasChildren && level === 3
                        ? "menu-item no-children"
                        : "menu-item";
                const parentClass =
                    level === 2 &&
                    item.level_3 &&
                    item.level_3.every((subItem) => !subItem.level_4)
                        ? "no-children-parent"
                        : "";
                const level1Class =
                    level === 1 && hasChildren ? "has-children" : "";

                return (
                    <div
                        key={index}
                        className={`${itemClass} ${isActive ? "active" : ""} ${
                            isItemActive ? "selected" : ""
                        } ${parentClass} ${level1Class}`}
                    >
                        {item.link ? (
                            <a
                                href={item.link}
                                onClick={(e) => e.stopPropagation()}
                                dangerouslySetInnerHTML={{ __html: item.text }}
                            />
                        ) : (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (level === 2 && item.level_3) {
                                        toggleVisibility(level, index);
                                        setActiveTab((prevState) => ({
                                            ...prevState,
                                            [3]:
                                                item.level_3[0] &&
                                                item.level_3[0].level_4
                                                    ? 0
                                                    : null,
                                        }));
                                        setActiveItem((prevState) => ({
                                            ...prevState,
                                            [level]: index,
                                        }));
                                        setSelectedTabText(
                                            item.level_3[0] &&
                                                item.level_3[0].level_4
                                                ? item.level_3[0].text
                                                : ""
                                        );
                                    } else if (isTab) {
                                        setActiveTab((prevState) => ({
                                            ...prevState,
                                            [level]:
                                                prevState[level] === index
                                                    ? null
                                                    : index,
                                        }));
                                        setSelectedTabText(item.text);
                                    } else {
                                        toggleVisibility(level, index);
                                        setActiveItem((prevState) => ({
                                            ...prevState,
                                            [level]: index,
                                        }));
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
                                                    {item.level_3.map(
                                                        (tabItem, tabIndex) => (
                                                            <span
                                                                key={tabIndex}
                                                                className="normal-menu-item"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: tabItem.text,
                                                                }}
                                                            />
                                                        )
                                                    )}
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
        }
    };

    return (
        <div ref={menuRef}>
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
            />
        </div>
    );
};

export default MegaMenu;
