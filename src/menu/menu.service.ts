import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu, MenuHierarchy } from './types/menu';
import { UpdateMenuDto } from './dto/udpate-menu-dto';

interface MenuItem {
  id: string;
  name: string;
  parent_id: string | null;
  depth: number;
  children: MenuItem[];
}

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) { }

  // Fetch all menus (flat list)
  async getAllMenus(): Promise<Menu[]> {
    try {
      const rawQuery = `
        SELECT 
          m.id,
          m.name,
          m.depth,
          m.parent_id AS "parentId",
          m.created_at AS "createdAt",
          m.updated_at AS "updatedAt",
          p.name AS "parentName"
        FROM menus AS m -- Corrected table name
        LEFT JOIN menus AS p ON m.parent_id = p.id
        ORDER BY m.depth ASC
      `;

      const menus = await this.prisma.$queryRawUnsafe<Menu[]>(rawQuery);

      return menus.map((menu) => ({
        id: menu.id,
        name: menu.name,
        depth: menu.depth,
        parentId: menu.parentId,
        parentName: menu.parentName || null,
        createdAt: menu.createdAt,
        updatedAt: menu.updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching all menus:', error);
      throw new Error('Failed to fetch menus.');
    }
  }




  // Fetch hierarchical structure

  async getMenuHierarchy(): Promise<MenuItem[]> {
    try {
      const rawQuery = `
        WITH RECURSIVE menu_hierarchy AS (
          SELECT 
            m.id AS id,
            m.name,
            m.depth,
            m.parent_id,
            m.created_at
          FROM menus AS m
          WHERE m.parent_id IS NULL
          UNION ALL
          SELECT 
            c.id AS id,
            c.name,
            c.depth,
            c.parent_id,
            c.created_at
          FROM menus AS c
          INNER JOIN menu_hierarchy AS p ON c.parent_id = p.id
        )
        SELECT * FROM menu_hierarchy 
        ORDER BY created_at, parent_id, depth, id, name;
      `;

      const menus = await this.prisma.$queryRawUnsafe<MenuItem[]>(rawQuery);

      // Create a map of all menus by their ID and initialize their `children` property
      const menuMap: Record<string, MenuItem> = {};
      const rootMenus: MenuItem[] = [];

      menus.forEach((menu: MenuItem) => {
        // Initialize the menu with its children array
        menuMap[menu.id] = { ...menu, children: [] };
      });

      // Build the hierarchy by assigning children to their parents
      menus.forEach((menu: MenuItem) => {
        if (menu.parent_id) {
          // If the menu has a parent, push it into the parent's `children` array
          if (menuMap[menu.parent_id]) {
            menuMap[menu.parent_id].children.push(menuMap[menu.id]);
          }
        } else {
          // If the menu has no parent, it's a root menu, so push it to `rootMenus`
          rootMenus.push(menuMap[menu.id]);
        }
      });

      // Return the root menus with their full hierarchical structure
      return rootMenus;
    } catch (error) {
      console.error('Error fetching menu hierarchy:', error);
      throw new Error('Failed to fetch menu hierarchy.');
    }
  }



  // Add a child menu to a parent menu
  async addChildMenu(data: CreateMenuDto): Promise<Menu> {
    try {
      const rawQueryParent = `SELECT * FROM menus WHERE id = $1`;
      const parentMenu = await this.prisma.$queryRawUnsafe<Menu[]>(rawQueryParent, data.parentId);

      if (!parentMenu.length) {
        throw new Error(`Parent menus with ID ${data.parentId} does not exist.`);
      }

      const childDepth = parentMenu[0].depth + 1;

      const rawQueryInsert = `
        INSERT INTO menus (name, depth, parentId) VALUES ($1, $2, $3) RETURNING *
      `;
      const newChildMenu = await this.prisma.$queryRawUnsafe<Menu[]>(rawQueryInsert, data.name, childDepth, data.parentId);

      return newChildMenu[0];
    } catch (error) {
      console.error('Error adding child menu:', error);
      throw new Error('Failed to add child menu. Please check your data.');
    }
  }

  // Create a new menu
  async createMenu(data: CreateMenuDto): Promise<Menu> {
    try {
      let depth = 0;
      let parentId: string | null = null; // Explicitly declare the type as `string | null`

      // If there's a parentId, find the parent's depth
      if (data.parentId) {
        const rawQueryParent = `SELECT * FROM menus WHERE id = $1`;
        const parentMenu = await this.prisma.$queryRawUnsafe<Menu[]>(rawQueryParent, data.parentId);

        if (!parentMenu.length) {
          throw new Error(`Parent menus with ID ${data.parentId} does not exist.`);
        }

        depth = parentMenu[0].depth + 1;
        parentId = data.parentId; // Now this is allowed since `parentId` can be a string
      }

      const rawQueryInsert = `
        INSERT INTO menus (name, depth, parent_id) VALUES ($1, $2, $3) RETURNING *
      `;
      const newMenu = await this.prisma.$queryRawUnsafe<Menu[]>(rawQueryInsert, data.name, depth, parentId);

      return newMenu[0];
    } catch (error) {
      console.error('Error creating menu:', error);
      throw new Error('Failed to create menu. Please check your data.');
    }
  }
  // Update an existing menu
  async updateMenu(id: string, data: UpdateMenuDto): Promise<Menu> {
    try {
      // Check if the menu exists
      const existingMenu = await this.prisma.menu.findUnique({
        where: { id },
        include: { parent: true }, // Include the parent menu to compute parentName
      });

      if (!existingMenu) {
        throw new Error(`Menu with ID ${id} does not exist.`);
      }

      // Update the menu
      const updatedMenu = await this.prisma.menu.update({
        where: { id },
        data: {
          name: data.name,
          parentId: data.parentId, // Update parentId if included in the UpdateMenuDto
          updatedAt: new Date(),
        },
        include: { parent: true }, // Include parent in the updated menu for `parentName`
      });

      // Compute parentName from the parent menu
      const parentName = updatedMenu.parent ? updatedMenu.parent.name : null;

      // Return the updated menu with parentName
      return {
        ...updatedMenu,
        parentName,
      };
    } catch (error) {
      console.error('Error updating menu:', error);
      throw new Error('Failed to update menu. Please check your data.');
    }
  }


}
