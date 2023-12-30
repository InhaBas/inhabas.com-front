// headerNav

export default interface MenuItem {
    menuId: number;
    priority: number;
    name: string;
    type: string;
    description: string;
    url?: string;
}
