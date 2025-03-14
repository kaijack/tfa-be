export interface Menu {
  id: string;
  name: string;
  depth: number;
  parentId: string | null;
  parentName: string | null;
  createdAt: Date;
  updatedAt: Date;
}


export interface MenuHierarchy {
  menuId: number;
  name: string;
  depth: number;
  parentId: number | null;
  parent?: MenuHierarchy | null;
  children: MenuHierarchy[];
}