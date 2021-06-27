import { IconType } from 'react-icons/lib';
import { MdBuild, MdHome } from 'react-icons/md';
import { BiBuilding } from 'react-icons/bi';

import { easyId } from 'utils';

export interface NavLinkType {
  label: string;
  url: string;
  Icon?: IconType;
}

// TODO Icon 属性的类型定义为 IconType 会让非 react-icon 库的图标无法使用?
export interface NavMenuType {
  id: string;
  label: string;
  Icon: IconType;
  children: NavLinkType[];
}

export function isNavLink(nav: NavLinkType | NavMenuType): nav is NavLinkType {
  return (nav as NavLinkType).url !== undefined;
}

const navigationConfig: Array<NavLinkType | NavMenuType> = [
  {
    label: '首页',
    Icon: MdHome,
    url: '/',
  },
  {
    id: easyId(),
    label: '产品管理',
    Icon: MdBuild,
    children: [
      {
        label: '角色管理',
        url: '/role-manage',
      },
      {
        label: '资源管理',
        url: '/resource-manage',
      },
      {
        label: '人员管理',
        url: '/user-manage',
      },
      {
        label: '角色列表',
        url: '/role-list',
      },
      {
        label: '目录管理',
        url: '/add-new-directory',
      },
    ],
  },
  {
    id: easyId(),
    label: '组织管理',
    Icon: BiBuilding,
    children: [
      {
        label: '超级管理员-组织管理',
        url: '/super-org-management',
      },
      {
        label: '普通管理员-组织管理',
        url: '/common-org-management',
      },
      {
        label: '目录绑定',
        url: '/directory-binding',
      },
    ],
  },
];

export default navigationConfig;
