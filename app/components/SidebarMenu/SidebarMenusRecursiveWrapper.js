import React from 'react'
import { SidebarMenu, Divider } from '../'

export const SidebarMenusRecursiveWrapper = ({ item }) => {

    const { label, path, children = [], icon = '' } = item;

    function getIcon(name) {
        let fullName = ''
        if (name) {
            fullName = 'fa fa-fw ' + name
            return <i className={fullName}></i>
        }
        return ''
    }
    return (
        !!label &&
        <SidebarMenu>
            {children.length > 0 ? (
                <SidebarMenu.Item
                    icon={getIcon(icon)}
                    title={label}>
                    {children.map((child, i) => {
                        return (
                            <SidebarMenusRecursiveWrapper key={i} item={child} />
                        );
                    })}
                </SidebarMenu.Item>
            ) : (
                    <SidebarMenu.Item
                        icon={getIcon(icon)}
                        title={label}
                        to={path}
                    />
                )
            }
        </SidebarMenu>
    );
};
