import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/udpate-menu-dto';

@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

  @Get()
  getAllMenus() {
    return this.menuService.getAllMenus();
  }

  @Get('hierarchy')
  getMenuHierarchy() {
    return this.menuService.getMenuHierarchy();
  }

  @Post()
  createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }
  
  @Put(':id')
  async updateMenu(
    @Param('id') id: string,
    @Body() updateMenuDto: UpdateMenuDto
  ) {
    return this.menuService.updateMenu(id, updateMenuDto);
  }
}
